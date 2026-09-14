"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Field, Input, Select } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { ProgressBar, Stat } from "@/components/ui/stat"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { studentDirectoryRows, type StudentDirectoryItem } from "@/lib/data"

export default function CollegeStudentsPage() {
  const [students, setStudents] = useState<StudentDirectoryItem[]>(studentDirectoryRows)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeStudent, setActiveStudent] = useState<StudentDirectoryItem | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [importOpen, setImportOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("All")
  const [perfFilter, setPerfFilter] = useState("All")
  const [deptFilter, setDeptFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [drawerTab, setDrawerTab] = useState<"Overview" | "Courses" | "Exams" | "Portfolio">("Overview")

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (statusFilter !== "All" && s.status !== statusFilter) return false
      if (perfFilter === "At risk" && s.avgScore >= 50) return false
      if (perfFilter === "Above avg" && s.avgScore < 75) return false
      if (deptFilter !== "All" && s.dept !== deptFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!s.name.toLowerCase().includes(q) && !s.roll.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [students, statusFilter, perfFilter, deptFilter, search])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id))
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">College Administration</p>
          <h1 className="mt-1 font-display text-2xl text-ink">Student Directory</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            3,240 enrolled students · 142 at-risk · 24 cohorts across campus.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            ⇪ Bulk CSV Import
          </Button>
          <Button variant="outline" size="sm">
            ⭳ Export Roster
          </Button>
          <Button variant="default" size="sm" onClick={() => setImportOpen(true)}>
            + Add Student
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Total Students" value="3,240" sub="All enrolled" color="bg-sunlight" />
        <Stat label="Active Standing" value="3,074" sub="94.8% in good standing" color="bg-mintlight" />
        <Stat label="At-Risk Alerts" value="142" delta={{ dir: "down", text: "Requires review" }} color="bg-bubblegum" />
        <Stat label="Suspended" value="24" sub="Admin hold" color="bg-skylight" />
      </div>

      {/* Advanced Filters Panel */}
      <Card>
        <CardHeader
          title="Search & Advanced Registry Filters"
          tone="sunlight"
          action={
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="text-[11px] font-bold uppercase text-ink underline"
            >
              {filtersOpen ? "⌃ Hide Filters" : "⌄ Show Filters"}
            </button>
          }
        />
        {filtersOpen ? (
          <CardBody className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Search by Name or Roll No">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Aarav, 21CSE001..."
                />
              </Field>
              <Field label="Department">
                <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                  <option value="All">All Departments</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </Select>
              </Field>
              <Field label="Academic Cohort">
                <Select>
                  <option>All Cohorts</option>
                  <option>2021–2025 A</option>
                  <option>2021–2025 B</option>
                  <option>2022–2026 A</option>
                </Select>
              </Field>
              <Field label="Admission Year">
                <Select>
                  <option>All Years</option>
                  <option>2021</option>
                  <option>2022</option>
                  <option>2023</option>
                </Select>
              </Field>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-ink/20 pt-3 text-[11px]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-ink/70">Standing:</span>
                {(["All", "Active", "At risk", "Suspended"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`nb-press border-2 px-2.5 py-0.5 font-bold ${
                      statusFilter === s
                        ? "border-ink bg-sun text-ink shadow-[2px_2px_0_#0a0a0a]"
                        : "border-transparent bg-paper text-ink/70 hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}

                <span className="font-bold text-ink/70 ml-2">Performance:</span>
                {(["All", "Above avg", "At risk"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPerfFilter(p)}
                    className={`nb-press border-2 px-2.5 py-0.5 font-bold ${
                      perfFilter === p
                        ? "border-ink bg-mint text-ink shadow-[2px_2px_0_#0a0a0a]"
                        : "border-transparent bg-paper text-ink/70 hover:border-ink"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("All")
                  setPerfFilter("All")
                  setDeptFilter("All")
                  setSearch("")
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </CardBody>
        ) : null}
      </Card>

      {/* At-Risk Warning Alert */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-tomato p-3 text-white shadow-[3px_3px_0_#0a0a0a]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">⚠</span>
          <span className="font-bold text-[12px]">
            {filteredStudents.filter((s) => s.avgScore < 40).length} students in this view are below 40% average in recent assessments.
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={() => setPerfFilter("At risk")}>
            View At-Risk Only
          </Button>
          <Button variant="outline" size="sm">
            ✉ Notify Academic Advisors
          </Button>
        </div>
      </div>

      {/* Dark Bulk Action Floating Bar */}
      {selectedIds.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-ink p-3 text-white shadow-[4px_4px_0_#ffdc58]">
          <span className="font-display text-[13px] text-sun">
            {selectedIds.length} students selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              Move to Batch
            </Button>
            <Button variant="outline" size="sm">
              Change Status
            </Button>
            <Button variant="outline" size="sm">
              Export Selected
            </Button>
            <Button variant="candy" size="sm">
              Send Notification
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="text-white hover:text-sun">
              Clear Selection
            </Button>
          </div>
        </div>
      ) : null}

      {/* Student Table */}
      <Card>
        <CardHeader
          title="Student Roster"
          tone="mint"
          action={
            <Badge tone="dark">
              Showing {filteredStudents.length} of {students.length} students
            </Badge>
          }
        />
        <CardBody className="p-0">
          <TableRoot className="border-0 shadow-none">
            <THead>
              <TR>
                <TH className="w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 accent-ink"
                  />
                </TH>
                <TH>Student Name</TH>
                <TH>Roll Number</TH>
                <TH>Dept</TH>
                <TH>Batch</TH>
                <TH className="text-right">Avg Score</TH>
                <TH className="text-right">Exams</TH>
                <TH>Last Active</TH>
                <TH>Status</TH>
                <TH className="text-right">Action</TH>
              </TR>
            </THead>
            <TBody>
              {filteredStudents.map((s) => {
                const isChecked = selectedIds.includes(s.id)
                return (
                  <TR
                    key={s.id}
                    className="hover:bg-paper cursor-pointer"
                    onClick={() => setActiveStudent(s)}
                  >
                    <TD onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(s.id)}
                        className="h-4 w-4 accent-ink"
                      />
                    </TD>
                    <TD className="font-bold text-ink">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center border border-ink bg-sun text-[10px] font-bold">
                          {s.name[0]}
                        </span>
                        <span>{s.name}</span>
                      </div>
                    </TD>
                    <TD className="font-mono text-[11px] font-bold text-ink">{s.roll}</TD>
                    <TD><Badge tone="dark">{s.dept}</Badge></TD>
                    <TD className="text-[11px] text-ink/70">{s.batch}</TD>
                    <TD className="text-right">
                      <span className={`font-display text-[13px] ${s.avgScore < 40 ? "text-tomato font-bold" : "text-ink"}`}>
                        {s.avgScore}%
                      </span>
                    </TD>
                    <TD className="text-right font-medium">{s.examsTaken}</TD>
                    <TD className="text-[11px] text-ink/60">{s.lastActive}</TD>
                    <TD>
                      <Badge
                        tone={
                          s.status === "Active"
                            ? "success"
                            : s.status === "At risk"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {s.status}
                      </Badge>
                    </TD>
                    <TD className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveStudent(s)
                        }}
                      >
                        Profile →
                      </Button>
                    </TD>
                  </TR>
                )
              })}
            </TBody>
          </TableRoot>
        </CardBody>
      </Card>

      {/* Slide-out Student Profile Drawer */}
      {activeStudent ? (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col border-l-2 border-ink bg-white shadow-[-6px_0_0_#0a0a0a]">
          <div className="flex items-center justify-between border-b-2 border-ink bg-sun px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-ink text-white font-display text-xs">
                {activeStudent.name[0]}
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/60">Student Profile</span>
                <h3 className="font-display text-[15px] text-ink">{activeStudent.name}</h3>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setActiveStudent(null)}>
              ✕
            </Button>
          </div>

          <div className="border-b-2 border-ink bg-paper2 p-4 text-[12px] space-y-1">
            <div><strong>Email:</strong> {activeStudent.email}</div>
            <div><strong>Roll No:</strong> {activeStudent.roll} · {activeStudent.dept}</div>
            <div><strong>Academic Advisor:</strong> {activeStudent.advisor}</div>
          </div>

          <div className="flex border-b-2 border-ink bg-paper">
            {(["Overview", "Courses", "Exams", "Portfolio"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setDrawerTab(tab)}
                className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider ${
                  drawerTab === tab
                    ? "bg-white border-b-2 border-sun text-ink shadow-[inset_0_-2px_0_#ffdc58]"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-ink bg-paper p-2.5">
                <span className="text-[10px] uppercase font-bold text-ink/60">Cumulative GPA</span>
                <p className="font-display text-xl text-ink">{activeStudent.gpa.toFixed(2)}</p>
              </div>
              <div className="border border-ink bg-paper p-2.5">
                <span className="text-[10px] uppercase font-bold text-ink/60">Average Score</span>
                <p className={`font-display text-xl ${activeStudent.avgScore < 40 ? "text-tomato" : "text-mint"}`}>
                  {activeStudent.avgScore}%
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[12px] text-ink mb-1">Academic Standing</h4>
              <Badge tone={activeStudent.status === "Active" ? "success" : "danger"}>
                {activeStudent.status}
              </Badge>
              <p className="mt-1 text-[11px] text-ink/70">
                {activeStudent.status === "At risk"
                  ? "Student is below academic retention threshold. Remedial sessions recommended."
                  : "Student is eligible for honors courses and placement season."}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[12px] text-ink mb-1">Term Completion</h4>
              <ProgressBar value={activeStudent.avgScore} height="h-3" color="bg-sun" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t-2 border-ink bg-paper p-3">
            <Button variant="outline" size="sm" className="flex-1">
              Reset Password
            </Button>
            <Button variant="danger" size="sm" className="flex-1">
              Suspend Account
            </Button>
            <Button variant="default" size="sm" className="w-full justify-center">
              ✉ Send Message to Student
            </Button>
          </div>
        </div>
      ) : null}

      {/* CSV Import Modal */}
      <Modal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import Students Roster (CSV)"
        footer={
          <>
            <Button variant="ghost" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => setImportOpen(false)}>
              Start Import Process
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
            <div className="border border-ink bg-sun p-1.5">1. Template</div>
            <div className="border border-ink bg-paper2 p-1.5">2. Upload</div>
            <div className="border border-ink bg-paper2 p-1.5">3. Preview</div>
            <div className="border border-ink bg-paper2 p-1.5">4. Confirm</div>
          </div>
          <div className="border-2 border-dashed border-ink bg-paper p-8 text-center flex flex-col items-center gap-2">
            <span className="text-3xl">📥</span>
            <p className="font-bold text-[13px] text-ink">Drop Student CSV File Here</p>
            <p className="text-[11px] text-ink/60">Maximum 5,000 rows per batch upload.</p>
            <Button variant="outline" size="sm" className="mt-2">
              ⭳ Download CSV Template
            </Button>
          </div>
          <p className="text-[11px] font-medium text-ink/70">
            Required headers: <code>Name, Email, Roll No, Department, Batch, Year</code>. Duplicates will be flagged during validation.
          </p>
        </div>
      </Modal>
    </>
  )
}
