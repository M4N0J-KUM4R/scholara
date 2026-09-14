"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"

async function loadLiveData() {
  const supabase = createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return { authenticated: false, tenant: null, counts: null }

  const { data: account } = await supabase
    .from("user_account")
    .select("id, first_name, last_name, tenant_id, tenant(name, slug)")
    .eq("auth_user_id", auth.user.id)
    .maybeSingle()

  if (!account) return { authenticated: true, tenant: null, counts: null }

  const tenantId = account.tenant_id
  const [users, departments, courses, assessments, announcements, notifications] = await Promise.all([
    supabase.from("user_account").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase.from("department").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase.from("course").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase.from("assessment").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase.from("announcement").select("id,title,published_at").eq("tenant_id", tenantId).order("published_at", { ascending: false }).limit(3),
    supabase.from("notification").select("id", { count: "exact", head: true }).eq("recipient_id", account.id).is("read_at", null),
  ])

  return {
    authenticated: true,
    tenant: { name: account.tenant?.name ?? "Connected tenant", slug: account.tenant?.slug ?? "" },
    user: `${account.first_name} ${account.last_name}`,
    counts: {
      users: users.count ?? 0,
      departments: departments.count ?? 0,
      courses: courses.count ?? 0,
      assessments: assessments.count ?? 0,
      unread: notifications.count ?? 0,
    },
    announcements: announcements.data ?? [],
  }
}

export function LiveDataPanel() {
  const { data, error, isLoading } = useSWR("collegecloud-live-dashboard", loadLiveData)

  return (
    <section className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl shadow-slate-950/10 backdrop-blur-md" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-200">
            <span className="size-2 rounded-full bg-teal-300" aria-hidden="true" />
            Supabase workspace signal
          </div>
          <p className="mt-2 text-sm text-slate-200">
            {isLoading ? "Loading your authenticated workspace..." : error ? "Workspace data could not be read. Check your Supabase policies." : data?.authenticated ? data.tenant ? `Connected as ${data.user} in ${data.tenant.name}` : "Authenticated user is not provisioned yet" : "Sign in to load tenant data"}
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-wide ${data?.authenticated ? "border-teal-200/40 bg-teal-300 text-teal-950" : "border-white/20 bg-white/10 text-slate-200"}`}>
          {data?.authenticated ? "CONNECTED" : "AUTH REQUIRED"}
        </span>
      </div>
      {data?.counts ? (
        <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-5">
          {Object.entries(data.counts).map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-slate-950/20 p-3">
              <p className="text-[10px] capitalize text-slate-300">{label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</p>
            </div>
          ))}
        </div>
      ) : null}
      {data?.announcements?.length ? (
        <div className="mt-4 border-t border-neutral-200 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Latest announcements</p>
          <ul className="mt-2 space-y-1">
            {data.announcements.map((item: { id: string; title: string }) => <li key={item.id} className="text-[11px] text-neutral-600">{item.title}</li>)}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
