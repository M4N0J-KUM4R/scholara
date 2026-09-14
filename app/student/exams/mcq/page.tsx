"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { mcqExam } from "@/lib/data"

// Extended question set for the 20-palette demo
const fullMcqQuestions = [
  ...mcqExam,
  { kind: "mcq" as const, n: 6, stem: "Which algorithm finds the shortest path in a weighted graph with non-negative edges?", options: ["Bellman-Ford", "Dijkstra's", "Floyd-Warshall", "Prim's"], answer: 1, marks: 2 },
  { kind: "mcq" as const, n: 7, stem: "What is the height of a balanced AVL tree with n nodes?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 1, marks: 2 },
  { kind: "mcq" as const, n: 8, stem: "Which collision resolution technique uses linked lists on hash buckets?", options: ["Linear probing", "Quadratic probing", "Separate chaining", "Double hashing"], answer: 2, marks: 2 },
  { kind: "mcq" as const, n: 9, stem: "What is the amortized cost of inserting an element into a dynamic array?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 0, marks: 2 },
  { kind: "mcq" as const, n: 10, stem: "Which sorting algorithm is in-place and stable?", options: ["Quick sort", "Merge sort", "Insertion sort", "Heap sort"], answer: 2, marks: 2 },
  { kind: "mcq" as const, n: 11, stem: "Which graph representation is optimal for sparse graphs with |V| nodes and |E| edges?", options: ["Adjacency matrix", "Adjacency list", "Incidence matrix", "Edge array"], answer: 1, marks: 2 },
  { kind: "mcq" as const, n: 12, stem: "What is the minimum number of queues needed to implement a stack?", options: ["1", "2", "3", "None"], answer: 1, marks: 2 },
  { kind: "mcq" as const, n: 13, stem: "In a min-heap, where is the second smallest element always located?", options: ["At root", "At index 1 or 2 (children of root)", "At leaves", "Anywhere"], answer: 1, marks: 2 },
  { kind: "mcq" as const, n: 14, stem: "Which data structure is fundamentally used for Breadth-First Search (BFS)?", options: ["Stack", "Queue", "Priority Queue", "Deque"], answer: 1, marks: 2 },
  { kind: "mcq" as const, n: 15, stem: "What is the space complexity of Depth-First Search on a graph of depth d?", options: ["O(1)", "O(d)", "O(V²)", "O(V + E)"], answer: 1, marks: 2 },
  { kind: "mcq" as const, n: 16, stem: "A red-black tree ensures that no path from root to leaf is more than twice as long as any other path.", options: ["True", "False", "Only for even nodes", "Only when full"], answer: 0, marks: 2 },
  { kind: "mcq" as const, n: 17, stem: "Which problem can be solved in O(V + E) using Topological Sort on a DAG?", options: ["All-pairs shortest path", "Single-source shortest path", "Traveling salesperson", "Maximum clique"], answer: 1, marks: 2 },
  { kind: "mcq" as const, n: 18, stem: "What is the recurrence relation for Merge Sort?", options: ["T(n) = T(n-1) + O(1)", "T(n) = 2T(n/2) + O(n)", "T(n) = T(n/2) + O(1)", "T(n) = 2T(n-1) + O(n)"], answer: 1, marks: 2 },
  { kind: "mcq" as const, n: 19, stem: "Which data structure is optimal for autocomplete search suggestions?", options: ["Binary Search Tree", "Trie", "Hash Table", "Segment Tree"], answer: 1, marks: 2 },
  { kind: "mcq" as const, n: 20, stem: "What is the maximum number of edges in an undirected simple graph with n vertices?", options: ["n(n-1)/2", "n²", "2n", "n(n+1)/2"], answer: 0, marks: 2 },
]

export default function ExamTakingMcqPage() {
  const [currentIdx, setCurrentIdx] = useState(6) // default question 7 (index 6) matching wireframe
  const [answers, setAnswers] = useState<Record<number, number>>({ 0: 0, 1: 1, 2: 1, 6: 2 })
  const [flagged, setFlagged] = useState<Record<number, boolean>>({ 3: true })
  const [secondsLeft, setSecondsLeft] = useState(42 * 60 + 18) // 00:42:18
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Countdown timer effect
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

  const currentQ = fullMcqQuestions[currentIdx]
  const currentAnswer = answers[currentIdx]
  const isFlagged = flagged[currentIdx] ?? false

  const selectOption = (optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }))
  }

  const clearCurrent = () => {
    setAnswers((prev) => {
      const next = { ...prev }
      delete next[currentIdx]
      return next
    })
  }

  const toggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentIdx]: !prev[currentIdx] }))
  }

  const answeredCount = Object.keys(answers).length
  const flaggedCount = Object.values(flagged).filter(Boolean).length
  const unansweredCount = fullMcqQuestions.length - answeredCount

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Slim Proctored Exam Top Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 border-ink bg-white px-4 py-2.5 shadow-[0_2px_0_#0a0a0a]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-sun font-display text-xs text-ink shadow-[2px_2px_0_#0a0a0a]">
            ✎
          </span>
          <div>
            <h1 className="font-display text-[14px] text-ink">DSA Midterm — MCQ Examination</h1>
            <p className="text-[10px] font-bold text-ink/50">Course: CS301 · Attempt 1 of 1</p>
          </div>
          <Badge tone="dark">20 Questions · 100 Marks</Badge>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Proctoring Badge */}
          <div className="flex items-center gap-1.5 border-2 border-ink bg-mint px-2.5 py-1 text-[11px] font-bold text-ink shadow-[2px_2px_0_#0a0a0a]">
            <span className="h-2 w-2 rounded-full bg-tomato animate-pulse" />
            <span>PROCTORING ACTIVE</span>
          </div>

          {/* Live Webcam Thumbnail Simulation */}
          <div className="relative flex h-8 w-12 items-center justify-center border-2 border-ink bg-ink text-sun text-[10px] font-bold max-sm:hidden">
            <span>CAM</span>
            <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-mint" />
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 border-2 border-ink bg-sun px-3 py-1 shadow-[2px_2px_0_#0a0a0a]">
            <span className="text-[12px]">⏱</span>
            <span className="font-mono text-[14px] font-bold tracking-widest text-ink">
              {formatTime(secondsLeft)}
            </span>
          </div>

          <Button variant="danger" size="sm" onClick={() => setSubmitModalOpen(true)}>
            Submit Exam
          </Button>
        </div>
      </header>

      {/* Warning Notice */}
      <div className="border-b-2 border-ink bg-sunlight px-4 py-1.5 text-center text-[11px] font-bold text-ink">
        ⚠ Fullscreen enforcement active. Tab switches and external key combinations are recorded in your proctoring audit log.
      </div>

      {/* Main Examination Body */}
      <div className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
        {/* Question Area (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card>
            <CardHeader
              title={`Question ${currentIdx + 1} of ${fullMcqQuestions.length}`}
              tone="sunlight"
              action={
                <div className="flex items-center gap-2">
                  <Badge tone="sky">{currentQ.marks} Marks</Badge>
                  <Badge tone="outline">Bloom: Apply</Badge>
                </div>
              }
            />
            <CardBody className="flex flex-col gap-5 p-6">
              <p className="font-display text-[16px] text-ink leading-snug">
                {currentQ.stem}
              </p>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = currentAnswer === oIdx
                  const letters = ["A", "B", "C", "D"]
                  return (
                    <div
                      key={oIdx}
                      onClick={() => selectOption(oIdx)}
                      className={`nb-press flex items-center gap-3 border-2 border-ink p-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-sun shadow-[3px_3px_0_#0a0a0a]"
                          : "bg-white hover:bg-paper shadow-[2px_2px_0_#0a0a0a]"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink font-bold text-xs ${
                          isSelected ? "bg-ink text-sun" : "bg-paper text-ink"
                        }`}
                      >
                        {letters[oIdx]}
                      </span>
                      <span className="font-medium text-[13px] text-ink flex-1">
                        {opt}
                      </span>
                      {isSelected ? (
                        <span className="font-bold text-ink text-sm">✓</span>
                      ) : null}
                    </div>
                  )
                })}
              </div>

              {/* Bottom Actions inside Card */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-ink/20 pt-4 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCurrent}
                  disabled={currentAnswer === undefined}
                >
                  Clear Selection
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant={isFlagged ? "danger" : "outline"}
                    size="sm"
                    onClick={toggleFlag}
                  >
                    ⚑ {isFlagged ? "Flagged for Review" : "Flag for Review"}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Prev / Next navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            >
              ← Previous Question
            </Button>
            <span className="text-[12px] font-bold text-ink/60">
              {answeredCount} of {fullMcqQuestions.length} Answered
            </span>
            <Button
              variant="default"
              size="md"
              disabled={currentIdx === fullMcqQuestions.length - 1}
              onClick={() => setCurrentIdx((i) => Math.min(fullMcqQuestions.length - 1, i + 1))}
            >
              Next Question →
            </Button>
          </div>
        </div>

        {/* Right Rail: Question Palette & Proctoring Audit */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Question Palette" tone="candy" action={<Badge tone="dark">20 total</Badge>} />
            <CardBody className="flex flex-col gap-4 p-4">
              <div className="grid grid-cols-5 gap-2">
                {fullMcqQuestions.map((_, qIdx) => {
                  const isCurrent = currentIdx === qIdx
                  const isAns = answers[qIdx] !== undefined
                  const isFlg = flagged[qIdx] === true

                  let colorClass = "bg-white text-ink border-ink"
                  if (isCurrent) {
                    colorClass = "bg-sun text-ink border-ink shadow-[2px_2px_0_#0a0a0a] ring-2 ring-ink"
                  } else if (isFlg) {
                    colorClass = "bg-tang text-ink border-ink font-bold"
                  } else if (isAns) {
                    colorClass = "bg-mint text-ink border-ink font-bold"
                  }

                  return (
                    <button
                      key={qIdx}
                      onClick={() => setCurrentIdx(qIdx)}
                      className={`nb-press flex h-9 items-center justify-center border-2 text-[12px] font-bold ${colorClass}`}
                    >
                      {isFlg ? `⚑${qIdx + 1}` : qIdx + 1}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-1.5 border-t-2 border-dashed border-ink/20 pt-3 text-[10px] font-bold">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 border border-ink bg-sun" />
                  <span>Current Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 border border-ink bg-mint" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 border border-ink bg-tang" />
                  <span>Flagged for Review ({flaggedCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 border border-ink bg-white" />
                  <span>Unanswered ({unansweredCount})</span>
                </div>
              </div>

              <Button
                variant="danger"
                size="md"
                className="w-full justify-center mt-2"
                onClick={() => setSubmitModalOpen(true)}
              >
                Submit Exam Paper
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Live Proctoring Audit" tone="sky" />
            <CardBody className="flex flex-col gap-2 text-[11px] font-medium text-ink/70">
              <div className="flex justify-between">
                <span>Lockdown Browser:</span>
                <span className="font-bold text-mint">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Tab Switched:</span>
                <span className="font-bold text-ink">0 times</span>
              </div>
              <div className="flex justify-between">
                <span>Webcam Heuristics:</span>
                <span className="font-bold text-mint">Compliant</span>
              </div>
              <div className="flex justify-between">
                <span>Answers Saved:</span>
                <span className="font-bold text-ink">Live Realtime</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Confirm Exam Submission"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSubmitModalOpen(false)}>
              Continue Exam
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setSubmitted(true)
                setSubmitModalOpen(false)
              }}
            >
              Confirm & Submit Now
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-[13px] font-medium text-ink">
            Are you sure you want to finish and submit your answers for{" "}
            <strong>DSA Midterm — MCQ</strong>? You will not be able to change your responses once confirmed.
          </p>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="border-2 border-ink bg-mint p-2.5">
              <span className="block font-display text-xl">{answeredCount}</span>
              <span className="text-[10px] font-bold uppercase">Answered</span>
            </div>
            <div className="border-2 border-ink bg-tang p-2.5">
              <span className="block font-display text-xl">{flaggedCount}</span>
              <span className="text-[10px] font-bold uppercase">Flagged</span>
            </div>
            <div className="border-2 border-ink bg-tomato p-2.5 text-white">
              <span className="block font-display text-xl">{unansweredCount}</span>
              <span className="text-[10px] font-bold uppercase">Unanswered</span>
            </div>
          </div>

          {unansweredCount > 0 ? (
            <div className="border-2 border-ink bg-tomato/15 p-2.5 text-[11px] font-bold text-tomato">
              ⚠ Warning: You have {unansweredCount} unanswered questions that will receive 0 marks!
            </div>
          ) : null}
        </div>
      </Modal>

      {/* Post-Submission Receipt View */}
      {submitted ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4">
          <div className="w-full max-w-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_#ffdc58] text-center flex flex-col items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center border-2 border-ink bg-mint text-2xl font-bold">
              ✓
            </span>
            <div>
              <h2 className="font-display text-xl text-ink">Exam Submitted Successfully!</h2>
              <p className="mt-1 text-[12px] font-medium text-ink/70">
                Your answers have been cryptographically hashed and saved in the CollegeCloud database.
              </p>
            </div>
            <div className="w-full border-2 border-ink bg-white p-3 text-left text-[11px] space-y-1">
              <div><strong>Exam:</strong> CS301 DSA Midterm</div>
              <div><strong>Candidate:</strong> Aarav Sharma (21CSE001)</div>
              <div><strong>Answers Logged:</strong> {answeredCount} / 20</div>
              <div><strong>Receipt Hash:</strong> 0x8F92...B34C</div>
              <div><strong>Submitted At:</strong> Today, {new Date().toLocaleTimeString()}</div>
            </div>
            <Link href="/student" className="w-full">
              <Button variant="default" size="lg" className="w-full justify-center">
                Return to Student Dashboard
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
