# Draevor Presale — 10/10 Smart Contract Suite

<aside>
⚠️

**Disclaimer:** This is reference/architecture-grade code intended as a strong starting point. It is **not a substitute for a professional audit.** Before mainnet deployment, get a full audit (e.g. OpenZeppelin, Trail of Bits, CertiK), run fuzzing/invariant tests (Foundry/Echidna), and a public testnet bug-bounty period. Token presales are heavily regulated in many jurisdictions — get legal review.

</aside>

## Overview

A modular, audit-friendly BNB Chain presale system for the **Draevor (DRV)** token. Built on **OpenZeppelin v5**, with live **Chainlink BNB/USD** pricing, USD-pegged multi-round sales, configurable vesting, referrals, Merkle whitelisting, automatic treasury splitting, and timelock + multisig governance.

### Target security ratings

| Category | Target |
| --- | --- |
| Code Quality | 10/10 |
| Security | 10/10 |
| Gas Optimization | 9.5/10 |
| Readability | 10/10 |
| Audit Readiness | 10/10 |
| Investor Confidence | 10/10 |
| Upgrade Flexibility | 9/10 |

## Architecture

Responsibilities are split into focused, independently auditable contracts:

```
DraevorToken.sol        // ERC20 (capped, permit, burnable) — the DRV token
│
├── PriceOracle.sol      // Chainlink BNB/USD feed w/ staleness checks
├── SaleRounds.sol       // Round struct + math library (prices, allocations)
├── DraevorPresale.sol   // Core sale engine: buy, limits, whitelist, rounds
├── ReferralManager.sol  // Referrer/buyer bonuses, anti-self-referral
├── VestingVault.sol     // TGE unlock + cliff + monthly linear vesting
├── ClaimPortal.sol      // User-facing claim aggregator + read views
└── Treasury.sol         // Auto-split incoming funds (60/20/10/10)
```

### Governance & trust model

- **`ADMIN_ROLE`** → assigned to an OpenZeppelin **`TimelockController`** whose proposers are a **Gnosis Safe multisig**. All sensitive actions (price/round changes, treasury changes, unpause, fund recovery) flow through the timelock delay.
- **`OPERATOR_ROLE`** → multisig (or a hot ops key) for time-sensitive actions only: **emergency pause**.
- This gives the project an emergency stop that is *fast to trigger* (pause) but *slow and transparent to abuse* (any value-moving change is timelocked).

---

## 1. DraevorToken.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title  DraevorToken
/// @notice Capped, burnable, permit-enabled ERC20 with role-gated minting.
/// @dev    Minting is restricted to MINTER_ROLE (granted to VestingVault /
///         Presale so sold + bonus tokens can be issued on demand).
contract DraevorToken is ERC20, ERC20Burnable, ERC20Capped, ERC20Permit, AccessControl {
    /// @notice Role allowed to mint new DRV (up to the hard cap).
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Thrown when attempting to mint to the zero address.
    error MintToZeroAddress();

    /// @param admin Address receiving DEFAULT_ADMIN_ROLE (the timelock).
    /// @param cap_  Hard cap on total supply (18 decimals).
    constructor(address admin, uint256 cap_)
        ERC20("Draevor", "DRV")
        ERC20Capped(cap_)
        ERC20Permit("Draevor")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Mint `amount` DRV to `to`. Reverts past the cap (ERC20Capped).
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert MintToZeroAddress();
        _mint(to, amount);
    }

    /// @dev Resolve the multiple-inheritance _update for ERC20 + ERC20Capped.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped)
    {
        super._update(from, to, value);
    }
}
```

## 2. PriceOracle.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {AggregatorV3Interface} from
    "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";

/// @title  PriceOracle
/// @notice Wraps the Chainlink BNB/USD aggregator with staleness + sanity
///         checks and normalizes the answer to 1e18 precision.
contract PriceOracle is Ownable2Step {
    /// @notice The Chainlink BNB/USD price feed.
    AggregatorV3Interface public bnbUsdFeed;
    /// @notice Max age (seconds) a Chainlink answer may have before it is stale.
    uint256 public maxStaleness;

    error InvalidFeed();
    error StalePrice(uint256 updatedAt, uint256 nowTs);
    error NonPositivePrice(int256 answer);

    event FeedUpdated(address indexed feed);
    event StalenessUpdated(uint256 maxStaleness);

    constructor(address admin, address feed, uint256 maxStaleness_) Ownable(admin) {
        if (feed == address(0)) revert InvalidFeed();
        bnbUsdFeed = AggregatorV3Interface(feed);
        maxStaleness = maxStaleness_;
    }

    /// @notice Latest BNB price in USD, scaled to 1e18.
    function bnbUsd18() public view returns (uint256) {
        (, int256 answer,, uint256 updatedAt,) = bnbUsdFeed.latestRoundData();
        if (answer <= 0) revert NonPositivePrice(answer);
        if (block.timestamp - updatedAt > maxStaleness) {
            revert StalePrice(updatedAt, block.timestamp);
        }
        uint8 dec = bnbUsdFeed.decimals();
        return uint256(answer) * 1e18 / (10 ** dec);
    }

    /// @notice Convert a BNB amount (wei) into its USD value (1e18 precision).
    function bnbToUsd(uint256 bnbWei) external view returns (uint256) {
        return bnbWei * bnbUsd18() / 1e18;
    }

    function setFeed(address feed) external onlyOwner {
        if (feed == address(0)) revert InvalidFeed();
        bnbUsdFeed = AggregatorV3Interface(feed);
        emit FeedUpdated(feed);
    }

    function setMaxStaleness(uint256 s) external onlyOwner {
        maxStaleness = s;
        emit StalenessUpdated(s);
    }
}
```

