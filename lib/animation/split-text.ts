/**
 * SplitType utilities — char/word/line splitting. No usage, with revert helper for cleanup.
 */
import SplitType from "split-type";
import type { SplitTypeOptions, TargetElement } from "split-type";

export type SplitMode = "chars" | "words" | "lines";

/**
 * Internal splitter.
 */
function split(
  target: TargetElement,
  modes: SplitMode[],
  options: Partial<SplitTypeOptions> = {},
): SplitType {
  return new SplitType(target, {
    types: modes.join(", ") as SplitTypeOptions["types"],
    ...options,
  });
}

/**
 * Split into words and chars.
 */
export function splitChars(
  target: TargetElement,
  options?: Partial<SplitTypeOptions>,
): SplitType {
  return split(target, ["words", "chars"], options);
}

/**
 * Split into words only.
 */
export function splitWords(
  target: TargetElement,
  options?: Partial<SplitTypeOptions>,
): SplitType {
  return split(target, ["words"], options);
}

/**
 * Split into lines only.
 */
export function splitLines(
  target: TargetElement,
  options?: Partial<SplitTypeOptions>,
): SplitType {
  return split(target, ["lines"], options);
}

/**
 * Split into lines, words, and chars.
 */
export function splitAll(
  target: TargetElement,
  options?: Partial<SplitTypeOptions>,
): SplitType {
  return split(target, ["lines", "words", "chars"], options);
}

/**
 * Reverts SplitType — restores original DOM.
 */
export function revertSplit(instance: SplitType | null): void {
  instance?.revert();
}
