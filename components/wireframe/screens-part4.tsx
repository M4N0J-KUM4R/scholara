"use client"

import { useState } from "react"
import { AppShell, PageHead, roleNav } from "./shell"
import { Avatar, Badge, Btn, Eyebrow, Field, Label, Lines, Note, Panel, Select, Table, Toggle } from "./kit"

const rows = Array.from({ length: 10 }, (_, index) => index + 1)
const placeholderRows = (type: string) => rows.map((index) => [
  <span key={`${type}-name-${index}`} className="text-[11px] text-neutral-600">[{type} {String(index).padStart(2, "0")}]</span>,
  <span key={`${type}-code-${index}`} className="text-[10px] text-neutral-400">[{type.slice(0, 3).toUpperCase()}-{100 + index}]</span>,
  <Badge key={`${type}-status-${index}`} tone={index === 7 ? "hatch" : undefined}>{index === 7 ? "Inactive" : "Active"}</Badge>,
  <Btn key={`${type}-action-${index}`} variant="ghost" size="sm">View</Btn>,
])

function DirectoryTable({ title, type }: { title: string; type: string }) {
  return <Panel title={title} action={<div className="flex gap-2"><Btn variant="outline" size="sm">⌕ Filter</Btn><Btn size="sm">+ Add {type}</Btn></div>}>
    <Table columns={["Name", "ID", "Status", ""]} widths={["2fr", "1fr", "1fr", "0.7fr"]} rows={placeholderRows(type)} />
    <div className="mt-3 flex items-center justify-between border-t border-dashed border-neutral-200 pt-3"><Label muted>10 of 128 records</Label><div className="flex gap-1"><Btn variant="outline" size="sm">Previous</Btn><Btn variant="outline" size="sm">Next</Btn></div></div>
    <Note className="mt-3">Hover row for quick actions · loading, empty and permission-denied states are documented in the prototype.</Note>
  </Panel>
}

const departmentRows = [
  ["Computer Science & Engineering", "CSE", "Dr. [Name]", "24", "840", "18", "3", "Active"],
  ["Electronics & Communication", "ECE", "Dr. [Name]", "18", "620", "14", "2", "Active"],
  ["Mechanical Engineering", "MECH", "[Unassigned]", "16", "540", "12", "1", "Active"],
  ["Civil Engineering", "CIVIL", "Dr. [Name]", "12", "410", "10", "0", "Active"],
  ["Electrical Engineering", "EEE", "Dr. [Name]", "14", "380", "11", "2", "Active"],
  ["Information Technology", "IT", "Dr. [Name]", "20", "590", "16", "4", "Active"],
  ["MBA", "MBA", "Dr. [Name]", "10", "240", "8", "1", "Active"],
  ["Applied Sciences", "AS", "Dr. [Name]", "8", "0", "6", "0", "Active"],
  ["Architecture", "ARC", "[Unassigned]", "6", "120", "5", "0", "Active"],
  ["Biotechnology", "BIO", "Dr. [Name]", "7", "180", "6", "1", "Active"],
  ["Commerce", "COM", "Dr. [Name]", "9", "210", "7", "1", "Active"],
  ["Humanities", "HUM", "[Unassigned]", "4", "100", "4", "0", "Archived"],
]

export function DepartmentManagementScreen() {
  const tableRows = departmentRows.map((row, index) => [
    <span key={`dept-${index}`} className="font-medium text-neutral-700">{row[0]}</span>,
    <span key={`code-${index}`} className="font-mono text-[10px] text-neutral-500">{row[1]}</span>,
    <div key={`hod-${index}`} className="flex items-center gap-2">{row[2] === "[Unassigned]" ? <Btn variant="outline" size="sm">Assign</Btn> : <><Avatar size={20} label="D" /><span>{row[2]}</span></>}</div>,
    row[3], row[4], row[5], row[6],
    <Badge key={`status-${index}`} tone={row[7] === "Archived" ? "hatch" : undefined}>{row[7]}</Badge>,
    <Btn key={`actions-${index}`} variant="ghost" size="sm">⋯</Btn>,
  ])

  return <AppShell role="College Admin" nav={roleNav.collegeAdmin} active="Departments" trail={["[College Name]", "Administration", "Departments"]} minWidth={1220}>
    <PageHead title="Departments" actions={<div className="flex gap-2"><Btn variant="outline" size="sm">⭳ Export list</Btn><Btn size="sm">+ New Department</Btn></div>} />
    <div className="mb-4 flex items-center justify-between"><Label muted>8 departments · 142 faculty · 3,240 students</Label><Field placeholder="Search departments…" w={220} /></div>
    <div className="mb-4 flex items-center justify-between rounded border border-neutral-300 bg-neutral-50 p-2"><div className="flex items-center gap-1"><Btn size="sm">All</Btn><Btn variant="outline" size="sm">Active</Btn><Btn variant="outline" size="sm">Archived</Btn></div><div className="flex items-center gap-2"><Label>HOD assigned</Label><Btn variant="outline" size="sm">Yes</Btn><Btn variant="outline" size="sm">No</Btn><Select value="Sort by: Name ▾" w={130} /></div></div>
    <div className="grid grid-cols-[minmax(0,1fr)_250px] gap-4">
      <Panel title="Department directory" action={<Label muted>12 departments</Label>}>
        <Table columns={["", "Dept Name", "Code", "HOD", "Faculty", "Students", "Courses", "Exams", "Status", ""]} widths={["0.3fr", "2fr", "0.6fr", "1.5fr", "0.6fr", "0.7fr", "0.6fr", "0.5fr", "0.8fr", "0.4fr"]} rows={tableRows.map((row, index) => [<span key={`check-${index}`} className="text-neutral-400">□</span>, ...row])} />
        <div className="mt-3 flex items-center justify-between border-t border-dashed border-neutral-200 pt-3"><Label muted>Showing 12 of 12 departments</Label><Note arrow="up">Hover row reveals Edit and ⋯ menu.</Note></div>
      </Panel>
      <div className="flex flex-col gap-4"><Panel title="Assign HOD"><Select label="Faculty from [Dept Name]" value="Select faculty ▾" /><Note className="mt-2">Only faculty with “HOD-eligible” flag appear here.</Note><div className="mt-3 flex justify-end gap-2"><Btn variant="outline" size="sm">Cancel</Btn><Btn size="sm">Assign</Btn></div></Panel><Panel title="Create Department"><Field label="Department name" placeholder="[e.g. Computer Science]" /><Field label="Code" placeholder="[CSE]" hint="Code must be unique." /><Select label="HOD" value="Select faculty ▾" /><Field label="Description" placeholder="[Department description]" /><Select label="Status" value="Active ▾" /><Note className="mt-2">HOD can be assigned later.</Note><div className="mt-3 flex justify-end gap-2"><Btn variant="outline" size="sm">Cancel</Btn><Btn size="sm">Create</Btn></div></Panel></div>
    </div>
    <div className="mt-4 grid grid-cols-3 gap-3"><Note>Only Super Admin can create the first department. College Admin can add more after onboarding.</Note><Note>Archiving hides a department from dropdowns but preserves historical data.</Note><Note>HOD assignment triggers an email notification and grants HOD permissions.</Note></div>
    <div className="mt-4 grid grid-cols-3 gap-3"><Panel title="Empty state"><Label muted>No departments yet. Create your first department to get started.</Label><Btn className="mt-3" size="sm">+ New Department</Btn></Panel><Panel title="Loading state"><Lines count={3} /></Panel><Panel title="Permission denied"><Badge tone="hatch">You don&apos;t have permission to manage departments. Contact your Super Admin.</Badge></Panel></div>
  </AppShell>
}

