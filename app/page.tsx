import type { ReactNode } from "react"
import {
  CollegeAdminScreen,
  FacultyScreen,
  LoginScreen,
  SuperAdminScreen,
  SuperAdminDestinationScreen,
  SuperAdminUserCreationScreen,
} from "@/components/wireframe/screens-part1"
import {
  AddQuestionScreen,
  ExamManagementScreen,
  QuestionBankScreen,
  ValidationScreen,
  WizardScreen,
} from "@/components/wireframe/screens-part2"
import {
  ExamCodingScreen,
  ExamLabScreen,
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
    desc: "Common HU email login with automatic institute routing by approved email domain; no tenant selection is exposed to users.",
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
    id: "super-admin-user-creation",
    n: 3,
    title: "Super Admin User Creation",
    desc: "Create individual or bulk-import faculty and student accounts, assign colleges, and review the creation log.",
    role: "Super Admin",
    render: () => <SuperAdminUserCreationScreen />,
  },
  {
    id: "super-admin-overview",
    n: 4,
    title: "Platform Overview",
    desc: "Super Admin overview of platform health, active institutes and operational activity.",
    role: "Super Admin",
    render: () => <SuperAdminDestinationScreen kind="overview" />,
  },
  {
    id: "super-admin-settings",
    n: 7,
    title: "Platform Settings",
    desc: "Global security, identity routing and platform defaults.",
    role: "Super Admin",
    render: () => <SuperAdminDestinationScreen kind="settings" />,
  },
  {
    id: "college-admin",
    n: 8,
    title: "College Admin Dashboard",
    desc: "Departments, users & roles, courses, the exam pipeline, report shortcuts and settings.",
    role: "College Admin / Exam Controller",
    render: () => <CollegeAdminScreen />,
  },
  {
    id: "faculty",
    n: 5,
    title: "Faculty Dashboard",
    desc: "My courses, question-bank snapshot, assessment statuses and the manual grading queue.",
    role: "Faculty",
    render: () => <FacultyScreen />,
  },
  {
    id: "wizard",
    n: 6,
    title: "Assessment Creation Wizard",
    desc: "Four steps — Details, Add Questions, Settings (timing / randomization / proctoring), Validation & Submit.",
    role: "Faculty",
    render: () => <WizardScreen />,
  },
  {
    id: "add-question",
    n: 7,
    title: "Add Question (MCQ / Coding)",
    desc: "Per-question editor with MCQ or Coding types. Coding questions include an inline compiler / test runner, and validation runs automatically as you edit — no separate submit step.",
    role: "Faculty",
    render: () => <AddQuestionScreen />,
  },
  {
    id: "question-bank",
    n: 8,
    title: "Question Bank",
    desc: "Filter by subject, unit, Bloom's taxonomy, difficulty and type. Preview panel and bulk import.",
    role: "Faculty",
    render: () => <QuestionBankScreen />,
  },
  {
    id: "validation",
    n: 9,
    title: "Validation Workflow",
    desc: "Submission → HOD review → Exam Cell approval, with comments, version history and status badges.",
    role: "HOD / Exam Cell",
    render: () => <ValidationScreen />,
  },
  {
    id: "exam-management",
    n: 10,
    title: "Exam Management",
    desc: "Schedule, student list, accommodations, proctoring settings and publish / unpublish controls.",
    role: "Exam Controller",
    render: () => <ExamManagementScreen />,
  },
  {
    id: "student",
    n: 11,
    title: "Student Dashboard",
    desc: "Enrolled courses with progress, upcoming exams, recent results and notifications.",
    role: "Student",
    render: () => <StudentScreen />,
  },
  {
    id: "exam-taking",
    n: 12,
    title: "Exam Taking Interface (MCQ)",
    desc: "Countdown timer, question palette, navigation, flag-for-review and guarded submit.",
    role: "Student",
    render: () => <ExamTakingScreen />,
  },
  {
    id: "exam-coding",
    n: 13,
    title: "Exam Taking — Coding Question",
    desc: "Problem statement with constraints, language selector, code editor and a run/test console showing sample vs hidden test cases. Same proctored top bar, palette and guarded submit.",
    role: "Student",
    render: () => <ExamCodingScreen />,
  },
  {
    id: "exam-lab",
    n: 14,
    title: "Exam Taking — Lab Question",
    desc: "KillerKoda-style split: instructions with an automated step checklist on the left, a Monaco-style editor (file tabs, explorer) and a live sandbox terminal on the right. Check task runs the grader for the active step.",
    role: "Student",
    render: () => <ExamLabScreen />,
  },
  {
    id: "grading",
    n: 15,
    title: "Grading & Moderation",
    desc: "Auto-graded vs manual, rubric grading, moderation panel and re-evaluation requests.",
    role: "Faculty / Moderator",
    render: () => <GradingScreen />,
  },
  {
    id: "reports",
    n: 16,
    title: "Reports & Analytics",
    desc: "Student progress, item analysis (difficulty / discrimination), outcome attainment and NAAC/NBA exports.",
    role: "Auditor / Admin",
    render: () => <ReportsScreen />,
  },
  {
    id: "settings",
    n: 17,
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
              "17 desktop-first screens on an 8px grid — top bar with tenant switcher, left sidebar, breadcrumbs and content area. Placeholder blocks, squiggly text lines, simple icons and dashed annotations mark key interactions, validation states and workflow steps. No real colors, logos or copy."
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
