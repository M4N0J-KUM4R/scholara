import { cn } from "@/lib/utils"

const palette = ["bg-sun", "bg-candy", "bg-sky", "bg-mint", "bg-grape", "bg-tang"]

export function BarChart({
  data,
  height = 160,
  className,
}: {
  data: { label: string; value: number }[]
  height?: number
  className?: string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-end gap-2 border-b-2 border-l-2 border-ink px-2 pt-2" style={{ height }}>
        {data.map((d, i) => (
          <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-0 self-stretch">
            <span className="mb-1 text-[9px] font-bold text-ink/70">{d.value}</span>
            <div
              className={cn("w-full border-2 border-b-0 border-ink", palette[i % palette.length])}
              style={{ height: `${(d.value / max) * 100}%` }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 px-2">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[9px] font-bold uppercase text-ink/60">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function LineChart({
  points,
  height = 150,
  labels,
}: {
  points: number[]
  height?: number
  labels?: string[]
}) {
  const w = 300
  const h = 100
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w
    const y = h - ((p - min) / range) * (h - 16) - 8
    return `${x},${y}`
  })
  return (
    <div className="flex flex-col gap-1">
      <div className="border-b-2 border-l-2 border-ink" style={{ height }}>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full">
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="#0a0a0a20" strokeWidth="1" />
          ))}
          <polyline points={coords.join(" ")} fill="none" stroke="#0a0a0a" strokeWidth="2.5" />
          {coords.map((c, i) => {
            const [x, y] = c.split(",")
            return <rect key={i} x={Number(x) - 3} y={Number(y) - 3} width="6" height="6" fill="#ffdc58" stroke="#0a0a0a" strokeWidth="1.5" />
          })}
        </svg>
      </div>
      {labels ? (
        <div className="flex justify-between text-[9px] font-bold uppercase text-ink/60">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function Donut({
  value,
  size = 120,
  color = "#ff90e8",
  label,
  caption,
}: {
  value: number
  size?: number
  color?: string
  label?: string
  caption?: string
}) {
  const r = 40
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`${label ?? "Share"}: ${value}%`}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f4ead0" strokeWidth="14" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeDasharray={`${(value / 100) * c} ${c}`}
          transform="rotate(-90 50 50)"
        />
        <circle cx="50" cy="50" r={r + 7} fill="none" stroke="#0a0a0a" strokeWidth="1.5" />
        <circle cx="50" cy="50" r={r - 7} fill="none" stroke="#0a0a0a" strokeWidth="1.5" />
        <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="800" fill="#0a0a0a">
          {value}%
        </text>
      </svg>
      {caption ? <span className="text-[10px] font-bold uppercase tracking-wide text-ink/60">{caption}</span> : null}
    </div>
  )
}
