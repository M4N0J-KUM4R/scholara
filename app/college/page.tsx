import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Stat } from "@/components/ui/stat"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { announcements, examPipeline, type ExamRow } from "@/lib/data"

const examTone: Record<ExamRow["status"], "success" | "warning" | "info" | "candy"> = {
  Published: "success",
  Approved: "success",
  "Pending review": "warning",
  Draft: "info",
  Completed: "candy",
}

const roleRows = [
  { role: "Exam Controller", who: "Dr. Ananya Rao", scope: "Publishes exams and approves re-evaluations", tone: "info" as const, label: "Exam cell", managed: false },
  { role: "HOD (CSE)", who: "Dr. Ananya Rao", scope: "Approves department question papers and results", tone: "candy" as const, label: "HOD", managed: false },
  { role: "Faculty", who: "24 members across 5 departments", scope: "Question banks, grading queue, attendance", tone: "sky" as const, label: "Teaching", managed: false },
  { role: "Invigilator", who: "12 staff on hall rotation", scope: "Hall duty, attendance capture, incident flags", tone: "grape" as const, label: "Exam duty", managed: true },
  { role: "Auditor", who: "2 external NBA auditors", scope: "Read-only access to results and attainment", tone: "default" as const, label: "Read-only", managed: true },
]

const shortcuts = [
  { title: "Outcome attainment", desc: "CO-wise attainment against targets for every department.", bg: "bg-sunlight" },
  { title: "Item analysis", desc: "Difficulty and discrimination for the latest published exams.", bg: "bg-candy" },
  { title: "NAAC/NBA", desc: "Accreditation-ready SSR and CO–PO matrix exports.", bg: "bg-sky" },
  { title: "Result summary", desc: "Pass rates, toppers and backlog trends by batch.", bg: "bg-mint" },
]

export default function CollegeDashboardPage() {
  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">Dashboard</h1>
          <p className="mt-1 text-[12px] font-medium text-ink/60">
            Everything happening across Hindustan University this term, at a glance.
          </p>
        </div>
        <Button variant="dark">+ New announcement</Button>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <Stat label="Departments" value="6" color="bg-sunlight" sub="5 active" />
        <Stat label="Faculty" value="24" color="bg-candy" sub="4 on leave rotation" />
        <Stat label="Students" value="840" color="bg-skylight" sub="6 batches tracked" />
        <Stat label="Active exams" value="3" delta={{ dir: "up", text: "2 this week" }} color="bg-mintlight" />
        <Stat label="Pending reviews" value="5" delta={{ dir: "down", text: "3 since Monday" }} color="bg-tanglight" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Users & roles */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Users & roles" action={<Badge tone="dark">5 roles configured</Badge>} />
            <CardBody className="p-0">
              <table className="w-full border-collapse text-left">
                <thead className="border-b-2 border-ink bg-paper2">
                  <tr>
                    <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ink/60">Role</th>
                    <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ink/60">Assigned to</th>
                    <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ink/60">Scope</th>
                    <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-[0.1em] text-ink/60">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {roleRows.map((r) => (
                    <tr key={r.role} className="border-b border-ink/15 last:border-0">
                      <td className="px-4 py-2.5 text-[12px] font-bold text-ink">{r.role}</td>
                      <td className="px-4 py-2.5 text-[12px] font-medium text-ink/80">{r.who}</td>
                      <td className="px-4 py-2.5 text-[11px] font-medium text-ink/60">{r.scope}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <Badge tone={r.tone}>{r.label}</Badge>
                          {r.managed ? <Badge tone="outline">Managed by Super Admin</Badge> : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>

        {/* Report shortcuts */}
        <Card>
          <CardHeader title="Report shortcuts" tone="candy" />
          <CardBody className="grid grid-cols-2 gap-3">
            {shortcuts.map((s) => (
              <Link
                key={s.title}
                href="/college/reports"
                className={`nb-press nb-shadow-sm flex flex-col gap-1 border-2 border-ink p-3 ${s.bg}`}
              >
                <span className="text-[12px] font-bold text-ink">{s.title}</span>
                <span className="text-[10px] font-medium leading-snug text-ink/60">{s.desc}</span>
              </Link>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Course & exam pipeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Course & exam pipeline"
              tone="sky"
              action={<Button variant="outline" size="sm">Open exam builder</Button>}
            />
            <CardBody className="p-0">
              <TableRoot className="border-0 shadow-none">
                <THead>
                  <TR className="border-0">
                    <TH>Exam</TH>
                    <TH>Course</TH>
                    <TH>Faculty</TH>
                    <TH>Date</TH>
                    <TH className="text-right">Students</TH>
                    <TH>Status</TH>
                  </TR>
                </THead>
                <TBody>
                  {examPipeline.map((e) => (
                    <TR key={e.id}>
                      <TD className="font-bold text-ink">{e.title}</TD>
                      <TD><Badge tone="dark">{e.course}</Badge></TD>
                      <TD>{e.faculty}</TD>
                      <TD className="whitespace-nowrap">{e.date}<span className="block text-[10px] text-ink/45">{e.duration}</span></TD>
                      <TD className="text-right">{e.students}</TD>
                      <TD><Badge tone={examTone[e.status]}>{e.status}</Badge></TD>
                    </TR>
                  ))}
                </TBody>
              </TableRoot>
            </CardBody>
          </Card>
        </div>

        {/* Announcements */}
        <Card>
          <CardHeader title="Announcements" tone="mint" action={<Badge tone="outline">3 posted</Badge>} />
          <CardBody className="flex flex-col">
            {announcements.map((a, i) => (
              <div
                key={a.id}
                className={`flex items-start gap-3 py-3 ${i < announcements.length - 1 ? "border-b border-ink/15" : ""} ${i === 0 ? "pt-0" : ""} ${i === announcements.length - 1 ? "pb-0" : ""}`}
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-sun nb-shadow-sm">
                  <span aria-hidden>⚑</span>
                </span>
                <div>
                  <p className="text-[12px] font-bold text-ink">{a.title}</p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-ink/50">Posted {a.when}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  )
}
