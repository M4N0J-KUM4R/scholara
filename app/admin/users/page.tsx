"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Checkbox, Field, Input, Select, Toggle } from "@/components/ui/input"
import { ProgressBar } from "@/components/ui/stat"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { tenants } from "@/lib/data"

type UserType = "Faculty" | "Student" | "HOD" | "Exam Controller"

type CreatedUser = {
  id: number
  name: string
  email: string
  type: UserType
  college: string
  when: string
}

const typeTone: Record<UserType, "info" | "success" | "grape" | "candy"> = {
  Faculty: "info",
  Student: "success",
  HOD: "grape",
  "Exam Controller": "candy",
}

const seedUsers: CreatedUser[] = [
  { id: 1, name: "Ishita Verma", email: "ishita.verma@hindustan.edu", type: "Student", college: "Hindustan University", when: "Sep 13, 09:12" },
  { id: 2, name: "Dr. Kavya Reddy", email: "kavya.reddy@hindustan.edu", type: "HOD", college: "Hindustan University", when: "Sep 12, 17:40" },
  { id: 3, name: "Rahul Menon", email: "rahul.menon@ridgeview.edu", type: "Faculty", college: "Ridgeview Institute of Technology", when: "Sep 12, 11:05" },
  { id: 4, name: "Sara Thomas", email: "sara.thomas@meridian.edu", type: "Student", college: "St. Meridian College", when: "Sep 11, 15:22" },
  { id: 5, name: "Naveen Prabhu", email: "naveen.prabhu@nova.edu", type: "Exam Controller", college: "Nova Science Academy", when: "Sep 10, 10:48" },
]

