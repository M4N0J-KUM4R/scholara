"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Stat } from "@/components/ui/stat"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { studentResults, studentTranscripts } from "@/lib/data"

export default function StudentResultsPage() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Academic Registry</p>
          <h1 className="mt-1 font-display text-2xl text-ink">Results & Transcripts</h1>
          <p className="mt-0.5 text-[12px] font-medium text-ink/60">
            Aarav Sharma · Roll No: 21CSE001 · B.Tech Computer Science & Engineering
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            ⭳ Download Official Transcript (PDF)
          </Button>
          <Button variant="dark" size="sm">
            Request Re-evaluation
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Cumulative GPA" value="8.74" sub="Scale: 10.0" color="bg-mintlight" />
        <Stat label="Credits Earned" value="108" sub="Out of 160 required" color="bg-sunlight" />
        <Stat label="Batch Ranking" value="#4" sub="Top 3% of 124 students" color="bg-bubblegum" />
        <Stat label="Active Backlogs" value="0" sub="All clears" color="bg-skylight" />
      </div>

      {/* Semester History */}
      <Card>
        <CardHeader
          title="Semester-wise SGPA Performance Record"
          tone="sunlight"
          action={<Badge tone="dark">5 Terms Tracked</Badge>}
        />
        <CardBody className="p-0">
          <TableRoot className="border-0 shadow-none">
            <THead>
              <TR>
                <TH>Academic Term</TH>
                <TH>SGPA</TH>
                <TH>Credits Earned</TH>
                <TH>Status</TH>
                <TH className="text-right">Action</TH>
              </TR>
            </THead>
            <TBody>
              {studentTranscripts.map((t) => (
                <TR key={t.term}>
                  <TD className="font-bold text-ink">{t.term}</TD>
                  <TD>
                    <span className="font-display text-base text-ink">{t.sgpa.toFixed(2)}</span>
                  </TD>
                  <TD className="font-medium text-ink/80">{t.credits} Credits</TD>
                  <TD>
                    <Badge tone={t.status === "Completed" ? "success" : "warning"}>
                      {t.status}
                    </Badge>
                  </TD>
                  <TD className="text-right">
                    <Button variant="outline" size="sm">
                      Grade Sheet ⭳
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </TableRoot>
        </CardBody>
      </Card>

      {/* Current Term Exam Breakdown */}
      <Card>
        <CardHeader
          title="Current Term Assessment Results"
          tone="mint"
          action={
            <Link href="/student/exams">
              <Button variant="outline" size="sm">
                View Exam Center →
              </Button>
            </Link>
          }
        />
        <CardBody className="p-0">
          <TableRoot className="border-0 shadow-none">
            <THead>
              <TR>
                <TH>Assessment Title</TH>
                <TH>Course Code</TH>
                <TH>Score</TH>
                <TH>Grading Status</TH>
                <TH className="text-right">Detailed Analysis</TH>
              </TR>
            </THead>
            <TBody>
              {studentResults.map((r, i) => (
                <TR key={i}>
                  <TD className="font-bold text-ink">{r.exam}</TD>
                  <TD><Badge tone="dark">{r.course}</Badge></TD>
                  <TD>
                    {r.when === "Pending" ? (
                      <span className="font-medium text-ink/50">Evaluation in progress</span>
                    ) : (
                      <span className="font-display text-base text-ink">{r.score} / {r.max}</span>
                    )}
                  </TD>
                  <TD>
                    {r.when === "Pending" ? (
                      <Badge tone="warning">Pending Moderation</Badge>
                    ) : (
                      <Badge tone="success">Final Result Published</Badge>
                    )}
                  </TD>
                  <TD className="text-right">
                    <Button variant="ghost" size="sm">
                      Question Breakdown →
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
