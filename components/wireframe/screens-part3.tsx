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
  LineChart,
  Lines,
  Note,
  Panel,
  Select,
  Stat,
  Table,
  Toggle,
} from "./kit"
import { AppShell, Frame, roleNav } from "./shell"

/* 9 — Student dashboard -------------------------------------------- */
export function StudentScreen() {
  return (
    <AppShell role="Student" nav={roleNav.student} active="Dashboard" trail={["[College Name]", "Dashboard"]}>
      <div className="grid grid-cols-4 gap-3">
        <Stat label="Enrolled courses" />
        <Stat label="Upcoming exams" big />
        <Stat label="Avg. score" />
        <Stat label="Notifications" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Panel title="Enrolled Courses" className="col-span-1">
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2 rounded border border-neutral-200 p-2">
                <Icon glyph="▦" size={22} />
                <div className="flex flex-1 flex-col gap-1">
                  <Label>[Course Title]</Label>
                  <div className="h-1.5 w-full rounded-full bg-neutral-200">
                    <div className="h-1.5 rounded-full bg-neutral-500" style={{ width: `${40 + i * 12}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Upcoming Exams" className="col-span-1" action={<Badge tone="hatch">2 this week</Badge>}>
          <div className="flex flex-col gap-2">
            {[
              ["[Exam Title]", "Tue · 10:00", "Starts in 2d"],
              ["[Exam Title]", "Fri · 14:00", "Starts in 5d"],
            ].map(([t, w, s], i) => (
              <div key={i} className="flex flex-col gap-2 rounded border border-neutral-200 p-2">
                <div className="flex items-center justify-between">
                  <Label>{t}</Label>
                  <Badge tone="outline">{s}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Icon glyph="◷" size={16} />
                  <span className="text-[10px] text-neutral-500">{w}</span>
                </div>
                <Btn size="sm" className="w-full justify-center">Enter when live →</Btn>
              </div>
            ))}
            <Note arrow="up">Enter button unlocks at the scheduled open time.</Note>
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Recent Results">
            <div className="flex flex-col gap-2">
              {[["[Exam Title]", "82%"], ["[Exam Title]", "74%"], ["[Exam Title]", "—"]].map(([t, s], i) => (
                <div key={i} className="flex items-center justify-between rounded border border-neutral-200 px-2 py-1.5">
                  <Label>{t}</Label>
                  {s === "—" ? <Badge tone="hatch">Pending</Badge> : <Badge tone="dark">{s}</Badge>}
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Notifications">
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <Icon glyph="⚑" size={16} />
                  <Lines count={1} widths={["90%"]} />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  )
}

/* 10 — Exam taking interface --------------------------------------- */
export function ExamTakingScreen() {
  return (
    <Frame minWidth={940}>
      {/* Slim exam top bar (no tenant switcher / nav during exam) */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Icon glyph="✎" size={22} />
          <span className="text-[12px] font-semibold text-neutral-600">[Exam Title]</span>
          <Badge tone="outline">Attempt 1</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone="outline">● Proctoring on</Badge>
          <div className="flex items-center gap-2 rounded border border-neutral-400 bg-neutral-100 px-3 py-1">
            <span className="text-[10px] text-neutral-500">⏱</span>
            <span className="text-[13px] font-bold tracking-widest text-neutral-700">00:42:18</span>
          </div>
        </div>
      </div>
      <Note arrow="left" className="mx-4 mt-3">Timer counts down; auto-submits at 00:00. Warning banner at 5 min left.</Note>

      <div className="flex gap-4 p-4">
        {/* Question area */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Panel title="Question 7 of 42">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge tone="outline">MCQ</Badge>
                <Badge tone="outline">5 marks</Badge>
              </div>
              <Lines count={3} />
              <div className="flex flex-col gap-2">
                {["A", "B", "C", "D"].map((o, i) => (
                  <div
                    key={o}
                    className={`flex items-center gap-3 rounded border px-3 py-2 ${
                      i === 2 ? "border-neutral-600 bg-neutral-100" : "border-neutral-200"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border text-[8px] ${
                        i === 2 ? "border-neutral-600 bg-neutral-600 text-white" : "border-neutral-300 text-neutral-400"
                      }`}
                    >
                      {i === 2 ? "●" : o}
                    </span>
                    <Line w="65%" />
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <div className="flex items-center justify-between">
            <Btn variant="outline">← Previous</Btn>
            <div className="flex gap-2">
              <Btn variant="outline">⚑ Flag for review</Btn>
              <Btn>Next →</Btn>
            </div>
          </div>
        </div>

        {/* Palette + submit */}
        <div className="flex w-56 shrink-0 flex-col gap-4">
          <Panel title="Question Palette">
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: 20 }).map((_, i) => {
                const state = i === 6 ? "current" : i < 5 ? "answered" : i === 3 ? "flagged" : i < 8 ? "answered" : "unseen"
                const cls =
                  state === "current"
                    ? "border-neutral-700 bg-neutral-700 text-white"
                    : state === "answered"
                      ? "border-neutral-500 bg-neutral-300 text-neutral-700"
                      : state === "flagged"
                        ? "wf-bar border-neutral-500 text-neutral-800"
                        : "border-neutral-300 bg-white text-neutral-400"
                return (
                  <span key={i} className={`flex h-6 w-6 items-center justify-center rounded border text-[9px] font-semibold ${cls}`}>
                    {i + 1}
                  </span>
                )
              })}
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded border border-neutral-500 bg-neutral-300" /> <Label>Answered</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="wf-bar h-3 w-3 rounded border border-neutral-500" /> <Label>Flagged</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded border border-neutral-300 bg-white" /> <Label>Not visited</Label>
              </div>
            </div>
          </Panel>
          <Btn className="w-full justify-center">Submit Exam</Btn>
          <Note arrow="up">Submit shows a confirm dialog with unanswered / flagged counts.</Note>
        </div>
      </div>
    </Frame>
  )
}

/* 11 — Grading & moderation ---------------------------------------- */
export function GradingScreen() {
  return (
    <AppShell role="Faculty / Moderator" nav={roleNav.faculty} active="Grading Queue" trail={["[Course Title]", "[Exam Title]", "Grading"]} minWidth={980}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-neutral-700">Grading & Moderation — [Exam Title]</span>
        <div className="flex gap-2">
          <Badge tone="dark">Auto-graded 118</Badge>
          <Badge tone="hatch">Manual 24</Badge>
          <Badge tone="outline">Re-eval 3</Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Submissions list */}
        <Panel title="Submissions" className="col-span-1">
          <div className="mb-2 flex gap-2">
            <Btn size="sm" variant="outline">All</Btn>
            <Btn size="sm" variant="outline">Manual</Btn>
            <Btn size="sm" variant="outline">Flagged</Btn>
          </div>
          <div className="flex flex-col gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex items-center gap-2 rounded border p-2 ${i === 1 ? "border-neutral-500 bg-neutral-100" : "border-neutral-200"}`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-[9px] text-neutral-500">☺</div>
                <div className="flex flex-1 flex-col gap-1">
                  <Label>[Student Name]</Label>
                  <Line w="60%" />
                </div>
                <Badge tone={i === 0 ? "dark" : "outline"}>{i === 0 ? "Done" : "Q3, Q7"}</Badge>
              </div>
            ))}
          </div>
        </Panel>

        {/* Rubric grading */}
        <Panel title="Rubric Grading · Q7 (Essay)" className="col-span-2">
          <div className="flex flex-col gap-3">
            <div className="rounded border border-neutral-200 p-3">
              <Eyebrow>Student response</Eyebrow>
              <div className="mt-2">
                <Lines count={4} />
              </div>
            </div>
            <div className="rounded border border-dashed border-neutral-300 p-3">
              <div className="flex items-center justify-between">
                <Eyebrow>Rubric</Eyebrow>
                <Badge tone="outline">Auto-grade: n/a</Badge>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                {[
                  ["Thesis / argument", "4 / 5"],
                  ["Evidence & accuracy", "3 / 5"],
                  ["Structure & clarity", "5 / 5"],
                ].map(([c, s], i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded border border-neutral-200 px-2 py-1.5">
                    <Label>{c}</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-neutral-200">
                        <div className="h-1.5 rounded-full bg-neutral-500" style={{ width: `${60 + i * 12}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-neutral-600">{s}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label muted>Score for Q7</Label>
                <Bar w={70} h={16} />
              </div>
              <div className="flex gap-2">
                <Btn variant="outline">Save & Next</Btn>
                <Btn>Finalize</Btn>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Panel title="Moderation Panel">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Second-marker moderation</Label>
              <Toggle on />
            </div>
            <div className="flex items-center justify-between">
              <Label>Blind grading (hide names)</Label>
              <Toggle on />
            </div>
            <Table
              columns={["Marker", "Avg", "Variance"]}
              rows={[
                [<Line key="a" w="70%" />, "72", <Badge key="c" tone="outline">Low</Badge>],
                [<Line key="a" w="60%" />, "68", <Badge key="c" tone="hatch">High</Badge>],
              ]}
            />
            <Note arrow="up">High variance flags items for moderator reconciliation.</Note>
          </div>
        </Panel>
        <Panel title="Re-evaluation Requests">
          <div className="flex flex-col gap-2">
            {[
              ["[Student Name]", "Q7 · +2 marks?", "Pending"],
              ["[Student Name]", "Q3 total", "Approved"],
              ["[Student Name]", "Full paper", "Rejected"],
            ].map(([n, r, s], i) => (
              <div key={i} className="flex items-center justify-between rounded border border-neutral-200 px-2 py-1.5">
                <div className="flex flex-col gap-1">
                  <Label>{n}</Label>
                  <span className="text-[9px] text-neutral-400">{r}</span>
                </div>
                <Badge tone={s === "Approved" ? "dark" : s === "Pending" ? "hatch" : "neutral"}>{s}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  )
}

/* 12 — Reports & analytics ----------------------------------------- */
export function ReportsScreen() {
  return (
    <AppShell role="Auditor / Admin" nav={roleNav.collegeAdmin} active="Reports" trail={["[College Name]", "Reports & Analytics"]} minWidth={980}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-neutral-700">Reports & Analytics</span>
        <div className="flex gap-2">
          <Select value="Term: [Sem] ▾" w={130} />
          <Btn variant="outline" size="sm">⭳ Export PDF</Btn>
          <Btn variant="outline" size="sm">⭳ Export Excel</Btn>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Panel title="Student Progress" className="col-span-2">
          <LineChart h={120} />
          <div className="mt-2 flex gap-3">
            <Label muted>■ Cohort average</Label>
            <Label muted>▨ Target</Label>
          </div>
        </Panel>
        <Panel title="Pass / Fail Distribution">
          <div className="flex flex-col items-center gap-2">
            <Donut size={96} />
            <div className="flex gap-3">
              <Label muted>Pass 66%</Label>
              <Label muted>Fail 34%</Label>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Item Analysis (per question)">
        <Table
          columns={["Q#", "Difficulty (p)", "Discrimination (D)", "Distractor health", "Flag"]}
          widths={["0.5fr", "1.2fr", "1.4fr", "1.4fr", "0.8fr"]}
          rows={[
            ["Q1", <Bar key="b" w="40%" h={10} />, <Bar key="c" w="70%" h={10} />, <Line key="d" w="60%" />, <Badge key="e" tone="dark">Good</Badge>],
            ["Q2", <Bar key="b" w="80%" h={10} />, <Bar key="c" w="30%" h={10} />, <Line key="d" w="50%" />, <Badge key="e" tone="hatch">Review</Badge>],
            ["Q3", <Bar key="b" w="55%" h={10} />, <Bar key="c" w="60%" h={10} />, <Line key="d" w="70%" />, <Badge key="e" tone="dark">Good</Badge>],
            ["Q4", <Bar key="b" w="20%" h={10} />, <Bar key="c" w="15%" h={10} />, <Line key="d" w="40%" />, <Badge key="e" tone="neutral">Drop</Badge>],
          ]}
        />
        <Note arrow="up" className="mt-2">Low discrimination + very high/low difficulty → candidate for revision or removal.</Note>
      </Panel>

      <div className="grid grid-cols-2 gap-4">
        <Panel title="Outcome Attainment (CO / PO)">
          <BarChart heights={[70, 55, 82, 48, 90, 64]} h={110} />
          <div className="mt-2 flex justify-between">
            {["CO1", "CO2", "CO3", "CO4", "CO5", "CO6"].map((c) => (
              <Label key={c} muted>{c}</Label>
            ))}
          </div>
        </Panel>
        <Panel title="Accreditation Reports">
          <div className="grid grid-cols-2 gap-2">
            {["NAAC — SSR", "NBA — Part B", "CO-PO Matrix", "Attainment Gap"].map((r) => (
              <div key={r} className="flex items-center justify-between rounded border border-neutral-200 p-2">
                <div className="flex items-center gap-2">
                  <Icon glyph="◫" size={20} />
                  <Label>{r}</Label>
                </div>
                <span className="text-[10px] text-neutral-400">⭳</span>
              </div>
            ))}
          </div>
          <Note arrow="up" className="mt-2">One-click export to PDF / Excel with institution letterhead.</Note>
        </Panel>
      </div>
    </AppShell>
  )
}

/* 13 — Tenant settings --------------------------------------------- */
export function TenantSettingsScreen() {
  const tabs = ["Branding", "Roles & Permissions", "Integrations", "Billing"]
  return (
    <AppShell role="College Admin" nav={roleNav.collegeAdmin} active="Settings" trail={["[College Name]", "Settings"]} minWidth={980}>
      <span className="text-[13px] font-semibold text-neutral-700">Tenant Settings</span>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200">
        {tabs.map((t, i) => (
          <div
            key={t}
            className={`-mb-px border-b-2 px-3 py-2 text-[11px] font-medium ${
              i === 0 ? "border-neutral-600 text-neutral-700" : "border-transparent text-neutral-400"
            }`}
          >
            {t}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Panel title="Branding">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="wf-imgx h-16 w-16" />
              <div className="flex flex-col gap-1.5">
                <Label>Institution logo</Label>
                <Btn variant="outline" size="sm">⭱ Upload</Btn>
              </div>
            </div>
            <Field label="Display name" placeholder="[College Name]" />
            <div className="flex flex-col gap-1.5">
              <Label>Primary color (token)</Label>
              <div className="flex gap-2">
                {["◻", "◼", "◧", "◨"].map((c) => (
                  <span key={c} className="flex h-7 w-7 items-center justify-center rounded border border-neutral-300 text-neutral-500">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <Note>Grayscale placeholders — real palette injected per tenant.</Note>
          </div>
        </Panel>

        <Panel title="Roles & Permissions">
          <div className="overflow-hidden rounded border border-neutral-200">
            <div className="grid grid-cols-[1.6fr_repeat(3,0.8fr)] gap-2 border-b border-neutral-200 bg-neutral-100 px-3 py-1.5">
              <Eyebrow>Role</Eyebrow>
              <Eyebrow>Create</Eyebrow>
              <Eyebrow>Approve</Eyebrow>
              <Eyebrow>Report</Eyebrow>
            </div>
            {[
              ["Exam Controller", true, true, true],
              ["HOD", true, true, false],
              ["Faculty", true, false, false],
              ["Auditor", false, false, true],
            ].map((r, i) => (
              <div key={i} className="grid grid-cols-[1.6fr_repeat(3,0.8fr)] items-center gap-2 border-b border-neutral-100 px-3 py-2 last:border-0">
                <Label>{r[0] as string}</Label>
                {[r[1], r[2], r[3]].map((v, ci) => (
                  <Checkbox key={ci} label="" checked={v as boolean} />
                ))}
              </div>
            ))}
          </div>
          <Note arrow="up" className="mt-2">Fine-grained matrix per tenant — least-privilege defaults.</Note>
        </Panel>

        <Panel title="Integrations">
          <div className="flex flex-col gap-2">
            {[
              ["SIS / ERP sync", true],
              ["SSO — SAML / OIDC", true],
              ["Proctoring provider", true],
              ["LTI 1.3", false],
              ["Plagiarism check", false],
            ].map(([n, on], i) => (
              <div key={i} className="flex items-center justify-between rounded border border-neutral-200 px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="wf-imgx h-6 w-6" />
                  <Label>{n as string}</Label>
                </div>
                <div className="flex items-center gap-2">
                  {on ? <Badge tone="dark">Connected</Badge> : <Badge tone="outline">Off</Badge>}
                  <Toggle on={on as boolean} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Billing">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded border border-neutral-200 p-3">
              <div className="flex flex-col gap-1">
                <Eyebrow>Current plan</Eyebrow>
                <Bar w={90} h={16} />
              </div>
              <Badge tone="dark">Enterprise</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Seats used" />
              <Stat label="Exams / mo" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Auto-renew</Label>
              <Toggle on />
            </div>
            <div className="flex gap-2">
              <Btn variant="outline" className="flex-1 justify-center">Invoices</Btn>
              <Btn className="flex-1 justify-center">Manage plan</Btn>
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  )
}
