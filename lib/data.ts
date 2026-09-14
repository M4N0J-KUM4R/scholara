/* Shared demo data — typed, realistic, ready to be replaced by Supabase queries. */

export type Role = "super-admin" | "college-admin" | "faculty" | "student"

export const roleHome: Record<Role, string> = {
  "super-admin": "/admin",
  "college-admin": "/college",
  faculty: "/faculty",
  student: "/student",
}

/* ---------------- Super admin ---------------- */

export type Tenant = {
  id: string
  name: string
  slug: string
  plan: "Enterprise" | "Growth" | "Starter"
  users: number
  status: "Active" | "Suspended" | "Onboarding"
  examsThisMonth: number
  mrr: number
}

export const tenants: Tenant[] = [
  { id: "t1", name: "Hindustan University", slug: "hindustan", plan: "Enterprise", users: 18420, status: "Active", examsThisMonth: 38, mrr: 4200 },
  { id: "t2", name: "Ridgeview Institute of Technology", slug: "ridgeview", plan: "Growth", users: 6210, status: "Active", examsThisMonth: 21, mrr: 1600 },
  { id: "t3", name: "St. Meridian College", slug: "meridian", plan: "Growth", users: 4380, status: "Active", examsThisMonth: 12, mrr: 1150 },
  { id: "t4", name: "Lakeport Polytechnic", slug: "lakeport", plan: "Starter", users: 1290, status: "Suspended", examsThisMonth: 0, mrr: 0 },
  { id: "t5", name: "Nova Science Academy", slug: "nova", plan: "Starter", users: 860, status: "Onboarding", examsThisMonth: 2, mrr: 250 },
]

export const platformStats = [
  { label: "Active tenants", value: "4", delta: { dir: "up" as const, text: "1 this month" } },
  { label: "Total users", value: "31,160", delta: { dir: "up" as const, text: "8.2%" } },
  { label: "Exams this month", value: "73", delta: { dir: "up" as const, text: "12" } },
  { label: "MRR", value: "$7,200", delta: { dir: "flat" as const, text: "stable" } },
]

export const featureFlags = [
  { id: "proctoring-v2", label: "Proctoring v2", desc: "Webcam + tab-heuristics engine for high-stakes exams.", enabled: true },
  { id: "ai-item-analysis", label: "AI item analysis", desc: "Auto difficulty/discrimination suggestions on published exams.", enabled: true },
  { id: "nba-reports", label: "NBA reports", desc: "CO–PO attainment matrix exports for accreditation.", enabled: false },
  { id: "offline-exams", label: "Offline exams", desc: "Kiosk mode with encrypted answer sync after reconnect.", enabled: false },
]

export const platformUsage = [
  { label: "Jul", value: 52 },
  { label: "Aug", value: 61 },
  { label: "Sep", value: 73 },
]

export const storageByTenant = [
  { label: "Hindustan", pct: 62 },
  { label: "Ridgeview", pct: 21 },
  { label: "Meridian", pct: 11 },
  { label: "Lakeport", pct: 6 },
]

export const recentChanges = [
  { date: "Sep 12", text: "Proctoring v2 rolled out to 100% of tenants.", who: "system" },
  { date: "Sep 10", text: "Lakeport Polytechnic suspended for payment failure.", who: "M. Kumar" },
  { date: "Sep 08", text: "Approved email domain added: @nova.edu.", who: "M. Kumar" },
]

/* ---------------- People ---------------- */

export type Department = {
  id: string
  name: string
  code: string
  hod?: string
  faculty: number
  students: number
  courses: number
  status: "Active" | "Archived"
}

export const departments: Department[] = [
  { id: "d1", name: "Computer Science & Engineering", code: "CSE", hod: "Dr. Ananya Rao", faculty: 24, students: 840, courses: 18, status: "Active" },
  { id: "d2", name: "Electronics & Communication", code: "ECE", hod: "Dr. Vikram Shetty", faculty: 19, students: 620, courses: 14, status: "Active" },
  { id: "d3", name: "Mechanical Engineering", code: "MECH", hod: "Dr. Farhan Ali", faculty: 16, students: 540, courses: 12, status: "Active" },
  { id: "d4", name: "Civil Engineering", code: "CIVIL", faculty: 11, students: 380, courses: 9, status: "Active" },
  { id: "d5", name: "Business Administration", code: "MBA", hod: "Dr. Leena Mathew", faculty: 9, students: 410, courses: 8, status: "Active" },
  { id: "d6", name: "Applied Sciences", code: "AS", faculty: 7, students: 290, courses: 6, status: "Archived" },
]