export default function UserCreationPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [userType, setUserType] = useState<UserType>("Student")
  const [college, setCollege] = useState(tenants[0].name)
  const [userId, setUserId] = useState("")
  const [sendWelcome, setSendWelcome] = useState(true)
  const [formError, setFormError] = useState("")
  const [recent, setRecent] = useState<CreatedUser[]>(seedUsers)
  const [successNote, setSuccessNote] = useState(false)

  const [fileName, setFileName] = useState<string | null>(null)
  const [importChecks, setImportChecks] = useState([true, false, false])
  const [importing, setImporting] = useState(false)
  const [importDone, setImportDone] = useState(false)

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Clear any pending timers on unmount.
  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach(clearTimeout)
  }, [])

  function createUser(e: FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Enter the user's first and last name.")
      return
    }
    if (!email.includes("@") || !email.includes(".")) {
      setFormError("Enter a valid institute email, e.g. faculty@college.edu.")
      return
    }
    setFormError("")
    setRecent((prev) => [
      {
        id: (prev[0]?.id ?? 0) + 1,
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        type: userType,
        college,
        when: "Just now",
      },
      ...prev,
    ])
    setFirstName("")
    setLastName("")
    setEmail("")
    setUserId("")
    setSuccessNote(true)
    timersRef.current.push(
      setTimeout(() => setSuccessNote(false), 3500),
    )
  }

  function startImport() {
    setImportDone(false)
    setImporting(true)
    timersRef.current.push(
      setTimeout(() => {
        setImporting(false)
        setImportDone(true)
      }, 2000),
    )
  }

  const importChecksDone = importChecks.filter(Boolean).length

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Super Admin</p>
          <h1 className="mt-1 font-display text-xl text-ink">User creation</h1>
          <p className="mt-1 text-[13px] font-medium text-ink/60">
            Provision individual accounts for any tenant, or bulk-import a full roster from a CSV export.
          </p>
        </div>
        <Badge tone="outline">{recent.length} accounts created this week</Badge>
      </div>

      {/* Create + bulk import */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Create a user" tone="sunlight" />
          <CardBody>
            <form className="flex flex-col gap-4" onSubmit={createUser}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="First name">
                  <Input placeholder="e.g. Ananya" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </Field>
                <Field label="Last name">
                  <Input placeholder="e.g. Rao" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Field>
              </div>
              <Field label="Email" hint="Must belong to an approved tenant domain.">
                <Input
                  type="email"
                  placeholder="ananya.rao@hindustan.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="User type">
                  <Select value={userType} onChange={(e) => setUserType(e.target.value as UserType)}>
                    <option value="Faculty">Faculty</option>
                    <option value="Student">Student</option>
                    <option value="HOD">HOD</option>
                    <option value="Exam Controller">Exam Controller</option>
                  </Select>
                </Field>
                <Field label="College">
                  <Select value={college} onChange={(e) => setCollege(e.target.value)}>
                    {tenants.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Field label="User ID" hint="Employee number for staff, roll number for students.">
                <Input placeholder="e.g. EMP-1042 or 21CSE016" value={userId} onChange={(e) => setUserId(e.target.value)} />
              </Field>
              <Toggle checked={sendWelcome} onChange={setSendWelcome} label="Send welcome email with sign-in instructions" />
              {formError ? (
                <p role="alert" className="border-2 border-ink bg-tomato px-3 py-2 text-[11px] font-bold text-ink">
                  {formError}
                </p>
              ) : null}
              {successNote ? (
                <p role="status" className="border-2 border-ink bg-mint px-3 py-2 text-[11px] font-bold text-ink">
                  User created and added to the tenant roster — credentials are on their way.
                </p>
              ) : null}
              <Button type="submit">Create user</Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Bulk import" tone="candy" />
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 border-2 border-dashed border-ink bg-paper px-6 py-8 text-center">
              <span aria-hidden className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-sun font-display text-[14px] nb-shadow-sm">
                ⇪
              </span>
              <p className="text-[13px] font-bold text-ink">Drop CSV with up to 5,000 rows</p>
              <p className="max-w-xs text-[11px] font-medium leading-snug text-ink/60">
                One row per user. Columns: first name, last name, email, user type, college, user ID.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setFileName(file.name)
                    setImportDone(false)
                  }
                }}
              />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Choose CSV file
              </Button>
              {fileName ? (
                <Badge tone="info">{fileName} selected</Badge>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/40">No file selected yet</span>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Pre-flight validation</p>
              {[
                "Header row matches the bulk-import template",
                "One row per user — emails are unique",
                "User types use accepted values (faculty, student, hod, exam-controller)",
              ].map((item, i) => (
                <Checkbox
                  key={item}
                  label={item}
                  checked={importChecks[i]}
                  onChange={(v) => setImportChecks((prev) => prev.map((c, j) => (j === i ? v : c)))}
                />
              ))}
            </div>

            {importing ? (
              <ProgressBar value={100} color="nb-stripe animate-pulse" height="h-5" />
            ) : null}
            {importDone ? (
              <p role="status" className="flex items-center gap-2 border-2 border-ink bg-mintlight px-3 py-2">
                <Badge tone="success">Import complete</Badge>
                <span className="text-[11px] font-bold text-ink">
                  {fileName ? `${fileName}` : "roster.csv"} — 5,000 users queued for provisioning.
                </span>
              </p>
            ) : null}

            <Button onClick={startImport} disabled={importing}>
              {importing ? "Importing…" : "Start import"}
            </Button>
            <p className="text-[10px] font-medium text-ink/50">
              {importChecksDone}/3 validation checks confirmed — rows failing validation land in the exceptions report.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Recently created */}
      <Card>
        <CardHeader title="Recently created users" action={<Badge tone="outline">Newest first</Badge>} />
        <CardBody className="p-0">
          <TableRoot className="border-0! shadow-none!">
            <THead>
              <tr>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Type</TH>
                <TH>College</TH>
                <TH>Created</TH>
              </tr>
            </THead>
            <TBody>
              {recent.map((u) => (
                <TR key={u.id}>
                  <TD className="font-bold text-ink">{u.name}</TD>
                  <TD>{u.email}</TD>
                  <TD>
                    <Badge tone={typeTone[u.type]}>{u.type}</Badge>
                  </TD>
                  <TD>{u.college}</TD>
                  <TD>{u.when}</TD>
                </TR>
              ))}
            </TBody>
          </TableRoot>
        </CardBody>
      </Card>
    </>
  )
}
