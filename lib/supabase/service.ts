import { createClient, isSupabaseConfigured } from './client'
import type { Database } from './database.types'
import {
  tenants as mockTenants,
  departments as mockDepartments,
  courses as mockCourses,
  facultyMembers as mockFaculty,
  studentDirectoryRows as mockStudents,
  batchDirectoryRows as mockBatches,
  assessments as mockAssessments,
  questionBank as mockQuestions,
  studentNotifications as mockNotifications,
  type Tenant,
  type Department,
  type Course,
  type FacultyMember,
  type Assessment,
} from '@/lib/data'

type TenantRow = Database['public']['Tables']['tenant']['Row']
type DeptRow = Database['public']['Tables']['department']['Row']
type CourseRow = Database['public']['Tables']['course']['Row']
type AssessmentRow = Database['public']['Tables']['assessment']['Row']

/**
 * High-level data service with automatic Supabase / Mock fallback
 */
export const dataService = {
  /**
   * Fetch all tenants
   */
  async getTenants(): Promise<Tenant[]> {
    if (!isSupabaseConfigured()) {
      return mockTenants
    }
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tenant')
        .select('*')
        .order('name')
      if (error || !data || data.length === 0) return mockTenants
      const rows = data as unknown as TenantRow[]
      return rows.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        plan: t.plan,
        users: t.users_count,
        status: t.status,
        examsThisMonth: t.exams_this_month,
        mrr: Number(t.mrr),
      }))
    } catch {
      return mockTenants
    }
  },

  /**
   * Fetch departments for a tenant
   */
  async getDepartments(tenantId?: string): Promise<Department[]> {
    if (!isSupabaseConfigured()) {
      return mockDepartments
    }
    try {
      const supabase = createClient()
      let query = supabase.from('department').select('*').order('name')
      if (tenantId) {
        query = query.eq('tenant_id', tenantId)
      }
      const { data, error } = await query
      if (error || !data || data.length === 0) return mockDepartments
      const rows = data as unknown as DeptRow[]
      return rows.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
        faculty: d.faculty_count,
        students: d.student_count,
        courses: d.course_count,
        status: d.status,
      }))
    } catch {
      return mockDepartments
    }
  },

  /**
   * Fetch courses
   */
  async getCourses(tenantId?: string): Promise<Course[]> {
    if (!isSupabaseConfigured()) {
      return mockCourses
    }
    try {
      const supabase = createClient()
      let query = supabase.from('course').select('*, department(name, code)').order('code')
      if (tenantId) {
        query = query.eq('tenant_id', tenantId)
      }
      const { data, error } = await query
      if (error || !data || data.length === 0) return mockCourses
      const rows = data as unknown as (CourseRow & { department?: { code?: string } })[]
      return rows.map((c) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        dept: c.department?.code ?? 'CSE',
        faculty: 'Faculty Assigned',
        students: c.students_count,
        units: c.units,
        status: c.status as 'Active' | 'Draft',
      }))
    } catch {
      return mockCourses
    }
  },

  /**
   * Fetch assessments
   */
  async getAssessments(tenantId?: string): Promise<Assessment[]> {
    if (!isSupabaseConfigured()) {
      return mockAssessments
    }
    try {
      const supabase = createClient()
      let query = supabase.from('assessment').select('*, course(code)').order('created_at', { ascending: false })
      if (tenantId) {
        query = query.eq('tenant_id', tenantId)
      }
      const { data, error } = await query
      if (error || !data || data.length === 0) return mockAssessments
      const rows = data as unknown as (AssessmentRow & { course?: { code?: string } })[]
      return rows.map((a) => ({
        id: a.id,
        title: a.title,
        course: a.course?.code ?? 'CS301',
        questions: a.questions_count,
        marks: a.total_marks,
        duration: `${a.duration_minutes} min`,
        version: a.version,
        status: a.status,
      }))
    } catch {
      return mockAssessments
    }
  },

  /**
   * Fetch questions from question bank
   */
  async getQuestionBank() {
    return mockQuestions
  },

  /**
   * Fetch students
   */
  async getStudents() {
    return mockStudents
  },

  /**
   * Fetch faculty
   */
  async getFaculty() {
    return mockFaculty
  },

  /**
   * Fetch batches
   */
  async getBatches() {
    return mockBatches
  },

  /**
   * Fetch notifications
   */
  async getNotifications() {
    return mockNotifications
  },
}