const batchRows = [
  ["2024–2028 CSE Batch A", "CSE", "2024", "140", "72%", "88%", "7", "Active"],
  ["2024–2028 CSE Batch B", "CSE", "2024", "138", "68%", "84%", "11", "Active"],
  ["2024–2028 ECE Batch A", "ECE", "2024", "120", "70%", "86%", "6", "Active"],
  ["2023–2027 MECH Batch A", "MECH", "2023", "110", "65%", "80%", "14", "Active"],
  ["2023–2027 CIVIL Batch A", "CIVIL", "2023", "95", "62%", "78%", "12", "Active"],
  ["2025–2029 CSE Batch A", "CSE", "2025", "132", "76%", "91%", "4", "Active"],
  ["2025–2029 ECE Batch A", "ECE", "2025", "118", "73%", "89%", "5", "Active"],
  ["2022–2026 IT Batch A", "IT", "2022", "128", "81%", "94%", "2", "Active"],
  ["2022–2026 MBA Batch A", "MBA", "2022", "64", "69%", "83%", "8", "Active"],
  ["2021–2025 CSE Batch A", "CSE", "2021", "136", "84%", "96%", "1", "Graduated"],
  ["2021–2025 EEE Batch A", "EEE", "2021", "88", "78%", "92%", "3", "Graduated"],
  ["2020–2024 CIVIL Batch A", "CIVIL", "2020", "76", "71%", "87%", "5", "Archived"],
]

export function BatchManagementScreen() {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [modal, setModal] = useState<"create" | "assign" | null>(null)
  const [status, setStatus] = useState("All")
  const visibleRows = status === "All" ? batchRows : batchRows.filter((row) => row[7] === status)

  return <AppShell role="College Admin" nav={roleNav.collegeAdmin} active="Batches" trail={["[College Name]", "Administration", "Batches"]} minWidth={1220}>
    <PageHead title="Batches" actions={<div className="flex gap-2"><Btn variant="outline" size="sm">⭳ Export</Btn><Btn variant="outline" size="sm" onClick={() => setModal("assign")}>⇪ Import students</Btn><Btn size="sm" onClick={() => setModal("create")}>+ New Batch</Btn></div>} />
    <div className="flex items-end justify-between gap-4"><div className="flex flex-col gap-1"><Label muted>24 active batches · 3,240 students assigned</Label><Field placeholder="Search batches…" w={260} /></div><div className="flex gap-2"><Select label="Department" value="All departments ▾" w={150} /><Select label="Year" value="2024 ▾" w={100} /><Select label="Sort" value="Name ▾" w={120} /></div></div>
    <div className="flex items-center justify-between rounded border border-neutral-300 bg-neutral-50 p-2"><div className="flex gap-1">{["All", "Active", "Graduated", "Archived"].map((item) => <Btn key={item} size="sm" variant={status === item ? "solid" : "outline"} onClick={() => setStatus(item)}>{item}</Btn>)}</div><Note>Clicking a row opens the batch detail drawer.</Note></div>
    <Panel title="Batch directory" action={<Label muted>{visibleRows.length} of 12 batches</Label>}>
      <Table columns={["", "Batch name", "Department", "Year", "Students", "Avg. score", "Pass %", "At-risk", "Status", "Actions"]} widths={["0.25fr", "2fr", "0.7fr", "0.5fr", "0.65fr", "0.7fr", "0.6fr", "0.6fr", "0.8fr", "0.5fr"]} rows={visibleRows.map((row, index) => [<span key={`check-${index}`} className="text-neutral-400">□</span>, <button type="button" key={`name-${index}`} className="text-left font-medium text-neutral-700 underline-offset-2 hover:underline" onClick={() => setSelectedBatch(row[0])}>{row[0]}</button>, row[1], row[2], row[3], row[4], row[5], <span key={`risk-${index}`} className={Number.parseInt(row[6]) > 10 ? "font-semibold text-neutral-700" : "text-neutral-500"}>{row[6]}</span>, <Badge key={`status-${index}`} tone={row[7] === "Archived" ? "hatch" : row[7] === "Graduated" ? "outline" : undefined}>{row[7]}</Badge>, <Btn key={`menu-${index}`} variant="ghost" size="sm">⋯</Btn>])} />
      <div className="mt-3 flex items-center justify-between border-t border-dashed border-neutral-200 pt-3"><Label muted>Showing {visibleRows.length} of 12 batches</Label><Note>At-risk count = students below 40% average in the last 3 assessments.</Note></div>
    </Panel>
    <div className="grid grid-cols-3 gap-3"><Note>Batch-level rules override department defaults, including grading scheme and exam timing.</Note><Note arrow="up">Students can belong to only one batch at a time. Reassigning moves them.</Note><Note>Archiving preserves student records but hides the batch from active lists.</Note></div>
    {selectedBatch ? <BatchDetailDrawer batch={selectedBatch} onClose={() => setSelectedBatch(null)} onAssign={() => setModal("assign")} /> : null}
    {modal ? <BatchModal kind={modal} onClose={() => setModal(null)} /> : null}
  </AppShell>
}