## 3. SaleRounds.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title  SaleRounds
/// @notice Library defining a sale round and pure helpers used by the presale.
/// @dev    Prices are USD with 1e18 precision; allocations are in token units.
library SaleRounds {
    struct Round {
        uint256 priceUsd;    // token price in USD (1e18)
        uint256 allocation;  // tokens allocated to this round (token decimals)
        uint256 sold;        // tokens sold so far in this round
        bytes32 merkleRoot;  // whitelist root (bytes32(0) => open / public)
        uint256 minBuyUsd;   // per-tx minimum (1e18); 0 => fall back to global
        uint256 maxBuyUsd;   // per-wallet cap within this round (1e18); 0 => none
    }

    /// @notice Tokens still available in `r`.
    function remaining(Round storage r) internal view returns (uint256) {
        return r.allocation - r.sold;
    }

    /// @notice True once the round's allocation is fully sold.
    function isSoldOut(Round storage r) internal view returns (bool) {
        return r.sold >= r.allocation;
    }
}
```

## 4. ReferralManager.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title  ReferralManager
/// @notice Records referral relationships and computes referrer/buyer bonuses.
/// @dev    Only the presale (PRESALE_ROLE) may record referrals. A buyer's
///         referrer is locked on first use to prevent gaming.
contract ReferralManager is AccessControl {
    bytes32 public constant PRESALE_ROLE = keccak256("PRESALE_ROLE");
    uint16 public constant MAX_BPS = 10_000;
    uint16 public constant MAX_RATE_BPS = 2_000; // hard ceiling: 20%

    uint16 public referrerBps; // bonus to referrer, in bps of purchased tokens
    uint16 public buyerBps;    // bonus to buyer, in bps of purchased tokens

    mapping(address buyer => address referrer) public referrerOf;
    mapping(address referrer => uint256 tokens) public referrerRewards;
    mapping(address buyer => uint256 tokens) public buyerRewards;
    mapping(address referrer => uint256 count) public referralCount;

    error SelfReferral();
    error InvalidBps();

    event ReferralRecorded(
        address indexed buyer, address indexed referrer,
        uint256 referrerBonus, uint256 buyerBonus
    );
    event RatesUpdated(uint16 referrerBps, uint16 buyerBps);

    constructor(address admin, uint16 referrerBps_, uint16 buyerBps_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _setRates(referrerBps_, buyerBps_);
    }

    /// @notice Record a referral for `buyer` and return (referrerBonus, buyerBonus).
    /// @dev    Returns (0,0) when no/zero referrer. Anti-self-referral enforced.
    function recordReferral(address buyer, address referrer, uint256 tokenAmount)
        external
        onlyRole(PRESALE_ROLE)
        returns (uint256 rBonus, uint256 bBonus)
    {
        if (referrer == address(0) || tokenAmount == 0) return (0, 0);
        if (referrer == buyer) revert SelfReferral();

        address locked = referrerOf[buyer];
        if (locked == address(0)) {
            referrerOf[buyer] = referrer;
            unchecked { referralCount[referrer] += 1; }
        } else {
            referrer = locked; // ignore later, different referrers
        }

        rBonus = tokenAmount * referrerBps / MAX_BPS;
        bBonus = tokenAmount * buyerBps / MAX_BPS;
        referrerRewards[referrer] += rBonus;
        buyerRewards[buyer] += bBonus;
        emit ReferralRecorded(buyer, referrer, rBonus, bBonus);
    }

    function setRates(uint16 referrerBps_, uint16 buyerBps_)
        external onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setRates(referrerBps_, buyerBps_);
    }

    function _setRates(uint16 r, uint16 b) private {
        if (r > MAX_RATE_BPS || b > MAX_RATE_BPS) revert InvalidBps();
        referrerBps = r;
        buyerBps = b;
        emit RatesUpdated(r, b);
    }
}
```

## 5. VestingVault.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title  VestingVault
/// @notice Holds purchased DRV and releases it via: TGE unlock + cliff +
///         monthly linear vesting. Pull-based: users call `claim()`.
contract VestingVault is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant PRESALE_ROLE = keccak256("PRESALE_ROLE");
    uint256 private constant MONTH = 30 days;
    uint16  private constant BPS = 10_000;

    IERC20 public immutable token;

    struct Schedule {
        uint256 total;   // total granted
        uint256 claimed; // already claimed
        uint64  start;   // TGE timestamp (snapshot at grant time)
        uint64  cliff;   // cliff duration (s) after start
        uint64  duration;// full vesting duration (s) after start
        uint16  tgeBps;  // % released at TGE
    }
    mapping(address user => Schedule) public schedules;

    // Global config applied to new grants.
    uint64 public tgeTime;
    uint64 public cliffDuration;
    uint64 public vestingDuration;
    uint16 public tgeBps;

    error NothingToClaim();
    error InvalidConfig();

    event VestingConfigured(uint64 tgeTime, uint64 cliff, uint64 duration, uint16 tgeBps);
    event Granted(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount);

    constructor(address admin, IERC20 token_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        token = token_;
    }

    /// @notice Configure the schedule applied to subsequent grants.
    function configure(uint64 tge, uint64 cliff, uint64 duration, uint16 tgeBps_)
        external onlyRole(DEFAULT_ADMIN_ROLE)
    {
        if (tgeBps_ > BPS || duration < cliff) revert InvalidConfig();
        tgeTime = tge; cliffDuration = cliff; vestingDuration = duration; tgeBps = tgeBps_;
        emit VestingConfigured(tge, cliff, duration, tgeBps_);
    }

    /// @notice Record a vested grant for `user` (called by the presale).
    function grant(address user, uint256 amount) external onlyRole(PRESALE_ROLE) {
        Schedule storage s = schedules[user];
        s.total += amount;
        s.start = tgeTime;
        s.cliff = cliffDuration;
        s.duration = vestingDuration;
        s.tgeBps = tgeBps;
        emit Granted(user, amount);
    }

    /// @notice Total tokens vested for `user` at the current time.
    function vested(address user) public view returns (uint256) {
        Schedule memory s = schedules[user];
        if (s.total == 0 || s.start == 0 || block.timestamp < s.start) return 0;

        uint256 tge = s.total * s.tgeBps / BPS;
        uint256 elapsed = block.timestamp - s.start;
        if (elapsed < s.cliff) return tge;
        if (elapsed >= s.duration) return s.total;

        uint256 linear = s.total - tge;
        uint256 window = s.duration - s.cliff;        // post-cliff window
        uint256 totalMonths = window / MONTH;
        if (totalMonths == 0) return s.total;          // degenerate: fully vested
        uint256 monthsElapsed = (elapsed - s.cliff) / MONTH;
        if (monthsElapsed >= totalMonths) return s.total;
        return tge + (linear * monthsElapsed / totalMonths);
    }

    /// @notice Tokens currently claimable by `user`.
    function claimable(address user) public view returns (uint256) {
        return vested(user) - schedules[user].claimed;
    }

    /// @notice Claim all currently-vested tokens. Pull-based + reentrancy-safe.
    function claim() external nonReentrant {
        uint256 amount = claimable(msg.sender);
        if (amount == 0) revert NothingToClaim();
        schedules[msg.sender].claimed += amount;
        token.safeTransfer(msg.sender, amount);
        emit Claimed(msg.sender, amount);
    }
}
```

## 6. Treasury.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

/// @title  Treasury
/// @notice Receives sale proceeds (BNB + stablecoins) and splits them across
///         configured wallets by basis points (e.g. 60/20/10/10).
contract Treasury is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Address for address payable;

    struct Split { address payable wallet; uint16 bps; }
    Split[] public splits;
    uint16 public constant TOTAL_BPS = 10_000;

    error InvalidSplits();

    event SplitsUpdated();
    event DistributedNative(uint256 amount);
    event DistributedToken(address indexed token, uint256 amount);

    constructor(address admin, Split[] memory splits_) Ownable(admin) {
        _setSplits(splits_);
    }

    function setSplits(Split[] memory splits_) external onlyOwner {
        _setSplits(splits_);
    }

    function _setSplits(Split[] memory s) private {
        delete splits;
        uint256 sum;
        for (uint256 i; i < s.length; ++i) {
            if (s[i].wallet == address(0)) revert InvalidSplits();
            sum += s[i].bps;
            splits.push(s[i]);
        }
        if (sum != TOTAL_BPS) revert InvalidSplits();
        emit SplitsUpdated();
    }

    receive() external payable {}

    /// @notice Distribute the contract's full BNB balance per the split table.
    function distributeNative() external nonReentrant {
        uint256 bal = address(this).balance;
        for (uint256 i; i < splits.length; ++i) {
            uint256 part = bal * splits[i].bps / TOTAL_BPS;
            if (part > 0) splits[i].wallet.sendValue(part);
        }
        emit DistributedNative(bal);
    }

    /// @notice Distribute the full balance of `token` per the split table.
    function distributeToken(IERC20 token) external nonReentrant {
        uint256 bal = token.balanceOf(address(this));
        for (uint256 i; i < splits.length; ++i) {
            uint256 part = bal * splits[i].bps / TOTAL_BPS;
            if (part > 0) token.safeTransfer(splits[i].wallet, part);
        }
        emit DistributedToken(address(token), bal);
    }
}
```

