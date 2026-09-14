import { Badge } from "./badge"
import { cn } from "@/lib/utils"

export function Stat({
  label,
  value,
  delta,
  sub,
  color = "bg-white",
}: {
  label: string
  value: React.ReactNode
  delta?: { dir: "up" | "down" | "flat"; text: string }
  sub?: string
  color?: string
}) {
  const deltaTone = delta?.dir === "up" ? "success" : delta?.dir === "down" ? "danger" : "info"
  const arrow = delta?.dir === "up" ? "↑" : delta?.dir === "down" ? "↓" : "→"
  return (
    <div className={cn("nb-shadow-sm rounded-none border-2 border-ink p-4", color)}>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/60">{label}</p>
      <p className="mt-1.5 font-display text-2xl text-ink">{value}</p>
      <div className="mt-1.5 flex items-center gap-2">
        {delta ? (
          <Badge tone={deltaTone}>
            {arrow} {delta.text}
          </Badge>
        ) : null}
        {sub ? <span className="text-[10px] font-medium text-ink/50">{sub}</span> : null}
      </div>
    </div>
  )
}

export function ProgressBar({
  value,
  color = "bg-sun",
  label,
  height = "h-4",
}: {
  value: number
  color?: string
  label?: string
  height?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <div className="flex justify-between text-[10px] font-bold text-ink/60">
          <span>{label}</span>
          <span>{Math.round(value)}%</span>
        </div>
      ) : null}
      <div className={cn("w-full border-2 border-ink bg-white", height)}>
        <div className={cn("h-full border-r-2 border-ink", color)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  )
}
