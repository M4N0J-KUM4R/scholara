"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, Input, Select } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { courses, departments, facultyMembers, type Course } from "@/lib/data"

const statusTone: Record<Course["status"], "success" | "info"> = {
  Active: "success",
  Draft: "info",
}

export default function CollegeCoursesPage() {
  const [rows, setRows] = useState<Course[]>(courses)
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")
  const [title, setTitle] = useState("")
  const [dept, setDept] = useState(departments[0]?.code ?? "")
  const [faculty, setFaculty] = useState(facultyMembers[0]?.name ?? "")
  const [error, setError] = useState("")

  const activeCount = rows.filter((c) => c.status === "Active").length
  const enrolled = rows.reduce((n, c) => n + c.students, 0)

  function openModal() {
    setCode("")
    setTitle("")
    setDept(departments[0]?.code ?? "")
    setFaculty(facultyMembers[0]?.name ?? "")
    setError("")
    setOpen(true)
  }

  function submit() {
    if (!code.trim() || !title.trim()) {
      setError("Course code and title are both required.")
      return
    }
    const row: Course = {
      id: `c-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      dept,
      faculty,
      students: 0,
      units: 3,
      status: "Draft",
    }
    setRows((prev) => [row, ...prev])
    setOpen(false)
  }

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">Courses</h1>
          <p className="mt-1 text-[12px] font-medium text-ink/60">
            The course catalogue for this term — owners, enrollment and publication state.
          </p>
        </div>
        <Button onClick={openModal}>+ New course</Button>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-wide text-ink/50">
        Showing {rows.length} courses · {activeCount} active · {enrolled} enrolled seats
      </p>

      <TableRoot>
        <THead>
          <TR>
            <TH>Code</TH>
            <TH>Title</TH>
            <TH>Dept</TH>
            <TH>Faculty</TH>
            <TH className="text-right">Students</TH>
            <TH className="text-right">Units</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {rows.map((c) => (
            <TR key={c.id} className="hover:bg-sunlight">
              <TD><Badge tone="dark">{c.code}</Badge></TD>
              <TD className="text-[12px] font-bold text-ink">{c.title}</TD>
              <TD>{c.dept}</TD>
              <TD>{c.faculty}</TD>
              <TD className="text-right">{c.students}</TD>
              <TD className="text-right">{c.units}</TD>
              <TD><Badge tone={statusTone[c.status]}>{c.status}</Badge></TD>
            </TR>
          ))}
        </TBody>
      </TableRoot>

      {/* New course modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New course"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Create course</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Course code" error={error}>
            <Input value={code} placeholder="e.g. CS330" onChange={(e) => setCode(e.target.value)} />
          </Field>
          <Field label="Course title">
            <Input value={title} placeholder="e.g. Computer Networks" onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Department">
              <Select value={dept} onChange={(e) => setDept(e.target.value)}>
                {departments.map((d) => (
                  <option key={d.id} value={d.code}>
                    {d.code} — {d.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Faculty owner">
              <Select value={faculty} onChange={(e) => setFaculty(e.target.value)}>
                {facultyMembers.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </div>
      </Modal>
    </>
  )
}
