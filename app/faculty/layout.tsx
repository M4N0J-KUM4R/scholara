import type { ReactNode } from "react"
import { AppShell } from "@/components/app-shell"

export const metadata = { title: "Faculty · CollegeCloud" }

const nav = [
  { label: "Dashboard", href: "/faculty", glyph: "▤" },
  { label: "Question Bank", href: "/faculty/question-bank", glyph: "❓" },
  { label: "Author Item", href: "/faculty/question-bank/new", glyph: "➕" },
  { label: "Assessments", href: "/faculty/assessments", glyph: "✎" },
  { label: "Validation", href: "/faculty/validation", glyph: "✓" },
  { label: "Grading", href: "/faculty/grading", glyph: "✍" },
  { label: "Dept Status", href: "/college/department-status", glyph: "📊" },
]

export default function FacultyLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="Faculty" roleTone="bg-mint" tenant="Hindustan University" nav={nav}>
      {children}
    </AppShell>
  )
}