function BatchDetailDrawer({ batch, onClose, onAssign }: { batch: string; onClose: () => void; onAssign: () => void }) {
  return <div className="fixed inset-y-0 right-0 z-20 flex w-[360px] flex-col border-l border-neutral-300 bg-white p-4 shadow-xl"><div className="flex items-start justify-between border-b border-neutral-200 pb-3"><div className="flex flex-col gap-1"><Eyebrow>Batch detail</Eyebrow><span className="text-[13px] font-semibold text-neutral-700">{batch}</span><Label muted>CSE · Year 2024 · 140 students</Label></div><Btn variant="ghost" size="sm" onClick={onClose}>×</Btn></div><div className="grid grid-cols-2 gap-2 py-3">{[["Avg. score", "72%"], ["Pass", "88%"], ["At-risk", "7"], ["Exams taken", "12"]].map(([label, value]) => <div key={label} className="rounded border border-neutral-200 bg-neutral-50 p-2"><Label muted>{label}</Label><div className="text-[15px] font-semibold text-neutral-700">{value}</div></div>)}</div><div className="flex gap-3 border-b border-neutral-200"><Btn variant="ghost" size="sm">Students</Btn><Btn variant="ghost" size="sm">Courses</Btn><Btn variant="ghost" size="sm">Exams</Btn><Btn variant="ghost" size="sm">Reports</Btn></div><div className="flex flex-1 flex-col gap-2 overflow-auto py-3"><Label>Students</Label>{Array.from({ length: 6 }, (_, index) => <div key={index} className="flex items-center justify-between border-b border-dashed border-neutral-200 pb-2"><div><span className="block text-[10px] text-neutral-600">[Student {String(index + 1).padStart(2, "0")}]</span><span className="text-[9px] text-neutral-400">[HU-CSE-{100 + index}] · {68 + index}%</span></div><Badge>{index === 4 ? "At risk" : "Active"}</Badge></div>)}</div><div className="flex gap-2 border-t border-neutral-200 pt-3"><Btn size="sm">Edit batch</Btn><Btn variant="outline" size="sm" onClick={onAssign}>Assign students</Btn><Btn variant="outline" size="sm">Archive</Btn></div></div>
}

function BatchModal({ kind, onClose }: { kind: "create" | "assign"; onClose: () => void }) {
  return <div className="fixed inset-0 z-20 flex items-center justify-center bg-neutral-900/20 p-4"><div className="w-full max-w-[620px] rounded-lg border border-neutral-300 bg-white p-5 shadow-xl"><div className="flex items-start justify-between border-b border-neutral-200 pb-3"><div className="flex flex-col gap-1"><Eyebrow>{kind === "create" ? "Create batch" : "Assign students"}</Eyebrow><span className="text-[14px] font-semibold text-neutral-700">{kind === "create" ? "New batch details" : "Select students for this batch"}</span></div><Btn variant="ghost" size="sm" onClick={onClose}>×</Btn></div>{kind === "create" ? <div className="grid grid-cols-2 gap-3 py-4"><Field label="Batch name" placeholder="2025–2029 CSE Batch A" /><Select label="Department" value="Select department ▾" /><Field label="Year" placeholder="2025" /><Field label="Section (optional)" placeholder="A" /><div className="col-span-2"><Field label="Description" placeholder="Batch description" /></div><Note className="col-span-2">Batch name must be unique within a department.</Note></div> : <div className="flex flex-col gap-3 py-4"><Field placeholder="Search students…" /><div className="grid grid-cols-4 border-b border-neutral-200 pb-2"><Label>Student</Label><Label>Roll No</Label><Label>Current batch</Label><Label>Select</Label></div>{["[Student 01]", "[Student 02]", "[Student 03]", "[Student 04]"].map((student) => <div key={student} className="grid grid-cols-4 items-center border-b border-dashed border-neutral-200 py-2"><Label>{student}</Label><Label muted>[HU-CSE-10]</Label><Label muted>Unassigned</Label><span className="text-neutral-500">□</span></div>)}<Note>128 students selected · Reassigning moves students from their current batch.</Note></div>}<div className="flex justify-end gap-2 border-t border-neutral-200 pt-3"><Btn variant="outline" size="sm" onClick={onClose}>Cancel</Btn><Btn size="sm" onClick={onClose}>{kind === "create" ? "Create" : "Assign to batch"}</Btn></div></div></div>
}

const studentRows = [
  ["[Student Name]", "21CSE001", "CSE", "2024–2028 A", "38%", "4", "2 days ago", "At risk"],
  ["[Student Name]", "21CSE002", "CSE", "2024–2028 A", "72%", "8", "Today", "Active"],
  ["[Student Name]", "21CSE003", "CSE", "2024–2028 A", "91%", "10", "Today", "Active"],
  ["[Student Name]", "21CSE004", "CSE", "2024–2028 A", "34%", "3", "5 days ago", "At risk"],
  ["[Student Name]", "21CSE005", "CSE", "2024–2028 A", "64%", "7", "Yesterday", "Active"],
  ["[Student Name]", "21CSE006", "CSE", "2024–2028 A", "28%", "2", "12 days ago", "Suspended"],
  ["[Student Name]", "21CSE007", "CSE", "2024–2028 A", "82%", "9", "Today", "Active"],
  ["[Student Name]", "21CSE008", "CSE", "2024–2028 A", "47%", "5", "3 days ago", "Active"],
  ["[Student Name]", "21CSE009", "CSE", "2024–2028 A", "36%", "4", "8 days ago", "At risk"],
  ["[Student Name]", "21CSE010", "CSE", "2024–2028 A", "76%", "8", "Today", "Active"],
  ["[Student Name]", "21CSE011", "CSE", "2024–2028 A", "88%", "10", "Today", "Active"],
  ["[Student Name]", "21CSE012", "CSE", "2024–2028 A", "39%", "3", "6 days ago", "At risk"],
  ["[Student Name]", "21CSE013", "CSE", "2024–2028 A", "69%", "7", "Yesterday", "Active"],
  ["[Student Name]", "21CSE014", "CSE", "2024–2028 A", "31%", "3", "10 days ago", "At risk"],
  ["[Student Name]", "21CSE015", "CSE", "2024–2028 A", "73%", "8", "Today", "Active"],
]

