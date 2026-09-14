"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Stat } from "@/components/ui/stat"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { coverageMatrix, facultyDirectoryRows } from "@/lib/data"

export default function CollegeDepartmentStatusPage() {
  const [view, setView] = useState<"faculty" | "hod">("hod")
  const [loading, setLoading] = useState(false)

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="dark">Computer Science & Engineering</Badge>
            <span className="text-[11px] font-bold text-ink/60">HOD: Dr. Ananya Rao</span>
          </div>
          <h1 className="mt-1 font-display text-2xl text-ink">Department Operational Status</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            {loading ? "Refreshing telemetry data…" : "Live departmental telemetry"} · 24 faculty · 840 students · 18 active courses.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* View Switcher */}
          <div className="border-2 border-ink bg-white p-1 flex gap-1 shadow-[2px_2px_0_#0a0a0a]">
            <button
              onClick={() => setView("faculty")}
              className={`px-3 py-1 text-[11px] font-bold ${
                view === "faculty" ? "bg-sun text-ink" : "text-ink/60 hover:text-ink"
              }`}
            >
              Faculty View
            </button>
            <button
              onClick={() => setView("hod")}
              className={`px-3 py-1 text-[11px] font-bold ${
                view === "hod" ? "bg-sun text-ink" : "text-ink/60 hover:text-ink"
              }`}
            >
              HOD View
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            {loading ? "↻ Syncing…" : "↻ Refresh"}
          </Button>
          <Button variant="default" size="sm">
            ⭳ Export NAAC Snapshot
          </Button>
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Active Courses" value="18" sub="↑2 this term" color="bg-sunlight" />
        <Stat label="Faculty Count" value="24" sub="3 overloaded ⚠" color="bg-candy" />
        <Stat label="Enrolled Students" value="840" sub="7 at-risk flagged" color="bg-skylight" />
        <Stat label="Pending Reviews" value="5" sub="3 HOD · 2 Cell" color="bg-mintlight" />
        <Stat label="Exams This Week" value="4" sub="2 live today" color="bg-tang" />
        <Stat label="Avg. Dept Score" value="71%" sub="↓3% vs last term" color="bg-bubblegum" />
      </div>

      {/* Course Coverage Map & Pending Actions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Course Coverage Matrix (8 Cols) */}
        <Card className="lg:col-span-8">
          <CardHeader
            title="Course Outcome (CO) & Unit Coverage Map"
            tone="sunlight"
            action={<Badge tone="dark">6 Courses · 5 Units</Badge>}
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[12px]">
                <thead className="border-b-2 border-ink bg-paper2 font-mono text-[10px] uppercase text-ink/70">
                  <tr>
                    <th className="p-3">Course</th>
                    <th className="p-3 text-center">Unit 1</th>
                    <th className="p-3 text-center">Unit 2</th>
                    <th className="p-3 text-center">Unit 3</th>
                    <th className="p-3 text-center">Unit 4</th>
                    <th className="p-3 text-center">Unit 5</th>
                    <th className="p-3 text-right">CO Coverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-ink">
                  {coverageMatrix.map((row) => (
                    <tr key={row.course} className="hover:bg-paper">
                      <td className="p-3 font-bold text-ink whitespace-nowrap">{row.course}</td>
                      {[row.u1, row.u2, row.u3, row.u4, row.u5].map((state, idx) => (
                        <td key={idx} className="p-3 text-center">
                          <span
                            className={`inline-block h-6 w-12 border-2 border-ink ${
                              state === "covered"
                                ? "bg-mint"
                                : state === "partial"
                                ? "bg-sun"
                                : "bg-white"
                            }`}
                            title={state}
                          />
                        </td>
                      ))}
                      <td className="p-3 text-right font-display text-base text-ink">
                        {row.coverage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 border-t-2 border-ink bg-white p-3 text-[11px] font-bold">
              <span>Legend:</span>
              <div className="flex items-center gap-1.5">
                <span className="h-4 w-6 border border-ink bg-mint" />
                <span>Fully Covered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-4 w-6 border border-ink bg-sun" />
                <span>Partial (Assessment Pending)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-4 w-6 border border-ink bg-white" />
                <span>Not Covered</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Pending Actions (4 Cols) */}
        <Card className="lg:col-span-4">
          <CardHeader
            title="Pending Operational Actions"
            tone="candy"
            action={<Badge tone="danger">8 Urgent</Badge>}
          />
          <CardBody className="flex flex-col gap-3 p-4">
            {[
              { title: "CS301 Midterm v3 pending HOD review", time: "2 days ago", link: "/faculty/validation" },
              { title: "CS305 Unit 4 has no scheduled assessment", time: "Due this week", link: "/faculty/assessments/new" },
              { title: "3 grading queues overdue (>48h backlog)", time: "Needs attention", link: "/faculty/grading" },
              { title: "CS302 CO3 outcome not yet evaluated", time: "Accreditation gap", link: "/college/reports" },
              { title: "CS304 validation waiting on Exam Cell", time: "Pending approval", link: "/faculty/validation" },
              { title: "2 faculty leave requests submitted", time: "Duty reassignment", link: "/college/faculty" },
              { title: "7 at-risk students need mentor assignment", time: "Below 40% avg", link: "/college/students" },
            ].map((act, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-2 border-b-2 border-dashed border-ink/20 pb-2.5 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-[11px] font-bold text-ink leading-snug">{act.title}</p>
                  <p className="text-[9px] text-ink/50 uppercase font-bold">{act.time}</p>
                </div>
                <Link href={act.link}>
                  <Button variant="outline" size="sm">
                    Go →
                  </Button>
                </Link>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* HOD Faculty Load Table */}
      {view === "hod" ? (
        <Card>
          <CardHeader
            title="CSE Faculty Workload (HOD Confidential View)"
            tone="mint"
            action={<Badge tone="dark">10 Members Tracked</Badge>}
          />
          <CardBody className="p-0">
            <TableRoot className="border-0 shadow-none">
              <THead>
                <TR>
                  <TH>Faculty Member</TH>
                  <TH>Courses</TH>
                  <TH>Students</TH>
                  <TH>Grading Backlog</TH>
                  <TH className="text-right">Teaching Load %</TH>
                  <TH>Workload Status</TH>
                </TR>
              </THead>
              <TBody>
                {facultyDirectoryRows
                  .filter((f) => f.dept === "CSE")
                  .map((f) => (
                    <TR key={f.id}>
                      <TD className="font-bold text-ink">{f.name}</TD>
                      <TD>{f.coursesCount} active</TD>
                      <TD>{f.studentsCount}</TD>
                      <TD>{f.gradingQueue} pending items</TD>
                      <TD className="text-right font-display text-base text-ink">{f.loadPct}%</TD>
                      <TD>
                        <Badge tone={f.status === "Overloaded" ? "danger" : "success"}>
                          {f.status}
                        </Badge>
                      </TD>
                    </TR>
                  ))}
              </TBody>
            </TableRoot>
          </CardBody>
        </Card>
      ) : null}

      {/* Performance Distribution Histogram & Department Announcements */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Student Performance Distribution (Score Intervals)" tone="sky" />
          <CardBody className="flex flex-col gap-4 p-5">
            <div className="flex h-36 items-end justify-around gap-4 border-b-2 border-l-2 border-ink px-4 pb-2 bg-paper">
              {[
                { range: "0–40%", pct: 18, color: "bg-tomato" },
                { range: "40–60%", pct: 24, color: "bg-sun" },
                { range: "60–80%", pct: 36, color: "bg-mint" },
                { range: "80–100%", pct: 22, color: "bg-sky" },
              ].map((b) => (
                <div key={b.range} className="flex flex-col items-center gap-1 w-16">
                  <span className="font-mono text-[10px] font-bold">{b.pct}%</span>
                  <div
                    className={`w-full border-2 border-ink ${b.color}`}
                    style={{ height: `${b.pct * 2.8}px` }}
                  />
                  <span className="text-[10px] font-bold text-ink/70">{b.range}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] font-medium text-ink/70">
              18% of cohort is currently below the 40% passing benchmark. Remedial tests scheduled for next week.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Department Circulars & Bulletins" tone="candy" action={<Button variant="dark" size="sm">+ Post Circular</Button>} />
          <CardBody className="flex flex-col gap-3 p-4">
            {[
              { title: "Midterm examination paper submission deadline: Friday 5:00 PM", author: "Dr. Ananya Rao", date: "Today" },
              { title: "AICTE / NBA SSR audit visit scheduled for next month", author: "Dean Academics", date: "Yesterday" },
              { title: "New cloud lab environment available for Operating Systems (CS305)", author: "Prof. Rahul Menon", date: "Sep 10" },
            ].map((c, i) => (
              <div key={i} className="border-2 border-ink bg-white p-3 shadow-[2px_2px_0_#0a0a0a]">
                <h5 className="font-bold text-[12px] text-ink">{c.title}</h5>
                <p className="text-[10px] font-medium text-ink/50 mt-1">Posted by {c.author} · {c.date}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  )
}
