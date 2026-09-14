"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Stat } from "@/components/ui/stat"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"

const examList = [
  {
    id: "mcq-dsa",
    title: "DSA Midterm — MCQ Examination",
    course: "CS301",
    courseName: "Data Structures & Algorithms",
    kind: "MCQ (42 Questions)",
    date: "Sep 18, 10:00 AM",
    duration: "90 min",
    marks: 100,
    status: "LIVE NOW",
    route: "/student/exams/mcq",
    type: "live",
  },
  {
    id: "coding-os",
    title: "OS Quiz 2 — Concurrency & Algorithms",
    course: "CS305",
    courseName: "Operating Systems",
    kind: "Coding (3 Problems)",
    date: "Sep 20, 02:00 PM",
    duration: "45 min",
    marks: 40,
    status: "LIVE NOW",
    route: "/student/exams/coding",
    type: "live",
  },
  {
    id: "lab-dbms",
    title: "DBMS Final Lab — Cloud Sandbox",
    course: "CS310",
    courseName: "Database Management Systems",
    kind: "Interactive Sandbox Lab",
    date: "Sep 22, 09:30 AM",
    duration: "120 min",
    marks: 60,
    status: "SCHEDULED",
    route: "/student/exams/lab",
    type: "scheduled",
  },
  {
    id: "dsp-final",
    title: "DSP Final Theory Examination",
    course: "EC210",
    courseName: "Digital Signal Processing",
    kind: "Mixed (Theory + Numerical)",
    date: "Sep 25, 10:00 AM",
    duration: "120 min",
    marks: 100,
    status: "SCHEDULED",
    route: "#",
    type: "scheduled",
  },
  {
    id: "dsa-quiz-1",
    title: "DSA Quiz 1 — Arrays & Linked Lists",
    course: "CS301",
    courseName: "Data Structures & Algorithms",
    kind: "MCQ (20 Questions)",
    date: "Aug 24, 11:00 AM",
    duration: "45 min",
    marks: 100,
    score: "82/100 (Pass)",
    status: "COMPLETED",
    route: "/student/results",
    type: "completed",
  },
  {
    id: "os-assign-2",
    title: "OS Assignment 2 — CPU Scheduling",
    course: "CS305",
    courseName: "Operating Systems",
    kind: "Coding + Short Answer",
    date: "Sep 01, 04:00 PM",
    duration: "60 min",
    marks: 100,
    score: "74/100 (Pass)",
    status: "COMPLETED",
    route: "/student/results",
    type: "completed",
  },
]

export default function StudentExamsPage() {
  const [filter, setFilter] = useState<"all" | "live" | "scheduled" | "completed">("all")

  const filtered = filter === "all" ? examList : examList.filter((e) => e.type === filter)

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Proctored Assessment Portal</p>
          <h1 className="mt-1 font-display text-2xl text-ink">Exam & Test Center</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            Secure proctored test sessions with automated environment verification and instant submission sync.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Exam Conduct Guidelines
          </Button>
          <Link href="/student/results">
            <Button variant="candy" size="sm">
              Past Exam Results →
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Live Right Now" value="2" delta={{ dir: "up", text: "Ready to enter" }} color="bg-tomato text-white" />
        <Stat label="Scheduled Ahead" value="2" sub="Next 7 days" color="bg-sunlight" />
        <Stat label="Completed This Term" value="6" sub="All recorded" color="bg-mintlight" />
        <Stat label="Proctoring Status" value="Verified" sub="Webcam & mic active" color="bg-skylight" />
      </div>

      {/* System Check Banner */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="flex items-center gap-3 border-2 border-ink bg-mint p-3 shadow-[2px_2px_0_#0a0a0a]">
          <span className="flex h-7 w-7 items-center justify-center border-2 border-ink bg-white font-bold">✓</span>
          <div>
            <span className="text-[10px] font-bold uppercase text-ink/60">Webcam Feed</span>
            <p className="font-bold text-ink text-[12px]">Device Connected</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-2 border-ink bg-mint p-3 shadow-[2px_2px_0_#0a0a0a]">
          <span className="flex h-7 w-7 items-center justify-center border-2 border-ink bg-white font-bold">✓</span>
          <div>
            <span className="text-[10px] font-bold uppercase text-ink/60">Microphone</span>
            <p className="font-bold text-ink text-[12px]">Audio Normal</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-2 border-ink bg-mint p-3 shadow-[2px_2px_0_#0a0a0a]">
          <span className="flex h-7 w-7 items-center justify-center border-2 border-ink bg-white font-bold">✓</span>
          <div>
            <span className="text-[10px] font-bold uppercase text-ink/60">Fullscreen Lock</span>
            <p className="font-bold text-ink text-[12px]">Extension Ready</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-2 border-ink bg-mint p-3 shadow-[2px_2px_0_#0a0a0a]">
          <span className="flex h-7 w-7 items-center justify-center border-2 border-ink bg-white font-bold">✓</span>
          <div>
            <span className="text-[10px] font-bold uppercase text-ink/60">Network Latency</span>
            <p className="font-bold text-ink text-[12px]">24 ms (Excellent)</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-white p-3 shadow-[3px_3px_0_#0a0a0a]">
        <div className="flex flex-wrap gap-1">
          {(["all", "live", "scheduled", "completed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`nb-press border-2 px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                filter === t
                  ? "border-ink bg-sun text-ink shadow-[2px_2px_0_#0a0a0a]"
                  : "border-transparent text-ink/70 hover:border-ink hover:bg-paper"
              }`}
            >
              {t === "all" ? "All Assessments" : t}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-bold text-ink/60">
          Showing {filtered.length} of {examList.length} exams
        </span>
      </div>

      {/* Exams Cards / Interactive list */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((exam) => (
          <div
            key={exam.id}
            className="flex flex-col justify-between border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#0a0a0a]"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge tone="dark">{exam.course}</Badge>
                <Badge
                  tone={
                    exam.status === "LIVE NOW"
                      ? "danger"
                      : exam.status === "SCHEDULED"
                      ? "warning"
                      : "success"
                  }
                >
                  {exam.status}
                </Badge>
              </div>
              <h3 className="mt-2 font-display text-[15px] text-ink">{exam.title}</h3>
              <p className="text-[11px] font-medium text-ink/60">{exam.courseName}</p>

              <div className="mt-3 flex flex-col gap-1.5 border-t-2 border-dashed border-ink/20 pt-3 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-ink/60">Format:</span>
                  <span className="font-bold text-ink">{exam.kind}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Schedule:</span>
                  <span className="font-bold text-ink">{exam.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Duration & Marks:</span>
                  <span className="font-bold text-ink">{exam.duration} · {exam.marks} Marks</span>
                </div>
                {exam.score ? (
                  <div className="flex justify-between">
                    <span className="text-ink/60">Final Result:</span>
                    <span className="font-bold text-mint">{exam.score}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t-2 border-ink">
              {exam.type === "live" ? (
                <Link href={exam.route} className="block w-full">
                  <Button variant="default" size="md" className="w-full justify-center">
                    Enter Live Exam Session →
                  </Button>
                </Link>
              ) : exam.type === "scheduled" ? (
                <Link href={exam.route} className="block w-full">
                  <Button variant="outline" size="md" className="w-full justify-center">
                    Preview Exam Details
                  </Button>
                </Link>
              ) : (
                <Link href={exam.route} className="block w-full">
                  <Button variant="candy" size="md" className="w-full justify-center">
                    Review Graded Paper
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
