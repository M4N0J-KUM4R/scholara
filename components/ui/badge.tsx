import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Tone =
  | "default"
  | "dark"
  | "outline"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "candy"
  | "sky"
  | "mint"
  | "grape"

const tones: Record<Tone, string> = {
  default: "bg-sunlight text-ink border-ink",
  dark: "bg-ink text-sun border-ink",
  outline: "bg-white text-ink border-ink border-dashed",
  success: "bg-mint text-ink border-ink",
  warning: "bg-tang text-ink border-ink",
  danger: "bg-tomato text-ink border-ink",
  info: "bg-skylight text-ink border-ink",
  candy: "bg-candy text-ink border-ink",
  sky: "bg-sky text-ink border-ink",
  mint: "bg-mint text-ink border-ink",
  grape: "bg-grape text-ink border-ink",
}

export function Badge({
  tone = "default",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-none border-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
