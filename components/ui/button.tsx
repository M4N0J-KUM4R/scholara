import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

type Variant = "default" | "dark" | "outline" | "ghost" | "danger" | "success" | "info" | "candy"
type Size = "sm" | "md" | "lg" | "icon"

const variants: Record<Variant, string> = {
  default: "bg-sun text-ink border-ink",
  dark: "bg-ink text-sun border-ink",
  outline: "bg-white text-ink border-ink",
  ghost: "bg-transparent text-ink border-transparent shadow-none hover:bg-paper2",
  danger: "bg-tomato text-ink border-ink",
  success: "bg-mint text-ink border-ink",
  info: "bg-sky text-ink border-ink",
  candy: "bg-candy text-ink border-ink",
}

const sizes: Record<Size, string> = {
  sm: "h-7 px-2.5 text-[11px]",
  md: "h-9 px-4 text-[12px]",
  lg: "h-11 px-6 text-[14px]",
  icon: "h-9 w-9 p-0",
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({ className, variant = "default", size = "md", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "nb-press nb-focus inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-none border-2 font-bold",
        "shadow-[3px_3px_0_#0a0a0a]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