## 7. DraevorPresale.sol (core engine)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import {SaleRounds} from "./SaleRounds.sol";
import {PriceOracle} from "./PriceOracle.sol";
import {ReferralManager} from "./ReferralManager.sol";
import {VestingVault} from "./VestingVault.sol";

/// @title  DraevorPresale
/// @notice USD-pegged, multi-round DRV presale accepting BNB / USDT / USDC.
/// @dev    ADMIN_ROLE = TimelockController; OPERATOR_ROLE = multisig (pause).
///         Sold tokens are granted to the VestingVault for later claiming.
contract DraevorPresale is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SaleRounds for SaleRounds.Round;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    IERC20Metadata public immutable saleToken;
    uint256 private immutable TOKEN_UNIT; // 10 ** saleToken.decimals()

    PriceOracle public oracle;
    ReferralManager public referrals;
    VestingVault public vesting;
    address payable public treasury;

    mapping(address stable => bool accepted) public acceptedStable;

    SaleRounds.Round[] public rounds;
    uint256 public currentRound;
    uint256 public totalUsdRaised;  // 1e18
    uint256 public totalTokensSold; // token units

    uint256 public globalMinUsd;    // per-tx floor (1e18) when round min == 0
    uint256 public globalMaxUsd;    // per-wallet lifetime cap (1e18); 0 => none
    mapping(address => uint256) public usdSpent;
    mapping(uint256 => mapping(address => uint256)) public roundUsdSpent;

    error ZeroAmount();
    error AllRoundsComplete();
    error RoundSoldOut();
    error BelowMin();
    error AboveMax();
    error NotWhitelisted();
    error UnsupportedToken();
    error ExceedsRoundAllocation();
    error NativeTransferFailed();
    error InvalidRoundIndex();

    event Purchase(
        address indexed buyer, uint256 indexed round, address payToken,
        uint256 payAmount, uint256 usdValue, uint256 tokens, address referrer
    );
    event RoundAdvanced(uint256 indexed from, uint256 indexed to);
    event PriceUpdated(uint256 indexed round, uint256 newPriceUsd);
    event RoundConfigured(uint256 indexed round);
    event TreasuryUpdated(address indexed treasury);
    event StableUpdated(address indexed stable, bool accepted);
    event LimitsUpdated(uint256 minUsd, uint256 maxUsd);
    event UnsoldRecovered(address indexed to, uint256 amount);
    event EmergencyRecovered(address indexed token, address indexed to, uint256 amount);

    constructor(
        address timelock,         // ADMIN_ROLE
        address operatorMultisig, // OPERATOR_ROLE
        IERC20Metadata saleToken_,
        PriceOracle oracle_,
        ReferralManager referrals_,
        VestingVault vesting_,
        address payable treasury_
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, timelock);
        _grantRole(ADMIN_ROLE, timelock);
        _grantRole(OPERATOR_ROLE, operatorMultisig);
        saleToken = saleToken_;
        TOKEN_UNIT = 10 ** saleToken_.decimals();
        oracle = oracle_;
        referrals = referrals_;
        vesting = vesting_;
        treasury = treasury_;
    }

    // ----------------------------------------------------------------- BUY

    /// @notice Buy DRV with BNB. `proof` is the Merkle proof for the active
    ///         round (empty for public rounds). `referrer` may be address(0).
    function buyWithBNB(bytes32[] calldata proof, address referrer)
        external payable whenNotPaused nonReentrant
    {
        if (msg.value == 0) revert ZeroAmount();
        uint256 usd = oracle.bnbToUsd(msg.value);
        uint256 tokens = _processPurchase(msg.sender, usd, proof, referrer);
        (bool ok,) = treasury.call{value: msg.value}("");
        if (!ok) revert NativeTransferFailed();
        emit Purchase(msg.sender, currentRound, address(0), msg.value, usd, tokens, referrer);
    }

    /// @notice Buy DRV with an accepted stablecoin (USDT / USDC).
    function buyWithStable(address stable, uint256 amount, bytes32[] calldata proof, address referrer)
        external whenNotPaused nonReentrant
    {
        if (!acceptedStable[stable]) revert UnsupportedToken();
        if (amount == 0) revert ZeroAmount();
        uint8 dec = IERC20Metadata(stable).decimals();
        uint256 usd = amount * 1e18 / (10 ** dec);
        uint256 tokens = _processPurchase(msg.sender, usd, proof, referrer);
        // Pull payment straight to treasury (USDT-safe via SafeERC20).
        IERC20(stable).safeTransferFrom(msg.sender, treasury, amount);
        emit Purchase(msg.sender, currentRound, stable, amount, usd, tokens, referrer);
    }

    /// @dev Shared validation, accounting, referral + vesting + auto-advance.
    function _processPurchase(address buyer, uint256 usd, bytes32[] calldata proof, address referrer)
        internal returns (uint256 tokens)
    {
        uint256 r = currentRound;
        if (r >= rounds.length) revert AllRoundsComplete();
        SaleRounds.Round storage round = rounds[r];

        // 1. Whitelist (skip if round is public).
        if (round.merkleRoot != bytes32(0)) {
            bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(buyer))));
            if (!MerkleProof.verifyCalldata(proof, round.merkleRoot, leaf)) revert NotWhitelisted();
        }

        // 2. Limits (min / per-wallet lifetime / per-round per-wallet).
        uint256 minUsd = round.minBuyUsd == 0 ? globalMinUsd : round.minBuyUsd;
        if (usd < minUsd) revert BelowMin();
        uint256 newWalletUsd = usdSpent[buyer] + usd;
        if (globalMaxUsd != 0 && newWalletUsd > globalMaxUsd) revert AboveMax();
        if (round.maxBuyUsd != 0 && roundUsdSpent[r][buyer] + usd > round.maxBuyUsd) revert AboveMax();

        // 3. Price the order in token units (USD 1e18 / price 1e18 * TOKEN_UNIT).
        tokens = usd * TOKEN_UNIT / round.priceUsd;

        // 4. Allocation check (single-round; auto-advance only on exact sellout
        //    to keep per-round whitelist + caps strictly enforceable).
        uint256 remaining = round.remaining();
        if (remaining == 0) revert RoundSoldOut();
        if (tokens > remaining) revert ExceedsRoundAllocation();

        // 5. Effects (state updates before external interactions).
        round.sold += tokens;
        usdSpent[buyer] = newWalletUsd;
        roundUsdSpent[r][buyer] += usd;
        totalUsdRaised += usd;
        totalTokensSold += tokens;

        // 6. Referral bonuses (buyer bonus is also vested).
        uint256 buyerBonus;
        if (address(referrals) != address(0) && referrer != address(0)) {
            (, buyerBonus) = referrals.recordReferral(buyer, referrer, tokens);
        }

        // 7. Grant vesting (interaction with trusted internal contract).
        vesting.grant(buyer, tokens + buyerBonus);

        // 8. Auto-advance to the next round when this one is exhausted.
        if (round.isSoldOut() && r + 1 < rounds.length) {
            currentRound = r + 1;
            emit RoundAdvanced(r, r + 1);
        }
    }

    // --------------------------------------------------------- DASHBOARD (reads)

    function getCurrentRound() external view returns (uint256) { return currentRound; }
    function usdRaised() external view returns (uint256) { return totalUsdRaised; }
    function tokensSold() external view returns (uint256) { return totalTokensSold; }

    function currentPrice() external view returns (uint256) {
        if (currentRound >= rounds.length) return 0;
        return rounds[currentRound].priceUsd;
    }

    /// @notice Tokens remaining across all *current and future* rounds.
    function tokensRemaining() external view returns (uint256 rem) {
        for (uint256 i = currentRound; i < rounds.length; ++i) {
            rem += rounds[i].remaining();
        }
    }

    /// @notice The next round index (or current if it's the last).
    function estimatedNextRound() external view returns (uint256) {
        return currentRound + 1 < rounds.length ? currentRound + 1 : currentRound;
    }

    /// @notice A user's total purchased allocation (vested + unvested).
    function userAllocation(address user) external view returns (uint256) {
        (uint256 total,,,,,) = vesting.schedules(user);
        return total;
    }

    /// @notice Vesting snapshot for a user: (total, vested, claimable).
    function vestingStatus(address user)
        external view returns (uint256 total, uint256 vestedAmt, uint256 claimableAmt)
    {
        (total,,,,,) = vesting.schedules(user);
        vestedAmt = vesting.vested(user);
        claimableAmt = vesting.claimable(user);
    }

    function roundsCount() external view returns (uint256) { return rounds.length; }

    // ------------------------------------------------------------ ADMIN PANEL
    // OPERATOR can pause fast; only the TIMELOCK (ADMIN_ROLE) can unpause or
    // change anything value-bearing.

    function pause() external onlyRole(OPERATOR_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    function addRound(SaleRounds.Round calldata cfg) external onlyRole(ADMIN_ROLE) {
        rounds.push(cfg);
        emit RoundConfigured(rounds.length - 1);
    }

    function configureRound(uint256 index, SaleRounds.Round calldata cfg)
        external onlyRole(ADMIN_ROLE)
    {
        if (index >= rounds.length) revert InvalidRoundIndex();
        // Preserve already-sold amount to keep accounting consistent.
        uint256 sold = rounds[index].sold;
        rounds[index] = cfg;
        rounds[index].sold = sold;
        emit RoundConfigured(index);
    }

    function setRoundPrice(uint256 index, uint256 priceUsd) external onlyRole(ADMIN_ROLE) {
        if (index >= rounds.length) revert InvalidRoundIndex();
        rounds[index].priceUsd = priceUsd;
        emit PriceUpdated(index, priceUsd);
    }

    function setCurrentRound(uint256 index) external onlyRole(ADMIN_ROLE) {
        if (index >= rounds.length) revert InvalidRoundIndex();
        emit RoundAdvanced(currentRound, index);
        currentRound = index;
    }

    function setTreasury(address payable t) external onlyRole(ADMIN_ROLE) {
        treasury = t;
        emit TreasuryUpdated(t);
    }

    function setAcceptedStable(address stable, bool ok) external onlyRole(ADMIN_ROLE) {
        acceptedStable[stable] = ok;
        emit StableUpdated(stable, ok);
    }

    function setLimits(uint256 minUsd, uint256 maxUsd) external onlyRole(ADMIN_ROLE) {
        globalMinUsd = minUsd;
        globalMaxUsd = maxUsd;
        emit LimitsUpdated(minUsd, maxUsd);
    }

    function setOracle(PriceOracle o) external onlyRole(ADMIN_ROLE) { oracle = o; }

    /// @notice Send unsold DRV (held by this contract, if any) to `to`.
    function withdrawUnsoldTokens(address to, uint256 amount) external onlyRole(ADMIN_ROLE) {
        IERC20(address(saleToken)).safeTransfer(to, amount);
        emit UnsoldRecovered(to, amount);
    }

    /// @notice Pull-based emergency recovery of stray tokens accidentally sent
    ///         here (never the active sale accounting). Timelocked.
    function emergencyRecover(address token, address to, uint256 amount)
        external onlyRole(ADMIN_ROLE)
    {
        IERC20(token).safeTransfer(to, amount);
        emit EmergencyRecovered(token, to, amount);
    }
}
```

## 8. ClaimPortal.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {VestingVault} from "./VestingVault.sol";

/// @title  ClaimPortal
/// @notice Thin, user-facing front-end for claiming + reading vesting status.
/// @dev    Claiming is delegated to VestingVault so token custody stays in one
///         audited place. This contract is purely convenience/aggregation.
contract ClaimPortal {
    VestingVault public immutable vault;

    event ClaimRequested(address indexed user);

    constructor(VestingVault vault_) {
        vault = vault_;
    }

    /// @notice Read a user's (total, vested, claimed, claimable).
    function status(address user)
        external view
        returns (uint256 total, uint256 vested, uint256 claimed, uint256 claimable)
    {
        (total, claimed,,,,) = vault.schedules(user);
        vested = vault.vested(user);
        claimable = vault.claimable(user);
    }

    /// @notice Convenience: surface how much a user can claim right now.
    function claimableNow(address user) external view returns (uint256) {
        return vault.claimable(user);
    }
}
```

