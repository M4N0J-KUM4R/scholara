"use client"

import { useState } from "react"
import {
  Badge,
  Bar,
  BarChart,
  Btn,
  Checkbox,
  Donut,
  Eyebrow,
  Field,
  Icon,
  Label,
  Line,
  Lines,
  Note,
  Panel,
  Select,
  Stat,
  Table,
  Toggle,
} from "./kit"
import { AppShell, Frame, PageHead, roleNav } from "./shell"

/* 1 — Common email login with automatic tenant routing ------------- */
export function LoginScreen() {
  return (
    <Frame minWidth={720}>
      <div className="grid grid-cols-2">
        {/* Brand / illustration side */}
        <div className="flex flex-col justify-between border-r border-neutral-200 bg-neutral-100 p-6" style={{ minHeight: 420 }}>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded border border-neutral-400 bg-white text-[10px] font-bold text-neutral-500">
              CC
            </span>
            <span className="text-[13px] font-semibold text-neutral-600">CollegeCloud</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Icon glyph="⌂" size={64} />
            <Line w={160} />
            <Line w={120} />
            <Note className="mt-2 max-w-[220px]">Common login for every institute — the approved HU email domain routes users to the correct tenant automatically.</Note>
          </div>
          <Line w={90} />
        </div>

        {/* Form side */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-semibold text-neutral-700">Sign in to your institute</span>
            <Line w={180} />
          </div>

          <Label muted>Use your official student or college email. No tenant selection is required.</Label>

          <Field label="HU email address" placeholder="[you@institute.edu]" />
          <Field label="Password" placeholder="••••••••" />

          <div className="flex items-center justify-between">
            <Checkbox label="Remember me" />
            <Label>Forgot password?</Label>
          </div>

          <Btn className="w-full justify-center">Continue</Btn>
        </div>
      </div>
    </Frame>
  )
}

/* 2 — Super Admin dashboard ---------------------------------------- */
export function SuperAdminScreen() {
  const [showFilter, setShowFilter] = useState(false)
  const [showAddTenant, setShowAddTenant] = useState(false)
  const [openTenant, setOpenTenant] = useState<string | null>(null)
  const [flags, setFlags] = useState([true, false, true, false])
  const [notice, setNotice] = useState("")

  const notify = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(""), 2600)
  }

  const tenants = ["Northbridge College", "Horizon Institute", "Lakeside University", "Pioneer Academy"]

  return (
    <AppShell role="Super Admin" nav={roleNav.superAdmin} active="Tenants" trail={["Platform", "Tenants"]}>
      <div className="grid grid-cols-4 gap-3">
        <button type="button" className="text-left" onClick={() => notify("Showing all active tenants")}><Stat label="Active tenants" big /></button>
        <button type="button" className="text-left" onClick={() => window.location.hash = "#super-admin-user-creation"}><Stat label="Total users" /></button>
        <button type="button" className="text-left" onClick={() => notify("Monthly exam activity opened")}><Stat label="Exams this month" /></button>
        <button type="button" className="text-left" onClick={() => notify("Revenue summary opened")}><Stat label="MRR" /></button>
      </div>

      {notice ? <div role="status" className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-[11px] text-neutral-600">{notice}</div> : null}

      <div className="grid grid-cols-3 gap-4">
        <Panel
          title="Tenants"
          className="col-span-2"
          action={
            <div className="flex gap-2">
              <Btn variant="outline" size="sm" onClick={() => setShowFilter((value) => !value)}>⌕ Filter</Btn>
              <Btn size="sm" onClick={() => setShowAddTenant(true)}>+ Add Tenant</Btn>
            </div>
          }
        >
          {showFilter ? (
            <div className="mb-3 flex items-center gap-2 rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-2">
              <button type="button" className="rounded border border-neutral-300 bg-white px-2 py-1 text-[10px]" onClick={() => notify("Showing Enterprise tenants")}>Enterprise</button>
              <button type="button" className="rounded border border-neutral-300 bg-white px-2 py-1 text-[10px]" onClick={() => notify("Showing active tenants")}>Active only</button>
              <button type="button" className="ml-auto text-[10px] text-neutral-500 underline" onClick={() => setShowFilter(false)}>Close</button>
            </div>
          ) : null}
          <Table
            columns={["College", "Users", "Status", ""]}
            widths={["2fr", "0.8fr", "1fr", "0.6fr"]}
            rows={tenants.map((tenant, index) => [
              <button key="name" type="button" className="text-left" onClick={() => notify(`${tenant} details opened`)}><Line w={["80%", "70%", "85%", "60%"][index]} /></button>,
              ["1,240", "620", "90", "410"][index],
              <button key="status" type="button" onClick={() => notify(`${tenant} status details opened`)}><Badge tone={index === 2 ? "hatch" : undefined}>{index === 2 ? "Suspended" : "Active"}</Badge></button>,
              <div key="actions" className="relative"><Btn size="sm" variant="ghost" onClick={() => setOpenTenant(openTenant === tenant ? null : tenant)}>⋯</Btn>{openTenant === tenant ? <div className="absolute right-0 top-8 z-10 flex w-32 flex-col gap-1 rounded-md border border-neutral-300 bg-white p-1 shadow-sm"><button type="button" className="px-2 py-1 text-left text-[10px] hover:bg-neutral-100" onClick={() => notify(`${tenant} opened`)}>View details</button><button type="button" className="px-2 py-1 text-left text-[10px] hover:bg-neutral-100" onClick={() => notify(`${tenant} settings opened`)}>Manage settings</button><button type="button" className="px-2 py-1 text-left text-[10px] hover:bg-neutral-100" onClick={() => notify(`${tenant} action confirmed`)}>Suspend tenant</button></div> : null}</div>,
            ])}
          />
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Feature Flags">
            <div className="flex flex-col gap-2">
              {["Proctoring v2", "AI item analysis", "NBA reports", "Offline exams"].map((flag, index) => (
                <div key={flag} className="flex items-center justify-between">
                  <Label>{flag}</Label>
                  <button type="button" aria-pressed={flags[index]} onClick={() => setFlags((current) => current.map((value, item) => item === index ? !value : value))}><Toggle on={flags[index]} /></button>
                </div>
              ))}
            </div>
            <Note arrow="up" className="mt-2">Flags scoped per-tenant or global rollout.</Note>
          </Panel>
          <Panel title="Quick actions">
            <div className="flex flex-col gap-2"><Btn size="sm" onClick={() => window.location.hash = "#super-admin-user-creation"}>Create users</Btn><Btn size="sm" variant="outline" onClick={() => notify("Platform report exported")}>Export platform report</Btn></div>
          </Panel>
        </div>
      </div>

      <Panel title="Platform Usage (last 30 days)">
        <div className="grid grid-cols-4 items-center gap-4"><div className="col-span-3"><button type="button" className="w-full text-left" onClick={() => notify("Usage analytics opened")}><BarChart heights={[40, 62, 48, 70, 55, 80, 66, 90, 72, 84, 60, 95]} /></button></div><button type="button" className="flex flex-col items-center gap-2" onClick={() => notify("Storage details opened")}><Donut /><Label muted>Storage used</Label></button></div>
      </Panel>

      {showAddTenant ? <div role="dialog" aria-label="Add tenant" className="rounded-md border border-neutral-400 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-neutral-700">Add a tenant</span><button type="button" className="text-[12px] text-neutral-500" onClick={() => setShowAddTenant(false)}>Close</button></div><div className="mt-3 grid grid-cols-2 gap-2"><Field label="College name" placeholder="[enter college]" /><Field label="Admin email" placeholder="[admin@institute.edu]" /></div><div className="mt-3 flex justify-end gap-2"><Btn variant="outline" size="sm" onClick={() => setShowAddTenant(false)}>Cancel</Btn><Btn size="sm" onClick={() => { setShowAddTenant(false); notify("Tenant creation queued") }}>Create tenant</Btn></div></div> : null}
    </AppShell>
  )
}

