"use client"

import { Fragment, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardBody } from "@/components/ui/card"
import { Textarea } from "@/components/ui/input"
import { validationStages, validationComments, validationVersions } from "@/lib/data"
import { cn } from "@/lib/utils"

type Comment = (typeof validationComments)[number]
type Decision = "approved" | "changes" | "rejected" | null

const decisionBanner: Record<Exclude<Decision, null>, { cls: string; text: string }> = {
  approved: {
    cls: "bg-mint",
    text: "✓ Approved — DBMS Unit Test v3 is queued for publishing. Exam Cell has been notified.",
  },
  changes: {
    cls: "bg-tanglight",
    text: "✎ Changes requested — Dr. Sneha Iyer must rework the marks split on Q12/Q29 and resubmit as v4.",
  },
  rejected: {
    cls: "bg-tomato",
    text: "✕ Rejected — submission returned to the author. Reason logged against DBMS Unit Test v3.",
  },
}

export default function ValidationPage() {
  const [comments, setComments] = useState<Comment[]>(validationComments)
  const [draft, setDraft] = useState("")
  const [decision, setDecision] = useState<Decision>(null)
  const [status, setStatus] = useState<"Pending review" | "Approved" | "Rejected">("Pending review")

  const addComment = () => {
    if (!draft.trim()) return
    setComments((cs) => [...cs, { by: "Prof. Rahul Menon", when: "Just now", text: draft.trim(), role: "Faculty" }])
    setDraft("")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Route header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">Validation</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            Review submissions moving from faculty draft to published exam.
          </p>
        </div>
        <Badge tone={status === "Pending review" ? "warning" : status === "Approved" ? "success" : "danger"}>{status}</Badge>
      </header>

      {/* Stage chain */}
      <Card>
        <CardHeader title="Where this submission sits" tone="sunlight" action={<Badge tone="dark">DBMS Unit Test</Badge>} />
        <CardBody>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {validationStages.map((s, i) => (
              <Fragment key={s.label}>
                <div
                  className={cn(
                    "flex-1 border-2 border-ink p-3",
                    s.state === "done" ? "bg-mint" : s.state === "current" ? "bg-sun nb-shadow-sm" : "bg-white",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-white text-[11px] font-bold text-ink">
                      {s.state === "done" ? "✓" : s.state === "current" ? "●" : i + 1}
                    </span>
                    <p className="font-display text-[13px] text-ink">{s.label}</p>
                  </div>
                  <p className="mt-1.5 text-[10px] font-medium text-ink/60">
                    {s.by} · {s.when}
                  </p>
                </div>
                {i < validationStages.length - 1 ? (
                  <div aria-hidden className="hidden h-0.5 w-8 shrink-0 bg-ink md:block" />
                ) : null}
              </Fragment>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Submission under review */}
        <Card className="self-start">
          <CardHeader title="Submission under review" tone="candy" />
          <CardBody className="flex flex-col gap-4">
            <div>
              <h2 className="font-display text-[16px] text-ink">DBMS Unit Test</h2>
              <p className="mt-1 text-[11px] font-medium text-ink/60">
                CS310 · Dr. Sneha Iyer · scheduled Sep 22, 09:30 · 60 min
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge tone={status === "Pending review" ? "warning" : status === "Approved" ? "success" : "danger"}>{status}</Badge>
              <Badge tone="dark">v3</Badge>
              <Badge tone="info">35 questions</Badge>
              <Badge tone="default">80 marks</Badge>
              <Badge tone="outline">Proctoring: lockdown + tab warnings</Badge>
            </div>

            {decision ? (
              <p className={cn("border-2 border-ink px-3 py-2.5 text-[11px] font-bold text-ink nb-shadow-sm", decisionBanner[decision].cls)}>
                {decisionBanner[decision].text}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDecision("changes")
                  setStatus("Pending review")
                }}
              >
                Request changes
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  setDecision("approved")
                  setStatus("Approved")
                }}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setDecision("rejected")
                  setStatus("Rejected")
                }}
              >
                Reject
              </Button>
            </div>

            <p className="border-2 border-dashed border-ink/40 bg-paper px-3 py-2.5 text-[11px] font-medium text-ink/60">
              Blueprint check: 12 Remember · 11 Apply · 9 Analyze · 3 Evaluate — coverage within the 10% tolerance set by
              the department.
            </p>
          </CardBody>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader title="Comments" tone="sky" action={<Badge tone="dark">{comments.length}</Badge>} />
          <CardBody className="flex flex-col gap-3">
            <div className="flex flex-col gap-2.5">
              {comments.map((c, i) => (
                <div key={`${c.by}-${i}`} className="border-2 border-ink bg-white p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-bold text-ink">{c.by}</span>
                    <Badge tone="outline">{c.role}</Badge>
                    <span className="text-[10px] font-medium text-ink/50">{c.when}</span>
                  </div>
                  <p className="mt-1.5 text-[12px] font-medium leading-snug text-ink/80">{c.text}</p>
                </div>
              ))}
            </div>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a note for the author or exam cell…"
              aria-label="New comment"
            />
            <div className="flex justify-end">
              <Button onClick={addComment} disabled={!draft.trim()} className="disabled:pointer-events-none disabled:opacity-50">
                Add comment
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Version history */}
      <Card className="self-start">
        <CardHeader title="Version history" tone="mint" />
        <CardBody className="flex flex-col gap-2">
          {validationVersions.map((v) => (
            <div key={v.v} className="flex flex-wrap items-center justify-between gap-2 border-2 border-ink bg-white px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <Badge tone={v.current ? "success" : "outline"}>{v.v}</Badge>
                <span className="text-[12px] font-medium text-ink/80">{v.note}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-ink/50">{v.when}</span>
                {v.current ? <Badge tone="dark">Current</Badge> : null}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  )
}
