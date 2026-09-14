import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("nb-shadow rounded-none border-2 border-ink bg-white", className)} {...props} />
}

export function CardHeader({
  title,
  action,
  tone = "sunlight",
  className,
}: {
  title: ReactNode
  action?: ReactNode
  tone?: "sunlight" | "candy" | "sky" | "mint" | "ink" | "grape" | "grapelight" | "none"
  className?: string
}) {
  const tones = {
    sunlight: "bg-sunlight",
    candy: "bg-candy",
    sky: "bg-skylight",
    mint: "bg-mintlight",
    grape: "bg-grapelight",
    grapelight: "bg-grapelight",
    ink: "bg-ink text-sun",
    none: "bg-white",
  }
  return (
    <div className={cn("flex items-center justify-between gap-3 border-b-2 border-ink px-4 py-2.5", tones[tone], className)}>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.12em]">{title}</h3>
      {action}
    </div>
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />
}
