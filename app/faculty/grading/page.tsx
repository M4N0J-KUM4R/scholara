"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardBody } from "@/components/ui/card"
import { Toggle } from "@/components/ui/input"
import { ProgressBar } from "@/components/ui/stat"
import { TableRoot, THead, TH, TBody, TR, TD } from "@/components/ui/table"
import { gradingQueue, rubricRows } from "@/lib/data"
import { cn } from "@/lib/utils"

const statusTone: Record<string, "warning" | "danger" | "sky"> = {
  Waiting: "warning",
  Flagged: "danger",
  "In progress": "sky",
}

const filters = ["All", "Waiting", "Flagged"] as const

/* Grader-facing excerpt of each student's script. */
const responses: Record<string, string> = {
  g1: "The LRU cache keeps a doubly linked list ordered by recency plus a hash map from key to node, so both get and put run in O(1) amortized time. Eviction correctly removes the tail node on capacity overflow, though the candidate skips sentinel head/tail nodes, making every boundary case an explicit branch. One line conflates cache capacity with element count, which would fail the hidden stress test.",
  g2: "The answer walks through heapify-down from the last internal node and justifies the O(n) bound with a summation over node heights. The tree diagrams for each pass are accurate, including the tricky swap at index 1. The final paragraph hand-waves the complexity of sift-down as “roughly logarithmic” without the closed-form argument the rubric asks for.",
  g3: "Entropy analysis is set up correctly and the student identifies that the cycle efficiency falls mainly with condenser temperature. The worked Rankine derivation uses consistent units and lands on 38.2%, close to the reference 37.9%. However, the pump-work term is dropped midway and only reappears in the final number without explanation.",
  g4: "The candidate computes the 4-point DFT via the matrix method and reports all four coefficients correctly, including X[2] = -2. Twiddle-factor notation is used precisely and the butterfly interpretation is mentioned. The response ends abruptly after part (a) and never attempts the magnitude spectrum sketch in part (b).",
}

const markers = [
  { name: "Dr. Ananya Rao (first)", avg: "76.2", variance: "3.1" },
  { name: "Prof. Rahul Menon (second)", avg: "74.8", variance: "4.0" },
  { name: "Exam Cell (final)", avg: "75.5", variance: "2.6" },
]

const reevals = [
  { id: "r1", who: "Kabir Singh", detail: "DSA Midterm Q7 — claims test cases pass locally; sandbox says 3/10." },
  { id: "r2", who: "Meera Krishnan", detail: "OS Quiz 2 Q4 — disputes partial credit on scheduler trace." },
]

