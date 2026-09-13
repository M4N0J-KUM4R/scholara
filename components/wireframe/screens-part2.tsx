import {
  Badge,
  Bar,
  Btn,
  Checkbox,
  Eyebrow,
  Field,
  Icon,
  Label,
  Line,
  Lines,
  Note,
  Panel,
  Select,
  Toggle,
} from "./kit"
import { AppShell, roleNav } from "./shell"

/* Wizard step indicator */
function Steps({ current }: { current: number }) {
  const steps = ["Details", "Add Questions", "Settings", "Validation & Submit"]
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const n = i + 1
        const active = n === current
        const done = n < current
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1 ${
                active
                  ? "border-neutral-600 bg-neutral-700 text-neutral-50"
                  : done
                    ? "border-neutral-400 bg-neutral-200 text-neutral-600"
                    : "border-neutral-300 bg-white text-neutral-400"
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[8px]">
                {done ? "✓" : n}
              </span>
              <span className="text-[10px] font-semibold">{s}</span>
            </div>
            {i < steps.length - 1 ? <span className="text-[10px] text-neutral-300">→</span> : null}
          </div>
        )
      })}
    </div>
  )
}

/* 5 — Assessment creation wizard (all 4 steps shown) --------------- */
export function WizardScreen() {
  return (
    <AppShell
      role="Faculty"
      nav={roleNav.faculty}
      active="Assessments"
      trail={["[Course Title]", "Assessments", "New"]}
      minWidth={980}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-neutral-700">Create Assessment — [Exam Title]</span>
        <Steps current={2} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Step 1 */}
        <Panel title="Step 1 · Details">
          <div className="flex flex-col gap-3">
            <Field label="Exam title" placeholder="[Exam Title]" />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Course" value="[Course Title] ▾" />
              <Select label="Exam type" value="Mid-term ▾" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Total marks" placeholder="100" />
              <Field label="Duration (min)" placeholder="90" />
              <Field label="Attempts" placeholder="1" />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Instructions</Label>
              <div className="rounded border border-neutral-300 p-2">
                <Lines count={3} />
              </div>
            </div>
          </div>
        </Panel>

        {/* Step 2 */}
        <Panel title="Step 2 · Add Questions" action={<Btn size="sm">+ From Bank</Btn>}>
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2 rounded border border-neutral-200 p-2">
                <span className="text-[10px] text-neutral-400">⋮⋮</span>
                <span className="text-[10px] font-semibold text-neutral-500">Q{i}</span>
                <div className="flex flex-1 flex-col gap-1">
                  <Lines count={2} widths={["100%", "70%"]} />
                  <div className="flex gap-1.5">
                    <Badge tone="outline">MCQ</Badge>
                    <Badge tone="outline">Bloom: Apply</Badge>
                    <Badge tone="outline">5 pts</Badge>
                  </div>
                </div>
                <Btn size="sm" variant="ghost">✕</Btn>
              </div>
            ))}
            <Btn variant="outline" size="sm" className="w-full justify-center">
              + Add question
            </Btn>
            <Note arrow="up">Drag to reorder. Marks auto-total against Step 1.</Note>
          </div>
        </Panel>

        {/* Step 3 */}
        <Panel title="Step 3 · Settings (timing, randomization, proctoring)">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Opens" placeholder="[date / time]" />
              <Field label="Closes" placeholder="[date / time]" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Randomize question order</Label>
              <Toggle on />
            </div>
            <div className="flex items-center justify-between">
              <Label>Shuffle options</Label>
              <Toggle on />
            </div>
            <div className="flex items-center justify-between">
              <Label>Question pooling (pick N of M)</Label>
              <Toggle />
            </div>
            <div className="rounded border border-dashed border-neutral-300 p-2">
              <Eyebrow>Proctoring</Eyebrow>
              <div className="mt-2 flex flex-col gap-2">
                <Checkbox label="Lockdown browser" checked />
                <Checkbox label="Webcam monitoring" checked />
                <Checkbox label="Tab-switch detection" />
              </div>
            </div>
          </div>
        </Panel>

        {/* Step 4 */}
        <Panel title="Step 4 · Validation & Submit">
          <div className="flex flex-col gap-2">
            {[
              ["All questions have answer keys", "ok"],
              ["Marks total = 100", "ok"],
              ["Duration set", "ok"],
              ["2 essay items need rubric", "warn"],
              ["Schedule window valid", "ok"],
            ].map(([t, s], i) => (
              <div key={i} className="flex items-center gap-2 rounded border border-neutral-200 px-2 py-1.5">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${
                    s === "ok" ? "bg-neutral-600 text-white" : "wf-bar text-neutral-700"
                  }`}
                >
                  {s === "ok" ? "✓" : "!"}
                </span>
                <Label>{t as string}</Label>
              </div>
            ))}
            <Note arrow="up">Submit is blocked until all validations pass or warnings are acknowledged.</Note>
            <div className="mt-1 flex gap-2">
              <Btn variant="outline" className="flex-1 justify-center">Save Draft</Btn>
              <Btn className="flex-1 justify-center">Submit for Review →</Btn>
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  )
}

/* Question type tabs */
function TypeTabs({ active }: { active: "mcq" | "coding" }) {
  const tabs = [
    ["mcq", "MCQ"],
    ["coding", "Coding"],
  ] as const
  return (
    <div className="flex items-center gap-1 rounded-md border border-neutral-300 bg-neutral-100 p-1">
      {tabs.map(([id, label]) => (
        <span
          key={id}
          className={`rounded px-3 py-1 text-[10px] font-semibold ${
            id === active ? "border border-neutral-500 bg-white text-neutral-700 shadow-sm" : "text-neutral-400"
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  )
}

/* Live auto-validation checklist */
function AutoValidation({ blocked }: { blocked: boolean }) {
  const checks = [
    ["Question stem present", "ok"],
    ["Marks + Bloom level assigned", "ok"],
    ["≥ 1 test case defined (3)", "ok"],
    ["Starter code compiles", "ok"],
    ["Reference solution passes all tests", blocked ? "warn" : "ok"],
  ] as const
  return (
    <Panel title="Auto-validation · live">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded border border-dashed border-neutral-300 bg-neutral-50 px-2 py-1.5">
          <span className="flex h-4 w-4 items-center justify-center rounded-full wf-bar text-[9px] text-neutral-700">
            ↻
          </span>
          <Label>Runs automatically on every edit — no separate step.</Label>
        </div>
        {checks.map(([t, s], i) => (
          <div key={i} className="flex items-center gap-2 rounded border border-neutral-200 px-2 py-1.5">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${
                s === "ok" ? "bg-neutral-600 text-white" : "wf-bar text-neutral-700"
              }`}
            >
              {s === "ok" ? "✓" : "!"}
            </span>
            <Label>{t}</Label>
          </div>
        ))}
        <Note arrow="up">
          {blocked ? "\"Add\" stays disabled until all checks pass." : "All checks passed — question can be added."}
        </Note>
      </div>
    </Panel>
  )
}

/* 5b — Add question (MCQ | Coding + compiler) ---------------------- */
export function AddQuestionScreen() {
  return (
    <AppShell
      role="Faculty"
      nav={roleNav.faculty}
      active="Assessments"
      trail={["[Course Title]", "Assessments", "[Exam Title]", "Add Question"]}
      minWidth={980}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-neutral-700">Add Question — [Exam Title]</span>
          <Badge tone="outline">Q7 of 42</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Label>Type</Label>
          <TypeTabs active="coding" />
        </div>
      </div>

      {/* ---- Coding question (active) ---- */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-4">
          <Panel title="Coding question">
            <div className="flex flex-col gap-3">
              <Field label="Title" placeholder="[Problem title]" />
              <div className="grid grid-cols-3 gap-3">
                <Select label="Language" value="C++ 17 ▾" />
                <Select label="Bloom level" value="Apply ▾" />
                <Field label="Marks" placeholder="10" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Problem statement</Label>
                <div className="rounded border border-neutral-300 p-2">
                  <Lines count={3} widths={["100%", "92%", "60%"]} />
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            title="Starter / reference code"
            action={
              <div className="flex items-center gap-2">
                <Badge tone="outline">main.cpp</Badge>
                <Btn size="sm" variant="outline">
                  ▷ Run
                </Btn>
              </div>
            }
          >
            {/* code editor mock */}
            <div className="overflow-hidden rounded border border-neutral-300 bg-neutral-50 font-mono">
              {[
                ["60%", true],
                ["78%", false],
                ["45%", false],
                ["70%", false],
                ["30%", false],
                ["55%", true],
              ].map(([w, dedent], i) => (
                <div key={i} className="flex items-center gap-3 border-b border-neutral-100 px-2 py-1 last:border-0">
                  <span className="w-4 shrink-0 text-right text-[9px] text-neutral-300">{i + 1}</span>
                  <span style={{ marginLeft: dedent ? 0 : 16 }}>
                    <Line w={w as string} />
                  </span>
                </div>
              ))}
            </div>
            <Note arrow="up" className="mt-2">
              Editor runs against the compiler sandbox on Run and on Save.
            </Note>
          </Panel>
        </div>

        {/* right rail: compiler + validation */}
        <div className="col-span-1 flex flex-col gap-4">
          <Panel title="Compiler · test runner" action={<Badge tone="dark">2 / 3 pass</Badge>}>
            <div className="flex flex-col gap-2">
              {[
                ["Test 1 · sample", "pass"],
                ["Test 2 · edge (empty)", "pass"],
                ["Test 3 · large N", "fail"],
              ].map(([t, s], i) => (
                <div key={i} className="flex items-center justify-between rounded border border-neutral-200 px-2 py-1.5">
                  <Label>{t}</Label>
                  <Badge tone={s === "pass" ? "dark" : "hatch"}>{s === "pass" ? "✓ pass" : "✕ fail"}</Badge>
                </div>
              ))}
              <div className="rounded border border-neutral-300 bg-neutral-900/5 p-2 font-mono">
                <Eyebrow>Output console</Eyebrow>
                <div className="mt-1.5 flex flex-col gap-1">
                  <Line w="80%" />
                  <Line w="55%" />
                  <Line w="68%" />
                </div>
              </div>
              <Btn size="sm" variant="outline" className="w-full justify-center">
                + Add test case
              </Btn>
            </div>
          </Panel>

          <AutoValidation blocked />

          <div className="flex gap-2">
            <Btn variant="outline" className="flex-1 justify-center">
              Cancel
            </Btn>
            <Btn className="flex-1 justify-center opacity-50">+ Add to Exam</Btn>
          </div>
        </div>
      </div>

      {/* ---- MCQ variant (alternate type) ---- */}
      <Panel
        title="Alternate type · MCQ editor"
        action={<Badge tone="outline">shown for reference</Badge>}
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label>Question stem</Label>
              <div className="rounded border border-neutral-300 p-2">
                <Lines count={2} widths={["100%", "72%"]} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {["A", "B", "C", "D"].map((o, i) => (
                <div key={o} className="flex items-center gap-2 rounded border border-neutral-200 px-2 py-1.5">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border text-[8px] ${
                      i === 2 ? "border-neutral-600 bg-neutral-600 text-white" : "border-neutral-300 text-neutral-400"
                    }`}
                  >
                    {i === 2 ? "✓" : o}
                  </span>
                  <Line w="65%" />
                </div>
              ))}
              <Note arrow="up">Mark exactly one correct option — validated live.</Note>
            </div>
          </div>
          <div className="col-span-1">
            <AutoValidation blocked={false} />
          </div>
        </div>
      </Panel>
    </AppShell>
  )
}

/* 6 — Question bank ------------------------------------------------ */
export function QuestionBankScreen() {
  return (
    <AppShell role="Faculty" nav={roleNav.faculty} active="Question Bank" trail={["[Course Title]", "Question Bank"]} minWidth={980}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-neutral-700">Question Bank</span>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm">⭳ Bulk Import (CSV / QTI)</Btn>
          <Btn size="sm">+ New Question</Btn>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Filters */}
        <Panel title="Filters" className="col-span-1">
          <div className="flex flex-col gap-3">
            <Select label="Subject" value="[Subject] ▾" />
            <Select label="Unit" value="All units ▾" />
            <div className="flex flex-col gap-1.5">
              <Label>Bloom&apos;s taxonomy</Label>
              {["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"].map((b, i) => (
                <Checkbox key={b} label={b} checked={i === 2} />
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Difficulty</Label>
              {["Easy", "Medium", "Hard"].map((d, i) => (
                <Checkbox key={d} label={d} checked={i === 1} />
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Type</Label>
              {["MCQ", "Short answer", "Essay", "Numerical"].map((t) => (
                <Checkbox key={t} label={t} />
              ))}
            </div>
          </div>
        </Panel>

        {/* Result list */}
        <Panel
          title="Questions (128)"
          className="col-span-2"
          action={
            <div className="flex items-center gap-2">
              <Checkbox label="Select all" />
              <Btn variant="outline" size="sm">Bulk ⋯</Btn>
            </div>
          }
        >
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex items-start gap-2 rounded border p-2 ${i === 2 ? "border-neutral-500 bg-neutral-100" : "border-neutral-200"}`}
              >
                <Checkbox label="" checked={i === 2} />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Lines count={2} widths={["95%", "60%"]} />
                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone="outline">MCQ</Badge>
                    <Badge tone="outline">Bloom: Apply</Badge>
                    <Badge tone="outline">Medium</Badge>
                    <Badge tone="outline">Unit 3</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Preview panel */}
        <Panel title="Preview" className="col-span-1">
          <div className="flex flex-col gap-3">
            <Badge tone="dark">MCQ · Apply · Medium</Badge>
            <Lines count={3} />
            <div className="flex flex-col gap-2">
              {["A", "B", "C", "D"].map((o, i) => (
                <div key={o} className="flex items-center gap-2 rounded border border-neutral-200 px-2 py-1.5">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border text-[8px] ${
                      i === 1 ? "border-neutral-600 bg-neutral-600 text-white" : "border-neutral-300 text-neutral-400"
                    }`}
                  >
                    {i === 1 ? "✓" : o}
                  </span>
                  <Line w="70%" />
                </div>
              ))}
            </div>
            <Note>Correct answer + rationale visible to author only.</Note>
            <div className="flex gap-2">
              <Btn variant="outline" size="sm" className="flex-1 justify-center">Edit</Btn>
              <Btn size="sm" className="flex-1 justify-center">Add to exam</Btn>
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  )
}

/* 7 — Validation workflow ------------------------------------------ */
export function ValidationScreen() {
  const stages = [
    ["Faculty submits", "dark", "✓"],
    ["HOD review", "dark", "✓"],
    ["Exam Cell approval", "hatch", "●"],
    ["Published", "neutral", "○"],
  ] as const
  return (
    <AppShell
      role="HOD / Exam Cell"
      nav={roleNav.collegeAdmin}
      active="Exams"
      trail={["[College Name]", "Exams", "[Exam Title]", "Review"]}
      minWidth={980}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-neutral-700">Validation Workflow — [Exam Title]</span>
        <Badge tone="hatch">Pending · Exam Cell</Badge>
      </div>

      {/* Stage chain */}
      <Panel>
        <div className="flex items-center justify-between">
          {stages.map(([label, tone, mark], i) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-[12px] ${
                    tone === "dark"
                      ? "border-neutral-700 bg-neutral-700 text-white"
                      : tone === "hatch"
                        ? "wf-bar border-neutral-500 text-neutral-800"
                        : "border-neutral-300 bg-white text-neutral-400"
                  }`}
                >
                  {mark}
                </div>
                <Label>{label}</Label>
              </div>
              {i < stages.length - 1 ? <div className="mx-2 h-px flex-1 bg-neutral-300" /> : null}
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-3 gap-4">
        <Panel title="Submission" className="col-span-2">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Badge tone="hatch">Pending</Badge>
              <Badge tone="outline">v3</Badge>
              <Badge tone="outline">42 questions</Badge>
              <Badge tone="outline">100 marks</Badge>
            </div>
            <div className="rounded border border-neutral-200 p-3">
              <Eyebrow>Exam summary</Eyebrow>
              <div className="mt-2">
                <Lines count={3} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Btn variant="outline" className="justify-center">↩ Request changes</Btn>
              <Btn className="justify-center">✓ Approve</Btn>
              <Btn variant="outline" className="justify-center">✕ Reject</Btn>
            </div>
            <Note arrow="up">Approver actions differ by role — HOD forwards, Exam Cell finalizes.</Note>
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Status Legend">
            <div className="flex flex-wrap gap-2">
              <Badge tone="outline">Draft</Badge>
              <Badge tone="hatch">Pending</Badge>
              <Badge tone="dark">Approved</Badge>
              <Badge tone="neutral">Rejected</Badge>
            </div>
          </Panel>

          <Panel title="Comments">
            <div className="flex flex-col gap-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-[9px] text-neutral-500">
                    ☺
                  </div>
                  <div className="flex flex-1 flex-col gap-1 rounded border border-neutral-200 p-2">
                    <Label>[Reviewer] · Q7</Label>
                    <Lines count={2} widths={["100%", "50%"]} />
                  </div>
                </div>
              ))}
              <Field placeholder="Add a comment…" />
            </div>
          </Panel>

          <Panel title="Version History">
            <div className="flex flex-col gap-2">
              {[
                ["v3", "current"],
                ["v2", "changes requested"],
                ["v1", "submitted"],
              ].map(([v, s]) => (
                <div key={v} className="flex items-center justify-between rounded border border-neutral-200 px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <Icon glyph="◷" size={18} />
                    <Label>{v}</Label>
                  </div>
                  <span className="text-[9px] text-neutral-400">{s}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  )
}

/* 8 — Exam management ---------------------------------------------- */
export function ExamManagementScreen() {
  return (
    <AppShell role="Exam Controller" nav={roleNav.collegeAdmin} active="Exams" trail={["[College Name]", "Exams", "[Exam Title]"]} minWidth={980}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-neutral-700">Manage — [Exam Title]</span>
          <Badge tone="dark">Approved</Badge>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm">Unpublish</Btn>
          <Btn size="sm">Publish ▲</Btn>
        </div>
      </div>
      <Note arrow="up">Publish makes the exam visible to enrolled students at the scheduled open time.</Note>

      <div className="grid grid-cols-3 gap-4">
        <Panel title="Schedule" className="col-span-1">
          <div className="flex flex-col gap-3">
            <Field label="Date" placeholder="[exam date]" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start" placeholder="10:00" />
              <Field label="End" placeholder="11:30" />
            </div>
            <Select label="Time zone" value="[TZ] ▾" />
            <div className="flex items-center justify-between">
              <Label>Late entry (grace)</Label>
              <Toggle on />
            </div>
          </div>
        </Panel>

        <Panel title="Proctoring Settings" className="col-span-1">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Lockdown browser</Label>
              <Toggle on />
            </div>
            <div className="flex items-center justify-between">
              <Label>Webcam monitoring</Label>
              <Toggle on />
            </div>
            <div className="flex items-center justify-between">
              <Label>Tab-switch alerts</Label>
              <Toggle on />
            </div>
            <div className="flex items-center justify-between">
              <Label>ID verification</Label>
              <Toggle />
            </div>
            <Select label="Assign invigilators" value="2 selected ▾" />
          </div>
        </Panel>

        <Panel title="Accommodations" className="col-span-1">
          <div className="flex flex-col gap-2">
            {[
              ["[Student Name]", "+50% time"],
              ["[Student Name]", "Screen reader"],
              ["[Student Name]", "Separate room"],
            ].map(([n, a], i) => (
              <div key={i} className="flex items-center justify-between rounded border border-neutral-200 px-2 py-1.5">
                <Label>{n}</Label>
                <Badge tone="outline">{a}</Badge>
              </div>
            ))}
            <Btn variant="outline" size="sm" className="w-full justify-center">+ Add accommodation</Btn>
            <Note>Overrides apply per-student on top of base timing.</Note>
          </div>
        </Panel>
      </div>

      <Panel title="Student List (enrolled · 142)" action={<Btn variant="outline" size="sm">⌕ Search</Btn>}>
        <div className="overflow-hidden rounded border border-neutral-200">
          <div className="grid grid-cols-[0.3fr_2fr_1fr_1fr_1fr] gap-3 border-b border-neutral-200 bg-neutral-100 px-3 py-1.5">
            <Checkbox label="" />
            <Eyebrow>Student</Eyebrow>
            <Eyebrow>Roll No.</Eyebrow>
            <Eyebrow>Accommodation</Eyebrow>
            <Eyebrow>Status</Eyebrow>
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-[0.3fr_2fr_1fr_1fr_1fr] items-center gap-3 border-b border-neutral-100 px-3 py-2 last:border-0">
              <Checkbox label="" />
              <Line w="70%" />
              <Line w="50%" />
              {i === 1 ? <Badge tone="outline">+50% time</Badge> : <span className="text-[10px] text-neutral-300">—</span>}
              <Badge tone={i === 3 ? "neutral" : "outline"}>{i === 3 ? "Not eligible" : "Ready"}</Badge>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  )
}
