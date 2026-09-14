"use client"

import { useMemo, useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input, Select } from "@/components/ui/input"
import { ProgressBar } from "@/components/ui/stat"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { Tabs } from "@/components/ui/tabs"
import { facultyMembers, students, type FacultyMember, type Student } from "@/lib/data"

const roleTone: Record<FacultyMember["role"], "candy" | "sky" | "info" | "mint" | "default"> = {
  HOD: "candy",
  Professor: "sky",
  "Associate Professor": "info",
  "Assistant Professor": "mint",
  Visiting: "default",
}

const facultyStatusTone: Record<FacultyMember["status"], "success" | "info" | "danger"> = {
  Active: "success",
  "On leave": "info",
  Overloaded: "danger",
}

const studentStatusTone: Record<Student["status"], "success" | "warning" | "danger"> = {
  Active: "success",
  "At risk": "warning",
  Suspended: "danger",
}

function emailFor(name: string) {
  const clean = name.replace(/^(Dr|Prof)\.\s*/, "").toLowerCase().split(/\s+/)
  return `${clean[0]}.${clean[clean.length - 1]}@hindustan.edu`
}

function facultyPhone(f: FacultyMember) {
  return `+91 98480 ${f.empId.replace(/\D/g, "")}`
}

function studentPhone(s: Student) {
  return `+91 99004 ${s.roll.replace(/\D/g, "")}`
}

function MiniStat({ label, value, bg = "bg-paper2" }: { label: string; value: string; bg?: string }) {
  return (
    <div className={`nb-shadow-sm border-2 border-ink p-2.5 text-center ${bg}`}>
      <p className="text-[9px] font-bold uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-1 font-display text-[13px] text-ink">{value}</p>
    </div>
  )
}

type Selected = { kind: "faculty" | "student"; id: string } | null