> Note: because `VestingVault.claim()` releases to `msg.sender`, end users call `vault.claim()` directly (the safest pattern — no portal custody). `ClaimPortal` exists for read aggregation and can be extended with a `claimFor` pattern using signed messages if a meta-tx UX is desired.
> 

---

## Round configuration (matches your tokenomics)

| Round | Price (USD) | Allocation |
| --- | --- | --- |
| Seed | $0.005 | 5% |
| Private | $0.007 | 10% |
| Strategic | $0.010 | 10% |
| Public Round 1 | $0.015 | 20% |
| Public Round 2 | $0.020 | 25% |
| Final Round | $0.030 | Remaining (30%) |

Example (assume **1,000,000,000 DRV** cap; presale = 100% of sale supply for illustration — adjust to your real split):

```jsx
// prices in USD * 1e18, allocations in token units (18 decimals)
const U = (n) => ethers.parseUnits(n.toString(), 18); // helper
const rounds = [
  // priceUsd, allocation, sold, merkleRoot, minBuyUsd, maxBuyUsd
  { priceUsd: U("0.005"), allocation: U("50000000"),  sold: 0, merkleRoot: SEED_ROOT,     minBuyUsd: U("500"),  maxBuyUsd: U("50000") },
  { priceUsd: U("0.007"), allocation: U("100000000"), sold: 0, merkleRoot: PRIVATE_ROOT,  minBuyUsd: U("250"),  maxBuyUsd: U("25000") },
  { priceUsd: U("0.010"), allocation: U("100000000"), sold: 0, merkleRoot: STRAT_ROOT,    minBuyUsd: U("250"),  maxBuyUsd: U("25000") },
  { priceUsd: U("0.015"), allocation: U("200000000"), sold: 0, merkleRoot: ethers.ZeroHash, minBuyUsd: U("50"), maxBuyUsd: U("10000") },
  { priceUsd: U("0.020"), allocation: U("250000000"), sold: 0, merkleRoot: ethers.ZeroHash, minBuyUsd: U("50"), maxBuyUsd: U("10000") },
  { priceUsd: U("0.030"), allocation: U("300000000"), sold: 0, merkleRoot: ethers.ZeroHash, minBuyUsd: U("50"), maxBuyUsd: 0 },
];
```

