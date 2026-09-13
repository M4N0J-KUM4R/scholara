import type { ReactNode } from "react"
import {
  CollegeAdminScreen,
  FacultyScreen,
  LoginScreen,
  SuperAdminScreen,
} from "@/components/wireframe/screens-part1"
import {
  ExamManagementScreen,
  QuestionBankScreen,
  ValidationScreen,
  WizardScreen,
} from "@/components/wireframe/screens-part2"
import {
  ExamTakingScreen,
  GradingScreen,
  ReportsScreen,
  StudentScreen,
  TenantSettingsScreen,
} from "@/components/wireframe/screens-part3"

type Screen = {
  id: string
  n: number
  title: string
  desc: string
  role: string
  render: () => ReactNode
}

const screens: Screen[] = [
  {
    id: "login",
    n: 1,
    title: "Login / SSO",
    desc: "Tenant selection first, then email/password or per-tenant SSO (SAML, Google Workspace).",
    role: "All users",
    render: () => <LoginScreen />,
  },
  {
    id: "super-admin",
    n: 2,
    title: "Super Admin Dashboard",
    desc: "Platform owner view: tenant list, subscription plans, usage metrics and feature-flag rollout.",
    role: "Super Admin",
    render: () => <SuperAdminScreen />,
  },
  {
    id: "college-admin",
    n: 3,
    title: "College Admin Dashboard",
    desc: "Departments, users & roles, courses, the exam pipeline, report shortcuts and settings.",
    role: "College Admin / Exam Controller",
    render: () => <CollegeAdminScreen />,
  },
  {
    id: "faculty",
    n: 4,
    title: "Faculty Dashboard",
    desc: "My courses, question-bank snapshot, assessment statuses and the manual grading queue.",
    role: "Faculty",
    render: () => <FacultyScreen />,
  },
  {
    id: "wizard",
    n: 5,
    title: "Assessment Creation Wizard",
    desc: "Four steps — Details, Add Questions, Settings (timing / randomization / proctoring), Validation & Submit.",
    role: "Faculty",
    render: () => <WizardScreen />,
  },
  {
    id: "question-bank",
    n: 6,
    title: "Question Bank",
    desc: "Filter by subject, unit, Bloom's taxonomy, difficulty and type. Preview panel and bulk import.",
    role: "Faculty",
    render: () => <QuestionBankScreen />,
  },
  {
    id: "validation",
    n: 7,
    title: "Validation Workflow",
    desc: "Submission → HOD review → Exam Cell approval, with comments, version history and status badges.",
    role: "HOD / Exam Cell",
    render: () => <ValidationScreen />,
  },
  {
    id: "exam-management",
    n: 8,
    title: "Exam Management",
    desc: "Schedule, student list, accommodations, proctoring settings and publish / unpublish controls.",
    role: "Exam Controller",
    render: () => <ExamManagementScreen />,
  },
  {
    id: "student",
    n: 9,
    title: "Student Dashboard",
    desc: "Enrolled courses with progress, upcoming exams, recent results and notifications.",
    role: "Student",
    render: () => <StudentScreen />,
  },
  {
    id: "exam-taking",
    n: 10,
    title: "Exam Taking Interface",
    desc: "Countdown timer, question palette, navigation, flag-for-review and guarded submit.",
    role: "Student",
    render: () => <ExamTakingScreen />,
  },
  {
    id: "grading",
    n: 11,
    title: "Grading & Moderation",
    desc: "Auto-graded vs manual, rubric grading, moderation panel and re-evaluation requests.",
    role: "Faculty / Moderator",
    render: () => <GradingScreen />,
  },
  {
    id: "reports",
    n: 12,
    title: "Reports & Analytics",
    desc: "Student progress, item analysis (difficulty / discrimination), outcome attainment and NAAC/NBA exports.",
    role: "Auditor / Admin",
    render: () => <ReportsScreen />,
  },
  {
    id: "settings",
    n: 13,
    title: "Tenant Settings",
    desc: "Branding, roles & permissions matrix, integrations and billing — scoped to a single tenant.",
    role: "College Admin",
    render: () => <TenantSettingsScreen />,
  },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800">
      {/* Kit header */}
      <header className="border-b border-neutral-300 bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded border border-neutral-400 bg-neutral-100 text-[12px] font-bold text-neutral-500">
              CC
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-neutral-800">CollegeCloud — Wireframe UI Kit</span>
              <span className="text-[12px] text-neutral-500">
                Low-fidelity, grayscale, brand-agnostic wireframes for a multi-tenant LMS
              </span>
            </div>
          </div>

          <p className="max-w-3xl text-[13px] leading-relaxed text-neutral-500">
            {
              "13 desktop-first screens on an 8px grid — top bar with tenant switcher, left sidebar, breadcrumbs and content area. Placeholder blocks, squiggly text lines, simple icons and dashed annotations mark key interactions, validation states and workflow steps. No real colors, logos or copy."
            }
          </p>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-[11px] text-neutral-500">
            <span className="font-semibold uppercase tracking-wide text-neutral-500">Legend</span>
            <span className="flex items-center gap-2">
              <span className="wf-scribble inline-block h-[7px] w-8" /> text
            </span>
            <span className="flex items-center gap-2">
              <span className="wf-imgx inline-block h-4 w-6" /> image
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 rounded-full border border-neutral-400 bg-neutral-200" /> avatar
            </span>
            <span className="flex items-center gap-2">
              <span className="wf-bar inline-block h-3 w-8 rounded" /> heading / fill
            </span>
            <span className="flex items-center gap-2">
              <span className="wf-note inline-flex h-4 items-center rounded px-1 text-[9px]">✎ note</span> annotation
            </span>
          </div>

          {/* Index */}
          <nav className="flex flex-wrap gap-2 pt-1">
            {screens.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-2.5 py-1 text-[11px] text-neutral-600 transition-colors hover:border-neutral-500 hover:bg-neutral-50"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-200 text-[9px] font-bold text-neutral-500">
                  {s.n}
                </span>
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Gallery */}
      <main className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 py-8">
        {screens.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-6">
            <article className="overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm">
              <header className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-700 text-[12px] font-bold text-neutral-50">
                    {s.n}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[15px] font-semibold text-neutral-800">{s.title}</h2>
                    <p className="max-w-2xl text-[12px] leading-relaxed text-neutral-500">{s.desc}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-dashed border-neutral-400 bg-neutral-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                  {s.role}
                </span>
              </header>
              <div className="bg-neutral-100 p-5">{s.render()}</div>
            </article>
          </section>
        ))}

        <footer className="pb-8 pt-2 text-center text-[11px] text-neutral-400">
          CollegeCloud wireframe kit · grayscale low-fidelity · ready to convert into a clickable prototype
        </footer>
      </main>
    </div>
  )
}