function StudentProfileDrawer({ student, onClose }: { student: string[]; onClose: () => void }) {
  return <div className="fixed inset-y-0 right-0 z-20 flex w-[390px] flex-col border-l border-neutral-300 bg-white p-4 shadow-xl"><div className="flex items-start justify-between border-b border-neutral-200 pb-3"><div className="flex items-center gap-3"><Avatar size={38} label="S" /><div><Eyebrow>Student profile</Eyebrow><div className="text-[13px] font-semibold text-neutral-700">{student[0]}</div><Label muted>{student[1]} · {student[2]}</Label></div></div><Btn variant="ghost" size="sm" onClick={onClose}>×</Btn></div><div className="flex flex-col gap-1 border-b border-neutral-200 py-3"><Label>student@institute.edu</Label><Label muted>+91 [phone number]</Label></div><div className="flex gap-1 border-b border-neutral-200 py-2">{["Overview", "Courses", "Exams", "Reports", "Portfolio"].map((tab) => <Btn key={tab} variant={tab === "Overview" ? "solid" : "ghost"} size="sm">{tab}</Btn>)}</div><div className="flex flex-col gap-3 overflow-auto py-3"><div className="grid grid-cols-2 gap-2">{[["Department", student[2]], ["Batch", student[3]], ["Section", "A"], ["Advisor", "[Faculty Name]"], ["Joined", "Aug 2024"], ["Last active", student[6]]].map(([label, value]) => <div key={label} className="rounded border border-neutral-200 bg-neutral-50 p-2"><Label muted>{label}</Label><div className="text-[11px] text-neutral-700">{value}</div></div>)}</div><Panel title="Performance"><div className="wf-scribble h-16 w-full" /><Label muted>Average score {student[4]} · {student[5]} exams taken</Label></Panel><Note>At-risk = avg. score below 40% in last 3 assessments.</Note></div><div className="flex flex-wrap gap-2 border-t border-neutral-200 pt-3"><Btn size="sm">Reset password</Btn><Btn variant="outline" size="sm">Suspend</Btn><Btn variant="outline" size="sm">Send message</Btn><Btn variant="outline" size="sm">View full profile</Btn></div></div>
}

function ImportStudentsModal({ onClose }: { onClose: () => void }) {
  return <div className="fixed inset-0 z-20 flex items-center justify-center bg-neutral-900/20 p-4"><div className="w-full max-w-[650px] rounded-lg border border-neutral-300 bg-white p-5 shadow-xl"><div className="flex items-start justify-between border-b border-neutral-200 pb-3"><div><Eyebrow>Import students</Eyebrow><div className="text-[14px] font-semibold text-neutral-700">Bulk import workflow</div></div><Btn variant="ghost" size="sm" onClick={onClose}>×</Btn></div><div className="grid grid-cols-4 gap-2 py-4">{["1 Download template", "2 Upload file", "3 Preview", "4 Confirm"].map((step, index) => <div key={step} className={`rounded border p-2 text-[10px] ${index === 0 ? "border-neutral-400 bg-neutral-100 font-semibold" : "border-neutral-200 text-neutral-500"}`}>{step}</div>)}</div><div className="flex flex-col gap-3"><Btn variant="outline" size="sm" className="w-fit">⭳ Download CSV template</Btn><div className="rounded border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center"><div className="text-[12px] text-neutral-600">Drop CSV file here or choose a file</div><Label muted>Maximum 5000 rows</Label></div><Note>Required columns: Name, Email, Roll No, Department, Batch. Bulk import runs in background; admin gets email when done.</Note></div><div className="flex justify-end gap-2 border-t border-neutral-200 pt-3 mt-4"><Btn variant="outline" size="sm" onClick={onClose}>Cancel</Btn><Btn size="sm" onClick={onClose}>Start import</Btn></div></div></div>
}

export function StudentDirectoryScreen() {
  const [selected, setSelected] = useState<number[]>([])
  const [student, setStudent] = useState<string[] | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const rowsForTable = studentRows.map((row, index) => [<button type="button" key={`student-${index}`} className="flex items-center gap-2 text-left" onClick={() => setStudent(row)}><Avatar size={22} label="S" /><span className="font-medium text-neutral-700">{row[0]}</span></button>, <span key={`roll-${index}`} className="font-mono text-[10px]">{row[1]}</span>, row[2], row[3], row[4], row[5], row[6], <Badge key={`status-${index}`} tone={row[7] === "At risk" ? "hatch" : row[7] === "Suspended" ? "outline" : undefined}>{row[7]}</Badge>, <Btn key={`menu-${index}`} variant="ghost" size="sm">⋯</Btn>])

  return <AppShell role="College Admin" nav={roleNav.collegeAdmin} active="Users" trail={["[College Name]", "Students"]} minWidth={1220}><PageHead title="Student Directory" actions={<div className="flex gap-2"><Btn size="sm" onClick={() => setImportOpen(true)}>+ Add Student</Btn><Btn variant="outline" size="sm" onClick={() => setImportOpen(true)}>⇪ Bulk Import</Btn><Btn variant="outline" size="sm">⭳ Export CSV</Btn><Btn variant="outline" size="sm">✉ Notify selected</Btn></div>} /><div className="flex items-center justify-between"><div><Label muted>3,240 students · 142 at-risk · 24 batches</Label></div><Btn variant="outline" size="sm" onClick={() => setFiltersOpen(!filtersOpen)}>{filtersOpen ? "⌃ Hide filters" : "⌄ Advanced filters"}</Btn></div>{filtersOpen ? <Panel title="Advanced filters"><div className="grid grid-cols-4 gap-3"><Select label="Department" value="All departments ▾" /><Select label="Batch" value="All batches ▾" /><Select label="Year" value="All years ▾" /><Select label="Section" value="All sections ▾" /></div><div className="mt-3 flex flex-wrap items-center gap-2"><Label>Status</Label>{["All", "Active", "Suspended", "Graduated"].map((item) => <Btn key={item} variant={item === "All" ? "solid" : "outline"} size="sm">{item}</Btn>)}<Label className="ml-3">Performance</Label>{["All", "Above avg", "At risk", "Failing"].map((item) => <Btn key={item} variant="outline" size="sm">{item}</Btn>)}<Label className="ml-3">Last active</Label>{["Any", "7 days", "30 days", "90 days"].map((item) => <Btn key={item} variant="outline" size="sm">{item}</Btn>)}</div><div className="mt-3 flex justify-end gap-2"><Btn variant="outline" size="sm">Clear all</Btn><Btn variant="outline" size="sm">Save as view</Btn><Btn size="sm">Apply filters</Btn></div></Panel> : null}<div className="flex items-center justify-between rounded border border-neutral-300 bg-neutral-50 p-2"><div className="flex items-center gap-2"><Badge tone="hatch">CSE × 2024–2028 Batch A × At risk</Badge><Btn variant="ghost" size="sm">Clear</Btn></div><Label muted>7 of 140 students match</Label></div><Note>⚠ 7 students in this view are below 40% average. Review or notify. <Btn variant="outline" size="sm">Notify all</Btn> <Btn variant="outline" size="sm">View at-risk only</Btn></Note>{selected.length ? <div className="flex items-center justify-between rounded border border-neutral-300 bg-neutral-900 p-2 text-white"><span className="text-[11px]">{selected.length} students selected</span><div className="flex gap-2"><Btn variant="outline" size="sm">Move to batch</Btn><Btn variant="outline" size="sm">Change status</Btn><Btn variant="outline" size="sm">Export</Btn><Btn variant="outline" size="sm">Send notification</Btn><Btn variant="ghost" size="sm" onClick={() => setSelected([])}>Clear selection</Btn></div></div> : null}<Panel title="Student table" action={<Label muted>15 students</Label>}><Table columns={["", "Student", "Roll No", "Dept", "Batch", "Avg. score", "Exams", "Last active", "Status", "Actions"]} widths={["0.25fr", "1.8fr", "0.8fr", "0.5fr", "1fr", "0.65fr", "0.5fr", "0.8fr", "0.7fr", "0.45fr"]} rows={rowsForTable.map((row, index) => [<button type="button" key={`select-${index}`} aria-label={`Select ${studentRows[index][0]}`} className="text-neutral-400" onClick={() => setSelected((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])}>{selected.includes(index) ? "■" : "□"}</button>, ...row])} /><div className="mt-3 flex items-center justify-between border-t border-dashed border-neutral-200 pt-3"><Label muted>Showing 15 of 3,240 students</Label><Note arrow="up">Row click opens profile drawer; checkbox click selects for bulk actions.</Note></div></Panel><div className="grid grid-cols-3 gap-3"><Note>At-risk = avg. score below 40% in last 3 assessments.</Note><Note>Suspended students cannot log in but their data is preserved.</Note><Note>States: empty · loading · permission denied are documented in the prototype.</Note></div>{student ? <StudentProfileDrawer student={student} onClose={() => setStudent(null)} /> : null}{importOpen ? <ImportStudentsModal onClose={() => setImportOpen(false)} /> : null}</AppShell>
}

