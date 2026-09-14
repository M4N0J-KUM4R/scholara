"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Field, Input, Textarea } from "@/components/ui/input"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"

type Project = {
  id: string
  name: string
  role: string
  link: string
  tech: string
}

const initialProjects: Project[] = [
  { id: "p1", name: "High-Throughput Distributed KV Store", role: "Lead Systems Architect", link: "https://github.com/aarav/distributed-kv", tech: "Go, Raft, gRPC" },
  { id: "p2", name: "AI Automated Proctoring Heuristics", role: "ML Engineer", link: "https://github.com/aarav/ai-proctor", tech: "Python, OpenCV, PyTorch" },
  { id: "p3", name: "CollegeCloud Neo-Brutalism UI Kit", role: "Frontend Developer", link: "https://github.com/aarav/neo-brutalism", tech: "TypeScript, Next.js, Tailwind" },
  { id: "p4", name: "POSIX Operating System Toy Kernel", role: "Systems Programmer", link: "https://github.com/aarav/os-kernel", tech: "C, Assembly x86" },
]

export default function StudentPortfolioPage() {
  const [headline, setHeadline] = useState("Computer Science Student · Systems & Distributed Architecture")
  const [about, setAbout] = useState(
    "Final-year CS student at Hindustan University passionate about low-level systems programming, distributed consensus protocols, and reactive web architecture. Actively seeking graduate engineering roles.",
  )
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Student Profile & Career</p>
          <h1 className="mt-1 font-display text-2xl text-ink">Portfolio & Resume</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            Curate your verified student portfolio, showcased projects, and career credentials.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/student/portfolio/connect">
            <Button variant="candy" size="sm">
              ★ Sync GitHub & LinkedIn →
            </Button>
          </Link>
          <Button variant="default" size="sm" onClick={handleSave}>
            {saved ? "✓ Changes Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Sync Callout */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-sunlight p-4 shadow-[3px_3px_0_#0a0a0a]">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-sun text-sm font-bold">
            ⚡
          </span>
          <div>
            <h4 className="font-display text-[13px] text-ink">Auto-Sync Your Verified Work</h4>
            <p className="text-[11px] font-medium text-ink/70">
              Connect your GitHub and LinkedIn accounts to automatically pull repositories, stars, commit activity, and verified certificates.
            </p>
          </div>
        </div>
        <Link href="/student/portfolio/connect">
          <Button variant="dark" size="sm">
            Configure Sync →
          </Button>
        </Link>
      </div>

      {/* 3 Panels Row: Photo, Headline, Resume */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Profile Photo Card */}
        <Card>
          <CardHeader title="Profile Photo" tone="candy" />
          <CardBody className="flex flex-col items-center gap-3 text-center">
            <div className="relative flex h-28 w-28 items-center justify-center border-2 border-ink bg-sun font-display text-2xl text-ink shadow-[3px_3px_0_#0a0a0a]">
              AS
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border border-ink bg-mint" />
            </div>
            <div>
              <p className="font-bold text-ink text-[13px]">Aarav Sharma</p>
              <p className="text-[11px] text-ink/60">21CSE001 · Hindustan University</p>
            </div>
            <Button variant="outline" size="sm" className="w-full justify-center">
              Upload New Photo
            </Button>
          </CardBody>
        </Card>

        {/* Headline & Bio */}
        <Card className="lg:col-span-2">
          <CardHeader title="Professional Headline & Bio" tone="sunlight" />
          <CardBody className="flex flex-col gap-4">
            <Field label="Professional Headline" hint="Appears at the top of your portfolio and exported resume.">
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Systems Engineer & Open-Source Contributor"
              />
            </Field>
            <Field label="About & Portfolio Summary" hint="Summarize your key skills, domains of interest, and achievements.">
              <Textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell recruiters about your background..."
              />
            </Field>
          </CardBody>
        </Card>
      </div>

      {/* Resume Section */}
      <Card>
        <CardHeader
          title="Master Resume (PDF)"
          tone="mint"
          action={<Badge tone="success">Verified by Dean</Badge>}
        />
        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-3 items-center">
          <div className="border-2 border-dashed border-ink bg-paper p-6 text-center flex flex-col items-center gap-2">
            <span className="text-3xl">📄</span>
            <div>
              <span className="font-bold text-ink text-[13px]">aarav_sharma_resume.pdf</span>
              <p className="text-[10px] text-ink/50">Uploaded Sep 10, 2026 · 184 KB</p>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              Replace Resume PDF
            </Button>
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <h4 className="font-display text-[13px] text-ink">Resume Visibility & Export</h4>
            <p className="text-[12px] font-medium text-ink/70 leading-relaxed">
              Your resume is linked in your public portfolio and visible to approved campus placement coordinators and visiting enterprise recruiters.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button variant="default" size="sm">
                ⭳ Download PDF
              </Button>
              <Button variant="outline" size="sm">
                Preview Resume Layout ↗
              </Button>
              <Link href="/student/portfolio/connect">
                <Button variant="ghost" size="sm">
                  Generate Resume from GitHub/LinkedIn →
                </Button>
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader
          title="Featured Academic & Independent Projects"
          tone="sky"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setProjects((p) => [
                  ...p,
                  {
                    id: `p-${p.length + 1}`,
                    name: "New Research Project",
                    role: "Contributor",
                    link: "https://github.com",
                    tech: "Rust / C++",
                  },
                ])
              }}
            >
              + Add Project
            </Button>
          }
        />
        <CardBody className="p-0">
          <TableRoot className="border-0 shadow-none">
            <THead>
              <TR>
                <TH>Project Title</TH>
                <TH>Role</TH>
                <TH>Technologies</TH>
                <TH>Repository URL</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {projects.map((proj) => (
                <TR key={proj.id}>
                  <TD className="font-bold text-ink">{proj.name}</TD>
                  <TD><Badge tone="candy">{proj.role}</Badge></TD>
                  <TD className="font-mono text-[11px] text-ink">{proj.tech}</TD>
                  <TD>
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-ink underline hover:text-tomato"
                    >
                      {proj.link.replace("https://", "")} ↗
                    </a>
                  </TD>
                  <TD className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setProjects((p) => p.filter((x) => x.id !== proj.id))}
                    >
                      Delete
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </TableRoot>
        </CardBody>
      </Card>
    </>
  )
}
