import type { ReactNode } from "react"
import { AppShell } from "@/components/app-shell"

export const metadata = { title: "Super Admin · CollegeCloud" }

const nav = [
  { label: "Dashboard", href: "/admin", glyph: "▤" },
  { label: "Tenants", href: "/admin/tenants", glyph: "⌂" },
  { label: "Onboard Tenant", href: "/onboarding", glyph: "🚀" },
  { label: "User Creation", href: "/admin/users", glyph: "☺" },
  { label: "Platform Settings", href: "/admin/settings", glyph: "⚙" },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="Super Admin" roleTone="bg-candy" tenant="Platform HQ" nav={nav}>
      {children}
    </AppShell>
  )
}
