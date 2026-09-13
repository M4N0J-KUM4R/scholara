import type { ReactNode } from "react"
import { Avatar, Eyebrow, Icon, Label } from "./kit"

/* Browser-window chrome that wraps every screen */
export function Frame({ children, minWidth = 940 }: { children: ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-300 bg-neutral-50">
      <div style={{ minWidth }}>
        <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full border border-neutral-400 bg-neutral-200" />
          <span className="h-2.5 w-2.5 rounded-full border border-neutral-400 bg-neutral-200" />
          <span className="h-2.5 w-2.5 rounded-full border border-neutral-400 bg-neutral-200" />
          <div className="ml-3 flex h-5 flex-1 items-center rounded border border-neutral-200 bg-white px-2">
            <span className="text-[9px] text-neutral-400">app.collegecloud.edu</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

/* Top application bar including the tenant switcher */
export function TopBar({ showTenantSwitcher = true }: { showTenantSwitcher?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded border border-neutral-400 bg-neutral-100 text-[10px] font-bold text-neutral-500">
            CC
          </span>
          <span className="text-[12px] font-semibold text-neutral-600">CollegeCloud</span>
        </div>
        {showTenantSwitcher ? (
          <div aria-label="Tenant switcher" className="flex items-center gap-2 rounded border border-dashed border-neutral-400 bg-neutral-50 px-2 py-1">
            <Icon glyph="⌂" size={18} />
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-wide text-neutral-400">Tenant</span>
              <span className="text-[10px] font-medium text-neutral-600">[College Name] ▾</span>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <div role="search" aria-label="Global search" className="flex h-7 w-56 items-center gap-1.5 rounded border border-neutral-300 bg-white px-2 max-md:hidden">
          <span className="text-[10px] text-neutral-400">⌕</span>
          <span className="text-[10px] text-neutral-400">Search…</span>
        </div>
        <Icon glyph="⚑" size={24} />
        <Icon glyph="?" size={24} />
        <Avatar size={26} />
      </div>
    </div>
  )
}

/* Left navigation sidebar */
export function Sidebar({
  items,
  active,
  role,
}: {
  items: { glyph: string; label: string; href?: string }[]
  active: string
  role: string
}) {
  return (
    <aside aria-label={`${role} navigation`} className="w-48 shrink-0 border-r border-neutral-200 bg-neutral-50 p-2 max-md:w-12 max-md:px-1">
      <div className="mb-2 px-2 py-1">
        <Eyebrow>{role}</Eyebrow>
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map((it) => {
          const isActive = it.label === active
          return (
            <a
              key={it.label}
              href={it.href ?? `#${it.label.toLowerCase().replaceAll(" ", "-")}`}
              className={`flex items-center gap-2 rounded px-2 py-1.5 ${
                isActive ? "border border-neutral-300 bg-white" : "border border-transparent"
              }`}
            >
              <span className="w-4 text-center text-[12px] text-neutral-500">{it.glyph}</span>
              <span className={`text-[11px] ${isActive ? "font-semibold text-neutral-700" : "text-neutral-500"}`}>
                {it.label}
              </span>
            </a>
          )
        })}
      </nav>
    </aside>
  )
}

/* Breadcrumb trail */
export function Breadcrumbs({ trail }: { trail: string[] }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-neutral-200 bg-white px-4 py-2">
      {trail.map((t, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className={`text-[10px] ${i === trail.length - 1 ? "font-semibold text-neutral-600" : "text-neutral-400"}`}>
            {t}
          </span>
          {i < trail.length - 1 ? <span className="text-[10px] text-neutral-300">/</span> : null}
        </span>
      ))}
    </div>
  )
}

/* Page heading row inside the content area */
export function PageHead({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-neutral-700">{title}</span>
        <div className="wf-scribble" style={{ width: 180 }} />
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}

/* Full dashboard layout: topbar + sidebar + breadcrumbs + content */
export function AppShell({
  role,
  nav,
  active,
  trail,
  children,
  minWidth,
}: {
  role: string
  nav: { glyph: string; label: string }[]
  active: string
  trail: string[]
  children: ReactNode
  minWidth?: number
}) {
  return (
    <Frame minWidth={minWidth}>
      <TopBar />
      <div className="flex">
        <Sidebar items={nav} active={active} role={role} />
        <div className="min-w-0 flex-1">
          <Breadcrumbs trail={trail} />
          <div className="flex flex-col gap-4 p-4">{children}</div>
        </div>
      </div>
    </Frame>
  )
}

export const roleNav = {
  superAdmin: [
    { glyph: "▤", label: "Overview", href: "#super-admin-overview" },
    { glyph: "⌂", label: "Tenants", href: "#super-admin" },
    { glyph: "☺", label: "User Creation", href: "#super-admin-user-creation" },
    { glyph: "⚙", label: "Platform Settings", href: "#super-admin-settings" },
  ],
  collegeAdmin: [
    { glyph: "▤", label: "Dashboard" },
    { glyph: "⧉", label: "Departments" },
    { glyph: "☺", label: "Users" },
    { glyph: "▦", label: "Courses" },
    { glyph: "✎", label: "Exams" },
    { glyph: "◫", label: "Reports" },
    { glyph: "⚙", label: "Settings" },
  ],
  faculty: [
    { glyph: "▤", label: "Dashboard" },
    { glyph: "▦", label: "My Courses" },
    { glyph: "❓", label: "Question Bank" },
    { glyph: "✎", label: "Assessments" },
    { glyph: "✓", label: "Grading Queue" },
  ],
  student: [
    { glyph: "▤", label: "Dashboard" },
    { glyph: "▦", label: "My Courses" },
    { glyph: "✎", label: "Exams" },
    { glyph: "◫", label: "Results" },
    { glyph: "⚑", label: "Notifications" },
  ],
}
