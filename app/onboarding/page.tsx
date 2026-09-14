"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Field, Input, Select, Toggle } from "@/components/ui/input"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"

const steps = [
  "Create Tenant",
  "Add Departments",
  "Import Faculty",
  "Import Students",
  "Configure Settings",
  "Review & Launch",
]

export default function OnboardingWizardPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [launched, setLaunched] = useState(false)

  // Step 1: Tenant Details
  const [collegeName, setCollegeName] = useState("Nova Science Academy")
  const [shortCode, setShortCode] = useState("NSA")
  const [domain, setDomain] = useState("nova.collegecloud.edu")
  const [adminEmail, setAdminEmail] = useState("dean@nova.edu")
  const [adminName, setAdminName] = useState("Dr. Rajiv Malhotra")
  const [plan, setPlan] = useState("Enterprise")
  const [billing, setBilling] = useState("Annual (15% discount)")

  // Step 2: Departments
  const [deptList, setDeptList] = useState([
    { id: 1, name: "Computer Science & Engineering", code: "CSE", hod: "hod.cse@nova.edu" },
    { id: 2, name: "Artificial Intelligence & Data", code: "AIDS", hod: "hod.ai@nova.edu" },
    { id: 3, name: "Mechanical & Robotics", code: "MERO", hod: "hod.mech@nova.edu" },
    { id: 4, name: "Bioengineering & Nanotech", code: "BENT", hod: "hod.bio@nova.edu" },
  ])

  // Step 5: Settings
  const [primaryColor, setPrimaryColor] = useState("#FFDC58")
  const [gradingScheme, setGradingScheme] = useState("GPA")
  const [integrations, setIntegrations] = useState({
    sso: true,
    sis: true,
    proctoring: true,
    github: true,
  })

  const nextStep = () => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))
  const prevStep = () => setCurrentStep((s) => Math.max(0, s - 1))

  const addDepartmentRow = () => {
    setDeptList((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: "New Department",
        code: "DEPT",
        hod: "hod@nova.edu",
      },
    ])
  }

  const removeDept = (id: number) => {
    setDeptList((prev) => prev.filter((d) => d.id !== id))
  }

  if (launched) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <div className="w-full max-w-lg border-2 border-ink bg-white p-8 shadow-[8px_8px_0_#ffdc58] text-center flex flex-col items-center gap-5">
          <span className="flex h-16 w-16 items-center justify-center border-2 border-ink bg-mint text-3xl font-bold shadow-[3px_3px_0_#0a0a0a]">
            ✓
          </span>
          <div>
            <Badge tone="dark">Setup Complete · Tenant Live</Badge>
            <h1 className="mt-2 font-display text-2xl text-ink">Welcome to {collegeName}!</h1>
            <p className="mt-2 text-[13px] font-medium leading-relaxed text-ink/75">
              CollegeCloud has provisioned the dedicated tenant workspace at <strong>{domain}</strong>. Onboarding invitations and login credentials have been dispatched to {adminEmail} and all imported faculty and student accounts.
            </p>
          </div>
          <div className="w-full border-2 border-ink bg-paper2 p-4 text-left text-[12px] space-y-1 font-mono">
            <div><strong>Tenant Slug:</strong> nova-science</div>
            <div><strong>Approved Domain:</strong> @nova.edu</div>
            <div><strong>Plan Tier:</strong> Enterprise (Unlimited Proctored Exams)</div>
            <div><strong>Active Departments:</strong> {deptList.length}</div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Link href="/admin/tenants" className="w-full">
              <Button variant="default" size="lg" className="w-full justify-center">
                Return to Super Admin Console →
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" size="md" className="w-full justify-center">
                Test Tenant Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Chrome Top Bar */}
      <header className="flex items-center justify-between border-b-2 border-ink bg-white px-6 py-3 shadow-[0_2px_0_#0a0a0a]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-sun font-display text-xs text-ink shadow-[2px_2px_0_#0a0a0a]">
            CC
          </span>
          <span className="font-display text-[14px] text-ink">CollegeCloud Setup Wizard</span>
          <Badge tone="dark">Super Admin Setup</Badge>
        </div>
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            Exit Wizard
          </Button>
        </Link>
      </header>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-6 border-b-2 border-ink bg-white">
        {steps.map((label, idx) => {
          const isCurrent = idx === currentStep
          const isDone = idx < currentStep
          return (
            <div
              key={label}
              className={`flex items-center gap-2 p-3 border-r-2 border-ink last:border-r-0 transition-all ${
                isCurrent
                  ? "bg-sun text-ink font-bold shadow-[inset_0_-3px_0_#0a0a0a]"
                  : isDone
                  ? "bg-mint text-ink font-medium"
                  : "bg-paper text-ink/50"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center border border-ink text-[10px] font-bold ${
                  isDone ? "bg-ink text-white" : isCurrent ? "bg-white text-ink" : "bg-transparent text-ink/40"
                }`}
              >
                {isDone ? "✓" : idx + 1}
              </span>
              <span className="text-[11px] truncate">{label}</span>
            </div>
          )
        })}
      </div>

      {/* Wizard Main Container */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full flex flex-col gap-6">
        {currentStep === 0 ? (
          /* Step 1: Create Tenant Details */
          <Card>
            <CardHeader
              title="Step 1 of 6: Institutional Tenant Details"
              tone="sunlight"
              action={<Badge tone="dark">Core Configuration</Badge>}
            />
            <CardBody className="flex flex-col gap-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="College / Institute Name *">
                  <Input value={collegeName} onChange={(e) => setCollegeName(e.target.value)} />
                </Field>
                <Field label="Short Code / Acronym *">
                  <Input value={shortCode} onChange={(e) => setShortCode(e.target.value)} />
                </Field>
                <Field label="Custom Domain Address *">
                  <Input value={domain} onChange={(e) => setDomain(e.target.value)} />
                </Field>
                <Field label="Primary Admin Email *">
                  <Input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                </Field>
                <Field label="Admin Full Name *">
                  <Input value={adminName} onChange={(e) => setAdminName(e.target.value)} />
                </Field>
                <Field label="Subscription Plan Tier">
                  <Select value={plan} onChange={(e) => setPlan(e.target.value)}>
                    <option value="Enterprise">Enterprise ($4,200/mo)</option>
                    <option value="Growth">Growth ($1,600/mo)</option>
                    <option value="Starter">Starter ($250/mo)</option>
                  </Select>
                </Field>
                <Field label="Billing Cadence">
                  <Select value={billing} onChange={(e) => setBilling(e.target.value)}>
                    <option value="Annual (15% discount)">Annual (15% discount)</option>
                    <option value="Monthly">Monthly</option>
                  </Select>
                </Field>
              </div>
              <p className="border border-dashed border-ink bg-paper p-3 text-[11px] font-medium text-ink/70 mt-2">
                ℹ An invite will be dispatched automatically to the admin email address upon tenant initialization.
              </p>
            </CardBody>
          </Card>
        ) : currentStep === 1 ? (
          /* Step 2: Add Departments */
          <Card>
            <CardHeader
              title="Step 2 of 6: Configure Departments & Schools"
              tone="mint"
              action={
                <Button variant="outline" size="sm" onClick={addDepartmentRow}>
                  + Add Row
                </Button>
              }
            />
            <CardBody className="flex flex-col gap-4 p-0">
              <TableRoot className="border-0 shadow-none">
                <THead>
                  <TR>
                    <TH>Department Name</TH>
                    <TH>Code</TH>
                    <TH>HOD Email (Optional)</TH>
                    <TH className="text-right">Action</TH>
                  </TR>
                </THead>
                <TBody>
                  {deptList.map((d, idx) => (
                    <TR key={d.id}>
                      <TD>
                        <input
                          type="text"
                          value={d.name}
                          onChange={(e) => {
                            const val = e.target.value
                            setDeptList((prev) => prev.map((item, i) => (i === idx ? { ...item, name: val } : item)))
                          }}
                          className="h-8 w-full border border-ink bg-white px-2 text-[12px] font-bold focus:outline-none"
                        />
                      </TD>
                      <TD>
                        <input
                          type="text"
                          value={d.code}
                          onChange={(e) => {
                            const val = e.target.value
                            setDeptList((prev) => prev.map((item, i) => (i === idx ? { ...item, code: val } : item)))
                          }}
                          className="h-8 w-24 border border-ink bg-white px-2 font-mono text-[12px] font-bold focus:outline-none"
                        />
                      </TD>
                      <TD>
                        <input
                          type="email"
                          value={d.hod}
                          onChange={(e) => {
                            const val = e.target.value
                            setDeptList((prev) => prev.map((item, i) => (i === idx ? { ...item, hod: val } : item)))
                          }}
                          className="h-8 w-full border border-ink bg-white px-2 text-[12px] focus:outline-none"
                        />
                      </TD>
                      <TD className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => removeDept(d.id)}>
                          ✕
                        </Button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </TableRoot>
              <div className="p-4 border-t-2 border-ink flex justify-between items-center bg-paper">
                <span className="text-[11px] text-ink/60">Departments can also be modified or imported via CSV later.</span>
                <Button variant="outline" size="sm">
                  ⇪ Import from CSV
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : currentStep === 2 ? (
          /* Step 3: Import Faculty */
          <Card>
            <CardHeader title="Step 3 of 6: Import Faculty Roster" tone="candy" action={<Badge tone="outline">Step 3</Badge>} />
            <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="flex flex-col gap-3">
                <Button variant="outline" size="sm" className="w-fit">
                  ⭳ Download Faculty CSV Template
                </Button>
                <div className="border-2 border-dashed border-ink bg-paper p-8 text-center flex flex-col items-center gap-2">
                  <span className="text-3xl">📥</span>
                  <p className="font-bold text-[13px]">Drop Faculty CSV File Here</p>
                  <p className="text-[10px] text-ink/60">Maximum 5,000 rows per batch</p>
                </div>
                <div className="border-2 border-ink bg-white p-3 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>Upload Progress</span>
                    <span className="text-mint">100% Processed</span>
                  </div>
                  <div className="h-3 border border-ink bg-paper">
                    <div className="h-full bg-mint w-full" />
                  </div>
                  <p className="text-[10px] text-ink/60">24 faculty records parsed and validated.</p>
                </div>
              </div>

              <div className="border-2 border-ink bg-white p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                  <span className="font-bold text-[12px]">Validation Preview</span>
                  <Badge tone="success">24 Valid · 0 Errors</Badge>
                </div>
                <div className="space-y-2 text-[11px] max-h-56 overflow-y-auto">
                  {["Dr. Ananya Rao (ananya.rao@nova.edu) · CSE HOD", "Prof. Rahul Menon (rahul.menon@nova.edu) · Associate", "Dr. Sneha Iyer (sneha.iyer@nova.edu) · Assistant", "Dr. Vikram Shetty (vikram.s@nova.edu) · ECE HOD"].map((row, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-1">
                      <span>{row}</span>
                      <Badge tone="success">Valid</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        ) : currentStep === 3 ? (
          /* Step 4: Import Students */
          <Card>
            <CardHeader title="Step 4 of 6: Import Student Directory" tone="sky" action={<Badge tone="outline">Step 4</Badge>} />
            <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="flex flex-col gap-3">
                <Button variant="outline" size="sm" className="w-fit">
                  ⭳ Download Student CSV Template
                </Button>
                <div className="border-2 border-dashed border-ink bg-paper p-8 text-center flex flex-col items-center gap-2">
                  <span className="text-3xl">📥</span>
                  <p className="font-bold text-[13px]">Drop Student CSV File Here</p>
                  <p className="text-[10px] text-ink/60">Maximum 5,000 rows per batch</p>
                </div>
                <div className="border-2 border-ink bg-white p-3 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>Processing Status</span>
                    <span className="text-mint">140 / 140 Ready</span>
                  </div>
                  <div className="h-3 border border-ink bg-paper">
                    <div className="h-full bg-sun w-full" />
                  </div>
                  <p className="text-[10px] text-ink/60">Cohort 2021–2025 parsed successfully.</p>
                </div>
              </div>

              <div className="border-2 border-ink bg-white p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                  <span className="font-bold text-[12px]">Sample Import Rows</span>
                  <Badge tone="success">140 Valid</Badge>
                </div>
                <div className="space-y-2 text-[11px] max-h-56 overflow-y-auto">
                  {["Aarav Sharma · 21CSE001 · 2021–25 A", "Diya Patel · 21CSE002 · 2021–25 A", "Rohan Gupta · 21CSE003 · 2021–25 A", "Ishita Verma · 21CSE004 · 2021–25 A"].map((row, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-1">
                      <span>{row}</span>
                      <Badge tone="success">Verified</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        ) : currentStep === 4 ? (
          /* Step 5: Configure Settings */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Institutional Branding" tone="sunlight" />
              <CardBody className="flex flex-col gap-4 p-5">
                <Field label="Display Brand Name">
                  <Input value={collegeName} onChange={(e) => setCollegeName(e.target.value)} />
                </Field>
                <div>
                  <span className="text-[11px] font-bold uppercase text-ink/70">Accent Palette</span>
                  <div className="flex gap-2 mt-2">
                    {["#FFDC58", "#FF90E8", "#90A8ED", "#B1F3A8", "#FF9B6A"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setPrimaryColor(c)}
                        className={`h-8 w-8 border-2 border-ink ${primaryColor === c ? "ring-2 ring-ink" : ""}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-ink/70">Grading Scheme</span>
                  <div className="flex gap-2 mt-2">
                    {(["Percentage", "GPA", "Letter Grade"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGradingScheme(g)}
                        className={`border-2 px-3 py-1 text-[11px] font-bold ${
                          gradingScheme === g ? "border-ink bg-sun text-ink shadow-[2px_2px_0_#0a0a0a]" : "bg-white"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Platform Integrations" tone="mint" />
              <CardBody className="flex flex-col gap-3 p-5">
                {[
                  { key: "sso", label: "Single Sign-On (SSO SAML/OIDC)" },
                  { key: "sis", label: "SIS / ERP Nightly Sync" },
                  { key: "proctoring", label: "Automated Proctoring Suite" },
                  { key: "github", label: "GitHub & LinkedIn Student Sync" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between border-2 border-ink bg-white p-3">
                    <span className="text-[12px] font-bold text-ink">{item.label}</span>
                    <Toggle
                      checked={integrations[item.key as keyof typeof integrations]}
                      onChange={(v) =>
                        setIntegrations((prev) => ({ ...prev, [item.key]: v }))
                      }
                    />
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        ) : (
          /* Step 6: Review & Launch */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Tenant Configuration Summary" tone="sunlight" />
              <CardBody className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div className="border border-ink bg-paper p-2">
                    <span className="text-[10px] uppercase font-bold text-ink/60">Tenant Name</span>
                    <p className="font-bold text-ink">{collegeName}</p>
                  </div>
                  <div className="border border-ink bg-paper p-2">
                    <span className="text-[10px] uppercase font-bold text-ink/60">Short Code</span>
                    <p className="font-bold text-ink">{shortCode}</p>
                  </div>
                  <div className="border border-ink bg-paper p-2">
                    <span className="text-[10px] uppercase font-bold text-ink/60">Domain</span>
                    <p className="font-bold text-ink">{domain}</p>
                  </div>
                  <div className="border border-ink bg-paper p-2">
                    <span className="text-[10px] uppercase font-bold text-ink/60">Subscription</span>
                    <p className="font-bold text-ink">{plan}</p>
                  </div>
                  <div className="border border-ink bg-paper p-2">
                    <span className="text-[10px] uppercase font-bold text-ink/60">Departments</span>
                    <p className="font-bold text-ink">{deptList.length} Active</p>
                  </div>
                  <div className="border border-ink bg-paper p-2">
                    <span className="text-[10px] uppercase font-bold text-ink/60">Primary Admin</span>
                    <p className="font-bold text-ink">{adminEmail}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Pre-Flight Readiness Checklist" tone="mint" />
              <CardBody className="flex flex-col gap-3 p-5">
                {[
                  "Tenant workspace created and partitioned",
                  "Academic departments registered and codes verified",
                  "Faculty member credentials staged for dispatch",
                  "Student roster validated against enrollment bounds",
                  "Branding swatches and grading schema applied",
                  "Proctoring engine and SSO endpoints ready",
                ].map((c) => (
                  <div key={c} className="flex items-center gap-2 text-[12px] font-bold text-ink">
                    <span className="text-mint text-base font-display">✓</span>
                    <span>{c}</span>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#0a0a0a]">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            ← Back
          </Button>
          <span className="text-[12px] font-bold text-ink/60">
            Step {currentStep + 1} of {steps.length}
          </span>
          {currentStep < steps.length - 1 ? (
            <Button variant="default" onClick={nextStep}>
              Next Step →
            </Button>
          ) : (
            <Button variant="danger" size="lg" onClick={() => setLaunched(true)}>
              🚀 Launch CollegeCloud Tenant!
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
