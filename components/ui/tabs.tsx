"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Tabs({ items, className }: { items: { label: string; content: ReactNode }[]; className?: string }) {
  const [active, setActive] = useState(0)
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap gap-2" role="tablist">
        {items.map((it, i) => (
          <button
            key={it.label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "nb-press nb-focus rounded-none border-2 border-ink px-3.5 py-1.5 text-[12px] font-bold",
              i === active ? "nb-shadow-sm bg-sun text-ink" : "bg-white text-ink/70 hover:text-ink",
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{items[active]?.content}</div>
    </div>
  )
}