export default function CollegeUsersPage() {
  const [studentRows, setStudentRows] = useState<Student[]>(students)
  const [facultyDept, setFacultyDept] = useState("All")
  const [facultySearch, setFacultySearch] = useState("")
  const [studentDept, setStudentDept] = useState("All")
  const [studentSearch, setStudentSearch] = useState("")
  const [selected, setSelected] = useState<Selected>(null)

  const depts = useMemo(
    () => Array.from(new Set([...facultyMembers.map((f) => f.dept), ...students.map((s) => s.dept)])),
    [],
  )

  const filteredFaculty = useMemo(() => {
    const q = facultySearch.trim().toLowerCase()
    return facultyMembers.filter(
      (f) =>
        (facultyDept === "All" || f.dept === facultyDept) &&
        (!q || f.name.toLowerCase().includes(q) || f.empId.toLowerCase().includes(q)),
    )
  }, [facultyDept, facultySearch])

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase()
    return studentRows.filter(
      (s) =>
        (studentDept === "All" || s.dept === studentDept) &&
        (!q || s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q)),
    )
  }, [studentRows, studentDept, studentSearch])

  const selectedFaculty = selected?.kind === "faculty" ? facultyMembers.find((f) => f.id === selected.id) : undefined
  const selectedStudent = selected?.kind === "student" ? studentRows.find((s) => s.id === selected.id) : undefined

  function suspendStudent(s: Student) {
    setStudentRows((prev) => prev.map((row) => (row.id === s.id ? { ...row, status: "Suspended" } : row)))
  }

  const facultyTab = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          aria-label="Filter faculty by department"
          className="w-44"
          value={facultyDept}
          onChange={(e) => setFacultyDept(e.target.value)}
        >
          <option value="All">All departments</option>
          {depts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
        <div className="w-full max-w-xs">
          <Input
            type="search"
            placeholder="Search faculty by name or ID…"
            aria-label="Search faculty"
            value={facultySearch}
            onChange={(e) => setFacultySearch(e.target.value)}
          />
        </div>
        <span className="ml-auto text-[11px] font-bold uppercase tracking-wide text-ink/50">
          {filteredFaculty.length} of {facultyMembers.length}
        </span>
      </div>
      <TableRoot>
        <THead>
          <TR>
            <TH>Faculty</TH>
            <TH>Role</TH>
            <TH>Dept</TH>
            <TH>Grading queue</TH>
            <TH>Load</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {filteredFaculty.map((f) => (
            <TR key={f.id} onClick={() => setSelected({ kind: "faculty", id: f.id })}>
              <TD>
                <div className="flex items-center gap-2.5">
                  <Avatar name={f.name} size={32} colorIndex={Number(f.empId.replace(/\D/g, "")) % 6} />
                  <div>
                    <span className="block text-[12px] font-bold text-ink">{f.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-ink/50">{f.empId}</span>
                  </div>
                </div>
              </TD>
              <TD><Badge tone={roleTone[f.role]}>{f.role}</Badge></TD>
              <TD>{f.dept}</TD>
              <TD>
                <Badge tone={f.gradingQueue > 10 ? "warning" : "default"}>
                  {f.gradingQueue > 0 ? `${f.gradingQueue} to grade` : "Queue clear"}
                </Badge>
              </TD>
              <TD>
                <div className="flex w-28 items-center gap-2">
                  <ProgressBar
                    value={Math.min(f.load, 100)}
                    height="h-3"
                    color={f.load > 100 ? "bg-tomato" : f.load > 90 ? "bg-tang" : "bg-mint"}
                  />
                  <span className="text-[10px] font-bold text-ink/60">{f.load}%</span>
                </div>
              </TD>
              <TD><Badge tone={facultyStatusTone[f.status]}>{f.status}</Badge></TD>
            </TR>
          ))}
          {filteredFaculty.length === 0 ? (
            <TR>
              <TD className="py-8 text-center text-ink/50" colSpan={6}>
                No faculty match this department and search combination.
              </TD>
            </TR>
          ) : null}
        </TBody>
      </TableRoot>
    </div>
  )

  const studentTab = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          aria-label="Filter students by department"
          className="w-44"
          value={studentDept}
          onChange={(e) => setStudentDept(e.target.value)}
        >
          <option value="All">All departments</option>
          {depts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
        <div className="w-full max-w-xs">
          <Input
            type="search"
            placeholder="Search students by name or roll no…"
            aria-label="Search students"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
          />
        </div>
        <span className="ml-auto text-[11px] font-bold uppercase tracking-wide text-ink/50">
          {filteredStudents.length} of {studentRows.length}
        </span>
      </div>
      <TableRoot>
        <THead>
          <TR>
            <TH>Student</TH>
            <TH>Dept</TH>
            <TH>Batch</TH>
            <TH className="text-right">Avg score</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {filteredStudents.map((s) => (
            <TR key={s.id} onClick={() => setSelected({ kind: "student", id: s.id })}>
              <TD>
                <div className="flex items-center gap-2.5">
                  <Avatar name={s.name} size={32} colorIndex={s.roll.length % 6} />
                  <div>
                    <span className="block text-[12px] font-bold text-ink">{s.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-ink/50">{s.roll}</span>
                  </div>
                </div>
              </TD>
              <TD>{s.dept}</TD>
              <TD>{s.batch}</TD>
              <TD className="text-right font-bold text-ink">{s.avgScore}%</TD>
              <TD><Badge tone={studentStatusTone[s.status]}>{s.status}</Badge></TD>
            </TR>
          ))}
          {filteredStudents.length === 0 ? (
            <TR>
              <TD className="py-8 text-center text-ink/50" colSpan={5}>
                No students match this department and search combination.
              </TD>
            </TR>
          ) : null}
        </TBody>
      </TableRoot>
    </div>
  )

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">Users</h1>
          <p className="mt-1 text-[12px] font-medium text-ink/60">
            Faculty and student directory for Hindustan University — click any row for the full profile.
          </p>
        </div>
        <Button variant="dark">+ Invite user</Button>
      </div>

      <Card className="p-4">
        <Tabs
          items={[
            { label: `Faculty (${facultyMembers.length})`, content: facultyTab },
            { label: `Students (${studentRows.length})`, content: studentTab },
          ]}
        />
      </Card>

      {/* Profile drawer */}
      {selectedFaculty || selectedStudent ? (
        <>
          <div className="fixed inset-0 z-50 bg-ink/50" aria-hidden onClick={() => setSelected(null)} />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="User profile"
            className="fixed inset-y-0 right-0 z-50 w-[380px] max-w-[calc(100vw-1rem)] overflow-y-auto border-l-2 border-ink bg-white"
          >
            <div className="flex items-center justify-between border-b-2 border-ink bg-sun px-4 py-3">
              <h2 className="font-display text-[14px] text-ink">Profile</h2>
              <Button variant="outline" size="sm" aria-label="Close profile" onClick={() => setSelected(null)}>
                ✕
              </Button>
            </div>

            <div className="flex flex-col gap-5 p-5">
              {selectedFaculty ? (
                <>
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedFaculty.name} size={64} colorIndex={Number(selectedFaculty.empId.replace(/\D/g, "")) % 6} />
                    <div>
                      <p className="font-display text-[15px] text-ink">{selectedFaculty.name}</p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-ink/50">
                        {selectedFaculty.role} · {selectedFaculty.dept}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col divide-y divide-ink/15 border-2 border-ink bg-paper">
                    {[
                      { label: "Email", value: emailFor(selectedFaculty.name) },
                      { label: "Phone", value: facultyPhone(selectedFaculty) },
                      { label: "Employee ID", value: selectedFaculty.empId },
                      { label: "Department", value: selectedFaculty.dept },
                    ].map((line) => (
                      <div key={line.label} className="flex items-center justify-between gap-3 px-3 py-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-ink/50">{line.label}</span>
                        <span className="truncate text-[12px] font-bold text-ink">{line.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <MiniStat label="Grading queue" value={String(selectedFaculty.gradingQueue)} bg="bg-sunlight" />
                    <MiniStat label="Teaching load" value={`${selectedFaculty.load}%`} bg="bg-bubblegum" />
                    <MiniStat label="Status" value={selectedFaculty.status} bg="bg-skylight" />
                  </div>
                </>
              ) : null}

              {selectedStudent ? (
                <>
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedStudent.name} size={64} colorIndex={selectedStudent.roll.length % 6} />
                    <div>
                      <p className="font-display text-[15px] text-ink">{selectedStudent.name}</p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-ink/50">
                        {selectedStudent.roll} · {selectedStudent.dept}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col divide-y divide-ink/15 border-2 border-ink bg-paper">
                    {[
                      { label: "Email", value: emailFor(selectedStudent.name) },
                      { label: "Phone", value: studentPhone(selectedStudent) },
                      { label: "Roll number", value: selectedStudent.roll },
                      { label: "Batch", value: selectedStudent.batch },
                    ].map((line) => (
                      <div key={line.label} className="flex items-center justify-between gap-3 px-3 py-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-ink/50">{line.label}</span>
                        <span className="truncate text-[12px] font-bold text-ink">{line.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <MiniStat label="Avg score" value={`${selectedStudent.avgScore}%`} bg="bg-mintlight" />
                    <MiniStat label="Batch" value={selectedStudent.batch.split(" ")[0]} bg="bg-tanglight" />
                    <MiniStat label="Status" value={selectedStudent.status} bg="bg-grapelight" />
                  </div>
                </>
              ) : null}

              <div className="flex gap-2.5">
                <Button variant="outline" className="flex-1">
                  Send message
                </Button>
                {selectedStudent ? (
                  <Button
                    variant="danger"
                    className="flex-1"
                    disabled={selectedStudent.status === "Suspended"}
                    onClick={() => suspendStudent(selectedStudent)}
                  >
                    {selectedStudent.status === "Suspended" ? "Suspended" : "Suspend"}
                  </Button>
                ) : (
                  <Button variant="danger" className="flex-1">
                    Suspend
                  </Button>
                )}
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </>
  )
}
