"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox, Field, Input, Select } from "@/components/ui/input"
import { Donut } from "@/components/ui/charts"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/avatar"
import { ProgressBar } from "@/components/ui/stat"
import { Modal } from "@/components/ui/modal"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { tenants, type Tenant } from "@/lib/data"

const planTone = { Enterprise: "grape", Growth: "candy", Starter: "info" } as const
const statusTone = { Active: "success", Suspended: "danger", Onboarding: "warning" } as const
const planPrices: Record<Tenant["plan"], number> = { Enterprise: 4200, Growth: 1600, Starter: 250 }

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function TenantsPage() {
  const [rows, setRows] = useState<Tenant[]>(tenants)
  const [planFilter, setPlanFilter] = useState<"All" | Tenant["plan"]>("All")
  const [query, setQuery] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [plan, setPlan] = useState<Tenant["plan"]>("Starter")
  const [formError, setFormError] = useState("")
  const [checklist, setChecklist] = useState([true, true, false])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter(
      (t) =>
        (planFilter === "All" || t.plan === planFilter) &&
        (q === "" || t.name.toLowerCase().includes(q) || t.slug.includes(q)),
    )
  }, [rows, planFilter, query])

  const planCounts = useMemo(
    () => ({
      Enterprise: rows.filter((t) => t.plan === "Enterprise").length,
      Growth: rows.filter((t) => t.plan === "Growth").length,
      Starter: rows.filter((t) => t.plan === "Starter").length,
    }),
    [rows],
  )
  const enterpriseShare = rows.length ? Math.round((planCounts.Enterprise / rows.length) * 100) : 0
  const doneSteps = checklist.filter(Boolean).length

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
      setFormError("Enter the primary admin's institute email, e.g. registrar@college.edu.")
      return
    }
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
        mrr: planPrices[plan],
      },
    ])
    setAddOpen(false)
  }

  function toggleStatus(id: string) {
    setRows((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "Suspended" ? "Active" : "Suspended" } : t)),
    )
  }

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Super Admin</p>
          <h1 className="mt-1 font-display text-xl text-ink">Tenants</h1>
          <p className="mt-1 text-[13px] font-medium text-ink/60">
            Every institute on the platform — provision new tenants, change plans and suspend delinquent accounts.
          </p>
        </div>
        <Button onClick={openAdd}>+ Add tenant</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Plan" className="w-44">
          <Select value={planFilter} onChange={(e) => setPlanFilter(e.target.value as typeof planFilter)}>
            <option value="All">All plans</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Growth">Growth</option>
            <option value="Starter">Starter</option>
          </Select>
        </Field>
        <Field label="Search" className="w-72" hint="Matches tenant name or slug.">
          <Input
            type="search"
            placeholder="Search tenants…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Field>
        <Badge tone="outline" className="mb-1">
          {filtered.length} of {rows.length} shown
        </Badge>
      </div>

      {/* Directory table */}
      {filtered.length > 0 ? (
        <TableRoot>
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
            {filtered.map((t) => (
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
                  {t.status === "Suspended" ? (
                    <Button variant="outline" size="sm" onClick={() => toggleStatus(t.id)}>
                      Activate
                    </Button>
                  ) : (
                    <Button variant="danger" size="sm" onClick={() => toggleStatus(t.id)}>
                      Suspend
                    </Button>
                  )}
                </TD>
              </TR>
            ))}
          </TBody>
        </TableRoot>
      ) : (
        <EmptyState
          icon="⌕"
          title={`No tenants match “${query || planFilter}”`}
          body="Nothing in the directory matches the current search and plan filter. Clear them to see all 5 tenants again."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("")
                setPlanFilter("All")
              }}
            >
              Clear filters
            </Button>
          }
        />
      )}

      {/* Plan mix + onboarding */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Plan distribution" tone="sky" action={<Badge tone="info">{rows.length} tenants</Badge>} />
          <CardBody className="flex flex-wrap items-center justify-around gap-6">
            <Donut value={enterpriseShare} color="#c4a1ff" label="Enterprise share" caption="Enterprise share" />
            <div className="flex flex-col gap-2.5">
              {(
                [
                  ["Enterprise", "grape"],
                  ["Growth", "candy"],
                  ["Starter", "info"],
                ] as const
              ).map(([p, tone]) => (
                <div key={p} className="flex items-center justify-between gap-6 border-2 border-ink bg-white px-3 py-1.5 nb-shadow-sm">
                  <Badge tone={tone}>{p}</Badge>
                  <span className="text-[12px] font-bold text-ink">
                    {planCounts[p]} · {rows.length ? Math.round((planCounts[p] / rows.length) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Onboarding checklist"
            tone="mint"
            action={<Badge tone="success">{doneSteps}/3 done</Badge>}
          />
          <CardBody className="flex flex-col gap-4">
            <ProgressBar value={(doneSteps / 3) * 100} color="bg-mint" label="Standard rollout progress" />
            {[
              "Verify institute domain ownership (DNS TXT record)",
              "Bulk-import users from the SIS export",
              "Publish the first exam window",
            ].map((step, i) => (
              <Checkbox
                key={step}
                label={
                  <span>
                    <span className="font-bold text-ink">Step {i + 1} — </span>
                    {step}
                  </span>
                }
                checked={checklist[i]}
                onChange={(v) => setChecklist((prev) => prev.map((c, j) => (j === i ? v : c)))}
              />
            ))}
            <p className="border-2 border-ink bg-paper2 px-2.5 py-1.5 text-[11px] font-medium text-ink/60">
              All three steps gate go-live. Nova Science Academy is the only tenant still in Onboarding.
            </p>
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
            <Input placeholder="e.g. Ashwood University" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Primary admin email" hint="This admin gets owner permissions on the tenant.">
            <Input
              type="email"
              placeholder="registrar@college.edu"
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
        </form>
      </Modal>
    </>
  )
}
