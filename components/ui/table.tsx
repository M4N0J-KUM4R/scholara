import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

export function TableRoot({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className={cn("overflow-x-auto rounded-none border-2 border-ink bg-white nb-shadow", className)}>
      <table className="w-full border-collapse text-left" {...props} />
    </div>
  )
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="border-b-2 border-ink bg-ink text-sun">{children}</thead>
}

export function TH({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap", className)}
      {...props}
    />
  )
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

export function TR({
  className,
  onClick,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { onClick?: () => void }) {
  return (
    <tr
      className={cn(
        "border-b border-ink/15 last:border-0",
        onClick && "cursor-pointer hover:bg-sunlight",
        className,
      )}
      onClick={onClick}
      {...props}
    />
  )
}

export function TD({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-3 py-2.5 align-middle text-[12px] font-medium text-ink/80", className)} {...props} />
}
