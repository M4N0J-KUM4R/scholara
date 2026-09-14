"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Checkbox, Select, Toggle } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { githubRepos } from "@/lib/data"

export default function GitHubLinkedInConnectPage() {
  const [githubConnected, setGithubConnected] = useState(true)
  const [linkedinConnected, setLinkedinConnected] = useState(true)
  const [modalProvider, setModalProvider] = useState<"GitHub" | "LinkedIn" | null>(null)
  const [previewTab, setPreviewTab] = useState<"GitHub" | "LinkedIn" | "Combined">("GitHub")
  const [visibility, setVisibility] = useState("Everyone in Hindustan University")
  const [repos, setRepos] = useState(githubRepos)
  const [privacySaved, setPrivacySaved] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [resumeTemplate, setResumeTemplate] = useState("Modern Brutalist")
  const [generatingResume, setGeneratingResume] = useState(false)
  const [resumeReady, setResumeReady] = useState(false)

  const toggleRepoVisibility = (index: number) => {
    setRepos((prev) =>
      prev.map((r, i) => (i === index ? { ...r, isPublic: !r.isPublic } : r)),
    )
  }

  const triggerSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 800)
  }

  const generatePdf = () => {
    setGeneratingResume(true)
    setTimeout(() => {
      setGeneratingResume(false)
      setResumeReady(true)
    }, 1000)
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/student/portfolio" className="text-[11px] font-bold text-ink underline">
              ← Back to Portfolio
            </Link>
          </div>
          <h1 className="mt-1 font-display text-2xl text-ink">Connect Your External Accounts</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            Secure OAuth sync for verified open source contributions, repositories, and professional achievements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="success">🔒 SOC2 & Privacy First</Badge>
          <Button variant="outline" size="sm" onClick={triggerSync} disabled={syncing}>
            {syncing ? "Syncing APIs…" : "↻ Re-sync Now"}
          </Button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* GitHub Account Card */}
        <div className="border-2 border-ink bg-white p-5 shadow-[4px_4px_0_#0a0a0a]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-ink text-white font-bold text-lg shadow-[2px_2px_0_#ffdc58]">
                GH
              </span>
              <div>
                <h3 className="font-display text-[15px] text-ink">GitHub</h3>
                <p className="text-[11px] text-ink/60">
                  {githubConnected ? "@aarav-sharma · Connected" : "Not connected"}
                </p>
              </div>
            </div>
            <Badge tone={githubConnected ? "success" : "outline"}>
              {githubConnected ? "● Connected" : "Disconnected"}
            </Badge>
          </div>

          {githubConnected ? (
            <div className="mt-4 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="border border-ink bg-paper2 p-2">
                  <span className="block font-display text-base text-ink">6</span>
                  <span className="text-[9px] font-bold uppercase text-ink/60">Repositories</span>
                </div>
                <div className="border border-ink bg-paper2 p-2">
                  <span className="block font-display text-base text-ink">495</span>
                  <span className="text-[9px] font-bold uppercase text-ink/60">Total Stars</span>
                </div>
                <div className="border border-ink bg-paper2 p-2">
                  <span className="block font-display text-base text-ink">84</span>
                  <span className="text-[9px] font-bold uppercase text-ink/60">Commits (Yr)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={triggerSync} className="flex-1 justify-center">
                  Re-sync Repos
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setGithubConnected(false)}>
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-[12px] font-medium text-ink/70 mb-3">
                Import your verified repositories, stars, and language proficiencies directly into your college portfolio.
              </p>
              <Button variant="dark" size="sm" onClick={() => setModalProvider("GitHub")} className="w-full justify-center">
                Connect GitHub Account →
              </Button>
            </div>
          )}
        </div>

        {/* LinkedIn Account Card */}
        <div className="border-2 border-ink bg-white p-5 shadow-[4px_4px_0_#0a0a0a]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-[#0A66C2] text-white font-bold text-lg shadow-[2px_2px_0_#0a0a0a]">
                in
              </span>
              <div>
                <h3 className="font-display text-[15px] text-ink">LinkedIn</h3>
                <p className="text-[11px] text-ink/60">
                  {linkedinConnected ? "Aarav Sharma · Connected" : "Not connected"}
                </p>
              </div>
            </div>
            <Badge tone={linkedinConnected ? "info" : "outline"}>
              {linkedinConnected ? "● Connected" : "Disconnected"}
            </Badge>
          </div>

          {linkedinConnected ? (
            <div className="mt-4 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="border border-ink bg-paper2 p-2">
                  <span className="block font-display text-base text-ink">14</span>
                  <span className="text-[9px] font-bold uppercase text-ink/60">Skills Synced</span>
                </div>
                <div className="border border-ink bg-paper2 p-2">
                  <span className="block font-display text-base text-ink">3</span>
                  <span className="text-[9px] font-bold uppercase text-ink/60">Certifications</span>
                </div>
                <div className="border border-ink bg-paper2 p-2">
                  <span className="block font-display text-base text-ink">500+</span>
                  <span className="text-[9px] font-bold uppercase text-ink/60">Network</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={triggerSync} className="flex-1 justify-center">
                  Re-sync Profile
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setLinkedinConnected(false)}>
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-[12px] font-medium text-ink/70 mb-3">
                Import verified skills, licenses, and headline endorsements to enhance your institutional resume.
              </p>
              <Button variant="default" size="sm" onClick={() => setModalProvider("LinkedIn")} className="w-full justify-center">
                Connect LinkedIn Profile →
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Data Preview Panel */}
      <Card>
        <CardHeader
          title="Synced Data Preview"
          tone="sunlight"
          action={
            <div className="flex gap-1">
              {(["GitHub", "LinkedIn", "Combined"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPreviewTab(tab)}
                  className={`nb-press border-2 px-3 py-1 text-[11px] font-bold ${
                    previewTab === tab
                      ? "border-ink bg-sun text-ink shadow-[2px_2px_0_#0a0a0a]"
                      : "border-transparent text-ink/70 hover:border-ink hover:bg-paper"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          }
        />
        <CardBody className="p-0">
          {previewTab === "GitHub" ? (
            <TableRoot className="border-0 shadow-none">
              <THead>
                <TR>
                  <TH>Repository Name</TH>
                  <TH>Primary Language</TH>
                  <TH>Stars</TH>
                  <TH>Last Commit</TH>
                  <TH className="text-right">Public in Portfolio</TH>
                </TR>
              </THead>
              <TBody>
                {repos.map((repo, idx) => (
                  <TR key={repo.name}>
                    <TD className="font-bold text-ink">{repo.name}</TD>
                    <TD><Badge tone="dark">{repo.lang}</Badge></TD>
                    <TD>★ {repo.stars}</TD>
                    <TD className="text-ink/60">{repo.lastCommit}</TD>
                    <TD className="text-right">
                      <Toggle
                        checked={repo.isPublic}
                        onChange={() => toggleRepoVisibility(idx)}
                      />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </TableRoot>
          ) : previewTab === "LinkedIn" ? (
            <div className="p-5 flex flex-col gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-ink/60">Synced Headline</span>
                <p className="font-display text-[15px] text-ink">
                  Computer Science Student · Systems & Distributed Architecture · Open Source Enthusiast
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-ink/60">Imported Skills</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {["Go", "Rust", "C++17", "Distributed Systems", "Raft Consensus", "TypeScript", "Next.js", "PostgreSQL", "Docker", "Linux Kernel"].map((s) => (
                    <Badge key={s} tone="sky">{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-ink/60">Verified Certifications</span>
                <ul className="mt-1 flex flex-col gap-1 text-[12px] font-medium text-ink">
                  <li>• AWS Certified Cloud Practitioner (Sep 2025)</li>
                  <li>• Kubernetes Certified Application Developer (CKAD) (May 2026)</li>
                  <li>• Meta Front-End Developer Professional Certificate (Dec 2024)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-5 flex flex-col gap-4 bg-paper">
              <div className="border-2 border-ink bg-white p-4 shadow-[3px_3px_0_#0a0a0a]">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 border-2 border-ink bg-sun flex items-center justify-center font-display text-lg">AS</div>
                  <div>
                    <h3 className="font-display text-lg">Aarav Sharma</h3>
                    <p className="text-[12px] text-ink/70">B.Tech CSE · Hindustan University · CGPA 8.74</p>
                  </div>
                </div>
                <p className="mt-3 text-[12px] font-medium leading-relaxed">
                  Systems programmer with 495+ GitHub stars across distributed key-value storage and operating system toy kernels. Proficient in Go, Rust, and C++.
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Badge tone="mint">495 Stars</Badge>
                  <Badge tone="candy">AWS Certified</Badge>
                  <Badge tone="dark">Dean&apos;s Honor List</Badge>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Privacy Configuration Panel */}
      <Card>
        <CardHeader title="Who Can View Your Academic Portfolio?" tone="mint" />
        <CardBody className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Only me (Private)",
              "Faculty & Mentors only",
              "Everyone in Hindustan University",
              "Public (Anyone with link)",
            ].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setVisibility(opt)}
                className={`nb-press border-2 p-3 text-left transition-all ${
                  visibility === opt
                    ? "border-ink bg-sun shadow-[3px_3px_0_#0a0a0a] font-bold text-ink"
                    : "border-ink bg-white text-ink/80 hover:bg-paper"
                }`}
              >
                <span className="mr-2">{visibility === opt ? "◉" : "○"}</span>
                <span className="text-[12px]">{opt}</span>
              </button>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-ink/20 pt-4">
            <h4 className="font-bold text-[12px] text-ink mb-2">Display Attribute Controls</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-medium text-ink">
              <Checkbox label="GitHub Repositories" checked={true} onChange={() => {}} />
              <Checkbox label="Commit Activity Graph" checked={true} onChange={() => {}} />
              <Checkbox label="Star Counts" checked={true} onChange={() => {}} />
              <Checkbox label="Programming Languages" checked={true} onChange={() => {}} />
              <Checkbox label="LinkedIn Headline" checked={true} onChange={() => {}} />
              <Checkbox label="Verified Skills" checked={true} onChange={() => {}} />
              <Checkbox label="Official SGPA / CGPA" checked={true} onChange={() => {}} />
              <Checkbox label="Downloadable Resume PDF" checked={true} onChange={() => {}} />
            </div>
          </div>

          <div className="flex items-center justify-between border-t-2 border-ink pt-3">
            <span className="text-[11px] text-ink/60">Changes take effect immediately on your public URL.</span>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setPrivacySaved(true)
                setTimeout(() => setPrivacySaved(false), 2000)
              }}
            >
              {privacySaved ? "✓ Privacy Settings Saved!" : "Save Privacy Settings"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Resume Generator Panel */}
      <Card>
        <CardHeader title="Generate Tailored Resume from Synced Data" tone="candy" />
        <CardBody className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-xl">
            <h4 className="font-display text-[14px] text-ink">
              Instant Academic & Technical Resume Generation
            </h4>
            <p className="text-[12px] font-medium text-ink/70">
              Combines your verified Hindustan University transcripts, attendance records, GitHub repositories, and LinkedIn certifications into a polished, ATS-compliant PDF.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-48">
              <Select value={resumeTemplate} onChange={(e) => setResumeTemplate(e.target.value)}>
                <option value="Modern Brutalist">Modern Brutalist</option>
                <option value="Academic Classic">Academic Classic (Standard)</option>
                <option value="Enterprise Tech">Enterprise Tech ATS</option>
              </Select>
            </div>
            <Button variant="default" size="sm" onClick={generatePdf} disabled={generatingResume}>
              {generatingResume ? "Compiling PDF…" : "Generate PDF"}
            </Button>
            {resumeReady ? (
              <Button variant="mint" size="sm">
                ⭳ Download
              </Button>
            ) : null}
          </div>
        </CardBody>
      </Card>

      {/* OAuth Authorization Modal */}
      <Modal
        open={modalProvider !== null}
        onClose={() => setModalProvider(null)}
        title={`Connect ${modalProvider} Account`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalProvider(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                if (modalProvider === "GitHub") setGithubConnected(true)
                if (modalProvider === "LinkedIn") setLinkedinConnected(true)
                setModalProvider(null)
              }}
            >
              Continue to {modalProvider} Authorization →
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4 text-ink">
          <p className="text-[13px] font-medium">
            CollegeCloud will redirect you to a secure {modalProvider} authentication flow.
          </p>
          <div className="border-2 border-ink bg-paper p-3 text-[12px] space-y-1">
            <strong className="block text-[11px] uppercase tracking-wider text-ink/60">Requested Permissions:</strong>
            <div>• Read public profile and verified email address</div>
            <div>• Read public repository metadata and commit history</div>
            <div>• Zero write access requested (read-only token)</div>
          </div>
          <p className="text-[11px] font-medium text-ink/60">
            Tokens are encrypted with AES-256 and stored securely in your tenant vault. You can revoke access anytime.
          </p>
        </div>
      </Modal>
    </>
  )
}