export type FacultyMember = {
  id: string
  name: string
  empId: string
  dept: string
  role: "HOD" | "Professor" | "Associate Professor" | "Assistant Professor" | "Visiting"
  gradingQueue: number
  load: number
  status: "Active" | "On leave" | "Overloaded"
}

export const facultyMembers: FacultyMember[] = [
  { id: "f1", name: "Dr. Ananya Rao", empId: "EMP-1001", dept: "CSE", role: "HOD", gradingQueue: 4, load: 82, status: "Active" },
  { id: "f2", name: "Prof. Rahul Menon", empId: "EMP-1002", dept: "CSE", role: "Associate Professor", gradingQueue: 14, load: 108, status: "Overloaded" },
  { id: "f3", name: "Dr. Sneha Iyer", empId: "EMP-1003", dept: "CSE", role: "Assistant Professor", gradingQueue: 8, load: 76, status: "Active" },
  { id: "f4", name: "Dr. Vikram Shetty", empId: "EMP-1004", dept: "ECE", role: "HOD", gradingQueue: 2, load: 70, status: "Active" },
  { id: "f5", name: "Prof. Divya Nair", empId: "EMP-1005", dept: "ECE", role: "Professor", gradingQueue: 0, load: 64, status: "On leave" },
  { id: "f6", name: "Dr. Farhan Ali", empId: "EMP-1006", dept: "MECH", role: "HOD", gradingQueue: 11, load: 88, status: "Active" },
  { id: "f7", name: "Prof. Kavya Reddy", empId: "EMP-1007", dept: "MECH", role: "Assistant Professor", gradingQueue: 6, load: 72, status: "Active" },
  { id: "f8", name: "Dr. Leena Mathew", empId: "EMP-1008", dept: "MBA", role: "HOD", gradingQueue: 3, load: 58, status: "Active" },
]

export type Student = {
  id: string
  name: string
  roll: string
  dept: string
  batch: string
  avgScore: number
  status: "Active" | "At risk" | "Suspended"
}

export const students: Student[] = [
  { id: "s1", name: "Aarav Sharma", roll: "21CSE001", dept: "CSE", batch: "2021–25 A", avgScore: 82, status: "Active" },
  { id: "s2", name: "Diya Patel", roll: "21CSE002", dept: "CSE", batch: "2021–25 A", avgScore: 91, status: "Active" },
  { id: "s3", name: "Rohan Gupta", roll: "21CSE003", dept: "CSE", batch: "2021–25 A", avgScore: 58, status: "At risk" },
  { id: "s4", name: "Ishita Verma", roll: "21CSE004", dept: "CSE", batch: "2021–25 B", avgScore: 77, status: "Active" },
  { id: "s5", name: "Kabir Singh", roll: "21CSE005", dept: "CSE", batch: "2021–25 B", avgScore: 44, status: "Suspended" },
  { id: "s6", name: "Meera Krishnan", roll: "21ECE014", dept: "ECE", batch: "2021–25 A", avgScore: 85, status: "Active" },
  { id: "s7", name: "Arjun Das", roll: "21ECE015", dept: "ECE", batch: "2021–25 B", avgScore: 61, status: "At risk" },
  { id: "s8", name: "Sara Thomas", roll: "21MEC007", dept: "MECH", batch: "2021–25 A", avgScore: 74, status: "Active" },
]

/* ---------------- Courses & exams ---------------- */

export type Course = {
  id: string
  code: string
  title: string
  dept: string
  faculty: string
  students: number
  units: number
  status: "Active" | "Draft"
}

export const courses: Course[] = [
  { id: "c1", code: "CS301", title: "Data Structures & Algorithms", dept: "CSE", faculty: "Dr. Ananya Rao", students: 124, units: 5, status: "Active" },
  { id: "c2", code: "CS305", title: "Operating Systems", dept: "CSE", faculty: "Prof. Rahul Menon", students: 118, units: 5, status: "Active" },
  { id: "c3", code: "CS310", title: "Database Management Systems", dept: "CSE", faculty: "Dr. Sneha Iyer", students: 132, units: 4, status: "Active" },
  { id: "c4", code: "EC210", title: "Digital Signal Processing", dept: "ECE", faculty: "Dr. Vikram Shetty", students: 96, units: 5, status: "Active" },
  { id: "c5", code: "ME220", title: "Thermodynamics", dept: "MECH", faculty: "Dr. Farhan Ali", students: 88, units: 4, status: "Active" },
  { id: "c6", code: "MB110", title: "Organisational Behaviour", dept: "MBA", faculty: "Dr. Leena Mathew", students: 74, units: 3, status: "Draft" },
]

