"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/input"

type QuestionType = "Coding" | "MCQ" | "Lab" | "Short answer"

export default function NewQuestionPage() {
  const [qType, setQType] = useState<QuestionType>("Coding")

  // Coding State
  const [title, setTitle] = useState("Implement LRU Cache with O(1) Operations")
  const [lang, setLang] = useState("C++17")
  const [bloom, setBloom] = useState("Create")
  const [marks, setMarks] = useState("10")
  const [statement, setStatement] = useState(
    "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\nImplement the LRUCache class with get(key) and put(key, value) in O(1) average time complexity.",
  )
  const [starterCode, setStarterCode] = useState(
    `#include <unordered_map>\n#include <list>\nusing namespace std;\n\nclass LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};`,
  )
  const [testCases, setTestCases] = useState([
    { id: 1, input: "LRUCache(2); put(1, 1); put(2, 2); get(1);", expected: "1", passed: true, hidden: false },
    { id: 2, input: "put(3, 3); get(2);", expected: "-1", passed: true, hidden: false },
    { id: 3, input: "put(4, 4); get(1); get(3); get(4);", expected: "-1, 3, 4", passed: false, hidden: true },
  ])

  // MCQ State
  const [mcqStem, setMcqStem] = useState("Which data structure provides O(1) amortized insertion and removal?")
  const [mcqOptions, setMcqOptions] = useState([
    "Singly Linked List",
    "Dynamic Array / Vector",
    "Binary Search Tree",
    "Hash Map",
  ])
  const [correctOption, setCorrectOption] = useState(1)

  // Lab State
  const [baseImage, setBaseImage] = useState("ubuntu:22.04")
  const [labSteps, setLabSteps] = useState([
    "Initialize Docker container and expose port 5000",
    "Install Flask and PyTest dependencies",
    "Create health endpoint route returning JSON",
    "Run verification suite to persist container",
  ])

  // Added notification
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/faculty/question-bank" className="text-[11px] font-bold text-ink underline">
              ← Back to Question Bank
            </Link>
          </div>
          <h1 className="mt-1 font-display text-2xl text-ink">Author New Assessment Item</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            Create high-stakes exam questions with automated test suites, Bloom taxonomy tagging, and autovalidation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={handleSave}>
            {savedSuccess ? "✓ Added to Bank!" : "+ Save & Add to Question Bank"}
          </Button>
        </div>
      </div>

      {/* Question Type Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-white p-3 shadow-[3px_3px_0_#0a0a0a]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink/60">Item Format:</span>
          {(["Coding", "MCQ", "Lab", "Short answer"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setQType(t)}
              className={`nb-press border-2 px-3 py-1 text-[11px] font-bold ${
                qType === t
                  ? "border-ink bg-sun text-ink shadow-[2px_2px_0_#0a0a0a]"
                  : "border-transparent text-ink/70 hover:border-ink hover:bg-paper"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <Badge tone="dark">Outcome: CO3 Attainment</Badge>
      </div>

      {/* Coding Format Editor */}
      {qType === "Coding" ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <Card>
              <CardHeader title="Coding Item Metadata" tone="sunlight" />
              <CardBody className="flex flex-col gap-4">
                <Field label="Problem Title">
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Primary Language">
                    <Select value={lang} onChange={(e) => setLang(e.target.value)}>
                      <option value="C++17">C++ 17</option>
                      <option value="Python 3">Python 3</option>
                      <option value="Java 17">Java 17</option>
                    </Select>
                  </Field>
                  <Field label="Bloom Taxonomy">
                    <Select value={bloom} onChange={(e) => setBloom(e.target.value)}>
                      <option value="Remember">Remember</option>
                      <option value="Understand">Understand</option>
                      <option value="Apply">Apply</option>
                      <option value="Analyze">Analyze</option>
                      <option value="Evaluate">Evaluate</option>
                      <option value="Create">Create</option>
                    </Select>
                  </Field>
                  <Field label="Total Marks">
                    <Input value={marks} onChange={(e) => setMarks(e.target.value)} />
                  </Field>
                </div>
                <Field label="Problem Statement & Specifications">
                  <Textarea
                    rows={4}
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                  />
                </Field>
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="Starter / Reference Code Template"
                tone="sky"
                action={<Badge tone="dark">main.cpp</Badge>}
              />
              <CardBody className="p-0">
                <div className="bg-ink p-4 font-mono text-[13px] text-paper">
                  <textarea
                    rows={8}
                    value={starterCode}
                    onChange={(e) => setStarterCode(e.target.value)}
                    className="w-full bg-ink text-paper font-mono text-[13px] focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Rail: Compiler & AutoValidation */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Card>
              <CardHeader
                title="Compiler Test Cases"
                tone="candy"
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setTestCases((prev) => [
                        ...prev,
                        {
                          id: prev.length + 1,
                          input: "get(4);",
                          expected: "4",
                          passed: true,
                          hidden: true,
                        },
                      ])
                    }
                  >
                    + Add Test
                  </Button>
                }
              />
              <CardBody className="flex flex-col gap-3 p-4">
                {testCases.map((tc) => (
                  <div key={tc.id} className="border-2 border-ink bg-paper p-3 text-[11px] font-mono shadow-[2px_2px_0_#0a0a0a]">
                    <div className="flex items-center justify-between border-b border-ink/20 pb-1">
                      <span className="font-bold font-sans">Test Case #{tc.id}</span>
                      <div className="flex gap-1">
                        {tc.hidden ? <Badge tone="dark">Hidden</Badge> : <Badge tone="outline">Public</Badge>}
                        <Badge tone={tc.passed ? "success" : "danger"}>
                          {tc.passed ? "✓ Pass" : "✗ Fail"}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-1.5"><strong className="font-sans">Input:</strong> {tc.input}</div>
                    <div><strong className="font-sans">Expected:</strong> {tc.expected}</div>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="AutoValidation Checklist" tone="mint" />
              <CardBody className="flex flex-col gap-2.5 text-[11px] font-bold text-ink">
                <div className="flex items-center gap-2">
                  <span className="text-mint text-sm">✓</span>
                  <span>Problem statement exceeds 40 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-mint text-sm">✓</span>
                  <span>Minimum 3 test cases configured</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-mint text-sm">✓</span>
                  <span>Hidden test case included for boundary check</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-mint text-sm">✓</span>
                  <span>Bloom taxonomy level mapped</span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : qType === "MCQ" ? (
        <Card>
          <CardHeader title="Multiple Choice Question (MCQ) Configuration" tone="mint" />
          <CardBody className="flex flex-col gap-4 max-w-3xl">
            <Field label="Question Stem / Statement">
              <Textarea
                rows={3}
                value={mcqStem}
                onChange={(e) => setMcqStem(e.target.value)}
              />
            </Field>

            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/70">
                Options & Correct Answer Radio
              </span>
              {mcqOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 border-2 border-ink p-3 ${
                    correctOption === idx ? "bg-mint shadow-[2px_2px_0_#0a0a0a]" : "bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="correct-opt"
                    checked={correctOption === idx}
                    onChange={() => setCorrectOption(idx)}
                    className="h-4 w-4 accent-ink"
                  />
                  <span className="font-bold text-ink text-xs">Option {String.fromCharCode(65 + idx)}:</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const val = e.target.value
                      setMcqOptions((prev) => prev.map((o, i) => (i === idx ? val : o)))
                    }}
                    className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
                  />
                  {correctOption === idx ? (
                    <Badge tone="dark">Correct Answer</Badge>
                  ) : null}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ) : qType === "Lab" ? (
        <Card>
          <CardHeader title="Interactive Sandbox Lab Configuration" tone="candy" />
          <CardBody className="flex flex-col gap-4 max-w-3xl">
            <Field label="Base Container Image" hint="Image pulled inside secure isolated micro-VM sandbox.">
              <Input value={baseImage} onChange={(e) => setBaseImage(e.target.value)} />
            </Field>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/70">
                Task Milestone Steps
              </span>
              <div className="mt-2 flex flex-col gap-2">
                {labSteps.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-3 border-2 border-ink bg-white p-2.5">
                    <span className="flex h-5 w-5 items-center justify-center border border-ink bg-sun text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-[12px] font-medium flex-1">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader title="Short Answer / Essay Rubric" tone="sky" />
          <CardBody className="flex flex-col gap-4 max-w-3xl">
            <Field label="Question Prompt">
              <Textarea rows={3} placeholder="Explain the primary advantages of B-Trees over Binary Search Trees in secondary storage..." />
            </Field>
            <Field label="Grading Rubric Criteria (Max 5 Points each)">
              <Textarea rows={4} placeholder="Criterion 1: Disk I/O reduction and block-factor alignment (2 marks)\nCriterion 2: Tree height bounds (2 marks)\nCriterion 3: Rebalancing during insertion/deletion (1 mark)" />
            </Field>
          </CardBody>
        </Card>
      )}
    </>
  )
}
