"use client"

import { AppShell, PageHead, roleNav } from "./shell"
import { Badge, Btn, Field, Label, Lines, Note, Panel, Select, Table, Toggle } from "./kit"

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

export function DepartmentManagementScreen() {
  return <AppShell role="College Admin" nav={roleNav.collegeAdmin} active="Departments" trail={["College Admin", "Departments"]} minWidth={980}>
    <PageHead title="Department management" actions={<Btn size="sm">+ Add department</Btn>} />
    <Note>Departments are inferred from Super Admin user creation and can be reviewed here. Manual additions require permission.</Note>
    <div className="grid grid-cols-3 gap-4"><Panel title="Department summary"><div className="flex flex-col gap-3"><span className="text-2xl font-semibold text-neutral-700">[08]</span><Label muted>active departments</Label><Badge>Auto-synced</Badge></div></Panel><Panel title="Heads of department"><Lines count={4} /><Note className="mt-2">HOD assignment follows faculty records.</Note></Panel><Panel title="Sync status"><Badge>Up to date</Badge><Label muted>Last sync: [Today, 09:40]</Label></Panel></div>
    <DirectoryTable title="Departments" type="Department" />
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