export type ExamRow = {
  id: string
  title: string
  course: string
  faculty: string
  date: string
  duration: string
  students: number
  status: "Published" | "Approved" | "Pending review" | "Draft" | "Completed"
}

export const examPipeline: ExamRow[] = [
  { id: "e1", title: "DSA Midterm", course: "CS301", faculty: "Dr. Ananya Rao", date: "Sep 18, 10:00", duration: "90 min", students: 124, status: "Published" },
  { id: "e2", title: "OS Quiz 2", course: "CS305", faculty: "Prof. Rahul Menon", date: "Sep 20, 14:00", duration: "45 min", students: 118, status: "Approved" },
  { id: "e3", title: "DBMS Unit Test", course: "CS310", faculty: "Dr. Sneha Iyer", date: "Sep 22, 09:30", duration: "60 min", students: 132, status: "Pending review" },
  { id: "e4", title: "DSP Final", course: "EC210", faculty: "Dr. Vikram Shetty", date: "Sep 25, 10:00", duration: "120 min", students: 96, status: "Draft" },
  { id: "e5", title: "Thermo Sem-Exam", course: "ME220", faculty: "Dr. Farhan Ali", date: "Sep 05, 10:00", duration: "120 min", students: 88, status: "Completed" },
]

/* ---------------- Faculty: questions & assessments ---------------- */

export type Question = {
  id: string
  stem: string
  type: "MCQ" | "Coding" | "Lab" | "Short answer" | "Essay" | "Numerical"
  course: string
  bloom: "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create"
  difficulty: "Easy" | "Medium" | "Hard"
  marks: number
  usedIn: number
}

export const questionBank: Question[] = [
  { id: "q1", stem: "Which data structure gives O(1) amortized push and pop?", type: "MCQ", course: "CS301", bloom: "Understand", difficulty: "Easy", marks: 2, usedIn: 4 },
  { id: "q2", stem: "Implement LRU cache with get/put in O(1).", type: "Coding", course: "CS301", bloom: "Create", difficulty: "Hard", marks: 10, usedIn: 2 },
  { id: "q3", stem: "Explain the difference between paging and segmentation.", type: "Short answer", course: "CS305", bloom: "Understand", difficulty: "Medium", marks: 5, usedIn: 3 },
  { id: "q4", stem: "Write SQL to find the 2nd highest salary per department.", type: "Coding", course: "CS310", bloom: "Apply", difficulty: "Medium", marks: 8, usedIn: 2 },
  { id: "q5", stem: "Compute the DFT of a 4-point sequence x[n] = {1, 2, 3, 4}.", type: "Numerical", course: "EC210", bloom: "Apply", difficulty: "Medium", marks: 6, usedIn: 1 },
  { id: "q6", stem: "Derive the efficiency expression of a Rankine cycle.", type: "Essay", course: "ME220", bloom: "Analyze", difficulty: "Hard", marks: 12, usedIn: 1 },
  { id: "q7", stem: "Containerize a Flask app with a health endpoint.", type: "Lab", course: "CS305", bloom: "Create", difficulty: "Hard", marks: 15, usedIn: 1 },
  { id: "q8", stem: "What is the time complexity of building a heap from n elements?", type: "MCQ", course: "CS301", bloom: "Remember", difficulty: "Easy", marks: 2, usedIn: 5 },
]

export type Assessment = {
  id: string
  title: string
  course: string
  questions: number
  marks: number
  duration: string
  version: string
  status: "Draft" | "Pending review" | "Approved" | "Rejected" | "Published" | "Completed"
}

export const assessments: Assessment[] = [
  { id: "a1", title: "DSA Midterm", course: "CS301", questions: 42, marks: 100, duration: "90 min", version: "v3", status: "Published" },
  { id: "a2", title: "OS Quiz 2", course: "CS305", questions: 20, marks: 40, duration: "45 min", version: "v2", status: "Approved" },
  { id: "a3", title: "DBMS Unit Test", course: "CS310", questions: 35, marks: 80, duration: "60 min", version: "v3", status: "Pending review" },
  { id: "a4", title: "Algorithms Practice Set", course: "CS301", questions: 15, marks: 30, duration: "—", version: "v1", status: "Draft" },
  { id: "a5", title: "Signals Assignment 3", course: "EC210", questions: 12, marks: 25, duration: "—", version: "v1", status: "Rejected" },
]

export const validationStages = [
  { label: "Faculty submits", state: "done" as const, by: "Dr. Sneha Iyer", when: "Sep 09" },
  { label: "HOD review", state: "done" as const, by: "Dr. Ananya Rao", when: "Sep 11" },
  { label: "Exam Cell approval", state: "current" as const, by: "Exam Cell", when: "—" },
  { label: "Published", state: "todo" as const, by: "—", when: "—" },
]