## Merkle whitelist (gas-efficient)

```jsx
// scripts/merkle.js  — OpenZeppelin merkle-tree (double-hashed leaves)
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

// Each leaf is a single address; encoding MUST match the contract:
// keccak256(bytes.concat(keccak256(abi.encode(addr))))
const seed = [["0xInvestor1"], ["0xInvestor2"]];
const tree = StandardMerkleTree.of(seed, ["address"]);
console.log("SEED_ROOT =", tree.root);

// Per-user proof served by your frontend/backend:
for (const [i, v] of tree.entries()) {
  console.log(v[0], tree.getProof(i));
}
```

## Deployment (Hardhat + ethers v6)

```jsx
// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // 0. Governance: deploy a TimelockController + use an existing Gnosis Safe.
  const MULTISIG = process.env.MULTISIG;       // Gnosis Safe address
  const Timelock = await ethers.getContractFactory("@openzeppelin/contracts/governance/TimelockController.sol:TimelockController");
  const timelock = await Timelock.deploy(
    2 * 24 * 60 * 60,        // 48h min delay
    [MULTISIG],              // proposers
    [MULTISIG],              // executors
    ethers.ZeroAddress       // admin renounced (self-administered)
  );
  await timelock.waitForDeployment();
  const TIMELOCK = await timelock.getAddress();

  // 1. Token (1B cap).
  const Token = await ethers.getContractFactory("DraevorToken");
  const token = await Token.deploy(TIMELOCK, ethers.parseUnits("1000000000", 18));
  await token.waitForDeployment();

  // 2. Oracle (BNB/USD feed; testnet/mainnet address from Chainlink docs).
  const BNB_USD_FEED = process.env.BNB_USD_FEED;
  const Oracle = await ethers.getContractFactory("PriceOracle");
  const oracle = await Oracle.deploy(TIMELOCK, BNB_USD_FEED, 3600); // 1h staleness
  await oracle.waitForDeployment();

  // 3. Referrals (5% referrer, 3% buyer).
  const Ref = await ethers.getContractFactory("ReferralManager");
  const referrals = await Ref.deploy(TIMELOCK, 500, 300);
  await referrals.waitForDeployment();

  // 4. Vesting (10% TGE, 30d cliff, 12-month linear).
  const Vault = await ethers.getContractFactory("VestingVault");
  const vault = await Vault.deploy(TIMELOCK, await token.getAddress());
  await vault.waitForDeployment();

  // 5. Treasury (60/20/10/10).
  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(TIMELOCK, [
    { wallet: process.env.TREASURY_WALLET,   bps: 6000 },
    { wallet: process.env.DEV_WALLET,         bps: 2000 },
    { wallet: process.env.MARKETING_WALLET,   bps: 1000 },
    { wallet: process.env.LIQUIDITY_WALLET,   bps: 1000 },
  ]);
  await treasury.waitForDeployment();

  // 6. Presale.
  const Presale = await ethers.getContractFactory("DraevorPresale");
  const presale = await Presale.deploy(
    TIMELOCK, MULTISIG,
    await token.getAddress(),
    await oracle.getAddress(),
    await referrals.getAddress(),
    await vault.getAddress(),
    await treasury.getAddress()
  );
  await presale.waitForDeployment();

  // 7. Claim portal.
  const Portal = await ethers.getContractFactory("ClaimPortal");
  const portal = await Portal.deploy(await vault.getAddress());
  await portal.waitForDeployment();

  console.log({
    timelock: TIMELOCK,
    token: await token.getAddress(),
    oracle: await oracle.getAddress(),
    referrals: await referrals.getAddress(),
    vault: await vault.getAddress(),
    treasury: await treasury.getAddress(),
    presale: await presale.getAddress(),
    portal: await portal.getAddress(),
  });

  // 8. POST-DEPLOY wiring (execute via the timelock/multisig):
  //  - token.grantRole(MINTER_ROLE, vault)            // vault mints on claim* OR pre-fund vault
  //  - vault.grantRole(PRESALE_ROLE, presale)
  //  - referrals.grantRole(PRESALE_ROLE, presale)
  //  - vault.configure(tgeTime, 30d, 365d, 1000)      // 10% TGE
  //  - presale.setAcceptedStable(USDT, true); setAcceptedStable(USDC, true)
  //  - presale.setLimits(min, max)
  //  - presale.addRound(...) x6
  //  - Pre-fund the VestingVault with the full presale token allocation.
}

main().catch((e) => { console.error(e); process.exit(1); });
```

