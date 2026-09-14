"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"

export type NavItem = { label: string; href: string; glyph: string }

export function AppShell({
  role,
  roleTone = "bg-candy",
  tenant,
  nav,
  children,
}: {
  role: string
  roleTone?: string
  tenant: string
  nav: NavItem[]
  children: ReactNode
}) {
  const pathname = usePathname()

  const crumbs = (() => {
    const parts = pathname.split("/").filter(Boolean)
    return parts.length ? parts : []
  })()

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b-2 border-ink bg-ink px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link href="/" className="nb-press nb-shadow-sm flex h-8 w-8 items-center justify-center rounded-none border-2 border-ink bg-sun font-display text-[12px] text-ink">
            CC
          </Link>
          <span className="font-display text-[13px] text-white max-sm:hidden">CollegeCloud</span>
          <div className="flex items-center gap-2 rounded-none border-2 border-ink bg-white px-2.5 py-1.5 shadow-[3px_3px_0_#ffdc58] max-sm:hidden">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink/50">Tenant</span>
            <span className="text-[11px] font-bold text-ink">{tenant} ▾</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search…"
            aria-label="Global search"
            className="h-8 w-52 rounded-none border-2 border-ink bg-white px-2.5 text-[12px] font-medium shadow-[3px_3px_0_#ff90e8] placeholder:text-ink/35 focus:shadow-none focus:outline-none max-md:hidden"
          />
          <span aria-hidden className="flex h-8 w-8 items-center justify-center border-2 border-white bg-ink text-[14px] text-sun">
            ⚑
          </span>
          <span aria-hidden className="flex h-8 w-8 items-center justify-center border-2 border-white bg-ink text-[14px] text-candy">
            ?
          </span>
          <Avatar size={28} />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside aria-label={`${role} navigation`} className="sticky top-[57px] flex h-[calc(100vh-57px)] w-52 shrink-0 flex-col border-r-2 border-ink bg-white p-3 max-md:w-14 max-md:px-1.5">
          <div className={cn("mb-3 border-2 border-ink px-2 py-1.5", roleTone)}>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink max-md:hidden">{role}</span>
            <span className="hidden text-[12px] font-bold text-ink max-md:block">{role.slice(0, 1)}</span>
          </div>
          <nav className="flex flex-col gap-1.5">
            {nav.map((it) => {
              const active = pathname === it.href
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "nb-press flex items-center gap-2.5 rounded-none border-2 px-2.5 py-2",
                    active ? "nb-shadow-sm border-ink bg-sun" : "border-transparent hover:border-ink hover:bg-paper",
                  )}
                >
                  <span aria-hidden className="w-4 text-center text-[13px]">{it.glyph}</span>
                  <span className={cn("text-[12px] max-md:hidden", active ? "font-bold text-ink" : "font-medium text-ink/70")}>
                    {it.label}
                  </span>
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto border-2 border-dashed border-ink/40 p-2 text-[9px] font-medium leading-snug text-ink/50 max-md:hidden">
            Demo build — data is local until Supabase keys are configured.
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 border-b-2 border-ink bg-white px-5 py-2">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className={cn("text-[11px]", i === crumbs.length - 1 ? "font-bold text-ink" : "font-medium text-ink/45")}>
                  {c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
                </span>
                {i < crumbs.length - 1 ? <span className="text-[11px] font-bold text-ink/30">/</span> : null}
              </span>
            ))}
          </div>
          <main className="flex flex-col gap-5 p-5 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
