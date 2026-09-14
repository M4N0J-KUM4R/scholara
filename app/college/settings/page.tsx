"use client"

import { useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Checkbox, Field, Input, Toggle } from "@/components/ui/input"
import { ProgressBar, Stat } from "@/components/ui/stat"
import { Tabs } from "@/components/ui/tabs"
import { integrations } from "@/lib/data"

const swatches = [
  { name: "Sun", cls: "bg-sun" },
  { name: "Candy", cls: "bg-candy" },
  { name: "Sky", cls: "bg-sky" },
  { name: "Mint", cls: "bg-mint" },
  { name: "Grape", cls: "bg-grape" },
]

type PermKey = "create" | "approve" | "export"

const permRoles: { role: string; perms: Record<PermKey, boolean> }[] = [
  { role: "College Admin", perms: { create: true, approve: true, export: true } },
  { role: "HOD", perms: { create: true, approve: true, export: false } },
  { role: "Faculty", perms: { create: true, approve: false, export: false } },
  { role: "Invigilator", perms: { create: false, approve: false, export: false } },
  { role: "Auditor", perms: { create: false, approve: false, export: true } },
]

const permLabels: Record<PermKey, string> = {
  create: "Create exam",
  approve: "Approve results",
  export: "Export data",
}

export default function CollegeSettingsPage() {
  const [displayName, setDisplayName] = useState("Hindustan University")
  const [accent, setAccent] = useState(0)
  const [logoName, setLogoName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [perms, setPerms] = useState(permRoles)
  const [conn, setConn] = useState<Record<string, boolean>>(
    Object.fromEntries(integrations.map((i) => [i.id, i.connected])),
  )
  const [saved, setSaved] = useState(false)
  const timer = useRef<number | null>(null)

  function setPerm(role: string, key: PermKey, value: boolean) {
    setPerms((prev) => prev.map((r) => (r.role === role ? { ...r, perms: { ...r.perms, [key]: value } } : r)))
  }

  function save() {
    setSaved(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSaved(false), 4000)
  }

  const brandingTab = (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader title="Logo & name" tone="sunlight" />
        <CardBody className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-4 border-2 border-dashed border-ink/50 bg-paper2 p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-ink bg-sun font-display text-[16px] text-ink nb-shadow-sm">
              HU
            </div>
            <div className="flex min-w-40 flex-col gap-2">
              <p className="text-[12px] font-bold text-ink">Drop your institute logo here, or browse.</p>
              <p className="text-[10px] font-medium text-ink/50">
                {logoName ? `Selected: ${logoName}` : "PNG or SVG, at least 256×256px."}
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/svg+xml"
                className="hidden"
                onChange={(e) => setLogoName(e.target.files?.[0]?.name ?? null)}
              />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                Browse files
              </Button>
            </div>
          </div>
          <Field label="Display name" hint="Shown on student hall tickets and exported reports.">
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Accent colour" tone="candy" />
        <CardBody className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            {swatches.map((s, i) => (
              <button
                key={s.name}
                type="button"
                aria-label={`Accent colour ${s.name}`}
                aria-pressed={accent === i}
                onClick={() => setAccent(i)}
                className={`h-10 w-10 border-2 border-ink ${s.cls} nb-shadow-sm ${
                  accent === i ? "ring-2 ring-ink ring-offset-2 ring-offset-white" : ""
                }`}
              />
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink/50">
              Selected · {swatches[accent].name}
            </span>
            <div className="border-2 border-ink bg-white">
              <div className={`h-8 border-b-2 border-ink ${swatches[accent].cls}`} />
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="font-display text-[12px] text-ink">{displayName}</span>
                <Badge tone="dark">Hall ticket</Badge>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )

  const rolesTab = (
    <Card>
      <CardHeader
        title="Roles & permissions"
        tone="sky"
        action={<Badge tone="outline">5 roles · 3 capabilities</Badge>}
      />
      <CardBody className="p-0">
        <table className="w-full border-collapse text-left">
          <thead className="border-b-2 border-ink bg-paper2">
            <tr>
              <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ink/60">Role</th>
              {Object.keys(permLabels).map((k) => (
                <th key={k} className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ink/60">
                  {permLabels[k as PermKey]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {perms.map((r) => (
              <tr key={r.role} className="border-b border-ink/15 last:border-0">
                <td className="px-4 py-3 text-[12px] font-bold text-ink">{r.role}</td>
                {Object.keys(permLabels).map((k) => (
                  <td key={k} className="px-4 py-3">
                    <Checkbox
                      label={<span className="sr-only">{`${r.role} — ${permLabels[k as PermKey]}`}</span>}
                      checked={r.perms[k as PermKey]}
                      onChange={(checked) => setPerm(r.role, k as PermKey, checked)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  )

  const integrationsTab = (
    <Card>
      <CardHeader
        title="Integrations"
        tone="mint"
        action={<Badge tone="success">{Object.values(conn).filter(Boolean).length} connected</Badge>}
      />
      <CardBody className="p-0">
        {integrations.map((i, idx) => (
          <div
            key={i.id}
            className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 ${idx < integrations.length - 1 ? "border-b border-ink/15" : ""}`}
          >
            <div className="min-w-48">
              <p className="text-[12px] font-bold text-ink">{i.name}</p>
              <p className="mt-0.5 text-[11px] font-medium text-ink/55">{i.desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={conn[i.id] ? "success" : "outline"}>{conn[i.id] ? "Connected" : "Not connected"}</Badge>
              <Toggle
                checked={conn[i.id] ?? false}
                onChange={(v) => setConn((prev) => ({ ...prev, [i.id]: v }))}
                label={<span className="sr-only">{`Toggle ${i.name}`}</span>}
              />
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  )

  const billingTab = (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader title="Plan & billing" tone="grapelight" action={<Badge tone="grape">Enterprise</Badge>} />
        <CardBody className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-[15px] text-ink">Enterprise plan · Hindustan University</p>
            <p className="mt-1 text-[12px] font-medium text-ink/60">
              Billed annually · renews Jul 2027 · dedicated success manager included.
            </p>
          </div>
          <Button variant="dark">Manage plan</Button>
        </CardBody>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Stat label="Seats" value="18,240" color="bg-skylight" sub="of 20,000 included" />
        <Stat label="Exams / month" value="38 / 50" color="bg-mintlight" sub="resets Oct 01" />
      </div>

      <Card>
        <CardHeader title="Usage this cycle" tone="none" />
        <CardBody className="flex flex-col gap-4">
          <ProgressBar value={91.2} label="Seat utilization" color="bg-sky" />
          <ProgressBar value={76} label="Exam quota used" color="bg-candy" />
          <p className="text-[11px] font-medium text-ink/60">
            You are on pace to hit the 50-exam quota by Sep 29 — overage is billed at $6 per exam.
          </p>
        </CardBody>
      </Card>
    </div>
  )

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">Settings</h1>
          <p className="mt-1 text-[12px] font-medium text-ink/60">
            Institute branding, role permissions, integrations and plan usage for Hindustan University.
          </p>
        </div>
        <Badge tone="grape">Enterprise workspace</Badge>
      </div>

      <Tabs
        items={[
          { label: "Branding", content: brandingTab },
          { label: "Roles & permissions", content: rolesTab },
          { label: "Integrations", content: integrationsTab },
          { label: "Billing", content: billingTab },
        ]}
      />

      {/* Save bar */}
      <div className="nb-shadow sticky bottom-4 flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-white px-4 py-3">
        <p className="text-[12px] font-medium text-ink/60">Changes apply to Hindustan University only.</p>
        <div className="flex items-center gap-3">
          {saved ? (
            <span className="nb-shadow-sm border-2 border-ink bg-mint px-3 py-1.5 text-[11px] font-bold text-ink">
              All changes saved ✓
            </span>
          ) : null}
          <Button onClick={save}>Save changes</Button>
        </div>
      </div>
    </>
  )
}
