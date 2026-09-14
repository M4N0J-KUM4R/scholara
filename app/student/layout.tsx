import type { ReactNode } from "react"
import { AppShell } from "@/components/app-shell"

export const metadata = { title: "Student · CollegeCloud" }

const nav = [
  { label: "Dashboard", href: "/student", glyph: "▤" },
  { label: "My Courses", href: "/student/courses", glyph: "▦" },
  { label: "Exams", href: "/student/exams", glyph: "✎" },
  { label: "Results", href: "/student/results", glyph: "◫" },
  { label: "Portfolio", href: "/student/portfolio", glyph: "★" },
  { label: "Connect Accounts", href: "/student/portfolio/connect", glyph: "⚡" },
]

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="Student" roleTone="bg-sun" tenant="Hindustan University" nav={nav}>
      {children}
    </AppShell>
  )
}