const facultyRows = [
  ["Dr. [Name]", "EMP001", "CSE", "HOD", "4", "12", "5", "Today", "Active"],
  ["Prof. [Name]", "EMP002", "CSE", "Professor", "3", "8", "2", "Today", "Active"],
  ["Dr. [Name]", "EMP003", "CSE", "Associate", "5", "15", "18", "Yesterday", "Overloaded"],
  ["Prof. [Name]", "EMP004", "CSE", "Assistant", "2", "6", "0", "3 days ago", "Active"],
  ["Dr. [Name]", "EMP005", "ECE", "Professor", "4", "11", "4", "Today", "Active"],
  ["Prof. [Name]", "EMP006", "ECE", "Visiting", "1", "3", "0", "Yesterday", "Active"],
  ["Dr. [Name]", "EMP007", "MECH", "Associate", "5", "13", "16", "Today", "Overloaded"],
  ["Prof. [Name]", "EMP008", "IT", "Professor", "3", "9", "3", "Today", "Active"],
  ["Dr. [Name]", "EMP009", "CIVIL", "Assistant", "2", "5", "1", "5 days ago", "On leave"],
  ["Prof. [Name]", "EMP010", "MBA", "Professor", "3", "7", "2", "Yesterday", "Active"],
  ["Dr. [Name]", "EMP011", "EEE", "Associate", "4", "10", "12", "Today", "Overloaded"],
  ["Prof. [Name]", "EMP012", "AS", "Assistant", "2", "4", "0", "Today", "Active"],
]

function FacultyProfileDrawer({ faculty, onClose }: { faculty: string[]; onClose: () => void }) {
  return <div className="fixed inset-y-0 right-0 z-20 flex w-[390px] flex-col border-l border-neutral-300 bg-white p-4 shadow-xl"><div className="flex items-start justify-between border-b border-neutral-200 pb-3"><div className="flex items-center gap-3"><Avatar size={38} label="F" /><div><Eyebrow>Faculty profile</Eyebrow><div className="text-[13px] font-semibold text-neutral-700">{faculty[0]}</div><Label muted>{faculty[1]} · {faculty[2]} · {faculty[3]}</Label></div></div><Btn variant="ghost" size="sm" onClick={onClose}>×</Btn></div><div className="flex flex-col gap-1 border-b border-neutral-200 py-3"><Label>faculty@institute.edu</Label><Label muted>+91 [phone number] · Joined Aug 2021</Label></div><div className="flex gap-1 border-b border-neutral-200 py-2">{["Overview", "Courses", "Assessments", "Grading", "Reports"].map((tab, index) => <Btn key={tab} variant={index === 0 ? "solid" : "ghost"} size="sm">{tab}</Btn>)}</div><div className="flex flex-col gap-3 overflow-auto py-3"><div className="grid grid-cols-2 gap-2">{[["Teaching load", "82%"], ["Avg. student score", "78%"], ["Grading turnaround", "2.4 days"], ["Assessment quality", "91%"]].map(([label, value]) => <div key={label} className="rounded border border-neutral-200 bg-neutral-50 p-2"><Label muted>{label}</Label><div className="text-[13px] font-semibold text-neutral-700">{value}</div></div>)}</div><Panel title="Department access"><Label muted>{faculty[2]} department · {faculty[3]} role</Label><Note className="mt-2">Changing role to HOD requires College Admin approval.</Note></Panel></div><div className="flex flex-wrap gap-2 border-t border-neutral-200 pt-3"><Btn size="sm">Assign course</Btn><Btn variant="outline" size="sm">Reassign courses</Btn><Btn variant="outline" size="sm">Change role</Btn><Btn variant="outline" size="sm">Suspend</Btn><Btn variant="outline" size="sm">Send message</Btn></div></div>
}

function AddFacultyModal({ onClose }: { onClose: () => void }) {
  return <div className="fixed inset-0 z-20 flex items-center justify-center bg-neutral-900/20 p-4"><div className="w-full max-w-[650px] rounded-lg border border-neutral-300 bg-white p-5 shadow-xl"><div className="flex items-start justify-between border-b border-neutral-200 pb-3"><div><Eyebrow>Add faculty</Eyebrow><div className="text-[14px] font-semibold text-neutral-700">Create faculty account</div></div><Btn variant="ghost" size="sm" onClick={onClose}>×</Btn></div><div className="grid grid-cols-2 gap-3 py-4"><Field label="Name" placeholder="[Faculty full name]" /><Field label="College email" placeholder="faculty@institute.edu" /><Field label="Employee ID" placeholder="EMP013" /><Select label="Department" value="Select department ▾" /><Select label="Role" value="Select role ▾" /><Field label="Joining date" placeholder="DD / MM / YYYY" /><Note className="col-span-2">Faculty will receive an invite email to set their password. HOD role changes require College Admin approval.</Note></div><div className="flex justify-end gap-2 border-t border-neutral-200 pt-3"><Btn variant="outline" size="sm" onClick={onClose}>Cancel</Btn><Btn size="sm" onClick={onClose}>Send invite</Btn></div></div></div>
}

