"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { ProgressBar, Stat } from "@/components/ui/stat"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { studentCourses } from "@/lib/data"

const courseDetails = [
  {
    id: "c1",
    code: "CS301",
    title: "Data Structures & Algorithms",
    credits: 4,
    faculty: "Dr. Ananya Rao",
    email: "ananya.rao@hindustan.edu",
    attendance: 94,
    units: [
      { num: "Unit 1", name: "Arrays, Linked Lists, Stacks & Queues", status: "Completed", tests: "2 tests taken" },
      { num: "Unit 2", name: "Trees, Binary Heaps & BSTs", status: "Completed", tests: "1 quiz taken" },
      { num: "Unit 3", name: "Hashing & Disjoint Sets", status: "In Progress", tests: "Midterm pending" },
      { num: "Unit 4", name: "Graph Algorithms & Shortest Path", status: "Upcoming", tests: "Lab assignment" },
      { num: "Unit 5", name: "Dynamic Programming & Greedy", status: "Upcoming", tests: "Final exam item" },
    ],
  },
  {
    id: "c2",
    code: "CS305",
    title: "Operating Systems",
    credits: 4,
    faculty: "Prof. Rahul Menon",
    email: "rahul.menon@hindustan.edu",
    attendance: 88,
    units: [
      { num: "Unit 1", name: "OS Architecture & System Calls", status: "Completed", tests: "Quiz 1 passed" },
      { num: "Unit 2", name: "Processes, Threads & CPU Scheduling", status: "Completed", tests: "Assignment 1" },
      { num: "Unit 3", name: "Process Synchronization & Deadlocks", status: "In Progress", tests: "Quiz 2 today" },
      { num: "Unit 4", name: "Memory Management & Paging", status: "Upcoming", tests: "Lab 3" },
      { num: "Unit 5", name: "File Systems & Mass Storage", status: "Upcoming", tests: "End-sem item" },
    ],
  },
  {
    id: "c3",
    code: "CS310",
    title: "Database Management Systems",
    credits: 4,
    faculty: "Dr. Sneha Iyer",
    email: "sneha.iyer@hindustan.edu",
    attendance: 96,
    units: [
      { num: "Unit 1", name: "ER Modeling & Relational Algebra", status: "Completed", tests: "100% score" },
      { num: "Unit 2", name: "SQL Queries, Views & Triggers", status: "Completed", tests: "SQL Lab passed" },
      { num: "Unit 3", name: "Normalization (1NF to BCNF)", status: "In Progress", tests: "Unit test pending" },
      { num: "Unit 4", name: "Transaction Processing & ACID", status: "Upcoming", tests: "Assignment 2" },
      { num: "Unit 5", name: "Indexing, B+ Trees & NoSQL", status: "Upcoming", tests: "Lab final" },
    ],
  },
  {
    id: "c4",
    code: "EC2XX",
    title: "Signals & Systems (Elective)",
    credits: 3,
    faculty: "Dr. Vikram Shetty",
    email: "vikram.shetty@hindustan.edu",
    attendance: 82,
    units: [
      { num: "Unit 1", name: "Continuous & Discrete Time Signals", status: "Completed", tests: "Quiz 1 passed" },
      { num: "Unit 2", name: "LTI Systems & Convolution", status: "In Progress", tests: "Problem set 2" },
      { num: "Unit 3", name: "Fourier Series & Transform", status: "Upcoming", tests: "Midterm test" },
      { num: "Unit 4", name: "Laplace Transform & Transfer Functions", status: "Upcoming", tests: "Assignment 3" },
      { num: "Unit 5", name: "Z-Transform & Discrete Filters", status: "Upcoming", tests: "Final exam" },
    ],
  },
]

