"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox, Field, Input, Select } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { roleHome, type Role } from "@/lib/data"

const roles: { value: Role; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "faculty", label: "Faculty" },
  { value: "college-admin", label: "College Admin / Exam Controller" },
  { value: "super-admin", label: "Super Admin" },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("student")
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState("")

  function signIn() {
    if (!email.includes("@")) {
      setError("Enter your institute email, e.g. you@college.edu")
      return
    }
    if (password.length < 4) {
      setError("Enter your password (any 4+ characters in this demo).")
      return
    }
    setError("")
    router.push(roleHome[role])
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative flex flex-col justify-between overflow-hidden border-b-2 border-ink bg-ink p-8 lg:border-b-0 lg:border-r-2 lg:p-12">
        <div className="flex items-center gap-3">
          <span className="nb-shadow-sun flex h-11 w-11 items-center justify-center rounded-none border-2 border-ink bg-sun font-display text-[15px] text-ink">
            CC
          </span>
          <span className="font-display text-[15px] text-white">CollegeCloud</span>
        </div>

        <div className="my-10 flex max-w-lg flex-col gap-6">
          <h1 className="font-display text-4xl leading-[1.05] text-sun lg:text-5xl">
            The operating system for college academics.
          </h1>
          <p className="text-[14px] font-medium leading-relaxed text-white/75">
            Exams, grading, departments and accreditation reports — one multi-tenant platform for
            every institute, from question bank to published result.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Exams", "Question banks", "Grading", "Analytics", "Accreditation", "Portfolios"].map((chip) => (
              <Badge key={chip} tone="dark" className="!border-white !text-white">
                {chip}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-medium text-white/50">
          <span className="border-2 border-white/30 px-2 py-1">SOC2-ready</span>
          <span className="border-2 border-white/30 px-2 py-1">NAAC / NBA exports</span>
          <span className="border-2 border-white/30 px-2 py-1">LTI 1.3</span>
        </div>

        <span aria-hidden className="pointer-events-none absolute -right-10 -bottom-10 hidden h-56 w-56 border-2 border-candy bg-candy/20 lg:block" />
        <span aria-hidden className="pointer-events-none absolute -top-8 right-24 hidden h-24 w-24 border-2 border-sun bg-sun/20 lg:block" />
      </div>

      {/* Login form */}
      <div className="flex items-center justify-center bg-paper p-6 lg:p-12">
        <div className="nb-shadow-lg w-full max-w-md border-2 border-ink bg-white">
          <div className="border-b-2 border-ink bg-sun px-6 py-4">
            <h2 className="font-display text-[18px] text-ink">Sign in to your institute</h2>
            <p className="mt-0.5 text-[11px] font-medium text-ink/60">
              Your email domain routes you to the right college automatically.
            </p>
          </div>

          <form
            className="flex flex-col gap-4 p-6"
            onSubmit={(e) => {
              e.preventDefault()
              signIn()
            }}
          >
            <Field label="Institute email">
              <Input
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Field>
            <Field label="Sign in as" hint="Demo: pick a role to explore its workspace.">
              <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="flex items-center justify-between">
              <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
              <a href="#" className="text-[11px] font-bold text-ink underline decoration-2 underline-offset-2 hover:text-tomato">
                Forgot password?
              </a>
            </div>

            {error ? (
              <p className="border-2 border-ink bg-tomato px-3 py-2 text-[11px] font-bold text-ink" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="w-full">
              Sign in →
            </Button>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">
              <span className="h-0.5 flex-1 bg-ink/20" /> or <span className="h-0.5 flex-1 bg-ink/20" />
            </div>
            <Button variant="outline" size="lg" className="w-full">
              Continue with Google SSO
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
