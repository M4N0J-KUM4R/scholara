"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardBody } from "@/components/ui/card"
import { Checkbox, Select, Field } from "@/components/ui/input"
import { EmptyState } from "@/components/ui/avatar"
import { questionBank, type Question } from "@/lib/data"
import { cn } from "@/lib/utils"

const typeTone: Record<Question["type"], "info" | "grape" | "mint" | "candy" | "warning" | "default"> = {
  MCQ: "info",
  Coding: "grape",
  Lab: "mint",
  "Short answer": "candy",
  Essay: "warning",
  Numerical: "default",
}

const blooms = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"] as const

/* MCQ answer keys live with the item authoring record — mirrored here for preview. */
const mcqKeys: Partial<Record<string, { options: string[]; answer: number }>> = {
  q1: { options: ["Singly linked list", "Dynamic array", "Binary heap", "Hash map"], answer: 1 },
  q8: { options: ["O(n log n)", "O(n)", "O(log n)", "O(n²)"], answer: 1 },
}

export default function QuestionBankPage() {
  const [course, setCourse] = useState("all")
  const [bloom, setBloom] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState("all")
  const [type, setType] = useState("all")
  const [selected, setSelected] = useState<string[]>([])
  const [previewId, setPreviewId] = useState<string>("q1")
  const [bulkNote, setBulkNote] = useState<string | null>(null)
  const [previewNote, setPreviewNote] = useState<string | null>(null)

  const courseCodes = Array.from(new Set(questionBank.map((q) => q.course)))

  const filtered = questionBank.filter(
    (q) =>
      (course === "all" || q.course === course) &&
      (bloom.length === 0 || bloom.includes(q.bloom)) &&
      (difficulty === "all" || q.difficulty.toLowerCase() === difficulty) &&
      (type === "all" || q.type === type),
  )

  const preview = questionBank.find((q) => q.id === previewId) ?? filtered[0] ?? questionBank[0]

  const toggleSelect = (id: string) => {
    setBulkNote(null)
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const allSelected = filtered.length > 0 && filtered.every((q) => selected.includes(q.id))

  const toggleSelectAll = (on: boolean) => {
    setBulkNote(null)
    setSelected((s) => (on ? Array.from(new Set([...s, ...filtered.map((q) => q.id)])) : s.filter((id) => !filtered.some((q) => q.id === id))))
  }

  const previewKey = preview ? mcqKeys[preview.id] : undefined

  return (
    <div className="flex flex-col gap-6">
      {/* Route header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">Question bank</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            Browse, filter and curate items before adding them to an assessment.
          </p>
        </div>
        <Badge tone="dark">{questionBank.length} items · 128 total in bank</Badge>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Filters */}
        <Card className="self-start">
          <CardHeader title="Filters" tone="sky" />
          <CardBody className="flex flex-col gap-4">
            <Field label="Course">
              <Select value={course} onChange={(e) => setCourse(e.target.value)}>
                <option value="all">All courses</option>
                {courseCodes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink">Bloom level</p>
              <div className="flex flex-col gap-2">
                {blooms.map((b) => (
                  <Checkbox
                    key={b}
                    label={b}
                    checked={bloom.includes(b)}
                    onChange={(on) => setBloom((s) => (on ? [...s, b] : s.filter((x) => x !== b)))}
                  />
                ))}
              </div>
            </div>

            <Field label="Difficulty">
              <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="all">Any difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
            </Field>

            <Field label="Question type">
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="all">All types</option>
                {Object.keys(typeTone).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
          </CardBody>
        </Card>

        {/* Question list */}
        <Card className="flex flex-col">
          <CardHeader
            title={`Questions (${filtered.length})`}
            action={<Checkbox label="Select all" checked={allSelected} onChange={toggleSelectAll} />}
          />
          <CardBody className="flex flex-col gap-2">
            {bulkNote ? (
              <p className="border-2 border-ink bg-mint px-3 py-2 text-[11px] font-bold text-ink nb-shadow-sm">{bulkNote}</p>
            ) : null}
            {filtered.length === 0 ? (
              <EmptyState
                icon="∅"
                title="No questions match"
                body="Loosen a filter or two — 128 items are waiting in the full bank."
              />
            ) : (
              filtered.map((q) => (
                <div
                  key={q.id}
                  className={cn(
                    "border-2 border-ink bg-white p-3 transition-colors",
                    preview.id === q.id && "bg-sunlight",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewId(q.id)
                        setPreviewNote(null)
                      }}
                      className="text-left text-[12px] font-bold text-ink hover:underline"
                    >
                      {q.stem}
                    </button>
                    <Checkbox label="" checked={selected.includes(q.id)} onChange={() => toggleSelect(q.id)} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge tone={typeTone[q.type]}>{q.type}</Badge>
                    <Badge tone="outline">{q.bloom}</Badge>
                    <Badge tone={q.difficulty === "Hard" ? "danger" : q.difficulty === "Medium" ? "warning" : "success"}>
                      {q.difficulty}
                    </Badge>
                    <Badge tone="dark">{q.marks} marks</Badge>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Preview */}
        {preview ? (
          <Card className="self-start lg:sticky lg:top-6">
            <CardHeader title="Preview" tone="none" action={<Badge tone="dark">{preview.course}</Badge>} />
            <CardBody className="flex flex-col gap-3">
              <p className="font-display text-[15px] leading-snug text-ink">{preview.stem}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone={typeTone[preview.type]}>{preview.type}</Badge>
                <Badge tone="grape">{preview.bloom}</Badge>
                <Badge tone={preview.difficulty === "Hard" ? "danger" : preview.difficulty === "Medium" ? "warning" : "success"}>
                  {preview.difficulty}
                </Badge>
                <Badge tone="dark">{preview.marks} marks</Badge>
                <Badge tone="default">Used in {preview.usedIn} exams</Badge>
              </div>

              {preview.type === "MCQ" && previewKey ? (
                <div className="flex flex-col gap-1.5">
                  {previewKey.options.map((opt, i) => (
                    <div
                      key={opt}
                      className={cn(
                        "flex items-center justify-between gap-2 border-2 border-ink px-3 py-2 text-[12px] font-medium text-ink",
                        i === previewKey.answer ? "bg-mint font-bold" : "bg-white",
                      )}
                    >
                      <span>
                        {String.fromCharCode(65 + i)}. {opt}
                      </span>
                      {i === previewKey.answer ? <Badge tone="success">Correct</Badge> : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="border-2 border-dashed border-ink/40 bg-paper px-3 py-2.5 text-[11px] font-medium text-ink/60">
                  {preview.type === "Coding"
                    ? "Evaluated against hidden test cases in the sandbox runner."
                    : preview.type === "Lab"
                      ? "Graded in the lab environment with step-wise checks."
                      : "Free-response item — graded manually against a rubric."}
                </p>
              )}

              {previewNote ? (
                <p className="border-2 border-ink bg-mint px-3 py-2 text-[11px] font-bold text-ink nb-shadow-sm">{previewNote}</p>
              ) : null}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setPreviewNote(`Editing "${preview.stem.slice(0, 32)}…" — opening item editor.`)}>
                  Edit
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setPreviewNote(`Added to "DBMS Unit Test" draft (v4).`)}
                >
                  Add to exam
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : null}
      </div>

      {/* Bulk bar */}
      {selected.length > 0 ? (
        <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 flex-wrap items-center gap-3 border-2 border-ink bg-ink px-4 py-2.5 text-sun nb-shadow-lg">
          <span className="text-[12px] font-bold">{selected.length} selected</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setBulkNote(`${selected.length} question${selected.length > 1 ? "s" : ""} added to "DBMS Unit Test" draft.`)
                setSelected([])
              }}
            >
              Add to exam
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setBulkNote(`${selected.length} question${selected.length > 1 ? "s" : ""} archived — hidden from new assessments.`)
                setSelected([])
              }}
            >
              Archive
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setBulkNote(`Exported ${selected.length} question${selected.length > 1 ? "s" : ""} as college-bank-qdf.json.`)
              }}
            >
              Export
            </Button>
            <Button size="sm" variant="dark" className="border-sun" onClick={() => setSelected([])}>
              ✕
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
