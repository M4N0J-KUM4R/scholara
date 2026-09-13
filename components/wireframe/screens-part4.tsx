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

export function StudentDirectoryScreen() {
  return <AppShell role="College Admin" nav={roleNav.collegeAdmin} active="Users" trail={["College Admin", "Student Directory"]} minWidth={1060}>
    <PageHead title="Student directory" actions={<div className="flex gap-2"><Btn variant="outline" size="sm">Export</Btn><Btn size="sm">Invite student</Btn></div>} />
    <div className="grid grid-cols-3 gap-4"><Panel title="Search"><Field label="Search by name or HU email" placeholder="[student@institute.edu]" /></Panel><Panel title="Department"><Select label="Department" value="[All departments] ▾" /></Panel><Panel title="Batch"><Select label="Batch" value="[2025–26] ▾" /></Panel></div>
    <DirectoryTable title="Students" type="Student" />
  </AppShell>
}

export function FacultyDirectoryScreen() {
  return <AppShell role="College Admin / HOD" nav={roleNav.collegeAdmin} active="Users" trail={["College Admin", "Faculty Directory"]} minWidth={1060}>
    <PageHead title="Faculty directory" actions={<div className="flex gap-2"><Btn variant="outline" size="sm">Export</Btn><Btn size="sm">Invite faculty</Btn></div>} />
    <div className="grid grid-cols-3 gap-4"><Panel title="Search"><Field label="Search by name or college email" placeholder="[faculty@institute.edu]" /></Panel><Panel title="Department"><Select label="Department" value="[All departments] ▾" /></Panel><Panel title="Role"><Select label="Role" value="[All roles] ▾" /></Panel></div>
    <DirectoryTable title="Faculty" type="Faculty" />
  </AppShell>
}

export function DepartmentStatusScreen() {
  return <AppShell role="Faculty / HOD" nav={roleNav.faculty} active="Dashboard" trail={["Faculty", "Department Status"]}>
    <PageHead title="Department status" actions={<Badge>HOD view</Badge>} />
    <div className="grid grid-cols-3 gap-4"><Panel title="Department"><span className="text-lg font-semibold text-neutral-700">[Dept Name]</span><Label muted>HOD: [Faculty Name]</Label></Panel><Panel title="Students"><StatValue value="[420]" label="active students" /></Panel><Panel title="Faculty"><StatValue value="[28]" label="active faculty" /></Panel></div>
    <Panel title="Academic readiness"><div className="grid grid-cols-3 gap-3"><StatusRow label="Course coverage" value="92%" /><StatusRow label="Exam readiness" value="78%" /><StatusRow label="Attendance sync" value="100%" /></div></Panel>
    <Note arrow="up">Status is read-only for Faculty; HODs can review department-level exceptions.</Note>
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