/* 3 — Super Admin user creation ------------------------------------- */
export function SuperAdminUserCreationScreen() {
  return (
    <AppShell
      role="Super Admin"
      nav={roleNav.superAdmin}
      active="User Creation"
      trail={["Platform", "User Creation"]}
      minWidth={980}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold text-neutral-700">Create platform users</span>
          <Label muted>Only Super Admins can provision faculty and students across colleges.</Label>
        </div>
        <Badge tone="dark">Super Admin only</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Panel title="Create a user" action={<Badge tone="outline">Required fields marked *</Badge>}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name *" placeholder="[First name]" />
              <Field label="Last name *" placeholder="[Last name]" />
            </div>
            <Field label="Work or college email *" placeholder="[name@college.edu]" />
            <div className="grid grid-cols-2 gap-3">
              <Select label="User type *" value="Faculty ▾" />
              <Select label="Assign college *" value="[College Name] ▾" />
            </div>
            <Field label="Employee / student ID" placeholder="[ID number]" />
            <div className="flex items-center justify-between rounded border border-neutral-200 bg-neutral-50 px-3 py-2">
              <div className="flex flex-col gap-1">
                <Label>Send welcome email</Label>
                <span className="text-[10px] text-neutral-400">Includes a secure first-login link.</span>
              </div>
              <Toggle on />
            </div>
            <div className="flex gap-2">
              <Btn variant="outline" className="flex-1 justify-center">Clear</Btn>
              <Btn className="flex-1 justify-center">Create user</Btn>
            </div>
          </div>
        </Panel>

        <Panel title="Bulk creation" action={<Btn variant="outline" size="sm">Download template</Btn>}>
          <div className="flex flex-col gap-3">
            <div className="rounded border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center">
              <Icon glyph="⇧" size={24} />
              <div className="mt-2 flex flex-col gap-1">
                <Label>Upload faculty or student CSV</Label>
                <span className="text-[10px] text-neutral-400">One file per user type · max 5,000 rows</span>
              </div>
              <Btn variant="outline" size="sm" className="mt-3">Choose CSV file</Btn>
            </div>
            <Note arrow="left">CSV validation checks duplicate emails, college assignment and required IDs before import.</Note>
          </div>
        </Panel>
      </div>

      <Panel title="Recently created users" action={<Btn variant="outline" size="sm">Export log</Btn>}>
        <Table
          columns={["Name", "Type", "College", "Created by", "Status"]}
          widths={["1.4fr", "0.8fr", "1.3fr", "1fr", "0.8fr"]}
          rows={[
            [<Line key="a" w="70%" />, <Badge key="b" tone="outline">Faculty</Badge>, <Line key="c" w="75%" />, "You", <Badge key="d">Invited</Badge>],
            [<Line key="e" w="62%" />, <Badge key="f" tone="outline">Student</Badge>, <Line key="g" w="65%" />, "You", <Badge key="h">Active</Badge>],
            [<Line key="i" w="80%" />, <Badge key="j" tone="outline">Faculty</Badge>, <Line key="k" w="58%" />, "You", <Badge key="l" tone="hatch">Pending</Badge>],
          ]}
        />
      </Panel>
    </AppShell>
  )
}