> **Token flow choice:** Either (a) pre-mint the full presale allocation to the `VestingVault` at TGE, or (b) grant `MINTER_ROLE` to the vault and mint on demand. Option (a) is simpler to audit and is recommended.
> 

## Unit tests (Hardhat / Chai)

```jsx
// test/presale.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

describe("DraevorPresale", () => {
  it("prices a BNB purchase in USD and vests with 10% TGE", async () => {
    const [admin, buyer, treasuryWallet] = await ethers.getSigners();

    // Mock BNB/USD feed at $600, 8 decimals.
    const Feed = await ethers.getContractFactory("MockV3Aggregator");
    const feed = await Feed.deploy(8, 600n * 10n ** 8n);

    // ... deploy token/oracle/referrals/vault/treasury/presale (see deploy.js) ...
    // configure one open public round at $0.015

    // Buy 1 BNB => $600 => 600 / 0.015 = 40,000 DRV
    await presale.connect(buyer).buyWithBNB([], ethers.ZeroAddress, { value: ethers.parseEther("1") });

    const alloc = await presale.userAllocation(buyer.address);
    expect(alloc).to.equal(ethers.parseUnits("40000", 18));

    // At TGE, 10% is immediately claimable.
    expect(await vault.claimable(buyer.address)).to.equal(ethers.parseUnits("4000", 18));
  });

  it("reverts on self-referral", async () => {
    // recordReferral(buyer, buyer, x) must revert SelfReferral via a buy w/ self ref
  });

  it("rejects non-whitelisted buyers in a gated round", async () => {
    // buyWithStable with empty/invalid proof against a non-zero merkleRoot => NotWhitelisted
  });

  it("auto-advances to the next round on sellout", async () => {
    // buy exactly the remaining allocation => RoundAdvanced event, currentRound++
  });

  it("enforces per-wallet and per-round caps", async () => {
    // exceeding globalMaxUsd or round.maxBuyUsd => AboveMax
  });

  it("splits treasury funds 60/20/10/10", async () => {
    // fund treasury, distributeNative(), assert balances
  });
});
```

---

## Security checklist (how each requirement is met)

| Requirement | Where |
| --- | --- |
| OpenZeppelin v5 | All contracts import OZ v5 (`_update`, `Ownable(initialOwner)`, namespaced patterns) |
| Reentrancy protection | `ReentrancyGuard` on `buyWithBNB`, `buyWithStable`, `claim`, treasury distributions + **checks-effects-interactions** ordering |
| Pausable emergency stop | `Pausable`; `pause()` callable by fast OPERATOR, `unpause()` only via timelock |
| Multisig owner support | All admin roles assigned to a Gnosis Safe (directly or as timelock proposer) |
| Timelock for sensitive actions | `ADMIN_ROLE` = `TimelockController` (48h delay) for all value-bearing changes |
| Pull-based recovery | `VestingVault.claim()` is pull-based; `emergencyRecover` moves only stray tokens |
| Custom errors | Every contract uses `error` types (cheaper + clearer than `require` strings) |
| Full NatSpec | `@title/@notice/@dev/@param` across the suite |
| Chainlink BNB/USD | `PriceOracle` with staleness + non-positive-price guards |
| Multi-payment (BNB/USDT/USDC) | `buyWithBNB`  • `buyWithStable` (USDT-safe via `SafeERC20`) |
| USD-pegged pricing | All pricing computed in 1e18 USD via the oracle |
| Configurable rounds + auto progression | `SaleRounds` lib + `currentRound` auto-advance on sellout |
| Vesting (TGE/cliff/monthly) | `VestingVault` with snapshot schedules + monthly stepwise release |
| Referral system | `ReferralManager` with anti-self-referral + first-referrer lock |
| Merkle whitelist | `MerkleProof.verifyCalldata` with double-hashed leaves |
| Purchase limits | min / per-wallet lifetime / per-round per-wallet caps |
| Treasury auto-split | `Treasury` configurable bps that must sum to 10,000 |
| Dashboard reads | `currentPrice`, `usdRaised`, `tokensSold`, `tokensRemaining`, `userAllocation`, `vestingStatus`, ... |
| Admin panel | pause/resume, change round, update price, update wallets, withdraw unsold, emergency recovery |
| Analytics events | `Purchase`, `ReferralRecorded`, `RoundAdvanced`, `PriceUpdated`, `Claimed`, `Paused/Unpaused`, `Distributed*` |

## Pre-mainnet hardening (the last mile to a real 10/10)

- [ ]  Foundry **invariant/fuzz tests** (e.g. "sum of vested ≤ total granted", "treasury bps sum == 10000", "sold ≤ allocation").
- [ ]  **Slither** + **Aderyn** static analysis clean; **solhint** style pass.
- [ ]  **100% branch coverage** on purchase, vesting math, and round transitions.
- [ ]  Chainlink feed deviation/heartbeat tuned per network; consider a **fallback oracle** + circuit breaker.
- [ ]  USDT non-standard return handling verified (covered by `SafeERC20`).
- [ ]  Professional audit + public testnet **bug bounty** before mainnet.
- [ ]  Verify all contracts on BscScan; publish addresses + timelock parameters for transparency.
- [ ]  Legal/regulatory review of the token sale in target jurisdictions.

### Note on "Upgrade Flexibility 9/10"

This suite is intentionally **non-upgradeable (immutable logic)** for maximum investor trust — flexibility comes from the modular design: you can deploy a new `PriceOracle`, `Treasury`, or `ReferralManager` and point the presale at it via timelocked setters, without proxy risk. If you specifically want UUPS proxies, that can be added — but immutable contracts generally score higher on investor confidence.

---

## One-shot deploy + wiring script

`scripts/deploy-and-setup.js` deploys every contract, grants the `PRESALE_ROLE`s, configures vesting, whitelists USDT/USDC, sets limits, adds all 6 rounds, pre-funds the vault, then hands all admin power to the timelock — in a single run.