export default function StudentCoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState("CS301")

  const activeCourse = courseDetails.find((c) => c.code === selectedCourse) ?? courseDetails[0]

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Student Academics</p>
          <h1 className="mt-1 font-display text-2xl text-ink">My Enrolled Courses</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            Current Term: Semester 5 · 4 Registered Courses · 15 Total Credits
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            ⭳ Download Semester Syllabus PDF
          </Button>
          <Link href="/student/exams">
            <Button variant="default" size="sm">
              View Exam Schedule →
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Total Enrolled" value="4" sub="15 Core + 3 Elective" color="bg-sunlight" />
        <Stat label="Avg. Attendance" value="90.0%" delta={{ dir: "up", text: "Healthy" }} color="bg-mintlight" />
        <Stat label="Assessments Passed" value="12" sub="3 more scheduled" color="bg-skylight" />
        <Stat label="Instructor Contact" value="4 Active" sub="Office hours open" color="bg-bubblegum" />
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {studentCourses.map((c) => {
          const isSelected = selectedCourse === c.code
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCourse(c.code)}
              className={`nb-press cursor-pointer border-2 border-ink p-4 transition-all ${
                isSelected
                  ? "bg-sun shadow-[4px_4px_0_#0a0a0a]"
                  : "bg-white shadow-[2px_2px_0_#0a0a0a] hover:bg-paper"
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge tone="dark">{c.code}</Badge>
                <Badge tone={c.grade.startsWith("A") ? "success" : "info"}>Grade {c.grade}</Badge>
              </div>
              <h3 className="mt-2.5 font-display text-[14px] text-ink">{c.title}</h3>
              <p className="mt-1 text-[11px] font-medium text-ink/60">{c.faculty}</p>
              <div className="mt-3">
                <ProgressBar value={c.progress} height="h-2.5" color="bg-ink" />
                <div className="mt-1.5 flex justify-between text-[10px] font-bold text-ink/60">
                  <span>Progress</span>
                  <span>{c.progress}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detailed Selected Course Overview */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title={`${activeCourse.code} · ${activeCourse.title}`}
            tone="sunlight"
            action={<Badge tone="dark">{activeCourse.credits} Credits</Badge>}
          />
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-paper2 p-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/60">Instructor</span>
                <p className="font-bold text-ink">{activeCourse.faculty}</p>
                <p className="text-[11px] font-medium text-ink/60">{activeCourse.email}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  ✉ Email Instructor
                </Button>
                <Button variant="dark" size="sm">
                  Course Resources ↗
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-display text-[13px] text-ink">Unit-wise Syllabus & Mastery</h4>
              <TableRoot className="border-0 shadow-none">
                <THead>
                  <TR>
                    <TH>Unit</TH>
                    <TH>Topics Covered</TH>
                    <TH>Status</TH>
                    <TH className="text-right">Assessments</TH>
                  </TR>
                </THead>
                <TBody>
                  {activeCourse.units.map((u) => (
                    <TR key={u.num}>
                      <TD className="font-bold text-ink whitespace-nowrap">{u.num}</TD>
                      <TD className="font-medium text-ink">{u.name}</TD>
                      <TD>
                        <Badge
                          tone={
                            u.status === "Completed"
                              ? "success"
                              : u.status === "In Progress"
                              ? "warning"
                              : "outline"
                          }
                        >
                          {u.status}
                        </Badge>
                      </TD>
                      <TD className="text-right text-[11px] font-medium text-ink/70">{u.tests}</TD>
                    </TR>
                  ))}
                </TBody>
              </TableRoot>
            </div>
          </CardBody>
        </Card>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader title="Attendance & Eligibility" tone="mint" />
            <CardBody className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl text-ink">{activeCourse.attendance}%</span>
                <Badge tone={activeCourse.attendance >= 85 ? "success" : "warning"}>
                  {activeCourse.attendance >= 85 ? "Exam Eligible" : "Needs Attention"}
                </Badge>
              </div>
              <p className="text-[11px] font-medium text-ink/60">
                Minimum 75% required by Hindustan University regulation to appear for semester end exams.
              </p>
              <div className="border-2 border-dashed border-ink/40 bg-paper p-2.5 text-[11px] font-medium text-ink/70">
                ✓ 28 of 30 lectures attended this semester.
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Upcoming Assessments" tone="candy" />
            <CardBody className="flex flex-col gap-3">
              <div className="border-2 border-ink bg-white p-2.5 shadow-[2px_2px_0_#0a0a0a]">
                <span className="text-[10px] font-bold uppercase text-tomato">High Stakes</span>
                <h5 className="font-bold text-ink">Midterm Examination</h5>
                <p className="text-[11px] text-ink/60">Sep 18, 10:00 AM · 90 Minutes · 100 Marks</p>
                <Link href="/student/exams/mcq" className="mt-2 block">
                  <Button variant="default" size="sm" className="w-full justify-center">
                    Launch Practice Exam →
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  )
}
