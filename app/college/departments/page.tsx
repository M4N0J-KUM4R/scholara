"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Field, Input, Select } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { departments, facultyMembers, type Department } from "@/lib/data"

type Filter = "All" | "Active" | "Archived"

const hodOptions = facultyMembers.map((f) => f.name)

export default function CollegeDepartmentsPage() {
  const [rows, setRows] = useState<Department[]>(departments)
  const [filter, setFilter] = useState<Filter>("All")
  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState<"create" | "assign">("create")
  const [assignTarget, setAssignTarget] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [hod, setHod] = useState("")
  const [error, setError] = useState("")

  const visible = useMemo(
    () => (filter === "All" ? rows : rows.filter((d) => d.status === filter)),
    [rows, filter],
  )

  const activeCount = rows.filter((d) => d.status === "Active").length
  const assignDept = rows.find((d) => d.id === assignTarget)

  function openCreate() {
    setMode("create")
    setAssignTarget(null)
    setName("")
    setCode("")
    setHod("")
    setError("")
    setModalOpen(true)
  }

  function openAssign(dept: Department) {
    setMode("assign")
    setAssignTarget(dept.id)
    setName(dept.name)
    setCode(dept.code)
    setHod(dept.hod ?? "")
    setError("")
    setModalOpen(true)
  }

  function submit() {
    if (mode === "create") {
      if (!name.trim() || !code.trim()) {
        setError("Department name and code are both required.")
        return
      }
      const row: Department = {
        id: `d-${Date.now()}`,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        hod: hod || undefined,
        faculty: 0,
        students: 0,
        courses: 0,
        status: "Active",
      }
      setRows((prev) => [row, ...prev])
    } else {
      if (!hod) {
        setError("Pick a faculty member to assign as HOD.")
        return
      }
      setRows((prev) => prev.map((d) => (d.id === assignTarget ? { ...d, hod } : d)))
    }
    setModalOpen(false)
  }

  function toggleArchive(dept: Department) {
    setRows((prev) =>
      prev.map((d) =>
        d.id === dept.id ? { ...d, status: d.status === "Active" ? "Archived" : "Active" } : d,
      ),
    )
  }

  return (
    <>
      {/* Page header + toolbar */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">Departments</h1>
          <p className="mt-1 text-[12px] font-medium text-ink/60">
            Academic departments, their heads and current enrollment across your institute.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            aria-label="Filter departments by status"
            className="w-36"
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
          >
            <option value="All">All departments</option>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </Select>
          <Button onClick={openCreate}>+ New department</Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Departments table */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink/50">
            Showing {visible.length} of {rows.length} departments · {activeCount} active
          </p>
          <TableRoot>
            <THead>
              <TR>
                <TH>Department</TH>
                <TH>Head of Dept</TH>
                <TH className="text-right">Faculty</TH>
                <TH className="text-right">Students</TH>
                <TH className="text-right">Courses</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {visible.map((d) => (
                <TR key={d.id} className={d.status === "Archived" ? "bg-paper2/60" : undefined}>
                  <TD>
                    <span className="block text-[12px] font-bold text-ink">{d.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-ink/50">{d.code}</span>
                  </TD>
                  <TD>
                    {d.hod ? (
                      <span className="text-[12px] font-medium text-ink">{d.hod}</span>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => openAssign(d)}>
                        Assign HOD
                      </Button>
                    )}
                  </TD>
                  <TD className="text-right">{d.faculty}</TD>
                  <TD className="text-right">{d.students}</TD>
                  <TD className="text-right">{d.courses}</TD>
                  <TD>
                    <Badge tone={d.status === "Active" ? "success" : "default"}>{d.status}</Badge>
                  </TD>
                  <TD className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toggleArchive(d)}>
                      {d.status === "Active" ? "Archive" : "Restore"}
                    </Button>
                  </TD>
                </TR>
              ))}
              {visible.length === 0 ? (
                <TR>
                  <TD className="py-8 text-center text-ink/50" colSpan={7}>
                    No departments match the “{filter}” filter.
                  </TD>
                </TR>
              ) : null}
            </TBody>
          </TableRoot>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader title="Create department" tone="sunlight" />
            <CardBody className="flex flex-col gap-3">
              <p className="text-[12px] font-medium text-ink/70">
                Add a department with a short code. It becomes selectable in course and exam flows immediately.
              </p>
              <Button onClick={openCreate}>Open creation form</Button>
              <p className="text-[10px] font-medium text-ink/50">
                Tip: codes like CSE or MECH appear on hall tickets and reports.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-mintlight">
            <CardHeader title="Sync note" tone="mint" />
            <CardBody>
              <p className="text-[12px] font-medium leading-relaxed text-ink/80">
                Departments sync from Super Admin user creation — assignment here is local to your institute.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="At a glance" tone="ink" />
            <CardBody className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-ink/60">Total faculty</span>
                <span className="font-display text-[13px]">{rows.reduce((n, d) => n + d.faculty, 0)}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-ink/60">Total students</span>
                <span className="font-display text-[13px]">{rows.reduce((n, d) => n + d.students, 0)}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-ink/60">Missing HODs</span>
                <span className="font-display text-[13px]">{rows.filter((d) => !d.hod).length}</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Create / assign modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={mode === "create" ? "New department" : `Assign HOD — ${assignDept?.name ?? ""}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>
              {mode === "create" ? "Create department" : "Assign as HOD"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Department name">
            <Input
              value={name}
              placeholder="e.g. Artificial Intelligence & Data Science"
              onChange={(e) => setName(e.target.value)}
              disabled={mode === "assign"}
            />
          </Field>
          <Field label="Code" hint="2–5 characters, used across timetables and reports.">
            <Input
              value={code}
              placeholder="e.g. AIDS"
              onChange={(e) => setCode(e.target.value)}
              disabled={mode === "assign"}
            />
          </Field>
          <Field label="Head of Department" error={error}>
            <Select value={hod} onChange={(e) => setHod(e.target.value)}>
              <option value="">— Assign later —</option>
              {hodOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Modal>
    </>
  )
}