export const validationComments = [
  { by: "Dr. Ananya Rao", when: "Sep 11, 16:40", text: "Q12 and Q29 need clearer marks split. Rest looks exam-ready.", role: "HOD" },
  { by: "Dr. Sneha Iyer", when: "Sep 11, 18:02", text: "Updated. Marks now total 100 with rubric on both essays.", role: "Faculty" },
]

export const validationVersions = [
  { v: "v3", when: "Sep 11", note: "Marks rebalanced, rubric added", current: true },
  { v: "v2", when: "Sep 09", note: "2 essay items replaced", current: false },
  { v: "v1", when: "Sep 02", note: "Initial submission", current: false },
]

export type GradingRow = {
  id: string
  student: string
  roll: string
  exam: string
  pending: string
  status: "Waiting" | "In progress" | "Flagged"
}

export const gradingQueue: GradingRow[] = [
  { id: "g1", student: "Rohan Gupta", roll: "21CSE003", exam: "DSA Midterm", pending: "Q3, Q7", status: "Flagged" },
  { id: "g2", student: "Ishita Verma", roll: "21CSE004", exam: "DSA Midterm", pending: "Q7", status: "Waiting" },
  { id: "g3", student: "Sara Thomas", roll: "21MEC007", exam: "Thermo Sem-Exam", pending: "Q2, Q5, Q9", status: "Waiting" },
  { id: "g4", student: "Arjun Das", roll: "21ECE015", exam: "DSP Final", pending: "Q1", status: "In progress" },
]

export const rubricRows = [
  { criterion: "Thesis & problem framing", max: 4, score: 4 },
  { criterion: "Evidence & test coverage", max: 5, score: 3 },
  { criterion: "Structure & clarity", max: 5, score: 5 },
]

/* ---------------- Student ---------------- */

export const studentCourses = [
  { id: "c1", code: "CS301", title: "Data Structures & Algorithms", faculty: "Dr. Ananya Rao", progress: 68, grade: "A" },
  { id: "c2", code: "CS305", title: "Operating Systems", faculty: "Prof. Rahul Menon", progress: 54, grade: "B+" },
  { id: "c3", code: "CS310", title: "Database Management Systems", faculty: "Dr. Sneha Iyer", progress: 71, grade: "A-" },
  { id: "c4", code: "EC2XX", title: "Signals & Systems (Elective)", faculty: "Dr. Vikram Shetty", progress: 40, grade: "B" },
]

export const studentExams = [
  { id: "1", title: "DSA Midterm — MCQ", course: "CS301", when: "Sep 18, 10:00", duration: "90 min", marks: 100, state: "live" as const },
  { id: "2", title: "OS Quiz 2 — Coding", course: "CS305", when: "Sep 20, 14:00", duration: "45 min", marks: 40, state: "live" as const },
  { id: "3", title: "DBMS Lab Final — Sandbox", course: "CS310", when: "Sep 22, 09:30", duration: "120 min", marks: 60, state: "scheduled" as const },
]

export const studentResults = [
  { exam: "DSA Quiz 1", course: "CS301", score: 82, max: 100, when: "Aug 24" },
  { exam: "OS Assignment 2", course: "CS305", score: 74, max: 100, when: "Sep 01" },
  { exam: "DBMS Unit Test", course: "CS310", score: 0, max: 100, when: "Pending" },
  { exam: "Signals Quiz", course: "EC2XX", score: 66, max: 100, when: "Aug 30" },
]

export const studentNotifications = [
  { id: "n1", title: "DSA Midterm hall ticket is ready", when: "2h ago", read: false },
  { id: "n2", title: "OS Quiz 2 practice set published", when: "1d ago", read: false },
  { id: "n3", title: "Grading complete for Signals Quiz", when: "2d ago", read: true },
  { id: "n4", title: "Portfolio review sign-ups close Friday", when: "3d ago", read: true },
]

export type ExamQuestion =
  | { kind: "mcq"; n: number; stem: string; options: string[]; answer?: number; marks: number }
  | { kind: "coding"; n: number; stem: string; language: string; constraints: string[]; marks: number }
  | { kind: "lab"; n: number; stem: string; steps: string[]; marks: number }

