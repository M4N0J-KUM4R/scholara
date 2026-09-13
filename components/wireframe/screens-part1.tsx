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
import { AppShell, Frame, roleNav } from "./shell"

/* 1 — Login / SSO with tenant selection ---------------------------- */
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
            <Note className="mt-2 max-w-[220px]">Brand-agnostic panel — tenant logo &amp; color inject here at runtime.</Note>
          </div>
          <Line w={90} />
        </div>

        {/* Form side */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-semibold text-neutral-700">Sign in</span>
            <Line w={140} />
          </div>

          <Select label="Select your college (tenant)" value="[College Name] ▾" />

          <Field label="Email / University ID" placeholder="[you@college.edu]" />
          <Field label="Password" placeholder="••••••••" />

          <div className="flex items-center justify-between">
            <Checkbox label="Remember me" />
            <Label>Forgot password?</Label>
          </div>

          <Btn className="w-full justify-center">Sign in</Btn>
        </div>
      </div>
    </Frame>
  )
}

/* 2 — Super Admin dashboard ---------------------------------------- */
export function SuperAdminScreen() {
  return (
    <AppShell role="Super Admin" nav={roleNav.superAdmin} active="Tenants" trail={["Platform", "Tenants"]}>
      <div className="grid grid-cols-4 gap-3">
        <Stat label="Active tenants" big />
        <Stat label="Total users" />
        <Stat label="Exams this month" />
        <Stat label="MRR" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Panel
          title="Tenants"
          className="col-span-2"
          action={
            <div className="flex gap-2">
              <Btn variant="outline" size="sm">
                ⌕ Filter
              </Btn>
              <Btn size="sm">+ Add Tenant</Btn>
            </div>
          }
        >
          <Table
            columns={["College", "Plan", "Users", "Status", ""]}
            widths={["2fr", "1fr", "0.8fr", "1fr", "0.6fr"]}
            rows={[
              [<Line key="a" w="80%" />, <Badge key="b" tone="dark">Enterprise</Badge>, "1,240", <Badge key="c">Active</Badge>, <Btn key="d" size="sm" variant="ghost">⋯</Btn>],
              [<Line key="a" w="70%" />, <Badge key="b">Pro</Badge>, "620", <Badge key="c">Active</Badge>, <Btn key="d" size="sm" variant="ghost">⋯</Btn>],
              [<Line key="a" w="85%" />, <Badge key="b" tone="outline">Trial</Badge>, "90", <Badge key="c" tone="hatch">Suspended</Badge>, <Btn key="d" size="sm" variant="ghost">⋯</Btn>],
              [<Line key="a" w="60%" />, <Badge key="b">Pro</Badge>, "410", <Badge key="c">Active</Badge>, <Btn key="d" size="sm" variant="ghost">⋯</Btn>],
            ]}
          />
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Feature Flags">
            <div className="flex flex-col gap-2">
              {["Proctoring v2", "AI item analysis", "NBA reports", "Offline exams"].map((f, i) => (
                <div key={f} className="flex items-center justify-between">
                  <Label>{f}</Label>
                  <Toggle on={i % 2 === 0} />
                </div>
              ))}
            </div>
            <Note arrow="up" className="mt-2">Flags scoped per-tenant or global rollout.</Note>
          </Panel>
        </div>
      </div>

      <Panel title="Platform Usage (last 30 days)">
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="col-span-3">
            <BarChart heights={[40, 62, 48, 70, 55, 80, 66, 90, 72, 84, 60, 95]} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Donut />
            <Label muted>Storage used</Label>
          </div>
        </div>
      </Panel>
    </AppShell>
  )
}

/* 3 — College Admin dashboard -------------------------------------- */
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
        <Panel title="Departments" action={<Btn size="sm">+ Add</Btn>}>
          <div className="flex flex-col gap-2">
            {["[Dept — CSE]", "[Dept — ECE]", "[Dept — MECH]", "[Dept — MBA]"].map((d) => (
              <div key={d} className="flex items-center justify-between rounded border border-neutral-200 px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <Icon glyph="⧉" size={18} />
                  <Label>{d}</Label>
                </div>
                <span className="text-[9px] text-neutral-400">HOD ✓</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Users & Roles"
          action={
            <div className="flex gap-2">
              <Btn variant="outline" size="sm">Import CSV</Btn>
              <Btn size="sm">+ Invite</Btn>
            </div>
          }
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