export function FacultyDirectoryScreen() {
  const [selectedFaculty, setSelectedFaculty] = useState<string[] | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [view, setView] = useState<"admin" | "hod">("admin")
  const tableRows = facultyRows.map((row, index) => [<span key={`check-${index}`} className="text-neutral-400">□</span>, <button type="button" key={`name-${index}`} className="flex items-center gap-2 text-left" onClick={() => setSelectedFaculty(row)}><Avatar size={22} label="F" /><span className="font-medium text-neutral-700">{row[0]}</span></button>, <span key={`id-${index}`} className="font-mono text-[10px]">{row[1]}</span>, row[2], row[3], row[4], row[5], <span key={`grading-${index}`} className={Number(row[6]) > 10 ? "font-semibold text-neutral-700" : "text-neutral-500"}>{row[6]}</span>, row[7], <Badge key={`status-${index}`} tone={row[8] === "Overloaded" ? "hatch" : row[8] === "On leave" ? "outline" : undefined}>{row[8]}</Badge>, <Btn key={`actions-${index}`} variant="ghost" size="sm">⋯</Btn>])
  return <AppShell role="College Admin / HOD" nav={roleNav.collegeAdmin} active="Users" trail={["[College Name]", "Faculty"]} minWidth={1280}><PageHead title="Faculty Directory" actions={<div className="flex gap-2"><Btn variant="outline" size="sm">⭳ Export</Btn><Btn variant="outline" size="sm">✉ Notify selected</Btn><Btn variant="outline" size="sm">⇪ Bulk Import</Btn><Btn size="sm" onClick={() => setAddOpen(true)}>+ Add Faculty</Btn></div>} /><div className="flex items-center justify-between rounded border border-neutral-300 bg-neutral-50 p-2"><div className="flex items-center gap-2"><Label>View</Label><Btn size="sm" variant={view === "admin" ? "solid" : "outline"} onClick={() => setView("admin")}>College Admin</Btn><Btn size="sm" variant={view === "hod" ? "solid" : "outline"} onClick={() => setView("hod")}>HOD</Btn></div><Label muted>{view === "hod" ? "Department access locked to CSE" : "Full college access"}</Label></div>{view === "hod" ? <div className="flex items-center justify-between rounded border border-neutral-300 bg-neutral-100 p-3"><div><Label>You are viewing CSE department. 24 faculty · 3 overloaded · 2 on leave.</Label><Note>HODs can view and request changes for their department only.</Note></div><Btn variant="outline" size="sm">Request rebalancing</Btn></div> : null}<div className="grid grid-cols-4 gap-3"><Panel title="Department"><Select value={view === "hod" ? "CSE · locked" : "All departments ▾"} /></Panel><Panel title="Role"><div className="flex flex-wrap gap-1">{["All", "HOD", "Professor", "Associate", "Assistant", "Visiting"].map((item) => <Btn key={item} variant={item === "All" ? "solid" : "outline"} size="sm">{item}</Btn>)}</div></Panel><Panel title="Status"><div className="flex flex-wrap gap-1">{["All", "Active", "On leave", "Suspended"].map((item) => <Btn key={item} variant={item === "All" ? "solid" : "outline"} size="sm">{item}</Btn>)}</div></Panel><Panel title="Search"><Field placeholder="Search by name, email, employee ID…" /></Panel></div><Panel title="Faculty directory" action={<Label muted>142 faculty · 8 departments · 12 pending HOD approvals</Label>}><Table columns={["", "Faculty", "Employee ID", "Dept", "Role", "Courses", "Assessments", "Grading queue", "Last active", "Status", ""]} widths={["0.25fr", "1.7fr", "0.8fr", "0.55fr", "0.8fr", "0.5fr", "0.7fr", "0.7fr", "0.8fr", "0.75fr", "0.4fr"]} rows={tableRows} /><div className="mt-3 flex items-center justify-between border-t border-dashed border-neutral-200 pt-3"><Label muted>Showing 12 of 142 faculty</Label><Note arrow="up">Row click opens faculty profile drawer.</Note></div></Panel><div className="grid grid-cols-[1.4fr_1fr] gap-4"><Panel title="Faculty load visualization"><div className="flex flex-col gap-2">{facultyRows.slice(0, 6).map((row) => <div key={row[1]} className="flex items-center gap-2"><span className="w-24 truncate text-[10px] text-neutral-600">{row[0]}</span><div className="h-3 flex-1 border border-neutral-300 bg-neutral-50"><div className={Number(row[6]) > 10 ? "h-full bg-neutral-700" : "h-full bg-neutral-300"} style={{ width: `${Math.min(100, 30 + Number(row[4]) * 8 + Number(row[5]) * 2)}%` }} /></div>{Number(row[6]) > 10 ? <Badge tone="hatch">Overloaded</Badge> : <Label muted>{row[4]} courses</Label>}</div>)}</div><Note className="mt-3">Load = courses + assessments + pending grading. Threshold configurable per department.</Note></Panel><Panel title="Access rules"><Note>HODs can view and request changes for their department only. College Admin has full access.</Note><Note className="mt-2">Overloaded = load score above department threshold (default 80%).</Note></Panel></div>{selectedFaculty ? <FacultyProfileDrawer faculty={selectedFaculty} onClose={() => setSelectedFaculty(null)} /> : null}{addOpen ? <AddFacultyModal onClose={() => setAddOpen(false)} /> : null}</AppShell>
}

const coverageRows = [
  ["CS301", "filled", "filled", "partial", "filled", "empty", "partial", "82%"],
  ["CS302", "filled", "partial", "filled", "filled", "filled", "filled", "94%"],
  ["CS303", "partial", "empty", "filled", "partial", "empty", "partial", "58%"],
  ["CS304", "filled", "filled", "filled", "filled", "partial", "filled", "88%"],
  ["CS305", "filled", "empty", "empty", "partial", "empty", "empty", "32%"],
  ["CS306", "filled", "filled", "partial", "filled", "filled", "filled", "90%"],
]

const statusFacultyRows = [
  ["Dr. [Name]", "4", "12", "5", "82%", "Overloaded"],
  ["Prof. [Name]", "3", "8", "2", "64%", "Healthy"],
  ["Dr. [Name]", "5", "15", "18", "91%", "Overloaded"],
  ["Prof. [Name]", "2", "6", "0", "42%", "Healthy"],
  ["Dr. [Name]", "4", "11", "4", "76%", "Healthy"],
  ["Prof. [Name]", "1", "3", "0", "28%", "Healthy"],
  ["Dr. [Name]", "5", "13", "16", "88%", "Overloaded"],
  ["Prof. [Name]", "3", "9", "3", "61%", "Healthy"],
  ["Dr. [Name]", "2", "5", "1", "49%", "On leave"],
  ["Prof. [Name]", "3", "7", "2", "57%", "Healthy"],
]

