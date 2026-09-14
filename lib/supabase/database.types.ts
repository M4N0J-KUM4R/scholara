export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'super-admin' | 'college-admin' | 'faculty' | 'student'
export type TenantStatus = 'Active' | 'Suspended' | 'Onboarding'
export type TenantPlan = 'Enterprise' | 'Growth' | 'Starter'
export type DepartmentStatus = 'Active' | 'Archived'
export type BatchStatus = 'Active' | 'Graduated' | 'Archived'
export type AssessmentStatus = 'Draft' | 'Pending review' | 'Approved' | 'Rejected' | 'Published' | 'Completed'
export type AssessmentType = 'MCQ' | 'Coding' | 'Lab' | 'Short answer' | 'Essay' | 'Numerical'
export type SubmissionStatus = 'In progress' | 'Submitted' | 'Evaluated' | 'Flagged'

export interface Database {
  public: {
    Tables: {
      tenant: {
        Row: {
          id: string
          name: string
          slug: string
          domain: string | null
          plan: TenantPlan
          status: TenantStatus
          users_count: number
          exams_this_month: number
          mrr: number
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          domain?: string | null
          plan?: TenantPlan
          status?: TenantStatus
          users_count?: number
          exams_this_month?: number
          mrr?: number
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          domain?: string | null
          plan?: TenantPlan
          status?: TenantStatus
          users_count?: number
          exams_this_month?: number
          mrr?: number
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_account: {
        Row: {
          id: string
          auth_user_id: string | null
          tenant_id: string
          email: string
          full_name: string
          first_name: string
          last_name: string
          role: UserRole
          avatar_url: string | null
          phone: string | null
          status: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          tenant_id: string
          email: string
          full_name: string
          role?: UserRole
          avatar_url?: string | null
          phone?: string | null
          status?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          tenant_id?: string
          email?: string
          full_name?: string
          role?: UserRole
          avatar_url?: string | null
          phone?: string | null
          status?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      department: {
        Row: {
          id: string
          tenant_id: string
          name: string
          code: string
          hod_id: string | null
          faculty_count: number
          student_count: number
          course_count: number
          status: DepartmentStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          code: string
          hod_id?: string | null
          faculty_count?: number
          student_count?: number
          course_count?: number
          status?: DepartmentStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          code?: string
          hod_id?: string | null
          faculty_count?: number
          student_count?: number
          course_count?: number
          status?: DepartmentStatus
          created_at?: string
          updated_at?: string
        }
      }
      batch: {
        Row: {
          id: string
          tenant_id: string
          department_id: string
          name: string
          code: string
          academic_year: string
          section: string
          student_count: number
          at_risk_count: number
          mentor_id: string | null
          status: BatchStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          department_id: string
          name: string
          code: string
          academic_year: string
          section?: string
          student_count?: number
          at_risk_count?: number
          mentor_id?: string | null
          status?: BatchStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          department_id?: string
          name?: string
          code?: string
          academic_year?: string
          section?: string
          student_count?: number
          at_risk_count?: number
          mentor_id?: string | null
          status?: BatchStatus
          created_at?: string
          updated_at?: string
        }
      }
      student_profile: {
        Row: {
          id: string
          user_id: string
          tenant_id: string
          roll_number: string
          department_id: string
          batch_id: string | null
          semester: number
          cgpa: number
          attendance_pct: number
          credits_earned: number
          total_credits: number
          class_rank: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tenant_id: string
          roll_number: string
          department_id: string
          batch_id?: string | null
          semester?: number
          cgpa?: number
          attendance_pct?: number
          credits_earned?: number
          total_credits?: number
          class_rank?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tenant_id?: string
          roll_number?: string
          department_id?: string
          batch_id?: string | null
          semester?: number
          cgpa?: number
          attendance_pct?: number
          credits_earned?: number
          total_credits?: number
          class_rank?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      faculty_profile: {
        Row: {
          id: string
          user_id: string
          tenant_id: string
          employee_id: string
          department_id: string
          designation: string
          workload_pct: number
          grading_queue_count: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tenant_id: string
          employee_id: string
          department_id: string
          designation?: string
          workload_pct?: number
          grading_queue_count?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tenant_id?: string
          employee_id?: string
          department_id?: string
          designation?: string
          workload_pct?: number
          grading_queue_count?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      course: {
        Row: {
          id: string
          tenant_id: string
          department_id: string
          code: string
          title: string
          faculty_id: string | null
          credits: number
          units: number
          semester: number
          students_count: number
          status: string
          syllabus: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          department_id: string
          code: string
          title: string
          faculty_id?: string | null
          credits?: number
          units?: number
          semester?: number
          students_count?: number
          status?: string
          syllabus?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          department_id?: string
          code?: string
          title?: string
          faculty_id?: string | null
          credits?: number
          units?: number
          semester?: number
          students_count?: number
          status?: string
          syllabus?: Json
          created_at?: string
          updated_at?: string
        }
      }
      course_enrollment: {
        Row: {
          id: string
          tenant_id: string
          course_id: string
          student_id: string
          attendance_pct: number
          progress_pct: number
          grade: string | null
          status: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          course_id: string
          student_id: string
          attendance_pct?: number
          progress_pct?: number
          grade?: string | null
          status?: string
          enrolled_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          course_id?: string
          student_id?: string
          attendance_pct?: number
          progress_pct?: number
          grade?: string | null
          status?: string
          enrolled_at?: string
        }
      }
      assessment: {
        Row: {
          id: string
          tenant_id: string
          course_id: string
          faculty_id: string | null
          title: string
          type: AssessmentType
          questions_count: number
          total_marks: number
          duration_minutes: number
          version: string
          status: AssessmentStatus
          schedule_start: string | null
          schedule_end: string | null
          instructions: string | null
          proctoring_config: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          course_id: string
          faculty_id?: string | null
          title: string
          type?: AssessmentType
          questions_count?: number
          total_marks?: number
          duration_minutes?: number
          version?: string
          status?: AssessmentStatus
          schedule_start?: string | null
          schedule_end?: string | null
          instructions?: string | null
          proctoring_config?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          course_id?: string
          faculty_id?: string | null
          title?: string
          type?: AssessmentType
          questions_count?: number
          total_marks?: number
          duration_minutes?: number
          version?: string
          status?: AssessmentStatus
          schedule_start?: string | null
          schedule_end?: string | null
          instructions?: string | null
          proctoring_config?: Json
          created_at?: string
          updated_at?: string
        }
      }
      question: {
        Row: {
          id: string
          tenant_id: string
          course_id: string
          assessment_id: string | null
          stem: string
          type: AssessmentType
          bloom_level: string
          difficulty: string
          marks: number
          used_in_count: number
          content: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          course_id: string
          assessment_id?: string | null
          stem: string
          type?: AssessmentType
          bloom_level?: string
          difficulty?: string
          marks?: number
          used_in_count?: number
          content?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          course_id?: string
          assessment_id?: string | null
          stem?: string
          type?: AssessmentType
          bloom_level?: string
          difficulty?: string
          marks?: number
          used_in_count?: number
          content?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exam_submission: {
        Row: {
          id: string
          tenant_id: string
          assessment_id: string
          student_id: string
          status: SubmissionStatus
          score: number | null
          total_marks: number
          started_at: string
          submitted_at: string | null
          answers: Json
          proctoring_logs: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          assessment_id: string
          student_id: string
          status?: SubmissionStatus
          score?: number | null
          total_marks?: number
          started_at?: string
          submitted_at?: string | null
          answers?: Json
          proctoring_logs?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          assessment_id?: string
          student_id?: string
          status?: SubmissionStatus
          score?: number | null
          total_marks?: number
          started_at?: string
          submitted_at?: string | null
          answers?: Json
          proctoring_logs?: Json
          created_at?: string
          updated_at?: string
        }
      }
      grading_record: {
        Row: {
          id: string
          tenant_id: string
          submission_id: string
          question_id: string
          evaluator_id: string | null
          marks_awarded: number
          rubric_scores: Json
          feedback: string | null
          graded_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          submission_id: string
          question_id: string
          evaluator_id?: string | null
          marks_awarded?: number
          rubric_scores?: Json
          feedback?: string | null
          graded_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          submission_id?: string
          question_id?: string
          evaluator_id?: string | null
          marks_awarded?: number
          rubric_scores?: Json
          feedback?: string | null
          graded_at?: string
        }
      }
      announcement: {
        Row: {
          id: string
          tenant_id: string
          author_id: string | null
          title: string
          content: string
          priority: string
          published_at: string
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          author_id?: string | null
          title: string
          content: string
          priority?: string
          published_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          author_id?: string | null
          title?: string
          content?: string
          priority?: string
          published_at?: string
          created_at?: string
        }
      }
      notification: {
        Row: {
          id: string
          tenant_id: string
          recipient_id: string
          title: string
          body: string
          link: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          recipient_id: string
          title: string
          body: string
          link?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          recipient_id?: string
          title?: string
          body?: string
          link?: string | null
          read_at?: string | null
          created_at?: string
        }
      }
      student_portfolio: {
        Row: {
          id: string
          user_id: string
          headline: string | null
          bio: string | null
          resume_url: string | null
          skills: string[]
          links: Json
          projects: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          headline?: string | null
          bio?: string | null
          resume_url?: string | null
          skills?: string[]
          links?: Json
          projects?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          headline?: string | null
          bio?: string | null
          resume_url?: string | null
          skills?: string[]
          links?: Json
          projects?: Json
          created_at?: string
          updated_at?: string
        }
      }
      integration_account: {
        Row: {
          id: string
          user_id: string
          provider: string
          provider_username: string | null
          access_token_enc: string | null
          profile_data: Json
          connected_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          provider_username?: string | null
          access_token_enc?: string | null
          profile_data?: Json
          connected_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          provider_username?: string | null
          access_token_enc?: string | null
          profile_data?: Json
          connected_at?: string
        }
      }
      department_course_coverage: {
        Row: {
          id: string
          tenant_id: string
          department_id: string
          course_id: string
          unit_1_pct: number
          unit_2_pct: number
          unit_3_pct: number
          unit_4_pct: number
          unit_5_pct: number
          overall_pct: number
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          department_id: string
          course_id: string
          unit_1_pct?: number
          unit_2_pct?: number
          unit_3_pct?: number
          unit_4_pct?: number
          unit_5_pct?: number
          overall_pct?: number
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          department_id?: string
          course_id?: string
          unit_1_pct?: number
          unit_2_pct?: number
          unit_3_pct?: number
          unit_4_pct?: number
          unit_5_pct?: number
          overall_pct?: number
          updated_at?: string
        }
      }
      system_audit_log: {
        Row: {
          id: string
          tenant_id: string | null
          actor_id: string | null
          action: string
          entity: string
          entity_id: string | null
          metadata: Json
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          actor_id?: string | null
          action: string
          entity: string
          entity_id?: string | null
          metadata?: Json
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          actor_id?: string | null
          action?: string
          entity?: string
          entity_id?: string | null
          metadata?: Json
          ip_address?: string | null
          created_at?: string
        }
      }
    }
  }
}
