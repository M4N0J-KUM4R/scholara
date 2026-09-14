"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardBody } from "@/components/ui/card"
import { Checkbox, Field, Input, Select, Textarea, Toggle } from "@/components/ui/input"
import { ProgressBar } from "@/components/ui/stat"
import { Modal } from "@/components/ui/modal"
import { questionBank, type Question } from "@/lib/data"
import { cn } from "@/lib/utils"

const steps = ["Details", "Add questions", "Settings", "Validation & submit"]

const typeTone: Record<Question["type"], "info" | "grape" | "mint" | "candy" | "warning" | "default"> = {
  MCQ: "info",
  Coding: "grape",
  Lab: "mint",
  "Short answer": "candy",
  Essay: "warning",
  Numerical: "default",
}

type Picked = { q: Question; points: number }

const seedPicked: Picked[] = ["q1", "q2", "q3"].map((id) => {
  const q = questionBank.find((x) => x.id === id) as Question
  return { q, points: q.marks }
})

export default function NewAssessmentPage() {
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState("DBMS Unit Test — Section B")
  const [course, setCourse] = useState("CS310")
  const [examType, setExamType] = useState("Mixed (MCQ + Coding)")
  const [marks, setMarks] = useState("20")
  const [duration, setDuration] = useState("60")
  const [instructions, setInstructions] = useState(
    "Answer all questions. Coding items run against hidden test cases in the sandbox; short answers are graded against the published rubric.",
  )
  const [picked, setPicked] = useState<Picked[]>(seedPicked)
  const [bankOpen, setBankOpen] = useState(false)
  const [randomize, setRandomize] = useState(true)
  const [shuffleOptions, setShuffleOptions] = useState(false)
  const [pooling, setPooling] = useState(false)
  const [lockdown, setLockdown] = useState(true)
  const [webcam, setWebcam] = useState(false)
  const [tabWarn, setTabWarn] = useState(true)
  const [lateEntry, setLateEntry] = useState("10 min")
  const [savedNote, setSavedNote] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const target = Number.parseInt(marks, 10) || 0
  const total = picked.reduce((sum, p) => sum + (Number.isFinite(p.points) ? p.points : 0), 0)

  const hasQuestions = picked.length >= 1
  const marksMatch = target > 0 && total === target
  const allPoints = picked.length > 0 && picked.every((p) => p.points > 0)
  const instructionsOk = instructions.trim().length > 0
  const allPass = hasQuestions && marksMatch && allPoints && instructionsOk

  const setPoints = (id: string, points: number) =>
    setPicked((ps) => ps.map((p) => (p.q.id === id ? { ...p, points: Number.isFinite(points) ? points : 0 } : p)))

  const removeFromPicked = (id: string) => setPicked((ps) => ps.filter((p) => p.q.id !== id))

  const addToPicked = (q: Question) => setPicked((ps) => (ps.some((p) => p.q.id === q.id) ? ps : [...ps, { q, points: q.marks }]))

  const resetWizard = () => {
    setStep(0)
    setSubmitted(false)
    setSavedNote(false)
    setPicked(seedPicked)
  }

  const stepCls = (i: number) =>
    cn(
      "nb-press nb-focus rounded-none border-2 border-ink px-3.5 py-2 text-left text-[12px] font-bold text-ink",
      i === step ? "nb-shadow-sm bg-sun" : i < step ? "bg-mint" : "bg-white text-ink/60 hover:text-ink",
    )

  /* ---------------- Submitted screen ---------------- */
  if (submitted) {
    return (
      <div className="flex flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-xl text-ink">New assessment</h1>
            <p className="mt-0.5 text-[12px] font-medium text-ink/60">Four steps from blank draft to validated exam.</p>
          </div>
        </header>
        <div className="mx-auto w-full max-w-xl border-2 border-ink bg-mint p-8 text-center nb-shadow">
          <span className="mx-auto flex h-14 w-14 items-center justify-center border-2 border-ink bg-white text-[24px] nb-shadow-sm">
            ✓
          </span>
          <h2 className="mt-4 font-display text-lg text-ink">Submitted for validation</h2>
          <p className="mt-1.5 text-[12px] font-medium text-ink/70">
            “{title || "Untitled assessment"}” ({course}, {total} marks, {picked.length} questions) is now with{" "}
            <strong>Dr. Ananya Rao (HOD)</strong> for review. You will be notified when the exam cell signs off.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link
              href="/faculty/assessments"
              className="nb-press nb-focus inline-flex h-9 select-none items-center justify-center whitespace-nowrap rounded-none border-2 border-ink bg-ink px-4 text-[12px] font-bold text-sun shadow-[3px_3px_0_#0a0a0a]"
            >
              ← Back to assessments
            </Link>
            <Button variant="outline" onClick={resetWizard}>
              Create another
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Route header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">New assessment</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">Four steps from blank draft to validated exam.</p>
        </div>
        <Link href="/faculty/assessments" className="text-[11px] font-bold uppercase tracking-wide text-ink underline">
          ← All assessments
        </Link>
      </header>

      {/* Stepper */}
      <nav className="flex flex-wrap items-center gap-2" aria-label="Wizard steps">
        {steps.map((s, i) => (
          <button key={s} type="button" onClick={() => setStep(i)} aria-current={i === step ? "step" : undefined} className={stepCls(i)}>
            <span className="mr-1.5 opacity-60">{i < step ? "✓" : `${i + 1}.`}</span>
            {s}
          </button>
        ))}
      </nav>

      <Card>
        <CardHeader
          title={`Step ${step + 1} of 4 — ${steps[step]}`}
          tone={step === 3 ? "mint" : step === 1 ? "candy" : step === 2 ? "sky" : "sunlight"}
          action={<Badge tone="dark">{course}</Badge>}
        />
        <CardBody className="flex flex-col gap-4">
          {/* ---------------- Step 1: Details ---------------- */}
          {step === 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Assessment title" className="md:col-span-2">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. DBMS Unit Test — Section B" />
              </Field>
              <Field label="Course">
                <Select value={course} onChange={(e) => setCourse(e.target.value)}>
                  <option value="CS301">CS301 — Data Structures &amp; Algorithms</option>
                  <option value="CS305">CS305 — Operating Systems</option>
                  <option value="CS310">CS310 — Database Management Systems</option>
                </Select>
              </Field>
              <Field label="Exam type">
                <Select value={examType} onChange={(e) => setExamType(e.target.value)}>
                  <option>MCQ exam</option>
                  <option>Coding exam</option>
                  <option>Mixed (MCQ + Coding)</option>
                  <option>Lab practical</option>
                </Select>
              </Field>
              <Field label="Total marks" hint="Questions in step 2 must add up to this.">
                <Input type="number" min={1} value={marks} onChange={(e) => setMarks(e.target.value)} />
              </Field>
              <Field label="Duration (minutes)">
                <Input type="number" min={5} value={duration} onChange={(e) => setDuration(e.target.value)} />
              </Field>
              <Field label="Instructions shown to students" className="md:col-span-2">
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Timing rules, grading policy, allowed resources…"
                />
              </Field>
            </div>
          ) : null}

          {/* ---------------- Step 2: Add questions ---------------- */}
          {step === 1 ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[12px] font-bold text-ink">
                  {picked.length} question{picked.length === 1 ? "" : "s"} in this assessment
                </p>
                <Button onClick={() => setBankOpen(true)}>+ Add from bank</Button>
              </div>

              <div className="flex flex-col gap-2">
                {picked.map((p) => (
                  <div key={p.q.id} className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-white p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-bold text-ink">{p.q.stem}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge tone={typeTone[p.q.type]}>{p.q.type}</Badge>
                        <Badge tone="outline">{p.q.bloom}</Badge>
                        <Badge tone="dark">{p.q.course}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-ink/60">Points</span>
                        <Input
                          type="number"
                          min={1}
                          value={p.points}
                          onChange={(e) => setPoints(p.q.id, Number.parseInt(e.target.value, 10))}
                          className="h-8 w-20"
                        />
                      </label>
                      <Button variant="outline" size="icon" aria-label={`Remove ${p.q.stem}`} onClick={() => removeFromPicked(p.q.id)}>
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
                {picked.length === 0 ? (
                  <p className="border-2 border-dashed border-ink/40 bg-paper px-4 py-6 text-center text-[12px] font-medium text-ink/60">
                    No questions yet — pull items from the bank to get started.
                  </p>
                ) : null}
              </div>

              <div className="border-2 border-ink bg-paper p-3">
                <ProgressBar
                  value={target > 0 ? (total / target) * 100 : 0}
                  color={total === target && target > 0 ? "bg-mint" : total > target ? "bg-tomato" : "bg-sun"}
                  label={`Marks ${total} of ${target || 0}`}
                />
                <p className="mt-2 text-[11px] font-bold text-ink">
                  {target === 0
                    ? "Set total marks in step 1 to track progress."
                    : total === target
                      ? "✓ Marks match the paper total."
                      : total > target
                        ? `Over budget by ${total - target} marks.`
                        : `${target - total} marks still unassigned.`}
                </p>
              </div>
            </div>
          ) : null}

          {/* ---------------- Step 3: Settings ---------------- */}
          {step === 2 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-3 border-2 border-ink bg-paper p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-ink">Delivery</p>
                <Toggle checked={randomize} onChange={setRandomize} label="Randomize question order per student" />
                <Toggle checked={shuffleOptions} onChange={setShuffleOptions} label="Shuffle MCQ options" />
                <Toggle checked={pooling} onChange={setPooling} label="Question pooling (draw 30 of 45)" />
              </div>
              <div className="flex flex-col gap-3 border-2 border-ink bg-paper p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-ink">Proctoring</p>
                <Checkbox label="Lockdown browser" checked={lockdown} onChange={setLockdown} />
                <Checkbox label="Webcam monitoring" checked={webcam} onChange={setWebcam} />
                <Checkbox label="Tab-switch warnings" checked={tabWarn} onChange={setTabWarn} />
              </div>
              <Field label="Late-entry window" hint="Students may join up to this long after start." className="md:col-span-2">
                <Select value={lateEntry} onChange={(e) => setLateEntry(e.target.value)} className="max-w-xs">
                  <option>No late entry</option>
                  <option>5 min</option>
                  <option>10 min</option>
                  <option>15 min</option>
                  <option>30 min</option>
                </Select>
              </Field>
            </div>
          ) : null}

          {/* ---------------- Step 4: Validation & submit ---------------- */}
          {step === 3 ? (
            <div className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {[
                  { ok: marksMatch, text: `Marks total (${total}) equals paper target (${target || 0})` },
                  { ok: allPoints, text: "Every question has points assigned" },
                  { ok: instructionsOk, text: "Student instructions filled in" },
                  { ok: hasQuestions, text: "At least one question added" },
                ].map((c) => (
                  <li
                    key={c.text}
                    className={cn(
                      "flex items-center justify-between gap-3 border-2 border-ink px-3 py-2.5 text-[12px] font-bold",
                      c.ok ? "bg-mint" : "bg-tanglight",
                    )}
                  >
                    <span>{c.text}</span>
                    <Badge tone={c.ok ? "success" : "danger"}>{c.ok ? "✓ Pass" : "✗ Check"}</Badge>
                  </li>
                ))}
              </ul>

              {savedNote ? (
                <p className="border-2 border-ink bg-mint px-3 py-2 text-[11px] font-bold text-ink nb-shadow-sm">
                  Draft saved — “{title || "Untitled assessment"}” is safe. You can finish submission any time.
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setSavedNote(true)}>
                  Save draft
                </Button>
                <Button disabled={!allPass} className="disabled:pointer-events-none disabled:opacity-50" onClick={() => setSubmitted(true)}>
                  Submit for validation
                </Button>
                {!allPass ? (
                  <span className="self-center text-[11px] font-medium text-ink/55">Fix the flagged checks to enable submission.</span>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Wizard nav */}
          <div className="flex items-center justify-between border-t-2 border-ink pt-4">
            <Button variant="outline" disabled={step === 0} className="disabled:pointer-events-none disabled:opacity-50" onClick={() => setStep((s) => Math.max(0, s - 1))}>
              ← Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep((s) => Math.min(3, s + 1))}>Next: {steps[step + 1]} →</Button>
            ) : (
              <span className="text-[11px] font-bold uppercase tracking-wide text-ink/50">Final step</span>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Add-from-bank modal */}
      <Modal open={bankOpen} onClose={() => setBankOpen(false)} title="Add questions from bank">
        <div className="flex flex-col gap-2">
          {questionBank.map((q) => {
            const already = picked.some((p) => p.q.id === q.id)
            return (
              <div key={q.id} className="flex items-center justify-between gap-3 border-2 border-ink bg-white px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold text-ink">{q.stem}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone={typeTone[q.type]}>{q.type}</Badge>
                    <Badge tone="outline">{q.course}</Badge>
                    <Badge tone="dark">{q.marks} marks</Badge>
                  </div>
                </div>
                <Button size="sm" variant={already ? "outline" : "default"} disabled={already} onClick={() => addToPicked(q)}>
                  {already ? "Added" : "Add"}
                </Button>
              </div>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}
