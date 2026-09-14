"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Checkbox, Field, Input, Select, Toggle } from "@/components/ui/input"
import { Stat } from "@/components/ui/stat"
import { Tabs } from "@/components/ui/tabs"
import { recentChanges } from "@/lib/data"

const defaults = {
  workspaceName: "CollegeCloud",
  displayName: "CollegeCloud Platform",
  domains: ["@hindustan.edu", "@ridgeview.edu", "@nova.edu"],
  ssoEnforced: true,
  sessionLength: "24 hours",
  twoFa: false,
  passwordPolicy: [true, true, false],
}

export default function PlatformSettingsPage() {
  const [workspaceName, setWorkspaceName] = useState(defaults.workspaceName)
  const [displayName, setDisplayName] = useState(defaults.displayName)
  const [domains, setDomains] = useState<string[]>(defaults.domains)
  const [domainInput, setDomainInput] = useState("")
  const [domainError, setDomainError] = useState("")
  const [ssoEnforced, setSsoEnforced] = useState(defaults.ssoEnforced)
  const [sessionLength, setSessionLength] = useState(defaults.sessionLength)
  const [twoFa, setTwoFa] = useState(defaults.twoFa)
  const [passwordPolicy, setPasswordPolicy] = useState<boolean[]>(defaults.passwordPolicy)
  const [saved, setSaved] = useState(false)

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach(clearTimeout)
  }, [])

  function addDomain() {
    const d = domainInput.trim().toLowerCase()
    if (!d.startsWith("@") || !d.includes(".")) {
      setDomainError("Use the full domain including @, e.g. @college.edu.")
      return
    }
    if (domains.includes(d)) {
      setDomainError("That domain is already approved.")
      return
    }
    setDomainError("")
    setDomains((prev) => [...prev, d])
    setDomainInput("")
  }

  function discard() {
    setWorkspaceName(defaults.workspaceName)
    setDisplayName(defaults.displayName)
    setDomains(defaults.domains)
    setDomainInput("")
    setDomainError("")
    setSsoEnforced(defaults.ssoEnforced)
    setSessionLength(defaults.sessionLength)
    setTwoFa(defaults.twoFa)
    setPasswordPolicy(defaults.passwordPolicy)
    setSaved(false)
  }

  function save() {
    setSaved(true)
    timersRef.current.push(setTimeout(() => setSaved(false), 2000))
  }

  const branding = (
    <Card>
      <CardHeader title="Branding" tone="sunlight" />
      <CardBody className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-5 border-2 border-dashed border-ink bg-paper px-5 py-6">
          <span
            aria-hidden
            className="nb-shadow-sm flex h-16 w-16 items-center justify-center border-2 border-ink bg-sun font-display text-[20px] text-ink"
          >
            CC
          </span>
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-bold text-ink">Workspace logo</p>
            <p className="max-w-sm text-[11px] font-medium leading-snug text-ink/60">
              PNG or SVG, at least 128×128 with 2px of padding. Replaces the CC mark across every tenant dashboard.
            </p>
            <div>
              <Button variant="outline" size="sm">
                Upload logo
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Workspace name" hint="Internal name used in URLs and API responses.">
            <Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
          </Field>
          <Field label="Display name" hint="Shown in the sidebar, emails and exam papers.">
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </Field>
        </div>
      </CardBody>
    </Card>
  )

  const identity = (
    <Card>
      <CardHeader title="Identity" tone="sky" />
      <CardBody className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Approved email domains</p>
          <p className="text-[12px] font-medium text-ink/60">
            Sign-ups are only accepted from these domains. SSO-mapped tenants are matched automatically.
          </p>
          <div className="flex flex-wrap gap-2">
            {domains.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-2 border-2 border-ink bg-paper2 px-2.5 py-1 text-[11px] font-bold text-ink nb-shadow-sm"
              >
                {d}
                <button
                  type="button"
                  aria-label={`Remove ${d}`}
                  onClick={() => setDomains((prev) => prev.filter((x) => x !== d))}
                  className="nb-focus text-[12px] font-bold leading-none text-ink/60 hover:text-tomato"
                >
                  ✕
                </button>
              </span>
            ))}
            {domains.length === 0 ? (
              <span className="text-[11px] font-bold text-tomato">No approved domains — password sign-ups are blocked.</span>
            ) : null}
          </div>
          <form
            className="flex items-start gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              addDomain()
            }}
          >
            <Field className="w-64" error={domainError || undefined}>
              <Input
                placeholder="@college.edu"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
              />
            </Field>
            <Button type="submit">Add domain</Button>
          </form>
        </div>
        <div className="flex items-center justify-between gap-4 border-t-2 border-dashed border-ink/20 pt-4">
          <div>
            <p className="text-[12px] font-bold text-ink">SSO enforced</p>
            <p className="mt-0.5 max-w-md text-[11px] font-medium leading-snug text-ink/60">
              Require sign-in through the institute identity provider. Password login is disabled for users on approved domains.
            </p>
          </div>
          <Toggle checked={ssoEnforced} onChange={setSsoEnforced} />
        </div>
      </CardBody>
    </Card>
  )

  const security = (
    <Card>
      <CardHeader title="Security" tone="mint" />
      <CardBody className="flex flex-col gap-5">
        <Field label="Session length" hint="Applies to web and kiosk sessions across all tenants.">
          <Select value={sessionLength} onChange={(e) => setSessionLength(e.target.value)} className="max-w-xs">
            <option value="8 hours">8 hours — exam-day kiosks</option>
            <option value="24 hours">24 hours — recommended</option>
            <option value="7 days">7 days — faculty convenience</option>
            <option value="30 days">30 days — student tablets</option>
          </Select>
        </Field>
        <div className="flex items-center justify-between gap-4 border-y-2 border-dashed border-ink/20 py-4">
          <div>
            <p className="text-[12px] font-bold text-ink">2FA enforcement</p>
            <p className="mt-0.5 max-w-md text-[11px] font-medium leading-snug text-ink/60">
              Require a second factor for HODs, exam controllers and platform admins. Students are exempt.
            </p>
          </div>
          <Toggle checked={twoFa} onChange={setTwoFa} />
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Password policy</p>
          {[
            "Minimum 12 characters",
            "Require at least one symbol and one number",
            "Block reuse of the last 5 passwords",
          ].map((rule, i) => (
            <Checkbox
              key={rule}
              label={rule}
              checked={passwordPolicy[i]}
              onChange={(v) => setPasswordPolicy((prev) => prev.map((c, j) => (j === i ? v : c)))}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  )

  const activity = (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Logins today" value="2,318" delta={{ dir: "up", text: "6.1%" }} color="bg-sunlight" />
        <Stat label="API calls (24h)" value="1.2M" delta={{ dir: "flat", text: "steady" }} color="bg-bubblegum" />
        <Stat label="Open incidents" value="0" sub="All clear since Sep 06" color="bg-mintlight" />
      </div>
      <Card>
        <CardHeader title="Recent changes" tone="none" action={<Badge tone="outline">Audit trail</Badge>} />
        <CardBody className="flex flex-col gap-4">
          {recentChanges.map((c) => (
            <div key={c.date} className="flex items-start justify-between gap-3 border-b-2 border-dashed border-ink/20 pb-4 last:border-0 last:pb-0">
              <div>
                <span className="text-[12px] font-bold text-ink">{c.date}</span>
                <p className="mt-0.5 text-[12px] font-medium leading-snug text-ink/75">{c.text}</p>
              </div>
              <Badge tone="outline">{c.who}</Badge>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  )

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Super Admin</p>
          <h1 className="mt-1 font-display text-xl text-ink">Platform settings</h1>
          <p className="mt-1 text-[13px] font-medium text-ink/60">
            Workspace-wide branding, identity and security policy — changes apply to every tenant after you save.
          </p>
        </div>
        <Badge tone="warning">Auto-save off — review before saving</Badge>
      </div>

      <Tabs
        items={[
          { label: "Branding", content: branding },
          { label: "Identity", content: identity },
          { label: "Security", content: security },
          { label: "Activity", content: activity },
        ]}
      />

      {/* Spacer so the sticky footer never covers the last card */}
      <div className="h-2" />

      {/* Sticky action footer */}
      <div className="sticky bottom-0 z-30 -mx-5 -mb-5 mt-auto flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink bg-paper px-5 py-3 md:-mx-6 md:-mb-6 md:px-6">
        <p className="text-[11px] font-medium text-ink/60">
          Applies to all 5 tenants · last saved by M. Kumar on Sep 08, 16:20
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {saved ? (
            <p role="status" className="border-2 border-ink bg-mint px-3 py-1.5 text-[11px] font-bold text-ink nb-shadow-sm">
              Settings saved — every tenant workspace has been notified.
            </p>
          ) : null}
          <Button variant="ghost" onClick={discard}>
            Discard
          </Button>
          <Button onClick={save}>Save changes</Button>
        </div>
      </div>
    </>
  )
}
