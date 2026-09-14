"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"

const fileContents: Record<string, string> = {
  "main.py": `from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/health", methods=["GET"])
def health_check():
    # Step 2: Ensure endpoint returns JSON with status: ok
    return jsonify({"status": "ok", "service": "dbms-engine", "uptime": 128})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
`,
  "config.yaml": `server:
  port: 5000
  host: "0.0.0.0"
database:
  provider: "postgres"
  pool_size: 10
  timeout_ms: 3000
monitoring:
  proctor_enabled: true
  health_interval_sec: 15
`,
  "README.md": `# Lab Task: Microservice Sandbox Configuration

## Objectives
1. Inspect the Flask application inside \`/app/main.py\`.
2. Ensure the \`/health\` route responds with HTTP 200 and \`{"status": "ok"}\`.
3. Verify that the test suite in \`/tests\` passes.
4. Issue \`docker build\` to verify image persistence.
`,
}

export default function ExamTakingLabPage() {
  const [secondsLeft, setSecondsLeft] = useState(24 * 60 + 47) // 00:24:47
  const [activeFile, setActiveFile] = useState("main.py")
  const [fileData, setFileData] = useState(fileContents)
  const [currentStep, setCurrentStep] = useState(1) // 0-indexed, step 2 active
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Cloud Sandbox provisioned: ubuntu:22.04 LTS (x86_64)",
    "Mounted persistent volume at /home/student/app",
    "Python 3.11.8 installed · Flask 3.0.2 ready",
    "student@sandbox:~$ ls -la",
    "total 24",
    "-rw-r--r-- 1 student student  285 Sep 14 10:00 main.py",
    "-rw-r--r-- 1 student student  164 Sep 14 10:00 config.yaml",
    "-rw-r--r-- 1 student student  312 Sep 14 10:00 README.md",
  ])
  const [cmdInput, setCmdInput] = useState("")
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (submitted) return
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [submitted])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  const runCommand = (cmdToRun?: string) => {
    const cmd = cmdToRun || cmdInput
    if (!cmd.trim()) return

    const newLogs = [...terminalHistory, `student@sandbox:~$ ${cmd}`]

    if (cmd.includes("curl") || cmd.includes("health")) {
      newLogs.push('HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"status":"ok","service":"dbms-engine","uptime":128}')
    } else if (cmd.includes("pytest") || cmd.includes("test")) {
      newLogs.push("====================== test session starts ======================")
      newLogs.push("tests/test_health.py::test_status_endpoint PASSED          [100%]")
      newLogs.push("======================= 1 passed in 0.08s =======================")
    } else if (cmd.includes("python")) {
      newLogs.push(" * Serving Flask app 'main'\n * Running on all addresses (0.0.0.0)\n * Running on http://127.0.0.1:5000")
    } else if (cmd.includes("ls")) {
      newLogs.push("main.py  config.yaml  README.md  tests/")
    } else {
      newLogs.push(`Executed command: ${cmd} (exit code 0)`)
    }

    setTerminalHistory(newLogs)
    setCmdInput("")
  }

  const checkNextStep = () => {
    setCurrentStep((s) => Math.min(3, s + 1))
    setTerminalHistory((prev) => [
      ...prev,
      `[Verification]: Step ${currentStep + 1} validation passed with exit code 0.`,
    ])
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 border-ink bg-white px-4 py-2.5 shadow-[0_2px_0_#0a0a0a]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-sky font-display text-xs text-ink shadow-[2px_2px_0_#0a0a0a]">
            ◱
          </span>
          <div>
            <h1 className="font-display text-[14px] text-ink">DBMS Final Lab — Cloud Sandbox</h1>
            <p className="text-[10px] font-bold text-ink/50">Question 15 of 20 · Cloud Environment: ubuntu:22.04</p>
          </div>
          <Badge tone="mint">◱ Sandbox: Running</Badge>
          <Badge tone="dark">25 Marks</Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 border-2 border-ink bg-mint px-2.5 py-1 text-[11px] font-bold text-ink shadow-[2px_2px_0_#0a0a0a]">
            <span className="h-2 w-2 rounded-full bg-tomato animate-pulse" />
            <span>PROCTORING ON</span>
          </div>

          <div className="flex items-center gap-1.5 border-2 border-ink bg-sun px-3 py-1 shadow-[2px_2px_0_#0a0a0a]">
            <span className="text-[12px]">⏱</span>
            <span className="font-mono text-[14px] font-bold tracking-widest text-ink">
              {formatTime(secondsLeft)}
            </span>
          </div>

          <Button variant="danger" size="sm" onClick={() => setSubmitModalOpen(true)}>
            Submit Lab Exam
          </Button>
        </div>
      </header>

      {/* 3-Pane Body */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1700px] w-full mx-auto">
        {/* Left Pane: Tasks Checklist (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card>
            <CardHeader title="Task Specifications" tone="sunlight" action={<Badge tone="dark">Q15</Badge>} />
            <CardBody className="flex flex-col gap-3 p-4">
              <h3 className="font-display text-[14px] text-ink">Configure Service Endpoint</h3>
              <p className="text-[12px] font-medium leading-relaxed text-ink/80">
                Configure a Flask service inside the sandbox container so that <code>GET /health</code> returns <code>{"{\"status\":\"ok\"}"}</code> with HTTP 200.
              </p>
            </CardBody>
          </Card>

          <Card className="flex-1 flex flex-col">
            <CardHeader
              title="Execution Steps"
              tone="mint"
              action={
                <Button variant="outline" size="sm" onClick={checkNextStep}>
                  ✓ Check Step
                </Button>
              }
            />
            <CardBody className="flex flex-col gap-3 p-4">
              {[
                { title: "Step 1 — Setup Environment", desc: "Docker container & dependencies initialized", done: currentStep > 0 },
                { title: "Step 2 — Configure Service", desc: "Implement /health in main.py", done: currentStep > 1, active: currentStep === 1 },
                { title: "Step 3 — Verify Endpoint", desc: "Test GET /health via curl & pytest", done: currentStep > 2, active: currentStep === 2 },
                { title: "Step 4 — Persist Container", desc: "Ensure state is written to volume", done: currentStep > 3, active: currentStep === 3 },
              ].map((st, i) => (
                <div
                  key={i}
                  className={`border-2 border-ink p-3 shadow-[2px_2px_0_#0a0a0a] ${
                    st.done
                      ? "bg-mint text-ink"
                      : st.active
                      ? "bg-sun text-ink ring-2 ring-ink"
                      : "bg-white text-ink/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[12px]">{st.title}</span>
                    <Badge tone={st.done ? "dark" : st.active ? "candy" : "outline"}>
                      {st.done ? "✓ Done" : st.active ? "● Active" : "Pending"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] font-medium">{st.desc}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Center & Right Pane: Code Editor + Interactive Terminal (9 Cols) */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          {/* Editor Card */}
          <Card className="flex-1 flex flex-col">
            <CardHeader
              title="File Workspace (/home/student/app)"
              tone="sky"
              action={
                <div className="flex items-center gap-1">
                  {Object.keys(fileData).map((filename) => (
                    <button
                      key={filename}
                      onClick={() => setActiveFile(filename)}
                      className={`nb-press border-2 px-3 py-1 text-[11px] font-bold ${
                        activeFile === filename
                          ? "border-ink bg-sun text-ink shadow-[2px_2px_0_#0a0a0a]"
                          : "border-transparent text-ink/60 hover:border-ink hover:bg-paper"
                      }`}
                    >
                      {filename}
                    </button>
                  ))}
                </div>
              }
            />
            <div className="bg-ink flex-1 min-h-[260px] flex flex-col">
              <textarea
                value={fileData[activeFile]}
                onChange={(e) =>
                  setFileData((prev) => ({ ...prev, [activeFile]: e.target.value }))
                }
                spellCheck={false}
                className="w-full flex-1 bg-ink p-4 font-mono text-[13px] text-paper focus:outline-none resize-none leading-relaxed"
                rows={11}
              />
            </div>
          </Card>

          {/* Interactive Cloud Terminal Card */}
          <Card className="flex-1 flex flex-col">
            <CardHeader
              title="Cloud Terminal (student@sandbox:~#)"
              tone="candy"
              action={
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-ink/60">Quick Commands:</span>
                  <Button variant="outline" size="sm" onClick={() => runCommand("curl http://localhost:5000/health")}>
                    curl /health
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => runCommand("pytest")}>
                    pytest
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setTerminalHistory(["Terminal cleared."])}>
                    Clear
                  </Button>
                </div>
              }
            />
            <div className="bg-ink text-paper font-mono text-[12px] p-4 flex-1 flex flex-col min-h-[240px] border-b-2 border-ink">
              <div className="flex-1 overflow-y-auto space-y-1">
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className={line.startsWith("student@") ? "text-sun font-bold" : line.includes("PASSED") ? "text-mint" : "text-paper/85"}>
                    {line}
                  </div>
                ))}
              </div>
              {/* Command Input Bar */}
              <form
                className="flex items-center gap-2 pt-2 border-t border-white/20 mt-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  runCommand()
                }}
              >
                <span className="text-mint font-bold">student@sandbox:~$</span>
                <input
                  type="text"
                  value={cmdInput}
                  onChange={(e) => setCmdInput(e.target.value)}
                  placeholder="type shell command (e.g. curl localhost:5000/health, pytest, ls)..."
                  className="flex-1 bg-transparent text-white font-mono text-[12px] focus:outline-none placeholder:text-white/30"
                />
                <Button variant="default" size="sm" type="submit">
                  Execute ↵
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit Cloud Sandbox Lab"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSubmitModalOpen(false)}>
              Keep Working
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setSubmitted(true)
                setSubmitModalOpen(false)
              }}
            >
              Submit Lab Evaluation
            </Button>
          </>
        }
      >
        <p className="text-[13px] font-medium text-ink">
          Are you ready to submit your lab exercise? Your container state and test suite outcomes will be snapshot and recorded.
        </p>
      </Modal>

      {/* Submitted View */}
      {submitted ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4">
          <div className="w-full max-w-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_#ffdc58] text-center flex flex-col items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center border-2 border-ink bg-mint text-2xl font-bold">
              ✓
            </span>
            <div>
              <h2 className="font-display text-xl text-ink">Lab Environment Snapshot Saved!</h2>
              <p className="mt-1 text-[12px] font-medium text-ink/70">
                All 4 validation checks passed. 25/25 marks awarded.
              </p>
            </div>
            <Link href="/student" className="w-full">
              <Button variant="default" size="lg" className="w-full justify-center">
                Return to Student Portal
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
