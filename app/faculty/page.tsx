import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardBody } from "@/components/ui/card"
import { Stat, ProgressBar } from "@/components/ui/stat"
import { TableRoot, THead, TH, TBody, TR, TD } from "@/components/ui/table"
import { assessments, studentCourses, gradingQueue } from "@/lib/data"
import type { Assessment } from "@/lib/data"

const statusTone: Record<Assessment["status"], "info" | "warning" | "success" | "default" | "danger"> = {
  Draft: "info",
  "Pending review": "warning",
  Approved: "success",
  Published: "default",
  Rejected: "danger",
  Completed: "success",
}

const btnLink =
  "nb-press nb-focus inline-flex h-9 select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-none border-2 border-ink bg-sun px-4 text-[12px] font-bold shadow-[3px_3px_0_#0a0a0a]"
const btnLinkOutline =
  "nb-press nb-focus inline-flex h-9 select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-none border-2 border-ink bg-white px-4 text-[12px] font-bold shadow-[3px_3px_0_#0a0a0a]"

const bankTypes = [
  { label: "MCQ", count: 64, cls: "bg-sky" },
  { label: "Coding", count: 22, cls: "bg-grape" },
  { label: "Lab", count: 8, cls: "bg-mint" },
  { label: "Short answer", count: 18, cls: "bg-sunlight" },
  { label: "Essay", count: 9, cls: "bg-candy" },
  { label: "Numerical", count: 7, cls: "bg-tang" },
]

const barColors = ["bg-sun", "bg-sky", "bg-mint", "bg-grape"]

export default function FacultyDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Route header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">Faculty dashboard</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            Your teaching load, assessment pipeline and pending grading at a glance.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/faculty/question-bank" className={btnLinkOutline}>
            Open question bank
          </Link>
          <Link href="/faculty/assessments/new" className={btnLink}>
            + New assessment
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="My courses" value="4" sub="Semester 5 · odd" color="bg-sunlight" />
        <Stat label="Assessments" value="5" sub="2 in validation" color="bg-bubblegum" />
        <Stat
          label="Grading queue"
          value="14"
          delta={{ dir: "down", text: "6 graded today" }}
          color="bg-tanglight"
        />
        <Stat label="Question bank" value="128" sub="+9 this week" color="bg-grapelight" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Assessments */}
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-display text-[15px] text-ink">Assessments</h2>
            <Link href="/faculty/assessments" className="text-[11px] font-bold uppercase tracking-wide text-ink underline">
              View all
            </Link>
          </div>
          <TableRoot>
            <THead>
              <TR>
                <TH>Assessment</TH>
                <TH>Course</TH>
                <TH>Questions</TH>
                <TH>Marks</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {assessments.map((a) => (
                <TR key={a.id}>
                  <TD className="font-bold text-ink">{a.title}</TD>
                  <TD>{a.course}</TD>
                  <TD>{a.questions}</TD>
                  <TD>{a.marks}</TD>
                  <TD>
                    <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                  </TD>
                </TR>
              ))}
            </TBody>
          </TableRoot>
        </section>

        {/* My courses */}
        <Card>
          <CardHeader title="My courses" action={<Badge tone="dark">4 active</Badge>} />
          <CardBody className="flex flex-col gap-4">
            {studentCourses.map((c, i) => (
              <div key={c.id} className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone="dark">{c.code}</Badge>
                      <span className="text-[12px] font-bold text-ink">{c.title}</span>
                    </div>
                    <p className="mt-1 text-[10px] font-medium text-ink/55">{c.faculty}</p>
                  </div>
                  <Badge tone="grape">{c.grade}</Badge>
                </div>
                <ProgressBar value={c.progress} color={barColors[i % barColors.length]} height="h-3" />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Grading queue */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Grading queue"
            tone="candy"
            action={
              <Link href="/faculty/grading" className={btnLinkOutline + " h-7 px-2.5 text-[11px] shadow-[3px_3px_0_#0a0a0a]"}>
                Grade →
              </Link>
            }
          />
          <CardBody className="flex flex-col gap-2 p-3">
            {gradingQueue.map((g) => (
              <div
                key={g.id}
                className="flex flex-wrap items-center justify-between gap-2 border-2 border-ink bg-paper px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[12px] font-bold text-ink">{g.student}</p>
                    <p className="text-[10px] font-medium text-ink/55">
                      {g.roll} · {g.exam}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-ink/60">Pending: {g.pending}</span>
                  <Badge tone={g.status === "Flagged" ? "danger" : g.status === "Waiting" ? "warning" : "sky"}>
                    {g.status}
                  </Badge>
                  <Link href="/faculty/grading" className={btnLink + " h-7 px-2.5 text-[11px]"}>
                    Grade →
                  </Link>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Question bank snapshot */}
        <Card>
          <CardHeader
            title="Question bank snapshot"
            tone="mint"
            action={
              <Link href="/faculty/question-bank" className="text-[11px] font-bold uppercase tracking-wide text-ink underline">
                Manage
              </Link>
            }
          />
          <CardBody className="grid grid-cols-2 gap-3">
            {bankTypes.map((t) => (
              <div key={t.label} className={`border-2 border-ink p-3 nb-shadow-sm ${t.cls}`}>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-ink/70">{t.label}</p>
                <p className="mt-1 font-display text-xl text-ink">{t.count}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