/* 4 — Super Admin destination pages -------------------------------- */
export function SuperAdminDestinationScreen({ kind }: { kind: "overview" | "feature-flags" | "usage" | "settings" }) {
  const content = {
    overview: { title: "Platform overview", trail: "Overview", description: "Cross-tenant health, active users and platform operations at a glance." },
    "feature-flags": { title: "Feature flags", trail: "Feature Flags", description: "Control staged platform rollouts and review tenant-wide availability." },
    usage: { title: "Platform usage", trail: "Usage", description: "Monitor activity, storage and adoption across every institute." },
    settings: { title: "Platform settings", trail: "Platform Settings", description: "Manage global security, identity routing and platform defaults." },
  }[kind]

  return (
    <AppShell role="Super Admin" nav={roleNav.superAdmin} active={content.trail} trail={["Platform", content.trail]} minWidth={980}>
      <PageHead title={content.title} actions={<Btn size="sm">Save changes</Btn>} />
      <Note>{content.description} This page is visible only to Super Admins.</Note>
      <div className="grid grid-cols-3 gap-4">
        <Panel title="Configuration"><div className="flex flex-col gap-3"><Field label="Workspace name" placeholder="[CollegeCloud platform]" /><Field label="Approved HU email domains" placeholder="[institute.edu, college.edu]" /><Btn size="sm">Update configuration</Btn></div></Panel>
        <Panel title="Activity"><div className="flex flex-col gap-2"><Stat label="Active institutes" big /><Stat label="Users this month" /></div></Panel>
        <Panel title="Recent changes"><div className="flex flex-col gap-3"><Label>Global routing updated</Label><Label>Policy review pending</Label><Label>Usage export ready</Label></div></Panel>
      </div>
    </AppShell>
  )
}

