"use client"

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

export function BatchManagementScreen() {
  return <AppShell role="College Admin" nav={roleNav.collegeAdmin} active="Users" trail={["College Admin", "Batches"]} minWidth={980}>
    <PageHead title="Batch management" actions={<Btn size="sm">+ Add batch</Btn>} />
    <div className="grid grid-cols-4 gap-3"><Panel title="Active batches"><StatValue value="[12]" label="running" /></Panel><Panel title="Current year"><StatValue value="[2025–26]" label="academic year" /></Panel><Panel title="Students"><StatValue value="[2,840]" label="enrolled" /></Panel><Panel title="Archive"><Btn variant="outline" size="sm">View archived</Btn></Panel></div>
    <DirectoryTable title="Batches" type="Batch" />
  </AppShell>
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

