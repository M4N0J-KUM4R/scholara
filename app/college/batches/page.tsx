"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Field, Input, Select } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Stat } from "@/components/ui/stat"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { batchDirectoryRows, type ExtendedBatchItem } from "@/lib/data"

type StatusFilter = "All" | "Active" | "Graduated" | "Archived"

export default function CollegeBatchesPage() {
  const [batches, setBatches] = useState<ExtendedBatchItem[]>(batchDirectoryRows)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("All")
  const [selectedBatch, setSelectedBatch] = useState<ExtendedBatchItem | null>(null)
  const [drawerTab, setDrawerTab] = useState<"Students" | "Courses" | "Exams" | "Reports">("Students")
  const [modalMode, setModalMode] = useState<"create" | "assign" | null>(null)

  // Create batch form state
  const [newBatchName, setNewBatchName] = useState("")
  const [newBatchDept, setNewBatchDept] = useState("CSE")
  const [newBatchYear, setNewBatchYear] = useState("2025")
  const [newBatchSec, setNewBatchSec] = useState("A")

  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      if (statusFilter !== "All" && b.status !== statusFilter) return false
      if (deptFilter !== "All" && b.dept !== deptFilter) return false
      if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [batches, statusFilter, deptFilter, search])

  const activeCount = batches.filter((b) => b.status === "Active").length
  const totalStudents = batches.reduce((acc, b) => acc + b.students, 0)
  const totalAtRisk = batches.reduce((acc, b) => acc + b.atRisk, 0)

  const handleCreateBatch = () => {
    if (!newBatchName.trim()) return
    const newB: ExtendedBatchItem = {
      id: `b-${batches.length + 1}`,
      name: newBatchName,
      dept: newBatchDept,
      year: parseInt(newBatchYear, 10) || 2025,
      section: newBatchSec,
      students: 0,
      avgScore: 0,
      passPct: 100,
      atRisk: 0,
      status: "Active",
    }
    setBatches((prev) => [newB, ...prev])
    setModalMode(null)
    setNewBatchName("")
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">College Administration</p>
          <h1 className="mt-1 font-display text-2xl text-ink">Batch Management</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            {batches.length} cohorts · {totalStudents.toLocaleString()} total students enrolled across 5 academic departments.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setModalMode("assign")}>
            Assign Students
          </Button>
          <Button variant="default" size="sm" onClick={() => setModalMode("create")}>
            + Create New Batch
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Active Cohorts" value={activeCount} sub="12 total registered" color="bg-sunlight" />
        <Stat label="Enrolled Students" value={totalStudents.toLocaleString()} sub="Across all years" color="bg-mintlight" />
        <Stat label="At-Risk Students" value={totalAtRisk} delta={{ dir: "down", text: "Flagged below 40%" }} color="bg-bubblegum" />
        <Stat label="Average Attainment" value="76.4%" sub="Meets NAAC criteria" color="bg-skylight" />
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-white p-3 shadow-[3px_3px_0_#0a0a0a]">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search batches by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-60 border-2 border-ink bg-paper px-2 text-[12px] font-medium placeholder:text-ink/40 focus:outline-none"
          />
          <div className="w-40">
            <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="MBA">MBA</option>
              <option value="AS">Applied Sciences</option>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {(["All", "Active", "Graduated", "Archived"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`nb-press border-2 px-3 py-1 text-[11px] font-bold ${
                statusFilter === s
                  ? "border-ink bg-sun text-ink shadow-[2px_2px_0_#0a0a0a]"
                  : "border-transparent text-ink/70 hover:border-ink hover:bg-paper"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Batches Table */}
      <Card>
        <CardHeader
          title="Batch Directory"
          tone="sunlight"
          action={
            <Badge tone="dark">
              Showing {filteredBatches.length} of {batches.length} batches
            </Badge>
          }
        />
        <CardBody className="p-0">
          <TableRoot className="border-0 shadow-none">
            <THead>
              <TR>
                <TH>Batch Name</TH>
                <TH>Department</TH>
                <TH>Year</TH>
                <TH>Section</TH>
                <TH className="text-right">Students</TH>
                <TH className="text-right">Avg Score</TH>
                <TH className="text-right">Pass %</TH>
                <TH className="text-right">At-Risk</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filteredBatches.map((b) => (
                <TR key={b.id} className="hover:bg-paper cursor-pointer" onClick={() => setSelectedBatch(b)}>
                  <TD className="font-bold text-ink underline decoration-2 underline-offset-2">
                    {b.name}
                  </TD>
                  <TD><Badge tone="dark">{b.dept}</Badge></TD>
                  <TD>{b.year}</TD>
                  <TD><Badge tone="outline">Sec {b.section}</Badge></TD>
                  <TD className="text-right font-medium">{b.students}</TD>
                  <TD className="text-right font-bold text-ink">{b.avgScore}%</TD>
                  <TD className="text-right font-medium text-mint">{b.passPct}%</TD>
                  <TD className="text-right">
                    <span className={b.atRisk >= 8 ? "font-bold text-tomato" : "text-ink/60"}>
                      {b.atRisk}
                    </span>
                  </TD>
                  <TD>
                    <Badge
                      tone={
                        b.status === "Active"
                          ? "success"
                          : b.status === "Graduated"
                          ? "sky"
                          : "outline"
                      }
                    >
                      {b.status}
                    </Badge>
                  </TD>
                  <TD className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedBatch(b)
                      }}
                    >
                      Inspect →
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </TableRoot>
        </CardBody>
      </Card>

      {/* Slide-out Batch Detail Drawer */}
      {selectedBatch ? (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col border-l-2 border-ink bg-white shadow-[-6px_0_0_#0a0a0a]">
          <div className="flex items-center justify-between border-b-2 border-ink bg-sun px-5 py-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/60">Batch Detail</span>
              <h3 className="font-display text-[15px] text-ink">{selectedBatch.name}</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedBatch(null)}>
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 border-b-2 border-ink bg-paper2 p-4">
            <div className="border border-ink bg-white p-2">
              <span className="text-[10px] uppercase text-ink/60 font-bold">Avg. Score</span>
              <p className="font-display text-lg text-ink">{selectedBatch.avgScore}%</p>
            </div>
            <div className="border border-ink bg-white p-2">
              <span className="text-[10px] uppercase text-ink/60 font-bold">Pass Rate</span>
              <p className="font-display text-lg text-mint">{selectedBatch.passPct}%</p>
            </div>
            <div className="border border-ink bg-white p-2">
              <span className="text-[10px] uppercase text-ink/60 font-bold">At-Risk Count</span>
              <p className="font-display text-lg text-tomato">{selectedBatch.atRisk}</p>
            </div>
            <div className="border border-ink bg-white p-2">
              <span className="text-[10px] uppercase text-ink/60 font-bold">Total Enrolled</span>
              <p className="font-display text-lg text-ink">{selectedBatch.students}</p>
            </div>
          </div>

          <div className="flex border-b-2 border-ink bg-paper">
            {(["Students", "Courses", "Exams", "Reports"] as const).map((tab) => (
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

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {drawerTab === "Students" ? (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase text-ink/60">Sample Cohort Roster</span>
                {[
                  { name: "Aarav Sharma", roll: "21CSE001", score: 82, status: "Active" },
                  { name: "Diya Patel", roll: "21CSE002", score: 91, status: "Active" },
                  { name: "Rohan Gupta", roll: "21CSE003", score: 38, status: "At risk" },
                  { name: "Ishita Verma", roll: "21CSE004", score: 77, status: "Active" },
                  { name: "Kabir Singh", roll: "21CSE005", score: 44, status: "At risk" },
                  { name: "Ananya Iyer", roll: "21CSE006", score: 85, status: "Active" },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between border-2 border-ink bg-white p-2.5 shadow-[1px_1px_0_#0a0a0a]">
                    <div>
                      <p className="text-[12px] font-bold text-ink">{s.name}</p>
                      <p className="text-[10px] text-ink/50">{s.roll} · Avg: {s.score}%</p>
                    </div>
                    <Badge tone={s.status === "Active" ? "success" : "danger"}>{s.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-[12px] text-ink/60">
                Data records active for {drawerTab.toLowerCase()} in {selectedBatch.name}.
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t-2 border-ink bg-paper p-3">
            <Button variant="default" size="sm" className="flex-1" onClick={() => setModalMode("assign")}>
              Assign Students
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedBatch(null)}>
              Close
            </Button>
          </div>
        </div>
      ) : null}

      {/* Create / Assign Modal */}
      <Modal
        open={modalMode !== null}
        onClose={() => setModalMode(null)}
        title={modalMode === "create" ? "Create Academic Batch" : "Assign Students to Batch"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalMode(null)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleCreateBatch}>
              {modalMode === "create" ? "Create Batch" : "Confirm Assignments"}
            </Button>
          </>
        }
      >
        {modalMode === "create" ? (
          <div className="flex flex-col gap-4">
            <Field label="Batch Name" hint="e.g. 2025–2029 CSE Batch C">
              <Input
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                placeholder="2025–2029 CSE Batch C"
              />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Department">
                <Select value={newBatchDept} onChange={(e) => setNewBatchDept(e.target.value)}>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </Select>
              </Field>
              <Field label="Admission Year">
                <Input value={newBatchYear} onChange={(e) => setNewBatchYear(e.target.value)} />
              </Field>
              <Field label="Section">
                <Input value={newBatchSec} onChange={(e) => setNewBatchSec(e.target.value)} />
              </Field>
            </div>
            <p className="border border-dashed border-ink p-2 text-[11px] text-ink/70">
              Students can be assigned to only one active cohort at a time.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Search unassigned students…"
              className="h-9 border-2 border-ink bg-paper px-3 text-[12px] focus:outline-none"
            />
            <div className="border-2 border-ink divide-y-2 divide-ink max-h-56 overflow-y-auto">
              {[
                { name: "Aarav Sharma", roll: "21CSE001", dept: "CSE" },
                { name: "Diya Patel", roll: "21CSE002", dept: "CSE" },
                { name: "Rohan Gupta", roll: "21CSE003", dept: "CSE" },
                { name: "Ishita Verma", roll: "21CSE004", dept: "CSE" },
              ].map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-white">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 accent-ink" defaultChecked />
                    <div>
                      <p className="font-bold text-[12px]">{s.name}</p>
                      <p className="text-[10px] text-ink/50">{s.roll} · {s.dept}</p>
                    </div>
                  </div>
                  <Badge tone="outline">Unassigned</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
