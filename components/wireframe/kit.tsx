import type { ReactNode, CSSProperties } from "react"

/* ------------------------------------------------------------------ */
/* Text placeholders                                                   */
/* ------------------------------------------------------------------ */

export function Line({ w = "100%", className = "" }: { w?: string | number; className?: string }) {
  return <div className={`wf-scribble ${className}`} style={{ width: w }} />
}

export function Lines({
  count = 3,
  widths,
  gap = 8,
  className = "",
}: {
  count?: number
  widths?: (string | number)[]
  gap?: number
  className?: string
}) {
  return (
    <div className={`flex flex-col ${className}`} style={{ gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <Line key={i} w={widths?.[i] ?? (i === count - 1 ? "60%" : "100%")} />
      ))}
    </div>
  )
}

/* Hatched heading bar */
export function Bar({ w = "40%", h = 12, className = "" }: { w?: string | number; h?: number; className?: string }) {
  return <div className={`wf-bar ${className}`} style={{ width: w, height: h }} />
}

/* Readable label text (for real labels, not placeholder copy) */
export function Label({
  children,
  className = "",
  muted = false,
}: {
  children: ReactNode
  className?: string
  muted?: boolean
}) {
  return (
    <span className={`text-[11px] font-medium leading-tight ${muted ? "text-neutral-400" : "text-neutral-600"} ${className}`}>
      {children}
    </span>
  )
}