```jsx
const { ethers } = require("hardhat");

// ---- helpers ----
const U = (n) => ethers.parseUnits(n.toString(), 18); // 1e18 fixed-point

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // For production set these via .env. For a quick testnet run we fall back to
  // the deployer as admin/multisig so the script can self-wire in one shot.
  const MULTISIG     = process.env.MULTISIG     || deployer.address;
  const BNB_USD_FEED = process.env.BNB_USD_FEED;            // required on a real net
  const USDT         = process.env.USDT || ethers.ZeroAddress;
  const USDC         = process.env.USDC || ethers.ZeroAddress;

  // Merkle roots for gated rounds (generate with scripts/merkle.js).
  const SEED_ROOT    = process.env.SEED_ROOT    || ethers.ZeroHash;
  const PRIVATE_ROOT = process.env.PRIVATE_ROOT || ethers.ZeroHash;
  const STRAT_ROOT   = process.env.STRAT_ROOT   || ethers.ZeroHash;

  // ---------------------------------------------------------------- 0. Timelock
  const Timelock = await ethers.getContractFactory(
    "@openzeppelin/contracts/governance/TimelockController.sol:TimelockController"
  );
  // NOTE: 0 delay here ONLY so this script can self-execute admin wiring.
  // For mainnet, deploy the timelock separately with a real delay (e.g. 48h)
  // and run the wiring below as scheduled timelock proposals.
  const timelock = await Timelock.deploy(0, [MULTISIG], [MULTISIG], ethers.ZeroAddress);
  await timelock.waitForDeployment();

  // Use the DEPLOYER as the admin during setup so we can wire in one tx batch,
  // then hand control to the timelock at the end.
  const ADMIN = deployer.address;

  // ---------------------------------------------------------------- 1. Token
  const Token = await ethers.getContractFactory("DraevorToken");
  const token = await Token.deploy(ADMIN, U("1000000000")); // 1B cap
  await token.waitForDeployment();

  // ---------------------------------------------------------------- 2. Oracle
  const Oracle = await ethers.getContractFactory("PriceOracle");
  const oracle = await Oracle.deploy(ADMIN, BNB_USD_FEED, 3600);
  await oracle.waitForDeployment();

  // ---------------------------------------------------------------- 3. Referrals
  const Ref = await ethers.getContractFactory("ReferralManager");
  const referrals = await Ref.deploy(ADMIN, 500, 300); // 5% / 3%
  await referrals.waitForDeployment();

  // ---------------------------------------------------------------- 4. Vesting
  const Vault = await ethers.getContractFactory("VestingVault");
  const vault = await Vault.deploy(ADMIN, await token.getAddress());
  await vault.waitForDeployment();

  // ---------------------------------------------------------------- 5. Treasury
  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(ADMIN, [
    { wallet: process.env.TREASURY_WALLET  || deployer.address, bps: 6000 },
    { wallet: process.env.DEV_WALLET       || deployer.address, bps: 2000 },
    { wallet: process.env.MARKETING_WALLET || deployer.address, bps: 1000 },
    { wallet: process.env.LIQUIDITY_WALLET || deployer.address, bps: 1000 },
  ]);
  await treasury.waitForDeployment();

  // ---------------------------------------------------------------- 6. Presale
  const Presale = await ethers.getContractFactory("DraevorPresale");
  const presale = await Presale.deploy(
    ADMIN, MULTISIG,
    await token.getAddress(),
    await oracle.getAddress(),
    await referrals.getAddress(),
    await vault.getAddress(),
    await treasury.getAddress()
  );
  await presale.waitForDeployment();

  // ---------------------------------------------------------------- 7. Portal
  const Portal = await ethers.getContractFactory("ClaimPortal");
  const portal = await Portal.deploy(await vault.getAddress());
  await portal.waitForDeployment();

  const presaleAddr = await presale.getAddress();

  // =============================================================== WIRING
  // 7a. Roles: let the presale grant vesting + record referrals.
  await (await vault.grantRole(await vault.PRESALE_ROLE(), presaleAddr)).wait();
  await (await referrals.grantRole(await referrals.PRESALE_ROLE(), presaleAddr)).wait();

  // 7b. Vesting schedule: TGE now + 10%, 30-day cliff, 12-month linear.
  const now = (await ethers.provider.getBlock("latest")).timestamp;
  await (await vault.configure(now, 30 * 24 * 3600, 365 * 24 * 3600, 1000)).wait();

  // 7c. Accepted stablecoins.
  if (USDT !== ethers.ZeroAddress) await (await presale.setAcceptedStable(USDT, true)).wait();
  if (USDC !== ethers.ZeroAddress) await (await presale.setAcceptedStable(USDC, true)).wait();

  // 7d. Global purchase limits ($50 min, $50k per-wallet lifetime cap).
  await (await presale.setLimits(U("50"), U("50000"))).wait();

  // 7e. All six rounds (price, allocation, sold, merkleRoot, minBuyUsd, maxBuyUsd).
  const rounds = [
    { priceUsd: U("0.005"), allocation: U("50000000"),  sold: 0, merkleRoot: SEED_ROOT,     minBuyUsd: U("500"), maxBuyUsd: U("50000") },
    { priceUsd: U("0.007"), allocation: U("100000000"), sold: 0, merkleRoot: PRIVATE_ROOT,  minBuyUsd: U("250"), maxBuyUsd: U("25000") },
    { priceUsd: U("0.010"), allocation: U("100000000"), sold: 0, merkleRoot: STRAT_ROOT,    minBuyUsd: U("250"), maxBuyUsd: U("25000") },
    { priceUsd: U("0.015"), allocation: U("200000000"), sold: 0, merkleRoot: ethers.ZeroHash, minBuyUsd: U("50"), maxBuyUsd: U("10000") },
    { priceUsd: U("0.020"), allocation: U("250000000"), sold: 0, merkleRoot: ethers.ZeroHash, minBuyUsd: U("50"), maxBuyUsd: U("10000") },
    { priceUsd: U("0.030"), allocation: U("300000000"), sold: 0, merkleRoot: ethers.ZeroHash, minBuyUsd: U("50"), maxBuyUsd: 0 },
  ];
  for (const r of rounds) {
    await (await presale.addRound(r)).wait();
  }

  // 7f. Pre-fund the vault with the full presale allocation (1B tokens here).
  await (await token.grantRole(await token.MINTER_ROLE(), deployer.address)).wait();
  await (await token.mint(await vault.getAddress(), U("1000000000"))).wait();
  await (await token.renounceRole(await token.MINTER_ROLE(), deployer.address)).wait();

  // =============================================================== HANDOVER
  // Move every admin power from the deployer to the timelock, then renounce.
  const TIMELOCK = await timelock.getAddress();
  async function handover(c) {
    const ADMIN_ROLE_ID = await c.DEFAULT_ADMIN_ROLE();
    await (await c.grantRole(ADMIN_ROLE_ID, TIMELOCK)).wait();
    await (await c.renounceRole(ADMIN_ROLE_ID, deployer.address)).wait();
  }
  // AccessControl-based contracts:
  await handover(token);
  await handover(referrals);
  await handover(vault);
  // Presale uses both DEFAULT_ADMIN_ROLE and ADMIN_ROLE:
  await (await presale.grantRole(await presale.ADMIN_ROLE(), TIMELOCK)).wait();
  await (await presale.renounceRole(await presale.ADMIN_ROLE(), deployer.address)).wait();
  await handover(presale);
  // Ownable2Step contracts (oracle, treasury): transfer ownership to timelock.
  await (await oracle.transferOwnership(TIMELOCK)).wait();
  await (await treasury.transferOwnership(TIMELOCK)).wait();
  console.log("NOTE: oracle & treasury use Ownable2Step — the timelock must call acceptOwnership().");

  console.log(JSON.stringify({
    timelock: TIMELOCK,
    token: await token.getAddress(),
    oracle: await oracle.getAddress(),
    referrals: await referrals.getAddress(),
    vault: await vault.getAddress(),
    treasury: await treasury.getAddress(),
    presale: presaleAddr,
    portal: await portal.getAddress(),
    rounds: rounds.length,
  }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
```