function CoverageCell({ state }: { state: string }) {
  return <span className={`block h-6 w-full border border-neutral-300 ${state === "filled" ? "bg-neutral-700" : state === "partial" ? "bg-[linear-gradient(90deg,#737373_50%,#f5f5f5_50%)]" : "bg-white"}`} aria-label={state} />
}

export function DepartmentStatusScreen() {
  const [view, setView] = useState<"faculty" | "hod">("hod")
  const [loading, setLoading] = useState(false)
  const refresh = () => { setLoading(true); window.setTimeout(() => setLoading(false), 500) }
  return <AppShell role="Faculty / HOD" nav={[...roleNav.faculty, { glyph: "◫", label: "Department" }]} active="Department" trail={["[College Name]", "CSE", "Status"]} minWidth={1240}>
    <PageHead title="CSE Department — Status" actions={<div className="flex gap-2"><Btn variant="outline" size="sm" onClick={refresh}>↻ Refresh</Btn><Btn variant="outline" size="sm">⭳ Export snapshot</Btn><Btn variant="outline" size="sm">⚙ Configure widgets</Btn></div>} />
    <div className="flex items-center justify-between"><Label muted>{loading ? "Refreshing…" : "Updated 2 min ago"} · 24 faculty · 840 students · 18 courses</Label><div className="flex gap-1"><Btn size="sm" variant={view === "faculty" ? "solid" : "outline"} onClick={() => setView("faculty")}>Faculty view</Btn><Btn size="sm" variant={view === "hod" ? "solid" : "outline"} onClick={() => setView("hod")}>HOD view</Btn></div></div>
    <div className="grid grid-cols-6 gap-3">{[["Active courses", "18", "↑2 this term"], ["Faculty", "24", "3 overloaded ⚠"], ["Students", "840", "7 at risk"], ["Pending validations", "5", "3 HOD · 2 Exam Cell"], ["Exams this week", "4", ""], ["Avg. score", "71%", "↓3% vs last term"]].map(([label, value, detail]) => <Panel key={label} title={label}><div className="text-xl font-semibold text-neutral-700">{value}</div><Label muted>{detail}</Label></Panel>)}</div>
    <div className="grid grid-cols-[1.55fr_0.85fr] gap-4"><Panel title="Course coverage map" action={<Label muted>6 courses · 5 units</Label>}><div className="grid grid-cols-[0.7fr_repeat(5,1fr)_1fr_0.8fr] gap-1 text-[9px] text-neutral-500"><span>Course</span>{["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Assessments", "CO coverage"].map((head) => <span key={head} className="text-center">{head}</span>)}{coverageRows.map((row) => <>{<span key={`${row[0]}-name`} className="flex items-center font-medium text-neutral-600">{row[0]}</span>}{row.slice(1, 7).map((state, index) => <CoverageCell key={`${row[0]}-${index}`} state={state} />)}<span key={`${row[0]}-score`} className="flex items-center justify-center text-neutral-600">{row[7]}</span></>)}</div><div className="mt-3 flex items-center gap-3 border-t border-dashed border-neutral-200 pt-2"><Label>Legend</Label><span className="h-3 w-5 bg-neutral-700" /><Label muted>Covered</Label><span className="h-3 w-5 bg-[linear-gradient(90deg,#737373_50%,#f5f5f5_50%)]" /><Label muted>Partial</Label><span className="h-3 w-5 border border-neutral-300 bg-white" /><Label muted>Not covered</Label></div><Note className="mt-2">Coverage based on question-unit mapping in assessments.</Note></Panel><Panel title="Pending actions" action={<Badge tone="hatch">8 items</Badge>}><div className="flex flex-col gap-3">{["CS301 Exam v2 pending HOD review · 2 days", "CS305 Unit 4 has no assessment", "3 grading queues overdue", "CS302 CO3 not assessed", "CS304 validation waiting on Exam Cell", "2 faculty leave requests pending", "CS306 rubric needs approval", "7 at-risk students need review"].map((item) => <div key={item} className="flex items-start justify-between gap-2 border-b border-dashed border-neutral-200 pb-2"><Label>{item}</Label><button type="button" className="text-[10px] font-semibold text-neutral-600 underline">Go →</button></div>)}</div></Panel></div>
    {view === "hod" ? <Panel title="Faculty load" action={<Label muted>HOD-only · 10 faculty</Label>}><Table columns={["Faculty", "Courses", "Assessments", "Grading queue", "Load %", "Status"]} widths={["2fr", "0.7fr", "0.9fr", "1fr", "0.8fr", "1fr"]} rows={statusFacultyRows.map((row, index) => [<span key={`name-${index}`} className="font-medium">{row[0]}</span>, row[1], row[2], row[3], <span key={`load-${index}`} className={row[5] === "Overloaded" ? "font-semibold" : ""}>{row[4]}</span>, <Badge key={`status-${index}`} tone={row[5] === "Overloaded" ? "hatch" : row[5] === "On leave" ? "outline" : undefined}>{row[5]}</Badge>])} /></Panel> : <Note arrow="up">Faculty see only their own courses, assessments and grading queue. HODs see the full department.</Note>}
    <div className="grid grid-cols-[1fr_1fr] gap-4"><Panel title="Student performance snapshot" action={<Btn variant="outline" size="sm">View students →</Btn>}><div className="flex h-28 items-end justify-around gap-4 border-b border-l border-neutral-300 px-5 pb-0">{[["0–40", "18%", "h-12"], ["40–60", "24%", "h-16"], ["60–80", "36%", "h-24"], ["80–100", "22%", "h-20"]].map(([label, percent, height]) => <div key={label} className="flex h-full flex-col items-center justify-end gap-1"><span className="text-[9px] text-neutral-500">{percent}</span><div className={`w-12 bg-neutral-600 ${height}`} /><Label muted>{label}</Label></div>)}</div><Note className="mt-2">7 students are at risk and below 40% average.</Note></Panel><Panel title="Upcoming exams" action={<Label muted>4 this week</Label>}><div className="flex flex-col gap-2">{["CS301 Mid-term · [Date] · 140 students · [Name] · Approved", "CS305 Quiz 2 · [Date] · 120 students · Pending validation", "CS302 Practical · [Date] · 138 students · [Name] · Approved", "CS304 Mid-term · [Date] · 110 students · [Name] · Draft"].map((exam) => <div key={exam} className="flex items-center justify-between border-b border-dashed border-neutral-200 pb-2"><Label>{exam}</Label><Badge tone={exam.includes("Pending") ? "hatch" : "outline"}>{exam.includes("Pending") ? "Pending" : "Ready"}</Badge></div>)}</div></Panel></div>
    {view === "hod" ? <Panel title="Department announcements" action={<Btn size="sm">+ Post announcement</Btn>}><div className="grid grid-cols-3 gap-3">{["Exam cell review window opens Monday", "Faculty workload review due Friday", "New assessment rubric available"].map((announcement) => <div key={announcement} className="rounded border border-neutral-200 bg-neutral-50 p-3"><Label>{announcement}</Label><Label muted>Posted by [HOD Name] · Today</Label></div>)}</div></Panel> : null}
    <div className="grid grid-cols-3 gap-3"><Note>Faculty see only their own courses. HODs see the full department.</Note><Note>Coverage map updates automatically when assessments are approved.</Note><Note arrow="up">Click any KPI card to drill into the underlying list. Overloaded faculty flagged when load % &gt; 80.</Note></div>
  </AppShell>
}

