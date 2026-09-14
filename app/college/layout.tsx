import type { ReactNode } from "react"
import { AppShell } from "@/components/app-shell"

export const metadata = { title: "College Admin · CollegeCloud" }

const nav = [
  { label: "Dashboard", href: "/college", glyph: "▤" },
  { label: "Batches", href: "/college/batches", glyph: "🗂" },
  { label: "Students", href: "/college/students", glyph: "🎓" },
  { label: "Faculty", href: "/college/faculty", glyph: "☺" },
  { label: "Departments", href: "/college/departments", glyph: "⧉" },
  { label: "Dept Status", href: "/college/department-status", glyph: "📊" },
  { label: "Courses", href: "/college/courses", glyph: "▦" },
  { label: "Exams", href: "/college/exams", glyph: "✎" },
  { label: "Reports", href: "/college/reports", glyph: "◫" },
  { label: "Settings", href: "/college/settings", glyph: "⚙" },
]

export default function CollegeLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="College Admin" roleTone="bg-sky" tenant="Hindustan University" nav={nav}>
      {children}
    </AppShell>
  )
}
