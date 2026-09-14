"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Field, Input, Select } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { ProgressBar, Stat } from "@/components/ui/stat"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { facultyDirectoryRows, type ExtendedFacultyItem } from "@/lib/data"

export default function CollegeFacultyPage() {
  const [facultyList, setFacultyList] = useState<ExtendedFacultyItem[]>(facultyDirectoryRows)
  const [viewMode, setViewMode] = useState<"admin" | "hod">("admin")
  const [selectedFaculty, setSelectedFaculty] = useState<ExtendedFacultyItem | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deptFilter, setDeptFilter] = useState("All")
  const [roleFilter, setRoleFilter] = useState("All")
  const [search, setSearch] = useState("")

  // Form state
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newEmpId, setNewEmpId] = useState("")
  const [newDept, setNewDept] = useState("CSE")
  const [newRole, setNewRole] = useState<ExtendedFacultyItem["role"]>("Assistant Professor")

  const filtered = useMemo(() => {
    return facultyList.filter((f) => {
      if (viewMode === "hod" && f.dept !== "CSE") return false
      if (deptFilter !== "All" && f.dept !== deptFilter) return false
      if (roleFilter !== "All" && f.role !== roleFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!f.name.toLowerCase().includes(q) && !f.empId.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [facultyList, viewMode, deptFilter, roleFilter, search])

  const overloadedCount = facultyList.filter((f) => f.status === "Overloaded").length
  const onLeaveCount = facultyList.filter((f) => f.status === "On leave").length

  const handleAddFaculty = () => {
    if (!newName.trim() || !newEmail.trim()) return
    const newF: ExtendedFacultyItem = {
      id: `fac-${facultyList.length + 1}`,
      name: newName,
      email: newEmail,
      empId: newEmpId || `EMP-${1000 + facultyList.length + 1}`,
      dept: newDept,
      role: newRole,
      coursesCount: 1,
      studentsCount: 60,
      gradingQueue: 0,
      loadPct: 50,
      lastActive: "Just now",
      status: "Active",
    }
    setFacultyList((prev) => [newF, ...prev])
    setAddModalOpen(false)
    setNewName("")
    setNewEmail("")
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Institutional Faculty Roster</p>
          <h1 className="mt-1 font-display text-2xl text-ink">Faculty Directory & Workload</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            Teaching staff allocation, grading queues, and accreditation workload monitoring.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="border-2 border-ink bg-white p-1 flex gap-1 shadow-[2px_2px_0_#0a0a0a]">
            <button
              onClick={() => setViewMode("admin")}
              className={`px-3 py-1 text-[11px] font-bold ${
                viewMode === "admin" ? "bg-sun text-ink" : "text-ink/60 hover:text-ink"
              }`}
            >
              College Admin View
            </button>
            <button
              onClick={() => setViewMode("hod")}
              className={`px-3 py-1 text-[11px] font-bold ${
                viewMode === "hod" ? "bg-sun text-ink" : "text-ink/60 hover:text-ink"
              }`}
            >
              HOD View (CSE)
            </button>
          </div>
          <Button variant="default" size="sm" onClick={() => setAddModalOpen(true)}>
            + Add Faculty Member
          </Button>
        </div>
      </div>

      {/* HOD Lock Banner if in HOD mode */}
      {viewMode === "hod" ? (
        <div className="flex items-center justify-between border-2 border-ink bg-candy p-3 text-ink shadow-[3px_3px_0_#0a0a0a]">
          <div className="flex items-center gap-2">
            <span className="font-bold">🔒</span>
            <span className="font-bold text-[12px]">
              Viewing as Dr. Ananya Rao (HOD — Computer Science & Engineering). Scope restricted to CSE faculty.
            </span>
          </div>
          <Button variant="outline" size="sm">
            Request Workload Rebalancing
          </Button>
        </div>
      ) : null}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Total Faculty" value={facultyList.length} sub="Across 5 departments" color="bg-sunlight" />
        <Stat label="Overloaded (>80%)" value={overloadedCount} delta={{ dir: "down", text: "3 flagged ⚠" }} color="bg-bubblegum" />
        <Stat label="On Leave" value={onLeaveCount} sub="Duty reallocated" color="bg-skylight" />
        <Stat label="Avg. Turnaround" value="2.4 Days" sub="Assessment grading" color="bg-mintlight" />
      </div>

      {/* Teaching Load Visualization */}
      <Card>
        <CardHeader
          title="Teaching Load & Grading Queue Distribution"
          tone="mint"
          action={<Badge tone="dark">Threshold: 80%</Badge>}
        />
        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {facultyList.slice(0, 6).map((f) => (
            <div key={f.id} className="border-2 border-ink bg-paper p-3 shadow-[2px_2px_0_#0a0a0a]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-ink text-[13px]">{f.name}</span>
                  <span className="block text-[10px] text-ink/50">{f.role} · {f.dept}</span>
                </div>
                <Badge tone={f.status === "Overloaded" ? "danger" : "success"}>
                  {f.status}
                </Badge>
              </div>
              <div className="mt-3">
                <ProgressBar
                  value={f.loadPct}
                  color={f.loadPct > 80 ? "bg-tomato" : "bg-sun"}
                  label="Teaching Load"
                  height="h-3"
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-ink/70">
                <span>Grading Queue: <strong>{f.gradingQueue} pending</strong></span>
                <span>{f.coursesCount} courses</span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-white p-3 shadow-[3px_3px_0_#0a0a0a]">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search faculty by name or EMP ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-64 border-2 border-ink bg-paper px-2 text-[12px] font-medium focus:outline-none"
          />
          {viewMode === "admin" ? (
            <div className="w-40">
              <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                <option value="All">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="MBA">MBA</option>
              </Select>
            </div>
          ) : null}
          <div className="w-48">
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="All">All Academic Roles</option>
              <option value="HOD">HOD</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Visiting">Visiting</option>
            </Select>
          </div>
        </div>

        <span className="text-[11px] font-bold text-ink/60">
          Showing {filtered.length} faculty members
        </span>
      </div>

      {/* Faculty Table */}
      <Card>
        <CardHeader title="Faculty Registry Table" tone="sunlight" />
        <CardBody className="p-0">
          <TableRoot className="border-0 shadow-none">
            <THead>
              <TR>
                <TH>Faculty Name</TH>
                <TH>EMP ID</TH>
                <TH>Dept</TH>
                <TH>Designation</TH>
                <TH className="text-right">Courses</TH>
                <TH className="text-right">Students</TH>
                <TH className="text-right">Grading Queue</TH>
                <TH className="text-right">Workload</TH>
                <TH>Status</TH>
                <TH className="text-right">Action</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((f) => (
                <TR
                  key={f.id}
                  className="hover:bg-paper cursor-pointer"
                  onClick={() => setSelectedFaculty(f)}
                >
                  <TD className="font-bold text-ink">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center border border-ink bg-mint text-[10px] font-bold">
                        {f.name[0]}
                      </span>
                      <span>{f.name}</span>
                    </div>
                  </TD>
                  <TD className="font-mono text-[11px] text-ink/70">{f.empId}</TD>
                  <TD><Badge tone="dark">{f.dept}</Badge></TD>
                  <TD className="text-[12px] font-medium">{f.role}</TD>
                  <TD className="text-right font-medium">{f.coursesCount}</TD>
                  <TD className="text-right font-medium">{f.studentsCount}</TD>
                  <TD className="text-right">
                    <span className={f.gradingQueue >= 10 ? "font-bold text-tomato" : "text-ink/70"}>
                      {f.gradingQueue}
                    </span>
                  </TD>
                  <TD className="text-right font-mono font-bold text-ink">{f.loadPct}%</TD>
                  <TD>
                    <Badge
                      tone={
                        f.status === "Active"
                          ? "success"
                          : f.status === "Overloaded"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {f.status}
                    </Badge>
                  </TD>
                  <TD className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFaculty(f)
                      }}
                    >
                      Profile →
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </TableRoot>
        </CardBody>
      </Card>

      {/* Slide-out Faculty Profile Drawer */}
      {selectedFaculty ? (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col border-l-2 border-ink bg-white shadow-[-6px_0_0_#0a0a0a]">
          <div className="flex items-center justify-between border-b-2 border-ink bg-mint px-5 py-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/60">Faculty Profile</span>
              <h3 className="font-display text-[15px] text-ink">{selectedFaculty.name}</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedFaculty(null)}>
              ✕
            </Button>
          </div>

          <div className="border-b-2 border-ink bg-paper2 p-4 text-[12px] space-y-1">
            <div><strong>Email:</strong> {selectedFaculty.email}</div>
            <div><strong>Designation:</strong> {selectedFaculty.role} · {selectedFaculty.dept}</div>
            <div><strong>Employee ID:</strong> {selectedFaculty.empId}</div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-ink bg-paper p-2.5">
                <span className="text-[10px] uppercase font-bold text-ink/60">Teaching Load</span>
                <p className={`font-display text-xl ${selectedFaculty.loadPct > 80 ? "text-tomato" : "text-ink"}`}>
                  {selectedFaculty.loadPct}%
                </p>
              </div>
              <div className="border border-ink bg-paper p-2.5">
                <span className="text-[10px] uppercase font-bold text-ink/60">Grading Queue</span>
                <p className="font-display text-xl text-ink">{selectedFaculty.gradingQueue} items</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[12px] text-ink mb-1">Workload Distribution</h4>
              <ProgressBar
                value={selectedFaculty.loadPct}
                color={selectedFaculty.loadPct > 80 ? "bg-tomato" : "bg-sun"}
                label="Course Credits Load"
                height="h-3"
              />
            </div>

            <div className="border border-dashed border-ink p-3 text-[11px] text-ink/70">
              ℹ HOD role reassignments require approval from the Academic Council and Super Admin.
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t-2 border-ink bg-paper p-3">
            <Button variant="outline" size="sm" className="flex-1">
              Assign Course
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Change Role
            </Button>
            <Button variant="default" size="sm" className="w-full justify-center">
              ✉ Send Message
            </Button>
          </div>
        </div>
      ) : null}

      {/* Add Faculty Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Faculty Member"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleAddFaculty}>
              Send Invitation
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Full Name">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Dr. Rajesh Kulkarni" />
          </Field>
          <Field label="Institutional Email">
            <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="faculty@hindustan.edu" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Employee ID">
              <Input value={newEmpId} onChange={(e) => setNewEmpId(e.target.value)} placeholder="EMP-1013" />
            </Field>
            <Field label="Department">
              <Select value={newDept} onChange={(e) => setNewDept(e.target.value)}>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="MBA">MBA</option>
              </Select>
            </Field>
          </div>
          <Field label="Role">
            <Select value={newRole} onChange={(e) => setNewRole(e.target.value as ExtendedFacultyItem["role"])}>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Visiting">Visiting Faculty</option>
            </Select>
          </Field>
        </div>
      </Modal>
    </>
  )
}
