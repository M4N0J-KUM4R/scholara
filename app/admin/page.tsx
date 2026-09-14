"use client"

import { useState } from "react"
import { LiveDataPanel } from "@/components/live-data-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart } from "@/components/ui/charts"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Field, Input, Select, Toggle } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { ProgressBar, Stat } from "@/components/ui/stat"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import {
  featureFlags,
  platformStats,
  platformUsage,
  recentChanges,
  storageByTenant,
  tenants,
  type Tenant,
} from "@/lib/data"

const planTone = { Enterprise: "grape", Growth: "candy", Starter: "info" } as const
const statusTone = { Active: "success", Suspended: "danger", Onboarding: "warning" } as const
const statColors = ["bg-sunlight", "bg-bubblegum", "bg-skylight", "bg-mintlight"]
const barColors = ["bg-sun", "bg-candy", "bg-sky", "bg-tang"]

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function AdminDashboardPage() {
  const [rows, setRows] = useState<Tenant[]>(tenants)
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [plan, setPlan] = useState<Tenant["plan"]>("Starter")
  const [formError, setFormError] = useState("")
  const [flags, setFlags] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(featureFlags.map((f) => [f.id, f.enabled])),
  )

  function openAdd() {
    setName("")
    setAdminEmail("")
    setPlan("Starter")
    setFormError("")
    setAddOpen(true)
  }

  function createTenant() {
    if (!name.trim()) {
      setFormError("Give the tenant its official institute name.")
      return
    }
    if (!adminEmail.includes("@") || !adminEmail.includes(".")) {
      setFormError("Enter the primary admin's institute email, e.g. dean@college.edu.")
      return
    }
    const mrr = plan === "Enterprise" ? 4200 : plan === "Growth" ? 1600 : 250
    setRows((prev) => [
      ...prev,
      {
        id: `t-new-${prev.length + 1}`,
        name: name.trim(),
        slug: slugify(name),
        plan,
        users: 0,
        status: "Onboarding",
        examsThisMonth: 0,
        mrr,
      },
    ])
    setAddOpen(false)
  }

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Super Admin</p>
          <h1 className="mt-1 font-display text-xl text-ink">Platform dashboard</h1>
          <p className="mt-1 text-[13px] font-medium text-ink/60">
            Health of every institute on CollegeCloud — tenants, revenue, exams and rollout state at a glance.
          </p>
        </div>
        <Button onClick={openAdd}>+ Add tenant</Button>
      </div>

      {/* Supabase live status */}
      <LiveDataPanel />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {platformStats.map((s, i) => (
          <Stat key={s.label} label={s.label} value={s.value} delta={s.delta} color={statColors[i % statColors.length]} />
        ))}
      </div>

      {/* Tenants + feature flags */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Tenants"
            action={
              <Badge tone="outline">
                {rows.length} tenants · {rows.filter((t) => t.status === "Active").length} active
              </Badge>
            }
          />
          <CardBody className="p-0">
            <TableRoot className="border-0! shadow-none!">
              <THead>
                <tr>
                  <TH>Tenant</TH>
                  <TH>Plan</TH>
                  <TH>Users</TH>
                  <TH>Exams (mo)</TH>
                  <TH>Status</TH>
                  <TH>MRR</TH>
                  <TH className="text-right">Actions</TH>
                </tr>
              </THead>
              <TBody>
                {rows.map((t) => (
                  <TR key={t.id}>
                    <TD>
                      <span className="block font-bold text-ink">{t.name}</span>
                      <span className="text-[10px] font-medium text-ink/50">/{t.slug}</span>
                    </TD>
                    <TD>
                      <Badge tone={planTone[t.plan]}>{t.plan}</Badge>
                    </TD>
                    <TD>{t.users.toLocaleString()}</TD>
                    <TD>{t.examsThisMonth}</TD>
                    <TD>
                      <Badge tone={statusTone[t.status]}>{t.status}</Badge>
                    </TD>
                    <TD className="font-bold text-ink">${t.mrr.toLocaleString()}</TD>
                    <TD className="text-right">
                      <Button variant="outline" size="sm">
                        Manage →
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </TableRoot>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Feature flags" tone="candy" action={<Badge tone="dark">{Object.values(flags).filter(Boolean).length} on</Badge>} />
          <CardBody className="flex flex-col gap-4">
            {featureFlags.map((f) => (
              <div key={f.id} className="flex items-start justify-between gap-3 border-b-2 border-dashed border-ink/20 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-[12px] font-bold text-ink">{f.label}</p>
                  <p className="mt-0.5 text-[11px] font-medium leading-snug text-ink/60">{f.desc}</p>
                </div>
                <Toggle
                  checked={flags[f.id] ?? false}
                  onChange={(v) => setFlags((prev) => ({ ...prev, [f.id]: v }))}
                />
              </div>
            ))}
            <p className="border-2 border-ink bg-paper2 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-ink/60">
              Flags apply platform-wide on next deploy
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Usage, storage, changes */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card>
          <CardHeader title="Platform usage" tone="sky" action={<Badge tone="info">Exams run</Badge>} />
          <CardBody>
            <BarChart data={platformUsage} />
            <p className="mt-3 text-[11px] font-medium text-ink/60">
              September is the strongest month so far — midterm season added 12 exams over August.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Storage share" action={<Badge tone="outline">Of 4.2 TB pool</Badge>} />
          <CardBody className="flex flex-col gap-3.5">
            {storageByTenant.map((s, i) => (
              <ProgressBar key={s.label} label={s.label} value={s.pct} color={barColors[i % barColors.length]} />
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent changes" tone="mint" />
          <CardBody className="flex flex-col gap-4">
            {recentChanges.map((c) => (
              <div key={c.date} className="border-b-2 border-dashed border-ink/20 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-bold text-ink">{c.date}</span>
                  <Badge tone="outline">{c.who}</Badge>
                </div>
                <p className="mt-1 text-[12px] font-medium leading-snug text-ink/75">{c.text}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Add tenant modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a tenant"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createTenant}>Create tenant</Button>
          </>
        }
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            createTenant()
          }}
        >
          <Field label="Tenant name" hint="Official institute name shown across the workspace.">
            <Input
              placeholder="e.g. Ashwood University"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Primary admin email" hint="This admin gets owner permissions on the tenant.">
            <Input
              type="email"
              placeholder="dean@college.edu"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
          </Field>
          <Field label="Plan">
            <Select value={plan} onChange={(e) => setPlan(e.target.value as Tenant["plan"])}>
              <option value="Enterprise">Enterprise — $4,200/mo</option>
              <option value="Growth">Growth — $1,600/mo</option>
              <option value="Starter">Starter — $250/mo</option>
            </Select>
          </Field>
          {formError ? (
            <p role="alert" className="border-2 border-ink bg-tomato px-3 py-2 text-[11px] font-bold text-ink">
              {formError}
            </p>
          ) : null}
          <p className="border-2 border-dashed border-ink/40 bg-paper px-3 py-2 text-[11px] font-medium text-ink/60">
            New tenants start in Onboarding with zero users — import rosters from the tenant admin console.
          </p>
        </form>
      </Modal>
    </>
  )
}