export const mcqExam: ExamQuestion[] = [
  { kind: "mcq", n: 1, stem: "What is the average time complexity of a lookup in a well-sized hash table?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 0, marks: 2 },
  { kind: "mcq", n: 2, stem: "Which traversal of a binary search tree yields sorted output?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], answer: 1, marks: 2 },
  { kind: "mcq", n: 3, stem: "A queue processed with a heap priority is best described as…", options: ["LIFO", "FIFO with priorities", "Random access", "Double-ended only"], answer: 1, marks: 2 },
  { kind: "mcq", n: 4, stem: "Worst-case complexity of quicksort on a bad pivot choice?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: 2, marks: 2 },
  { kind: "mcq", n: 5, stem: "Which structure suits undo/redo in editors?", options: ["Queue", "Two stacks", "Trie", "Graph"], answer: 1, marks: 2 },
]

export const codingExam: ExamQuestion[] = [
  {
    kind: "coding",
    n: 1,
    stem: "Given an array of integers, return indices of the two numbers that add up to the target. Exactly one solution exists.",
    language: "C++17",
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "Time limit 1.0s", "Memory limit 256 MB"],
    marks: 20,
  },
]

export const labExam = {
  stem: "Configure a Flask service inside the sandbox so that GET /health returns {\"status\":\"ok\"} and the test suite passes.",
  steps: ["Pull base image ubuntu:22.04", "Install dependencies", "Implement /health route", "Run test suite and persist container"],
  marks: 25,
}

/* ---------------- Misc shared ---------------- */

export const announcements = [
  { id: "an1", title: "Midterm timetable published", when: "Sep 12" },
  { id: "an2", title: "Library extended hours during exams", when: "Sep 10" },
  { id: "an3", title: "NBA documentation workshop — Sep 20", when: "Sep 08" },
]

export const integrations = [
  { id: "sis", name: "SIS / ERP Sync", desc: "Nightly roster and enrollment sync.", connected: true },
  { id: "sso", name: "SSO (SAML / OIDC)", desc: "Institute identity provider login.", connected: true },
  { id: "proctor", name: "Proctoring", desc: "Lockdown browser + webcam capture.", connected: true },
  { id: "lti", name: "LTI 1.3", desc: "Embed CollegeCloud exams in external LMS.", connected: false },
  { id: "plag", name: "Plagiarism Check", desc: "Essay and short-answer similarity scan.", connected: false },
]

export const batches = [
  { id: "b1", name: "CSE 2021–25 A", dept: "CSE", students: 62, avg: 78, pass: 92, atRisk: 4, status: "Active" as const },
  { id: "b2", name: "CSE 2021–25 B", dept: "CSE", students: 60, avg: 74, pass: 88, atRisk: 7, status: "Active" as const },
  { id: "b3", name: "ECE 2021–25 A", dept: "ECE", students: 58, avg: 81, pass: 95, atRisk: 2, status: "Active" as const },
  { id: "b4", name: "MECH 2021–25 A", dept: "MECH", students: 55, avg: 70, pass: 84, atRisk: 9, status: "Active" as const },
  { id: "b5", name: "MBA 2022–24", dept: "MBA", students: 48, avg: 76, pass: 90, atRisk: 3, status: "Graduated" as const },
  { id: "b6", name: "AS 2020–23", dept: "AS", students: 40, avg: 69, pass: 80, atRisk: 11, status: "Archived" as const },
]

export const outcomeAttainment = [
  { label: "CO1", value: 78 },
  { label: "CO2", value: 71 },
  { label: "CO3", value: 64 },
  { label: "CO4", value: 82 },
  { label: "CO5", value: 58 },
  { label: "CO6", value: 69 },
]

export const itemAnalysis = [
  { q: "Q1", p: 0.91, d: 0.18, verdict: "Good" as const },
  { q: "Q7", p: 0.62, d: 0.41, verdict: "Good" as const },
  { q: "Q12", p: 0.94, d: 0.08, verdict: "Review" as const },
  { q: "Q19", p: 0.35, d: 0.52, verdict: "Good" as const },
  { q: "Q28", p: 0.88, d: -0.12, verdict: "Drop" as const },
  { q: "Q33", p: 0.57, d: 0.36, verdict: "Good" as const },
]

/* ---------------- Extended Directory & Operational Data ---------------- */

export type StudentDirectoryItem = {
  id: string
  name: string
  roll: string
  email: string
  dept: string
  batch: string
  avgScore: number
  examsTaken: number
  lastActive: string
  status: "Active" | "At risk" | "Suspended"
  gpa: number
  advisor: string
}

export const studentDirectoryRows: StudentDirectoryItem[] = [
  { id: "std-01", name: "Aarav Sharma", roll: "21CSE001", email: "aarav.sharma@hindustan.edu", dept: "CSE", batch: "2021–25 A", avgScore: 38, examsTaken: 4, lastActive: "2 days ago", status: "At risk", gpa: 5.8, advisor: "Dr. Ananya Rao" },
  { id: "std-02", name: "Diya Patel", roll: "21CSE002", email: "diya.patel@hindustan.edu", dept: "CSE", batch: "2021–25 A", avgScore: 91, examsTaken: 8, lastActive: "Today", status: "Active", gpa: 9.4, advisor: "Dr. Ananya Rao" },
  { id: "std-03", name: "Rohan Gupta", roll: "21CSE003", email: "rohan.gupta@hindustan.edu", dept: "CSE", batch: "2021–25 A", avgScore: 58, examsTaken: 6, lastActive: "Today", status: "Active", gpa: 6.9, advisor: "Prof. Rahul Menon" },
  { id: "std-04", name: "Ishita Verma", roll: "21CSE004", email: "ishita.verma@hindustan.edu", dept: "CSE", batch: "2021–25 A", avgScore: 34, examsTaken: 3, lastActive: "5 days ago", status: "At risk", gpa: 5.2, advisor: "Dr. Sneha Iyer" },
  { id: "std-05", name: "Kabir Singh", roll: "21CSE005", email: "kabir.singh@hindustan.edu", dept: "CSE", batch: "2021–25 B", avgScore: 44, examsTaken: 5, lastActive: "Yesterday", status: "Suspended", gpa: 4.8, advisor: "Prof. Rahul Menon" },
  { id: "std-06", name: "Ananya Iyer", roll: "21CSE006", email: "ananya.iyer@hindustan.edu", dept: "CSE", batch: "2021–25 B", avgScore: 82, examsTaken: 9, lastActive: "Today", status: "Active", gpa: 8.7, advisor: "Dr. Sneha Iyer" },
  { id: "std-07", name: "Meera Krishnan", roll: "21ECE014", email: "meera.k@hindustan.edu", dept: "ECE", batch: "2021–25 A", avgScore: 85, examsTaken: 7, lastActive: "Today", status: "Active", gpa: 8.9, advisor: "Dr. Vikram Shetty" },
  { id: "std-08", name: "Arjun Das", roll: "21ECE015", email: "arjun.das@hindustan.edu", dept: "ECE", batch: "2021–25 B", avgScore: 61, examsTaken: 5, lastActive: "3 days ago", status: "Active", gpa: 6.8, advisor: "Prof. Divya Nair" },
  { id: "std-09", name: "Sara Thomas", roll: "21MEC007", email: "sara.thomas@hindustan.edu", dept: "MECH", batch: "2021–25 A", avgScore: 74, examsTaken: 6, lastActive: "Yesterday", status: "Active", gpa: 7.9, advisor: "Dr. Farhan Ali" },
  { id: "std-10", name: "Kunal Deshmukh", roll: "21CSE007", email: "kunal.d@hindustan.edu", dept: "CSE", batch: "2021–25 B", avgScore: 36, examsTaken: 4, lastActive: "8 days ago", status: "At risk", gpa: 5.4, advisor: "Dr. Sneha Iyer" },
  { id: "std-11", name: "Pooja Hegde", roll: "21CSE008", email: "pooja.h@hindustan.edu", dept: "CSE", batch: "2021–25 A", avgScore: 76, examsTaken: 8, lastActive: "Today", status: "Active", gpa: 8.1, advisor: "Dr. Ananya Rao" },
  { id: "std-12", name: "Tanmay Bhatia", roll: "21CSE009", email: "tanmay.b@hindustan.edu", dept: "CSE", batch: "2021–25 B", avgScore: 88, examsTaken: 10, lastActive: "Today", status: "Active", gpa: 9.1, advisor: "Prof. Rahul Menon" },
  { id: "std-13", name: "Zoya Akhtar", roll: "21CSE010", email: "zoya.a@hindustan.edu", dept: "CSE", batch: "2021–25 A", avgScore: 39, examsTaken: 3, lastActive: "6 days ago", status: "At risk", gpa: 5.6, advisor: "Dr. Sneha Iyer" },
  { id: "std-14", name: "Aditya Roy", roll: "21CSE011", email: "aditya.r@hindustan.edu", dept: "CSE", batch: "2021–25 B", avgScore: 69, examsTaken: 7, lastActive: "Yesterday", status: "Active", gpa: 7.3, advisor: "Prof. Rahul Menon" },
  { id: "std-15", name: "Neha Sengupta", roll: "21CSE012", email: "neha.s@hindustan.edu", dept: "CSE", batch: "2021–25 A", avgScore: 83, examsTaken: 8, lastActive: "Today", status: "Active", gpa: 8.6, advisor: "Dr. Ananya Rao" },
]

export type ExtendedFacultyItem = {
  id: string
  name: string
  empId: string
  email: string
  dept: string
  role: "HOD" | "Professor" | "Associate Professor" | "Assistant Professor" | "Visiting"
  coursesCount: number
  studentsCount: number
  gradingQueue: number
  loadPct: number
  lastActive: string
  status: "Active" | "Overloaded" | "On leave"
}

export const facultyDirectoryRows: ExtendedFacultyItem[] = [
  { id: "fac-01", name: "Dr. Ananya Rao", empId: "EMP-1001", email: "ananya.rao@hindustan.edu", dept: "CSE", role: "HOD", coursesCount: 4, studentsCount: 248, gradingQueue: 4, loadPct: 82, lastActive: "Today", status: "Active" },
  { id: "fac-02", name: "Prof. Rahul Menon", empId: "EMP-1002", email: "rahul.menon@hindustan.edu", dept: "CSE", role: "Associate Professor", coursesCount: 5, studentsCount: 280, gradingQueue: 14, loadPct: 108, lastActive: "Today", status: "Overloaded" },
  { id: "fac-03", name: "Dr. Sneha Iyer", empId: "EMP-1003", email: "sneha.iyer@hindustan.edu", dept: "CSE", role: "Assistant Professor", coursesCount: 3, studentsCount: 190, gradingQueue: 8, loadPct: 76, lastActive: "Today", status: "Active" },
  { id: "fac-04", name: "Dr. Vikram Shetty", empId: "EMP-1004", email: "vikram.shetty@hindustan.edu", dept: "ECE", role: "HOD", coursesCount: 4, studentsCount: 210, gradingQueue: 2, loadPct: 70, lastActive: "Today", status: "Active" },
  { id: "fac-05", name: "Prof. Divya Nair", empId: "EMP-1005", email: "divya.nair@hindustan.edu", dept: "ECE", role: "Professor", coursesCount: 2, studentsCount: 96, gradingQueue: 0, loadPct: 64, lastActive: "5 days ago", status: "On leave" },
  { id: "fac-06", name: "Dr. Farhan Ali", empId: "EMP-1006", email: "farhan.ali@hindustan.edu", dept: "MECH", role: "HOD", coursesCount: 5, studentsCount: 240, gradingQueue: 11, loadPct: 92, lastActive: "Today", status: "Overloaded" },
  { id: "fac-07", name: "Prof. Kavya Reddy", empId: "EMP-1007", email: "kavya.reddy@hindustan.edu", dept: "MECH", role: "Assistant Professor", coursesCount: 3, studentsCount: 160, gradingQueue: 6, loadPct: 72, lastActive: "Yesterday", status: "Active" },
  { id: "fac-08", name: "Dr. Leena Mathew", empId: "EMP-1008", email: "leena.mathew@hindustan.edu", dept: "MBA", role: "HOD", coursesCount: 3, studentsCount: 140, gradingQueue: 3, loadPct: 58, lastActive: "Today", status: "Active" },
  { id: "fac-09", name: "Prof. T. S. Narayanan", empId: "EMP-1009", email: "ts.narayanan@hindustan.edu", dept: "CIVIL", role: "Professor", coursesCount: 3, studentsCount: 130, gradingQueue: 2, loadPct: 62, lastActive: "Today", status: "Active" },
  { id: "fac-10", name: "Dr. Prateek Sen", empId: "EMP-1010", email: "prateek.sen@hindustan.edu", dept: "AS", role: "Associate Professor", coursesCount: 4, studentsCount: 195, gradingQueue: 12, loadPct: 96, lastActive: "Today", status: "Overloaded" },
  { id: "fac-11", name: "Prof. Anushree Jain", empId: "EMP-1011", email: "anushree.jain@hindustan.edu", dept: "CSE", role: "Visiting", coursesCount: 1, studentsCount: 65, gradingQueue: 1, loadPct: 35, lastActive: "Yesterday", status: "Active" },
  { id: "fac-12", name: "Dr. Rajesh Kulkarni", empId: "EMP-1012", email: "rajesh.k@hindustan.edu", dept: "ECE", role: "Assistant Professor", coursesCount: 3, studentsCount: 175, gradingQueue: 5, loadPct: 68, lastActive: "Today", status: "Active" },
]

export type ExtendedBatchItem = {
  id: string
  name: string
  dept: string
  year: number
  section: string
  students: number
  avgScore: number
  passPct: number
  atRisk: number
  status: "Active" | "Graduated" | "Archived"
}

export const batchDirectoryRows: ExtendedBatchItem[] = [
  { id: "b-01", name: "2021–2025 CSE Batch A", dept: "CSE", year: 2021, section: "A", students: 62, avgScore: 78, passPct: 92, atRisk: 4, status: "Active" },
  { id: "b-02", name: "2021–2025 CSE Batch B", dept: "CSE", year: 2021, section: "B", students: 60, avgScore: 74, passPct: 88, atRisk: 7, status: "Active" },
  { id: "b-03", name: "2022–2026 CSE Batch A", dept: "CSE", year: 2022, section: "A", students: 68, avgScore: 82, passPct: 94, atRisk: 2, status: "Active" },
  { id: "b-04", name: "2022–2026 CSE Batch B", dept: "CSE", year: 2022, section: "B", students: 65, avgScore: 71, passPct: 86, atRisk: 8, status: "Active" },
  { id: "b-05", name: "2021–2025 ECE Batch A", dept: "ECE", year: 2021, section: "A", students: 58, avgScore: 81, passPct: 95, atRisk: 2, status: "Active" },
  { id: "b-06", name: "2021–2025 ECE Batch B", dept: "ECE", year: 2021, section: "B", students: 54, avgScore: 75, passPct: 89, atRisk: 5, status: "Active" },
  { id: "b-07", name: "2021–2025 MECH Batch A", dept: "MECH", year: 2021, section: "A", students: 55, avgScore: 70, passPct: 84, atRisk: 9, status: "Active" },
  { id: "b-08", name: "2021–2025 CIVIL Batch A", dept: "CIVIL", year: 2021, section: "A", students: 48, avgScore: 68, passPct: 82, atRisk: 12, status: "Active" },
  { id: "b-09", name: "2022–2024 MBA Batch A", dept: "MBA", year: 2022, section: "A", students: 48, avgScore: 76, passPct: 90, atRisk: 3, status: "Graduated" },
  { id: "b-10", name: "2020–2024 MECH Batch B", dept: "MECH", year: 2020, section: "B", students: 52, avgScore: 73, passPct: 88, atRisk: 4, status: "Graduated" },
  { id: "b-11", name: "2019–2023 AS Batch A", dept: "AS", year: 2019, section: "A", students: 40, avgScore: 69, passPct: 80, atRisk: 11, status: "Archived" },
  { id: "b-12", name: "2020–2022 MBA Batch B", dept: "MBA", year: 2020, section: "B", students: 36, avgScore: 72, passPct: 85, atRisk: 6, status: "Archived" },
]

export const githubRepos = [
  { name: "algorithms-in-rust", lang: "Rust", stars: 142, lastCommit: "2 days ago", isPublic: true },
  { name: "collegecloud-lms-client", lang: "TypeScript", stars: 28, lastCommit: "Yesterday", isPublic: true },
  { name: "distributed-kv-store", lang: "Go", stars: 67, lastCommit: "Sep 04", isPublic: true },
  { name: "os-kernel-toy", lang: "C", stars: 89, lastCommit: "Aug 22", isPublic: false },
  { name: "ai-proctor-heuristics", lang: "Python", stars: 34, lastCommit: "Aug 15", isPublic: false },
  { name: "react-neo-brutalism-ui", lang: "TypeScript", stars: 215, lastCommit: "Sep 10", isPublic: true },
]

export const coverageMatrix = [
  { course: "CS301 Data Structures", u1: "covered", u2: "covered", u3: "partial", u4: "covered", u5: "empty", coverage: "82%" },
  { course: "CS302 Computer Networks", u1: "covered", u2: "partial", u3: "covered", u4: "covered", u5: "covered", coverage: "94%" },
  { course: "CS303 Theory of Computation", u1: "partial", u2: "empty", u3: "covered", u4: "partial", u5: "partial", coverage: "58%" },
  { course: "CS304 Software Engineering", u1: "covered", u2: "covered", u3: "covered", u4: "covered", u5: "partial", coverage: "88%" },
  { course: "CS305 Operating Systems", u1: "covered", u2: "empty", u3: "empty", u4: "partial", u5: "empty", coverage: "32%" },
  { course: "CS306 Database Systems", u1: "covered", u2: "covered", u3: "partial", u4: "covered", u5: "covered", coverage: "90%" },
]

export const studentTranscripts = [
  { term: "Semester 5 (Current)", sgpa: 8.6, credits: 24, status: "In Progress" },
  { term: "Semester 4", sgpa: 8.9, credits: 26, status: "Completed" },
  { term: "Semester 3", sgpa: 8.4, credits: 24, status: "Completed" },
  { term: "Semester 2", sgpa: 9.1, credits: 22, status: "Completed" },
  { term: "Semester 1", sgpa: 8.8, credits: 22, status: "Completed" },
]

