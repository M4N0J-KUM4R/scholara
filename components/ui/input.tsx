"use client"

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const controlBase =
  "rounded-none border-2 border-ink bg-white px-3 text-[13px] font-medium text-ink shadow-[3px_3px_0_#0a0a0a] placeholder:text-ink/35 focus:translate-x-[3px] focus:translate-y-[3px] focus:shadow-none focus:outline-none disabled:opacity-50"

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-10 w-full", controlBase, className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-20 w-full py-2", controlBase, className)} {...props} />
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("h-10 w-full appearance-none pr-8", controlBase, className)} {...props}>
      {children}
    </select>
  )
}

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label?: string
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      {label ? <span className="text-[11px] font-bold uppercase tracking-wide text-ink">{label}</span> : null}
      {children}
      {hint && !error ? <span className="text-[10px] font-medium text-ink/50">{hint}</span> : null}
      {error ? <span className="text-[10px] font-bold text-tomato">{error}</span> : null}
    </label>
  )
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: ReactNode
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-2.5 text-[12px] font-medium text-ink", disabled && "opacity-50")}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span
        aria-hidden
        className="flex h-4.5 w-4.5 shrink-0 items-center justify-center border-2 border-ink bg-white text-[10px] font-bold text-transparent peer-checked:bg-ink peer-checked:text-sun peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2"
      >
        ✓
      </span>
      {label}
    </label>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange?: (checked: boolean) => void
  label?: ReactNode
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className="nb-focus flex items-center gap-2.5"
    >
      <span
        className={cn(
          "inline-flex h-5.5 w-10 items-center rounded-full border-2 border-ink p-0.5 transition-colors",
          checked ? "justify-end bg-mint" : "justify-start bg-white",
        )}
      >
        <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-ink" />
      </span>
      {label ? <span className="text-[12px] font-medium text-ink">{label}</span> : null}
    </button>
  )
}