export default function GradingPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [selectedId, setSelectedId] = useState(gradingQueue[0].id)
  const [scoresByRow, setScoresByRow] = useState<Record<string, number[]>>(() =>
    Object.fromEntries(gradingQueue.map((r) => [r.id, rubricRows.map((x) => x.score)])),
  )
  const [secondMarker, setSecondMarker] = useState(true)
  const [blind, setBlind] = useState(false)
  const [finalNote, setFinalNote] = useState<string | null>(null)
  const [openReeval, setOpenReeval] = useState<string | null>(null)

  const visible = filter === "All" ? gradingQueue : gradingQueue.filter((r) => r.status === filter)
  const selected = gradingQueue.find((r) => r.id === selectedId) ?? gradingQueue[0]
  const scores = scoresByRow[selected.id] ?? rubricRows.map((x) => x.score)

  const maxTotal = rubricRows.reduce((s, r) => s + r.max, 0)
  const scoreTotal = scores.reduce((s, v) => s + v, 0)
  const pct = Math.round((scoreTotal / maxTotal) * 100)

  const adjust = (idx: number, delta: number) =>
    setScoresByRow((m) => ({
      ...m,
      [selected.id]: m[selected.id].map((v, i) =>
        i === idx ? Math.min(rubricRows[i].max, Math.max(0, v + delta)) : v,
      ),
    }))

  const saveAndNext = () => {
    const i = gradingQueue.findIndex((r) => r.id === selected.id)
    const next = gradingQueue[(i + 1) % gradingQueue.length]
    setSelectedId(next.id)
    setFinalNote(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Route header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">Grading</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            Work the manual queue with rubrics, then cross-check moderation stats.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="info">Auto-graded 118</Badge>
          <Badge tone="warning">Manual 24</Badge>
          <Badge tone="danger">Re-eval 3</Badge>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Submissions */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Submissions"
            tone="candy"
            action={
              <div className="flex gap-1">
                {filters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    aria-pressed={filter === f}
                    className={cn(
                      "rounded-none border-2 border-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                      filter === f ? "bg-ink text-sun" : "bg-white text-ink/70 hover:text-ink",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            }
          />
          <CardBody className="flex flex-col gap-2">
            {visible.length === 0 ? (
              <p className="border-2 border-dashed border-ink/40 bg-paper px-4 py-6 text-center text-[12px] font-medium text-ink/60">
                Nothing {filter.toLowerCase()} right now — queue clear.
              </p>
            ) : (
              visible.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(r.id)
                    setFinalNote(null)
                  }}
                  className={cn(
                    "rounded-none border-2 border-ink bg-white p-3 text-left transition-colors",
                    selected.id === r.id && "bg-sunlight nb-shadow-sm",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[12px] font-bold text-ink">{r.student}</span>
                    <Badge tone={statusTone[r.status]}>{r.status}</Badge>
                  </div>
                  <p className="mt-1 text-[10px] font-medium text-ink/55">
                    {r.roll} · {r.exam} · pending {r.pending}
                  </p>
                </button>
              ))
            )}
          </CardBody>
        </Card>

        {/* Rubric grading */}
        <Card className="lg:col-span-3">
          <CardHeader
            title="Rubric grading"
            tone="sunlight"
            action={
              <Badge tone="dark">
                {selected.student} · {selected.exam}
              </Badge>
            }
          />
          <CardBody className="flex flex-col gap-4">
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-ink/60">
                Student response — {selected.pending}
              </p>
              <p className="border-2 border-ink bg-paper p-3 text-[12px] font-medium leading-relaxed text-ink/85">
                {responses[selected.id]}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {rubricRows.map((r, i) => (
                <div key={r.criterion} className="border-2 border-ink bg-white p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[12px] font-bold text-ink">{r.criterion}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" aria-label={`Decrease ${r.criterion}`} onClick={() => adjust(i, -1)}>
                        −
                      </Button>
                      <span className="font-display text-[14px] text-ink">
                        {scores[i]}
                        <span className="text-ink/40"> / {r.max}</span>
                      </span>
                      <Button variant="outline" size="sm" aria-label={`Increase ${r.criterion}`} onClick={() => adjust(i, +1)}>
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={(scores[i] / r.max) * 100} color={scores[i] === r.max ? "bg-mint" : "bg-sun"} height="h-3" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-paper p-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink/60">Computed total</p>
                <p className="font-display text-2xl text-ink">
                  {scoreTotal}
                  <span className="text-[14px] text-ink/40"> / {maxTotal}</span>
                </p>
              </div>
              <Badge tone={pct >= 60 ? "success" : pct >= 40 ? "warning" : "danger"}>{pct}%</Badge>
            </div>

            {finalNote ? (
              <p className="border-2 border-ink bg-mint px-3 py-2 text-[11px] font-bold text-ink nb-shadow-sm">{finalNote}</p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button onClick={saveAndNext}>Save &amp; next →</Button>
              <Button
                variant="success"
                onClick={() =>
                  setFinalNote(
                    `Finalized ${scoreTotal}/${maxTotal} (${pct}%) for ${selected.student} on ${selected.exam}. Released to the portal.`,
                  )
                }
              >
                Finalize grades
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Moderation */}
      <Card className="self-start">
        <CardHeader title="Moderation" tone="sky" />
        <CardBody className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-6">
            <Toggle checked={secondMarker} onChange={setSecondMarker} label="Second marker on disputed items" />
            <Toggle checked={blind} onChange={setBlind} label="Blind grading (hide student names)" />
          </div>

          <TableRoot className="nb-shadow-sm">
            <THead>
              <TR>
                <TH>Marker</TH>
                <TH>Avg</TH>
                <TH>Variance</TH>
              </TR>
            </THead>
            <TBody>
              {markers.map((m) => (
                <TR key={m.name}>
                  <TD className="font-bold text-ink">{m.name}</TD>
                  <TD>{m.avg}</TD>
                  <TD>{m.variance}</TD>
                </TR>
              ))}
            </TBody>
          </TableRoot>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-ink/60">Re-evaluation requests</p>
            <div className="flex flex-col gap-2">
              {reevals.map((r) => (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 border-2 border-ink bg-white px-3 py-2.5">
                  <p className="text-[11px] font-medium text-ink/80">
                    <span className="font-bold text-ink">{r.who}</span> — {r.detail}
                  </p>
                  <div className="flex items-center gap-2">
                    {openReeval === r.id ? <Badge tone="info">Ticket #REE-{r.id === "r1" ? "0214" : "0219"} open</Badge> : null}
                    <Button variant="outline" size="sm" onClick={() => setOpenReeval(r.id)}>
                      Open
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
