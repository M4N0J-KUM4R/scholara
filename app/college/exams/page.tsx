"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/input"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { examPipeline, type ExamRow } from "@/lib/data"

const statusTone: Record<ExamRow["status"], "success" | "warning" | "info" | "candy"> = {
  Published: "success",
  Approved: "success",
  "Pending review": "warning",
  Draft: "info",
  Completed: "candy",
}

const accommodations = [
  { key: "time" as const, label: "+50% time", desc: "Applied automatically to timed sections." },
  { key: "reader" as const, label: "Screen reader", desc: "Enables the accessible player for flagged students." },
  { key: "room" as const, label: "Separate room", desc: "Marks the batch for the quiet hall roster." },
]

function DateBlock({ date }: { date: string }) {
  const [monthDay, time] = date.split(", ")
  const [month, day] = monthDay.split(" ")
  return (
    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center border-2 border-ink bg-sun nb-shadow-sm">
      <span className="font-display text-[15px] leading-none text-ink">{day}</span>
      <span className="text-[8px] font-bold uppercase tracking-wide text-ink/70">{month}</span>
      <span className="sr-only">{time}</span>
    </div>
  )
}

export default function CollegeExamsPage() {
  const [rows, setRows] = useState<ExamRow[]>(examPipeline)
  const [reviewing, setReviewing] = useState<string | null>(null)
  const [acc, setAcc] = useState({ time: true, reader: false, room: false })

  function publish(id: string) {
    setRows((prev) => prev.map((e) => (e.id === id ? { ...e, status: "Published" as const } : e)))
  }

  const upcoming = rows
    .filter((e) => e.status === "Published" || e.status === "Approved" || e.status === "Pending review")
    .slice(0, 3)

  const appliedCount = Object.values(acc).filter(Boolean).length

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">Exams</h1>
          <p className="mt-1 text-[12px] font-medium text-ink/60">
            The approval-to-publication pipeline, the live schedule and exam-day accommodations.
          </p>
        </div>
        <Button variant="dark">+ Schedule exam</Button>
      </div>

      {reviewing ? (
        <div className="nb-shadow-sm flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-bubblegum px-4 py-2.5">
          <p className="text-[12px] font-bold text-ink">
            {reviewing} is now open for exam-cell review — the committee has been notified.
          </p>
          <Button variant="ghost" size="sm" onClick={() => setReviewing(null)}>
            Dismiss
          </Button>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Pipeline table */}
        <div className="lg:col-span-2">
          <TableRoot>
            <THead>
              <TR>
                <TH>Exam</TH>
                <TH>Faculty</TH>
                <TH>Date</TH>
                <TH className="text-right">Students</TH>
                <TH>Status</TH>
                <TH className="text-right">Action</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((e) => (
                <TR key={e.id}>
                  <TD>
                    <span className="block text-[12px] font-bold text-ink">{e.title}</span>
                    <Badge tone="dark" className="mt-1">{e.course}</Badge>
                  </TD>
                  <TD>{e.faculty}</TD>
                  <TD className="whitespace-nowrap">
                    {e.date}
                    <span className="block text-[10px] text-ink/45">{e.duration}</span>
                  </TD>
                  <TD className="text-right">{e.students}</TD>
                  <TD><Badge tone={statusTone[e.status]}>{e.status}</Badge></TD>
                  <TD className="text-right">
                    {e.status === "Approved" ? (
                      <Button variant="success" size="sm" onClick={() => publish(e.id)}>
                        Publish →
                      </Button>
                    ) : e.status === "Pending review" ? (
                      <Button variant="outline" size="sm" onClick={() => setReviewing(e.title)}>
                        Open review
                      </Button>
                    ) : (
                      <span className="text-ink/30" aria-hidden>—</span>
                    )}
                  </TD>
                </TR>
              ))}
            </TBody>
          </TableRoot>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader title="Schedule snapshot" tone="sky" action={<Badge tone="dark">Next 3</Badge>} />
            <CardBody className="flex flex-col gap-3">
              {upcoming.map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <DateBlock date={e.date} />
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-bold text-ink">{e.title}</p>
                    <p className="mt-0.5 text-[10px] font-medium text-ink/50">
                      {e.date.split(", ")[1]} · {e.course} · {e.students} students
                    </p>
                  </div>
                  <Badge tone={statusTone[e.status]} className="ml-auto shrink-0">
                    {e.status}
                  </Badge>
                </div>
              ))}
              {upcoming.length === 0 ? (
                <p className="text-[12px] font-medium text-ink/50">No upcoming exams on the schedule.</p>
              ) : null}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Accommodations"
              tone="mint"
              action={<Badge tone={appliedCount > 0 ? "success" : "outline"}>{appliedCount} applied</Badge>}
            />
            <CardBody className="flex flex-col gap-3">
              <p className="text-[11px] font-medium text-ink/60">
                Applied to the next 3 published exams for flagged students.
              </p>
              {accommodations.map((a) => (
                <div key={a.key} className="flex flex-col gap-0.5 border-b border-ink/10 pb-3 last:border-0 last:pb-0">
                  <Checkbox
                    label={<span className="font-bold">{a.label}</span>}
                    checked={acc[a.key]}
                    onChange={(checked) => setAcc((prev) => ({ ...prev, [a.key]: checked }))}
                  />
                  <span className="pl-7 text-[10px] font-medium text-ink/50">{a.desc}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  )
}
