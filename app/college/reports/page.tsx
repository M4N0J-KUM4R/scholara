import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Donut, LineChart } from "@/components/ui/charts"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Select } from "@/components/ui/input"
import { TableRoot, TBody, TD, TH, THead, TR } from "@/components/ui/table"
import { itemAnalysis, outcomeAttainment } from "@/lib/data"

const trend = [55, 61, 58, 66, 70, 74, 82]

function discriminationTone(d: number): "success" | "warning" | "danger" {
  if (d > 0.3) return "success"
  if (d >= 0.1) return "warning"
  return "danger"
}

const verdictTone: Record<(typeof itemAnalysis)[number]["verdict"], "success" | "warning" | "danger"> = {
  Good: "success",
  Review: "warning",
  Drop: "danger",
}

const exportsList = [
  { title: "NAAC SSR", desc: "Self-study report sections auto-filled from attainment data.", meta: "PDF · generated Sep 12" },
  { title: "NBA Part B", desc: "Programme-level Part B tables for the current cycle.", meta: "XLSX · generated Sep 11" },
  { title: "CO–PO Matrix", desc: "Course-outcome to programme-outcome correlation grid.", meta: "PDF · generated Sep 10" },
  { title: "Attainment gap", desc: "Target vs achieved attainment for every CO this term.", meta: "XLSX · generated Sep 09" },
]

export default function CollegeReportsPage() {
  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-ink">Reports</h1>
          <p className="mt-1 text-[12px] font-medium text-ink/60">
            Outcome attainment, item quality and accreditation exports for the selected term.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select aria-label="Select term" className="w-44" defaultValue="sep-2026">
            <option value="sep-2026">Sep 2026 term</option>
            <option value="may-2026">May 2026 term</option>
            <option value="jan-2026">Jan 2026 term</option>
          </Select>
          <Button variant="outline">Export PDF</Button>
          <Button variant="outline">Export Excel</Button>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="Outcome attainment" tone="sunlight" action={<Badge tone="outline">CO1–CO6</Badge>} />
          <CardBody className="flex flex-col gap-3">
            <BarChart data={outcomeAttainment} />
            <p className="text-[11px] font-medium text-ink/60">
              6 of 6 course outcomes measured · 4 above the 65% target.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Pass / fail" tone="candy" />
          <CardBody className="flex flex-col items-center gap-4">
            <Donut value={66} caption="Pass rate" />
            <div className="flex flex-col gap-1.5 self-stretch">
              <div className="flex items-center justify-between text-[11px] font-medium text-ink/70">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="inline-block h-3 w-3 border-2 border-ink bg-mint" />
                  Pass — 552 students
                </span>
                <span className="font-bold text-ink">66%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium text-ink/70">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="inline-block h-3 w-3 border-2 border-ink bg-tomato" />
                  Fail — 288 students
                </span>
                <span className="font-bold text-ink">34%</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Student progress trend" tone="sky" action={<Badge tone="outline">Cohort avg</Badge>} />
          <CardBody className="flex flex-col gap-3">
            <LineChart points={trend} labels={trend.map((_, i) => `W${i + 1}`)} />
            <p className="text-[11px] font-medium text-ink/60">
              Average score up 27 points across the 7 weeks of the term.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Item analysis */}
      <TableRoot>
        <THead>
          <TR>
            <TH>Question</TH>
            <TH className="text-right">Difficulty (p)</TH>
            <TH>Discrimination (d)</TH>
            <TH>Verdict</TH>
          </TR>
        </THead>
        <TBody>
          {itemAnalysis.map((row) => (
            <TR key={row.q}>
              <TD className="font-bold text-ink">{row.q}</TD>
              <TD className="text-right">
                {row.p.toFixed(2)}
                <span className="ml-2 text-[10px] font-medium text-ink/45">
                  {row.p > 0.85 ? "too easy" : row.p < 0.4 ? "very hard" : "moderate"}
                </span>
              </TD>
              <TD>
                <Badge tone={discriminationTone(row.d)}>d = {row.d.toFixed(2)}</Badge>
              </TD>
              <TD><Badge tone={verdictTone[row.verdict]}>{row.verdict}</Badge></TD>
            </TR>
          ))}
        </TBody>
      </TableRoot>
      <p className="-mt-3 text-[11px] font-medium text-ink/50">
        From 1,842 graded responses on the DSA Midterm. Items with d &lt; 0.10 should be dropped or rewritten.
      </p>

      {/* Accreditation exports */}
      <div>
        <h2 className="mb-3 font-display text-[14px] text-ink">Accreditation exports</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {exportsList.map((x) => (
            <button
              key={x.title}
              type="button"
              className="nb-press nb-shadow-sm flex flex-col gap-2 border-2 border-ink bg-white p-4 text-left"
            >
              <span className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-sun font-display text-[14px] text-ink nb-shadow-sm" aria-hidden>
                ↓
              </span>
              <span className="text-[12px] font-bold text-ink">{x.title}</span>
              <span className="text-[10px] font-medium leading-snug text-ink/60">{x.desc}</span>
              <span className="mt-auto text-[9px] font-bold uppercase tracking-wide text-ink/45">{x.meta}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