/* 5 — College Admin dashboard -------------------------------------- */
export function CollegeAdminScreen() {
  return (
    <AppShell
      role="College Admin"
      nav={roleNav.collegeAdmin}
      active="Dashboard"
      trail={["[College Name]", "Dashboard"]}
    >
      <div className="grid grid-cols-5 gap-3">
        <Stat label="Departments" />
        <Stat label="Faculty" />
        <Stat label="Students" big />
        <Stat label="Active exams" />
        <Stat label="Pending reviews" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Panel
          title="Users & Roles"
          action={<Badge tone="hatch">Managed by Super Admin</Badge>}
        >
          <Table
            columns={["Name", "Role"]}
            widths={["1.4fr", "1fr"]}
            rows={[
              [<Line key="a" w="70%" />, <Badge key="b" tone="outline">Exam Controller</Badge>],
              [<Line key="a" w="60%" />, <Badge key="b" tone="outline">HOD</Badge>],
              [<Line key="a" w="80%" />, <Badge key="b" tone="outline">Faculty</Badge>],
              [<Line key="a" w="55%" />, <Badge key="b" tone="outline">Invigilator</Badge>],
              [<Line key="a" w="65%" />, <Badge key="b" tone="outline">Auditor</Badge>],
            ]}
          />
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Reports Shortcuts">
            <div className="grid grid-cols-2 gap-2">
              {["Outcome attainment", "Item analysis", "NAAC / NBA", "Result summary"].map((r) => (
                <div key={r} className="flex flex-col gap-1 rounded border border-neutral-200 p-2">
                  <Icon glyph="◫" size={20} />
                  <Label>{r}</Label>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Settings">
            <div className="flex flex-col gap-2">
              <Label>Branding · Roles · Integrations · Billing</Label>
              <Btn variant="outline" size="sm" className="w-max">
                ⚙ Open tenant settings →
              </Btn>
            </div>
          </Panel>
        </div>
      </div>

      <Panel title="Courses & Exam Pipeline">
        <Table
          columns={["Course", "Dept", "Faculty", "Exams", "Status"]}
          widths={["2fr", "1fr", "1.2fr", "0.8fr", "1fr"]}
          rows={[
            [<Line key="a" w="70%" />, "[CSE]", <Line key="c" w="60%" />, "3", <Badge key="e">On track</Badge>],
            [<Line key="a" w="85%" />, "[ECE]", <Line key="c" w="50%" />, "2", <Badge key="e" tone="hatch">Review due</Badge>],
            [<Line key="a" w="60%" />, "[MBA]", <Line key="c" w="70%" />, "4", <Badge key="e">On track</Badge>],
          ]}
        />
      </Panel>
    </AppShell>
  )
}

/* College Admin destination pages ----------------------------------- */
export function CollegeAdminDestinationScreen({ kind }: { kind: "departments" | "users" | "courses" | "exams" | "reports" | "settings" }) {
  const content = {
    departments: { title: "Departments", description: "Review the departments inferred from faculty and student records." },
    users: { title: "Users", description: "View college users provisioned by the Super Admin." },
    courses: { title: "Courses", description: "Manage course ownership, enrollment and faculty assignments." },
    exams: { title: "Exams", description: "Coordinate exam schedules, review status and publishing controls." },
    reports: { title: "Reports", description: "Open college-level academic, outcome and examination reports." },
    settings: { title: "Settings", description: "Configure college branding, roles and institute preferences." },
  }[kind]

  return (
    <AppShell role="College Admin" nav={roleNav.collegeAdmin} active={content.title} trail={["[College Name]", content.title]} minWidth={980}>
      <PageHead title={content.title} actions={<Btn size="sm">+ New {content.title === "Users" ? "view" : content.title.slice(0, -1)}</Btn>} />
      <div className="grid grid-cols-3 gap-4">
        <Panel title={content.title} className="col-span-2">
          <div className="flex flex-col gap-2">
            <Label muted>{content.description}</Label>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between rounded border border-neutral-200 p-2">
                <div className="flex flex-col gap-1"><Line w={`${55 + item * 8}%`} /><Line w="40%" /></div>
                <Badge tone={item === 3 ? "hatch" : "outline"}>{item === 3 ? "Review" : "Active"}</Badge>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Quick actions">
          <div className="flex flex-col gap-2"><Btn size="sm">Export {content.title.toLowerCase()}</Btn><Btn variant="outline" size="sm">Open filters</Btn></div>
          <Note arrow="up" className="mt-3">College Admin access is limited to this institute.</Note>
        </Panel>
      </div>
    </AppShell>
  )
}

/* 4 — Faculty dashboard -------------------------------------------- */
export function FacultyScreen() {
  return (
    <AppShell role="Faculty" nav={roleNav.faculty} active="Dashboard" trail={["[College Name]", "Faculty", "Dashboard"]}>
      <div className="grid grid-cols-4 gap-3">
        <Stat label="My courses" />
        <Stat label="Bank questions" big />
        <Stat label="Assessments" />
        <Stat label="To grade" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Panel title="My Courses" className="col-span-1">
          <div className="flex flex-col gap-2">
            {["[Course Title]", "[Course Title]", "[Course Title]"].map((c, i) => (
              <div key={i} className="flex items-center gap-2 rounded border border-neutral-200 p-2">
                <Icon glyph="▦" size={22} />
                <div className="flex flex-1 flex-col gap-1">
                  <Label>{c}</Label>
                  <Line w="70%" />
                </div>
                <Badge tone="outline">{40 + i * 10} students</Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Assessments"
          className="col-span-1"
          action={<Btn size="sm">+ New Assessment</Btn>}
        >
          <div className="flex flex-col gap-2">
            {[
              ["[Exam Title]", "Draft", "outline"],
              ["[Exam Title]", "Pending", "hatch"],
              ["[Exam Title]", "Approved", "dark"],
              ["[Exam Title]", "Rejected", "neutral"],
            ].map(([t, s, tone], i) => (
              <div key={i} className="flex items-center justify-between rounded border border-neutral-200 px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <Icon glyph="✎" size={18} />
                  <Label>{t as string}</Label>
                </div>
                <Badge tone={tone as "outline" | "hatch" | "dark" | "neutral"}>{s as string}</Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Grading Queue" className="col-span-1" action={<Badge tone="hatch">12 waiting</Badge>}>
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 rounded border border-neutral-200 p-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-[9px] text-neutral-500">
                  ☺
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <Line w="80%" />
                  <Line w="50%" />
                </div>
                <Btn size="sm" variant="outline">Grade →</Btn>
              </div>
            ))}
            <Note arrow="up">Manual-grade items surface here after auto-scoring.</Note>
          </div>
        </Panel>
      </div>

      <Panel title="Question Bank (quick view)" action={<Btn variant="outline" size="sm">Open bank →</Btn>}>
        <div className="grid grid-cols-4 gap-3">
          {["MCQ", "Short answer", "Essay", "Numerical"].map((t) => (
            <div key={t} className="flex flex-col gap-1.5 rounded border border-neutral-200 p-2">
              <Eyebrow>{t}</Eyebrow>
              <Bar w="50%" h={12} />
              <Lines count={2} widths={["100%", "60%"]} />
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  )
}
