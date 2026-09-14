import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/* Square brutal avatar block — initials on a bright color */
const avatarColors = ["bg-sun", "bg-candy", "bg-sky", "bg-mint", "bg-grape", "bg-tang"]

export function Avatar({
  name,
  size = 32,
  colorIndex = 0,
}: {
  name?: string
  size?: number
  colorIndex?: number
}) {
  const initials = (name ?? "CC")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <span
      aria-label={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border-2 border-ink font-bold text-ink",
        avatarColors[colorIndex % avatarColors.length],
      )}
      style={{ width: size, height: size, fontSize: Math.max(9, Math.round(size * 0.34)) }}
    >
      {initials || "?"}
    </span>
  )
}

export function AvatarStack({ names, size = 24 }: { names: string[]; size?: number }) {
  return (
    <div className="flex -space-x-1.5">
      {names.map((n, i) => (
        <div key={n} className="rounded-full ring-2 ring-white">
          <Avatar name={n} size={size} colorIndex={i} />
        </div>
      ))}
      {names.length > 4 ? (
        <span className="inline-flex items-center justify-center rounded-full border-2 border-ink bg-white text-[9px] font-bold" style={{ width: size, height: size }}>
          +{names.length - 4}
        </span>
      ) : null}
    </div>
  )
}

export function EmptyState({
  icon = "□",
  title,
  body,
  action,
}: {
  icon?: ReactNode
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 border-2 border-dashed border-ink/40 bg-paper px-6 py-10 text-center">
      <span aria-hidden className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-white text-[20px] nb-shadow-sm">
        {icon}
      </span>
      <div>
        <p className="font-display text-[14px] text-ink">{title}</p>
        <p className="mt-1 max-w-sm text-[12px] font-medium text-ink/60">{body}</p>
      </div>
      {action}
    </div>
  )
}