export function GitHubLinkedInConnectScreen() {
  return <AppShell role="Student" nav={roleNav.student} active="Dashboard" trail={["Student", "GitHub & LinkedIn"]}>
    <PageHead title="GitHub & LinkedIn connect" actions={<Badge tone="outline">Optional</Badge>} />
    <Note>Connect professional profiles to keep verified work and career links available to faculty and placement reviewers.</Note>
    <div className="grid grid-cols-2 gap-4"><ConnectCard title="GitHub" detail="[github.com/student]" /><ConnectCard title="LinkedIn" detail="[linkedin.com/in/student]" /></div>
    <Panel title="Visibility"><div className="flex items-center justify-between"><div className="flex flex-col gap-1"><Label>Show profiles on student portfolio</Label><Label muted>Students control visibility at any time.</Label></div><Toggle on /></div></Panel>
  </AppShell>
}

export function PortfolioResumeScreen() {
  return <AppShell role="Student" nav={roleNav.student} active="Dashboard" trail={["Student", "Portfolio & Resume"]} minWidth={980}>
    <PageHead title="Portfolio & resume" actions={<div className="flex gap-2"><Btn variant="outline" size="sm">Preview</Btn><Btn size="sm">Save changes</Btn></div>} />
    <div className="grid grid-cols-3 gap-4"><Panel title="Profile photo"><div className="wf-imgx mx-auto h-24 w-24" /><Btn variant="outline" size="sm" className="mt-3 w-full justify-center">Upload photo</Btn></Panel><Panel title="Headline"><Field label="Professional headline" placeholder="[Computer Science student]" /><Field label="About" placeholder="[Short portfolio summary]" /></Panel><Panel title="Resume"><div className="rounded border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center"><span className="text-[11px] text-neutral-500">[resume.pdf]</span><Btn variant="outline" size="sm" className="mt-3">Replace resume</Btn></div></Panel></div>
    <Panel title="Projects"><Table columns={["Project", "Role", "Link", ""]} widths={["2fr", "1fr", "1fr", "0.6fr"]} rows={rows.slice(0, 5).map((index) => [<span key={index}>[Project {index}]</span>, "[Role]", "[URL]", <Btn key="edit" variant="ghost" size="sm">Edit</Btn>])} /></Panel>
  </AppShell>
}

export function OnboardingWizardScreen() {
  return <AppShell role="Super Admin" nav={roleNav.superAdmin} active="Overview" trail={["Platform", "Onboarding Wizard"]} minWidth={980}>
    <PageHead title="Institute onboarding wizard" actions={<Badge tone="dark">Step 2 of 4</Badge>} />
    <div className="flex items-center gap-2">{["Institute details", "Identity routing", "Admin access", "Review"].map((step, index) => <div key={step} className={`flex flex-1 items-center gap-2 border-b-2 pb-2 ${index === 1 ? "border-neutral-700" : "border-neutral-300"}`}><span className="flex size-5 items-center justify-center rounded-full border border-neutral-400 text-[9px]">{index + 1}</span><Label>{step}</Label></div>)}</div>
    <div className="grid grid-cols-2 gap-4"><Panel title="Identity routing"><div className="flex flex-col gap-3"><Field label="Institute name *" placeholder="[College Name]" /><Field label="Approved HU email domain *" placeholder="[institute.edu]" /><Select label="Default timezone" value="[Asia/Kolkata] ▾" /><Note>Domain verification prevents users from seeing another tenant.</Note></div></Panel><Panel title="Preview"><div className="rounded border border-dashed border-neutral-300 bg-neutral-50 p-4"><Label>Login destination</Label><div className="mt-3 rounded border border-neutral-300 bg-white p-3"><span className="text-[11px] text-neutral-600">[College Name] workspace</span><div className="mt-2 wf-scribble w-32" /></div></div></Panel></div>
    <div className="flex justify-between"><Btn variant="outline">Back</Btn><Btn>Continue to admin access</Btn></div>
  </AppShell>
}

function StatValue({ value, label }: { value: string; label: string }) { return <div className="flex flex-col gap-1"><span className="text-xl font-semibold text-neutral-700">{value}</span><Label muted>{label}</Label></div> }
function StatusRow({ label, value }: { label: string; value: string }) { return <div className="rounded border border-neutral-200 bg-neutral-50 p-3"><Label>{label}</Label><div className="mt-2 flex items-center justify-between"><span className="text-lg font-semibold text-neutral-700">{value}</span><Badge>Ready</Badge></div></div> }
function ConnectCard({ title, detail }: { title: string; detail: string }) { return <Panel title={title} action={<Btn variant="outline" size="sm">Connect</Btn>}><Label muted>{detail}</Label><div className="mt-3 flex items-center gap-2"><span className="size-8 rounded-full border border-neutral-400 bg-neutral-200" /><Label>Not connected</Label></div></Panel> }

export const additionalScreenNav = [
  { label: "Departments", href: "#department-management" },
  { label: "Batches", href: "#batch-management" },
  { label: "Student Directory", href: "#student-directory" },
  { label: "Faculty Directory", href: "#faculty-directory" },
  { label: "Department Status", href: "#department-status" },
  { label: "GitHub & LinkedIn", href: "#github-linkedin" },
  { label: "Portfolio & Resume", href: "#portfolio-resume" },
  { label: "Onboarding Wizard", href: "#onboarding-wizard" },
]

