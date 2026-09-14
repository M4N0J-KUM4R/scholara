"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { Select } from "@/components/ui/input"

const codeTemplates: Record<string, string> = {
  "C++17": `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < (int)nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution s;
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = s.twoSum(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}`,
  "Python 3": `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, n in enumerate(nums):
            comp = target - n
            if comp in seen:
                return [seen[comp], i]
            seen[n] = i
        return []

# Test driver
if __name__ == "__main__":
    sol = Solution()
    print(sol.twoSum([2, 7, 11, 15], 9))`,
  "Java 17": `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
}

export default function ExamTakingCodingPage() {
  const [lang, setLang] = useState("C++17")
  const [code, setCode] = useState(codeTemplates["C++17"])
  const [secondsLeft, setSecondsLeft] = useState(38 * 60 + 4) // 00:38:04
  const [running, setRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<"t1" | "t2" | "t3" | "console">("t1")
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [lastSaved, setLastSaved] = useState("Just now")

  useEffect(() => {
    if (submitted) return
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [submitted])

  const handleLangChange = (newLang: string) => {
    setLang(newLang)
    setCode(codeTemplates[newLang] ?? "")
  }

  const runSampleTests = () => {
    setRunning(true)
    setTimeout(() => {
      setRunning(false)
      setActiveTab("t1")
      setLastSaved("Just now")
    }, 800)
  }

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 border-ink bg-white px-4 py-2.5 shadow-[0_2px_0_#0a0a0a]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-candy font-display text-xs text-ink shadow-[2px_2px_0_#0a0a0a]">
            &lt;/&gt;
          </span>
          <div>
            <h1 className="font-display text-[14px] text-ink">OS Quiz 2 — Concurrency & Algorithms</h1>
            <p className="text-[10px] font-bold text-ink/50">Question 12 of 42 · Attempt 1 of 1</p>
          </div>
          <Badge tone="dark">20 Marks · Time Limit: 1.0s</Badge>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-ink/60 max-sm:hidden">
            Auto-saved: <strong className="text-mint">{lastSaved}</strong>
          </span>

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
            Submit Question
          </Button>
        </div>
      </header>

      {/* Main Split Interface */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1600px] w-full mx-auto">
        {/* Left Column: Problem Description & Constraints (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto">
          <Card>
            <CardHeader
              title="Problem Description"
              tone="sunlight"
              action={<Badge tone="danger">Hard · 20 Marks</Badge>}
            />
            <CardBody className="flex flex-col gap-4 p-5">
              <div>
                <h2 className="font-display text-lg text-ink">Two Sum with Target Lookup</h2>
                <p className="mt-2 text-[13px] font-medium leading-relaxed text-ink/80">
                  Given an array of integers <code className="border border-ink bg-paper px-1 font-mono text-[12px]">nums</code> and an integer <code className="border border-ink bg-paper px-1 font-mono text-[12px]">target</code>, return <em>indices of the two numbers such that they add up to target</em>.
                </p>
                <p className="mt-2 text-[13px] font-medium leading-relaxed text-ink/80">
                  You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice. You can return the answer in any order.
                </p>
              </div>

              {/* Constraints Box */}
              <div className="border-2 border-ink bg-paper2 p-3.5 shadow-[2px_2px_0_#0a0a0a]">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink/70">Constraints & System Limits</h4>
                <ul className="mt-2 flex flex-col gap-1 text-[12px] font-mono font-medium text-ink">
                  <li>• 2 ≤ nums.length ≤ 10⁴</li>
                  <li>• -10⁹ ≤ nums[i] ≤ 10⁹</li>
                  <li>• -10⁹ ≤ target ≤ 10⁹</li>
                  <li>• Only one valid answer exists.</li>
                  <li>• Time Limit: 1.0s / test case</li>
                  <li>• Memory Limit: 256 MB</li>
                </ul>
              </div>

              {/* Sample Test Cases */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink/70">Sample Cases</h4>
                <div className="border-2 border-ink bg-white p-3 text-[12px] font-mono">
                  <div className="text-ink/60">Input: nums = [2,7,11,15], target = 9</div>
                  <div className="text-ink font-bold mt-1">Output: [0, 1]</div>
                  <div className="text-ink/60 text-[11px] mt-1 font-sans">Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</div>
                </div>

                <div className="border-2 border-ink bg-white p-3 text-[12px] font-mono">
                  <div className="text-ink/60">Input: nums = [3,2,4], target = 6</div>
                  <div className="text-ink font-bold mt-1">Output: [1, 2]</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Code Editor + Test Console (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col">
            <CardHeader
              title="Solution Workspace"
              tone="mint"
              action={
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <Select value={lang} onChange={(e) => handleLangChange(e.target.value)}>
                      <option value="C++17">C++ 17</option>
                      <option value="Python 3">Python 3</option>
                      <option value="Java 17">Java 17</option>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCode(codeTemplates[lang])}>
                    Reset
                  </Button>
                </div>
              }
            />

            {/* Simulated Monaco/Code Editor */}
            <div className="border-b-2 border-ink bg-ink text-white font-mono text-[13px] flex-1 flex flex-col min-h-[360px]">
              <div className="flex items-center justify-between border-b border-white/20 bg-ink/90 px-4 py-1.5 text-[11px] text-white/60">
                <div className="flex items-center gap-2">
                  <span className="text-sun">●</span>
                  <span>solution.{lang === "Python 3" ? "py" : lang === "Java 17" ? "java" : "cpp"}</span>
                </div>
                <span>UTF-8 · Tab Size: 4</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full bg-ink p-4 font-mono text-[13px] text-paper focus:outline-none resize-none leading-relaxed"
                rows={16}
              />
            </div>

            {/* Run & Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border-b-2 border-ink">
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm" onClick={runSampleTests} disabled={running}>
                  {running ? "Compiling & Running…" : "▷ Run Sample Tests"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("console")}>
                  Console Output
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="candy" size="sm" onClick={() => setSubmitModalOpen(true)}>
                  Submit Final Code →
                </Button>
              </div>
            </div>

            {/* Compiler Output & Test Case Console */}
            <div className="bg-paper p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 border-b-2 border-ink pb-2">
                <button
                  onClick={() => setActiveTab("t1")}
                  className={`border-2 px-2.5 py-1 text-[11px] font-bold ${
                    activeTab === "t1" ? "border-ink bg-mint text-ink shadow-[2px_2px_0_#0a0a0a]" : "bg-white text-ink"
                  }`}
                >
                  ✓ Case 1 (Passed)
                </button>
                <button
                  onClick={() => setActiveTab("t2")}
                  className={`border-2 px-2.5 py-1 text-[11px] font-bold ${
                    activeTab === "t2" ? "border-ink bg-mint text-ink shadow-[2px_2px_0_#0a0a0a]" : "bg-white text-ink"
                  }`}
                >
                  ✓ Case 2 (Passed)
                </button>
                <button
                  onClick={() => setActiveTab("t3")}
                  className={`border-2 px-2.5 py-1 text-[11px] font-bold ${
                    activeTab === "t3" ? "border-ink bg-tomato text-white shadow-[2px_2px_0_#0a0a0a]" : "bg-white text-ink"
                  }`}
                >
                  ✗ Case 3 (Hidden)
                </button>
                <button
                  onClick={() => setActiveTab("console")}
                  className={`border-2 px-2.5 py-1 text-[11px] font-bold ${
                    activeTab === "console" ? "border-ink bg-sun text-ink shadow-[2px_2px_0_#0a0a0a]" : "bg-white text-ink"
                  }`}
                >
                  Terminal Logs
                </button>
              </div>

              {activeTab === "t1" ? (
                <div className="text-[12px] font-mono space-y-1 bg-white border-2 border-ink p-3">
                  <div className="flex justify-between text-[11px] text-ink/60 border-b pb-1">
                    <span>Status: <strong className="text-mint">Passed (12 ms)</strong></span>
                    <span>Memory: 14.8 MB</span>
                  </div>
                  <div><strong>Input:</strong> nums = [2,7,11,15], target = 9</div>
                  <div><strong>Expected Output:</strong> [0, 1]</div>
                  <div><strong>Actual Output:</strong> [0, 1]</div>
                </div>
              ) : activeTab === "t2" ? (
                <div className="text-[12px] font-mono space-y-1 bg-white border-2 border-ink p-3">
                  <div className="flex justify-between text-[11px] text-ink/60 border-b pb-1">
                    <span>Status: <strong className="text-mint">Passed (14 ms)</strong></span>
                    <span>Memory: 14.9 MB</span>
                  </div>
                  <div><strong>Input:</strong> nums = [3,2,4], target = 6</div>
                  <div><strong>Expected Output:</strong> [1, 2]</div>
                  <div><strong>Actual Output:</strong> [1, 2]</div>
                </div>
              ) : activeTab === "t3" ? (
                <div className="text-[12px] font-mono space-y-1 bg-white border-2 border-ink p-3">
                  <div className="flex justify-between text-[11px] text-tomato border-b pb-1 font-bold">
                    <span>Status: Hidden Evaluation Case</span>
                    <span>Evaluated at Submission</span>
                  </div>
                  <div className="text-ink/70">This is a private boundary test case with 10⁴ elements. Test runner reports code passed execution within 1.0s limit.</div>
                </div>
              ) : (
                <div className="bg-ink text-mint font-mono text-[12px] p-3 border-2 border-ink min-h-[90px]">
                  <div>[g++ -O3 -std=c++17 solution.cpp -o solution]</div>
                  <div>Compilation successful. Zero warnings generated.</div>
                  <div>Process exited with code 0 in 0.012s.</div>
                  <div className="flex items-center gap-1 mt-1 text-white">
                    <span>student@exam-runner:~$</span>
                    <span className="h-3 w-1.5 bg-white animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit Coding Question"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSubmitModalOpen(false)}>
              Back to Code
            </Button>
            <Button
              variant="candy"
              onClick={() => {
                setSubmitted(true)
                setSubmitModalOpen(false)
              }}
            >
              Confirm Submission
            </Button>
          </>
        }
      >
        <p className="text-[13px] font-medium text-ink">
          Are you ready to submit your code for <strong>Question 12: Two Sum</strong>? Your solution will be tested against 15 automated test cases including edge cases.
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
              <h2 className="font-display text-xl text-ink">Code Submitted & Evaluated!</h2>
              <p className="mt-1 text-[12px] font-medium text-ink/70">
                15 / 15 test cases passed. 20/20 marks awarded.
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
