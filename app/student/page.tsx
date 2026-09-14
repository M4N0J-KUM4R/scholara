"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { ProgressBar, Stat } from "@/components/ui/stat"
import { studentCourses, studentExams, studentNotifications, studentResults } from "@/lib/data"

export default function StudentDashboardPage() {
  return (
    <>
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-sun p-5 shadow-[4px_4px_0_#0a0a0a]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sun">
              Student Workspace
            </span>
            <span className="text-[11px] font-bold text-ink/70">
              Roll No: 21CSE001 · Semester 5
            </span>
          </div>
          <h1 className="mt-1 font-display text-2xl text-ink md:text-3xl">
            Welcome back, Aarav Sharma!
          </h1>
          <p className="mt-1 text-[13px] font-medium text-ink/80">
            Hindustan University · Computer Science & Engineering (2021–2025)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/student/portfolio">
            <Button variant="outline" size="sm">
              ★ My Portfolio
            </Button>
          </Link>
          <Link href="/student/exams">
            <Button variant="dark" size="sm">
              ✎ Exam Portal →
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat
          label="Enrolled Courses"
          value="4"
          sub="24 credits this term"
          color="bg-sunlight"
        />
        <Stat
          label="Upcoming Exams"
          value="3"
          delta={{ dir: "up", text: "2 live today" }}
          color="bg-bubblegum"
        />
        <Stat
          label="Current CGPA"
          value="8.74"
          sub="Top 5% of 2021–25 A"
          color="bg-mintlight"
        />
        <Stat
          label="Attendance"
          value="91.4%"
          sub="Above 75% cutoff"
          color="bg-skylight"
        />
      </div>

      {/* Main Grid: Courses + Live Exams */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Enrolled Courses */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Enrolled Courses"
            tone="sunlight"
            action={
              <Link href="/student/courses">
                <Button variant="outline" size="sm">
                  View all courses →
                </Button>
              </Link>
            }
          />
          <CardBody className="flex flex-col gap-4">
            {studentCourses.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-2 border-2 border-ink bg-paper p-3 shadow-[2px_2px_0_#0a0a0a]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge tone="dark">{c.code}</Badge>
                    <span className="font-display text-[14px] text-ink">{c.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-ink/60">{c.faculty}</span>
                    <Badge tone="success">Grade {c.grade}</Badge>
                  </div>
                </div>
                <ProgressBar
                  value={c.progress}
                  label="Course Completion"
                  color="bg-sun"
                  height="h-3"
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Live & Upcoming Exams */}
        <Card>
          <CardHeader
            title="Upcoming & Live Exams"
            tone="candy"
            action={<Badge tone="dark">2 active</Badge>}
          />
          <CardBody className="flex flex-col gap-3">
            {studentExams.map((exam) => (
              <div
                key={exam.id}
                className="flex flex-col gap-2.5 border-2 border-ink bg-white p-3 shadow-[2px_2px_0_#0a0a0a]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[13px] text-ink">{exam.title}</span>
                  <Badge tone={exam.state === "live" ? "danger" : "warning"}>
                    {exam.state === "live" ? "● LIVE NOW" : "SCHEDULED"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium text-ink/60">
                  <span>{exam.when}</span>
                  <span>{exam.duration} · {exam.marks} marks</span>
                </div>
                {exam.id === "1" ? (
                  <Link href="/student/exams/mcq" className="w-full">
                    <Button variant="default" size="sm" className="w-full justify-center">
                      Enter Proctored Exam (MCQ) →
                    </Button>
                  </Link>
                ) : exam.id === "2" ? (
                  <Link href="/student/exams/coding" className="w-full">
                    <Button variant="candy" size="sm" className="w-full justify-center">
                      Launch Coding IDE →
                    </Button>
                  </Link>
                ) : (
                  <Link href="/student/exams/lab" className="w-full">
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      Launch Cloud Sandbox Lab →
                    </Button>
                  </Link>
                )}
              </div>
            ))}
            <div className="border-2 border-dashed border-ink/40 bg-paper2 p-2.5 text-[11px] font-medium text-ink/70">
              ℹ Proctored exams enforce full-screen mode, webcam proctoring, and tab-switch detection.
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Lower Row: Recent Results + Notifications */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent Results */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent Assessment Results"
            tone="mint"
            action={
              <Link href="/student/results">
                <Button variant="outline" size="sm">
                  View grade transcript →
                </Button>
              </Link>
            }
          />
          <CardBody className="p-0">
            <div className="divide-y-2 divide-ink">
              {studentResults.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 hover:bg-paper"
                >
                  <div>
                    <span className="font-bold text-ink">{r.exam}</span>
                    <span className="ml-2 text-[11px] font-medium text-ink/50">{r.course} · {r.when}</span>
                  </div>
                  <div>
                    {r.when === "Pending" ? (
                      <Badge tone="warning">Pending Grading</Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg text-ink">{r.score}%</span>
                        <Badge tone={r.score >= 75 ? "success" : "default"}>
                          {r.score >= 80 ? "Distinction" : "Pass"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader
            title="Notifications"
            tone="sky"
            action={<Badge tone="outline">{studentNotifications.filter(n => !n.read).length} new</Badge>}
          />
          <CardBody className="flex flex-col gap-2.5">
            {studentNotifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-2.5 border-b-2 border-dashed border-ink/20 pb-2.5 last:border-0 last:pb-0"
              >
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-none border border-ink ${
                    n.read ? "bg-paper2" : "bg-tomato shadow-[1px_1px_0_#0a0a0a]"
                  }`}
                />
                <div>
                  <p className="text-[12px] font-bold text-ink">{n.title}</p>
                  <p className="text-[10px] font-medium text-ink/50">{n.when}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Bottom Banner: Sync Career & Portfolio */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-white p-5 shadow-[4px_4px_0_#0a0a0a]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-grape text-lg font-bold text-white shadow-[2px_2px_0_#0a0a0a]">
            ★
          </span>
          <div>
            <h3 className="font-display text-[15px] text-ink">
              Connect GitHub & LinkedIn to Supercharge Your Academic Portfolio
            </h3>
            <p className="text-[12px] font-medium text-ink/65">
              Automatically import verified repositories, skills, and generate an accreditation-ready resume.
            </p>
          </div>
        </div>
        <Link href="/student/portfolio/connect">
          <Button variant="default">
            Connect Accounts →
          </Button>
        </Link>
      </div>
    </>
  )
}
