"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardBody } from "@/components/ui/card"
import { TableRoot, THead, TH, TBody, TR, TD } from "@/components/ui/table"
import { assessments as seedAssessments } from "@/lib/data"
import type { Assessment } from "@/lib/data"

const statusTone: Record<Assessment["status"], "info" | "warning" | "success" | "default" | "danger"> = {
  Draft: "info",
  "Pending review": "warning",
  Approved: "success",
  Published: "default",
  Rejected: "danger",
  Completed: "success",
}

const pipelineSteps = [
  {
    n: "1",
    title: "Faculty submits",
    desc: "Author finalises questions, marks and settings, then sends the draft for review.",
    cls: "bg-sun",
  },
  {
    n: "2",
    title: "HOD review",
    desc: "Department head checks blueprint coverage and the marks split across units.",
    cls: "bg-sky",
  },
  {
    n: "3",
    title: "Exam Cell approval",
    desc: "Exam cell verifies duration, proctoring and the timetable slot before sign-off.",
    cls: "bg-mint",
  },
  {
    n: "4",
    title: "Published",
    desc: "Students see the exam in their portal; any later edit creates a new version.",
    cls: "bg-grape",
  },
]

const recentActivity = [
  { date: "Sep 12", text: "DBMS Unit Test v3 submitted for validation by Dr. Sneha Iyer." },
  { date: "Sep 11", text: "HOD approved OS Quiz 2 v2 — cleared by Dr. Ananya Rao." },
  { date: "Sep 10", text: "Signals Assignment 3 v1 rejected: marks mismatch across sections." },
  { date: "Sep 08", text: "Algorithms Practice Set v1 drafted for CS301 (15 items)." },
]

export default function AssessmentsPage() {
  const [rows, setRows] = useState<Assessment[]>(seedAssessments)
  const [note, setNote] = useState<string | null>(null)

  const submitForReview = (id: string) => {
    const row = rows.find((r) => r.id === id)
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: "Pending review" as const } : r)))
    setNote(`"${row?.title}" sent to Dr. Ananya Rao (HOD) for review.`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Route header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">Assessments</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            Build, submit and track every exam through the validation pipeline.
          </p>
        </div>
        <Link
          href="/faculty/assessments/new"
          className="nb-press nb-focus inline-flex h-9 select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-none border-2 border-ink bg-sun px-4 text-[12px] font-bold shadow-[3px_3px_0_#0a0a0a]"
        >
          + New assessment
        </Link>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="flex flex-col gap-3 lg:col-span-2">
          {note ? (
            <p className="border-2 border-ink bg-mint px-3 py-2 text-[11px] font-bold text-ink nb-shadow-sm">{note}</p>
          ) : null}
          <TableRoot>
            <THead>
              <TR>
                <TH>Assessment</TH>
                <TH>Course</TH>
                <TH>Questions</TH>
                <TH>Marks</TH>
                <TH>Duration</TH>
                <TH>Version</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((a) => (
                <TR key={a.id}>
                  <TD className="font-bold text-ink">{a.title}</TD>
                  <TD>{a.course}</TD>
                  <TD>{a.questions}</TD>
                  <TD>{a.marks}</TD>
                  <TD>{a.duration}</TD>
                  <TD>{a.version}</TD>
                  <TD>
                    <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                  </TD>
                  <TD>
                    <div className="flex justify-end gap-1.5">
                      <Link
                        href="/faculty/assessments/new"
                        className="nb-press nb-focus inline-flex h-7 select-none items-center justify-center whitespace-nowrap rounded-none border-2 border-ink bg-white px-2.5 text-[11px] font-bold shadow-[3px_3px_0_#0a0a0a]"
                      >
                        Edit
                      </Link>
                      {a.status === "Draft" ? (
                        <Button size="sm" onClick={() => submitForReview(a.id)}>
                          Submit for review
                        </Button>
                      ) : null}
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </TableRoot>
        </section>

        <div className="flex flex-col gap-4">
          {/* Validation pipeline explained */}
          <Card>
            <CardHeader title="Validation pipeline explained" tone="sky" />
            <CardBody className="flex flex-col gap-3">
              {pipelineSteps.map((s) => (
                <div key={s.n} className="flex gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink text-[11px] font-bold text-ink nb-shadow-sm ${s.cls}`}
                  >
                    {s.n}
                  </span>
                  <div>
                    <p className="text-[12px] font-bold text-ink">{s.title}</p>
                    <p className="text-[11px] font-medium text-ink/60">{s.desc}</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader title="Recent activity" tone="candy" />
            <CardBody className="flex flex-col gap-2.5">
              {recentActivity.map((r) => (
                <div key={r.date + r.text} className="flex gap-2.5">
                  <Badge tone="dark" className="h-fit shrink-0">
                    {r.date}
                  </Badge>
                  <p className="text-[11px] font-medium leading-snug text-ink/80">{r.text}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