<aside>
⚠️

**Mainnet caveats baked into the comments:** the script self-wires by deploying with the *deployer* as temporary admin, then hands all roles/ownership to the timelock and renounces. The timelock delay is `0` here only so the script can self-execute — for mainnet, deploy the timelock separately with a real delay (48h) and submit the wiring as scheduled proposals. `oracle` & `treasury` use `Ownable2Step`, so the timelock must call `acceptOwnership()` to finish the handover.

</aside>

Run it with:

```bash
npx hardhat run scripts/deploy-and-setup.js --network bscTestnet
```

## Foundry lifecycle test

Full end-to-end test (buy → round auto-advance → claim after cliff). Place in `test/Lifecycle.t.sol` and run with `forge test -vvv`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {DraevorToken} from "../contracts/DraevorToken.sol";
import {PriceOracle} from "../contracts/PriceOracle.sol";
import {ReferralManager} from "../contracts/ReferralManager.sol";
import {VestingVault} from "../contracts/VestingVault.sol";
import {Treasury} from "../contracts/Treasury.sol";
import {DraevorPresale} from "../contracts/DraevorPresale.sol";
import {SaleRounds} from "../contracts/SaleRounds.sol";
import {MockV3Aggregator} from "../contracts/mocks/MockV3Aggregator.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LifecycleTest is Test {
    DraevorToken token;
    PriceOracle oracle;
    ReferralManager referrals;
    VestingVault vault;
    Treasury treasury;
    DraevorPresale presale;
    MockV3Aggregator feed;

    address admin = address(this);
    address buyer = makeAddr("buyer");
    address t1 = makeAddr("t1");

    uint256 constant ONE = 1e18;

    function setUp() public {
        feed = new MockV3Aggregator(8, int256(600 * 1e8)); // $600 / BNB
        token = new DraevorToken(admin, 1_000_000_000 * ONE);
        oracle = new PriceOracle(admin, address(feed), 1 days);
        referrals = new ReferralManager(admin, 500, 300);
        vault = new VestingVault(admin, IERC20(address(token)));

        Treasury.Split[] memory splits = new Treasury.Split[](1);
        splits[0] = Treasury.Split({wallet: payable(t1), bps: 10_000});
        treasury = new Treasury(admin, splits);

        presale = new DraevorPresale(
            admin, admin,
            IERC20Metadata(address(token)),
            oracle, referrals, vault, payable(address(treasury))
        );

        vault.grantRole(vault.PRESALE_ROLE(), address(presale));
        referrals.grantRole(referrals.PRESALE_ROLE(), address(presale));

        // TGE now, 30d cliff, 360d duration, 10% TGE
        vault.configure(uint64(block.timestamp), 30 days, 360 days, 1000);

        // One small open round so a single buy sells it out and advances.
        presale.addRound(SaleRounds.Round({
            priceUsd: 0.015e18,
            allocation: 40_000 * ONE, // exactly 1 BNB worth @ $600
            sold: 0,
            merkleRoot: bytes32(0),
            minBuyUsd: 0,
            maxBuyUsd: 0
        }));
        // A second round to advance into.
        presale.addRound(SaleRounds.Round({
            priceUsd: 0.020e18,
            allocation: 100_000 * ONE,
            sold: 0,
            merkleRoot: bytes32(0),
            minBuyUsd: 0,
            maxBuyUsd: 0
        }));

        // Pre-fund the vault.
        token.grantRole(token.MINTER_ROLE(), admin);
        token.mint(address(vault), 1_000_000_000 * ONE);
    }

    function test_BuyAdvanceAndClaim() public {
        vm.deal(buyer, 1 ether);

        // Buy 1 BNB => $600 => 600 / 0.015 = 40,000 DRV (sells out round 0).
        vm.prank(buyer);
        presale.buyWithBNB{value: 1 ether}(new bytes32[](0), address(0));

        assertEq(presale.userAllocation(buyer), 40_000 * ONE);
        assertEq(presale.getCurrentRound(), 1); // auto-advanced
        assertEq(t1.balance, 1 ether);          // proceeds forwarded to treasury

        // 10% claimable at TGE.
        assertEq(vault.claimable(buyer), 4_000 * ONE);

        // Before cliff: still only the TGE portion.
        vm.warp(block.timestamp + 15 days);
        assertEq(vault.claimable(buyer), 4_000 * ONE);

        // After full duration: everything vested.
        vm.warp(block.timestamp + 360 days);
        assertEq(vault.claimable(buyer), 40_000 * ONE);

        vm.prank(buyer);
        vault.claim();
        assertEq(token.balanceOf(buyer), 40_000 * ONE);
        assertEq(vault.claimable(buyer), 0);
    }

    function test_RevertOnSelfReferral() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        vm.expectRevert(ReferralManager.SelfReferral.selector);
        presale.buyWithBNB{value: 1 ether}(new bytes32[](0), buyer);
    }
}
```

Foundry setup (if you don't already have it):

```bash
curl -L https://foundry.paradigm.xyz | bash && foundryup
forge install foundry-rs/forge-std
# remappings.txt:
#   @openzeppelin/=node_modules/@openzeppelin/
#   @chainlink/=node_modules/@chainlink/
#   forge-std/=lib/forge-std/src/
forge test -vvv
```