/* Small caps section title */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500 ${className}`}>
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Shapes                                                              */
/* ------------------------------------------------------------------ */

export function ImageX({
  w = "100%",
  h = 80,
  label,
  className = "",
}: {
  w?: string | number
  h?: string | number
  label?: string
  className?: string
}) {
  return (
    <div className={`wf-imgx flex items-center justify-center ${className}`} style={{ width: w, height: h }}>
      {label ? (
        <span className="relative z-10 bg-neutral-100 px-1 text-[9px] font-medium text-neutral-500">{label}</span>
      ) : null}
    </div>
  )
}

export function Avatar({ size = 28, label }: { size?: number; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex shrink-0 items-center justify-center rounded-full border border-neutral-400 bg-neutral-200 text-[9px] font-semibold text-neutral-500"
        style={{ width: size, height: size }}
      >
        {label ?? "☺"}
      </div>
    </div>
  )
}

export function Icon({
  glyph,
  size = 24,
  className = "",
}: {
  glyph: string
  size?: number
  className?: string
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded border border-neutral-300 bg-neutral-50 text-neutral-500 ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.5) }}
      aria-hidden="true"
    >
      {glyph}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

export function Btn({
  children,
  variant = "solid",
  size = "md",
  className = "",
  onClick,
}: {
  children: ReactNode
  variant?: "solid" | "outline" | "ghost"
  size?: "sm" | "md"
  className?: string
  onClick?: () => void
}) {
  const base =
    "inline-flex items-center justify-center gap-1 rounded font-medium whitespace-nowrap select-none"
  const sizes = size === "sm" ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-[11px]"
  const variants =
    variant === "solid"
      ? "bg-neutral-700 text-neutral-50 border border-neutral-700"
      : variant === "outline"
        ? "bg-white text-neutral-600 border border-neutral-400"
        : "bg-transparent text-neutral-500 border border-transparent"
  return (
    <button type="button" onClick={onClick} className={`${base} ${sizes} ${variants} ${className}`}>
      {children}
    </button>
  )
}

export function Field({
  label,
  placeholder,
  w = "100%",
  hint,
}: {
  label?: string
  placeholder?: string
  w?: string | number
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1" style={{ width: w }}>
      {label ? <Label>{label}</Label> : null}
      <div className="flex h-8 items-center rounded border border-neutral-300 bg-white px-2">
        <span className="text-[11px] text-neutral-400">{placeholder ?? "…"}</span>
      </div>
      {hint ? <span className="text-[9px] text-neutral-400">{hint}</span> : null}
    </div>
  )
}

export function Select({ label, value, w = "100%" }: { label?: string; value: string; w?: string | number }) {
  return (
    <div className="flex flex-col gap-1" style={{ width: w }}>
      {label ? <Label>{label}</Label> : null}
      <div className="flex h-8 items-center justify-between rounded border border-neutral-300 bg-white px-2">
        <span className="text-[11px] text-neutral-500">{value}</span>
        <span className="text-[9px] text-neutral-400">▾</span>
      </div>
    </div>
  )
}

export function Checkbox({ label, checked = false }: { label: string; checked?: boolean }) {
  return (
    <label className="flex items-center gap-2">
      <span
        className={`flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border text-[9px] ${
          checked ? "border-neutral-600 bg-neutral-600 text-white" : "border-neutral-400 bg-white text-transparent"
        }`}
      >
        ✓
      </span>
      <Label>{label}</Label>
    </label>
  )
}

export function Toggle({ on = false }: { on?: boolean }) {
  return (
    <span
      className={`inline-flex h-4 w-7 items-center rounded-full border p-0.5 ${
        on ? "justify-end border-neutral-600 bg-neutral-300" : "justify-start border-neutral-400 bg-neutral-100"
      }`}
    >
      <span className="h-3 w-3 rounded-full bg-neutral-600" />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Status badges                                                       */
/* ------------------------------------------------------------------ */

type BadgeTone = "neutral" | "outline" | "dark" | "hatch"

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}) {
  const tones: Record<BadgeTone, string> = {
    neutral: "bg-neutral-200 text-neutral-600 border-neutral-300",
    outline: "bg-white text-neutral-500 border-neutral-400 border-dashed",
    dark: "bg-neutral-700 text-neutral-50 border-neutral-700",
    hatch: "wf-bar text-neutral-700 border-neutral-400",
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

/* status dot + label used inside workflow chains */
export function Status({ label, tone = "neutral" }: { label: string; tone?: BadgeTone }) {
  return <Badge tone={tone}>{label}</Badge>
}

/* ------------------------------------------------------------------ */
/* Containers                                                          */
/* ------------------------------------------------------------------ */

export function Panel({
  title,
  action,
  children,
  className = "",
  style,
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <section className={`rounded-md border border-neutral-300 bg-white ${className}`} style={style}>
      {title ? (
        <header className="flex items-center justify-between border-b border-neutral-200 px-3 py-2">
          <Eyebrow>{title}</Eyebrow>
          {action}
        </header>
      ) : null}
      <div className="p-3">{children}</div>
    </section>
  )
}

/* Stat / metric tile */
export function Stat({ label, big }: { label: string; big?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-neutral-300 bg-white p-3">
      <Label muted>{label}</Label>
      <Bar w={big ? "55%" : "40%"} h={big ? 18 : 14} />
      <Line w="70%" />
    </div>
  )
}

/* Dashed annotation callout with an optional connector arrow */
export function Note({
  children,
  arrow,
  className = "",
  style,
}: {
  children: ReactNode
  arrow?: "left" | "right" | "up" | "down"
  className?: string
  style?: CSSProperties
}) {
  const arrows = { left: "←", right: "→", up: "↑", down: "↓" }
  return (
    <div className={`wf-note flex items-start gap-1.5 rounded px-2 py-1.5 text-[10px] leading-snug ${className}`} style={style}>
      {arrow ? <span className="font-bold">{arrows[arrow]}</span> : <span className="font-bold">✎</span>}
      <span>{children}</span>
    </div>
  )
}

/* Simple bar chart made of hatched columns */
export function BarChart({ heights, h = 90 }: { heights: number[]; h?: number }) {
  return (
    <div className="flex items-end gap-1.5 border-b border-l border-neutral-300 px-1 pt-1" style={{ height: h }}>
      {heights.map((v, i) => (
        <div key={i} className="wf-bar flex-1 rounded-t" style={{ height: `${v}%` }} />
      ))}
    </div>
  )
}

/* Line chart placeholder */
export function LineChart({ h = 90 }: { h?: number }) {
  return (
    <div className="relative border-b border-l border-neutral-300" style={{ height: h }}>
      <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="h-full w-full">
        <polyline
          points="0,60 30,45 60,52 90,30 120,38 150,18 180,26 200,10"
          fill="none"
          stroke="#737373"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )
}

/* Donut / pie placeholder */
export function Donut({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e5e5" strokeWidth="6" />
      <circle
        cx="18"
        cy="18"
        r="15"
        fill="none"
        stroke="#737373"
        strokeWidth="6"
        strokeDasharray="66 100"
        transform="rotate(-90 18 18)"
      />
    </svg>
  )
}

/* Generic table */
export function Table({
  columns,
  rows,
  widths,
}: {
  columns: string[]
  rows: ReactNode[][]
  widths?: string[]
}) {
  return (
    <div className="overflow-hidden rounded border border-neutral-200">
      <div
        className="grid border-b border-neutral-200 bg-neutral-100 px-3 py-1.5"
        style={{ gridTemplateColumns: widths?.join(" ") ?? `repeat(${columns.length}, 1fr)`, gap: 12 }}
      >
        {columns.map((c, i) => (
          <Eyebrow key={i}>{c}</Eyebrow>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div
          key={ri}
          className="grid items-center border-b border-neutral-100 px-3 py-2 last:border-0"
          style={{ gridTemplateColumns: widths?.join(" ") ?? `repeat(${columns.length}, 1fr)`, gap: 12 }}
        >
          {r.map((cell, ci) => (
            <div key={ci} className="min-w-0 text-[11px] text-neutral-600">
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
