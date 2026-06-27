import { cn } from "@/utils/cn"

export type Crumb = { label: string; href?: string }

type ProjectBreadcrumbProps = {
	items: Crumb[]
	className?: string
}

/**
 * Semantic breadcrumb: <nav> + ordered list, last item marked aria-current.
 */
export function ProjectBreadcrumb({ items, className }: ProjectBreadcrumbProps) {
	return (
		<nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
			<ol className="flex flex-wrap items-center gap-2 text-text-muted">
				{items.map((item, index) => {
					const isLast = index === items.length - 1
					return (
						<li key={`${item.label}-${index}`} className="flex items-center gap-2">
							{item.href && !isLast ? (
								<a
									href={item.href}
									className="transition-colors hover:text-text-primary focus:outline-none focus-visible:text-text-primary"
								>
									{item.label}
								</a>
							) : (
								<span
									aria-current={isLast ? "page" : undefined}
									className={isLast ? "text-text-primary" : undefined}
								>
									{item.label}
								</span>
							)}
							{!isLast ? (
								<span aria-hidden="true" className="text-text-muted/50">
									/
								</span>
							) : null}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}
