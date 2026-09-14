-- ==============================================================================
-- CollegeCloud (Scholara) - Supabase PostgreSQL Initial Migration Schema
-- Version: 20260914000001
-- Features: Multi-Tenancy, Row-Level Security (RLS), RBAC, Academic LMS Core
-- ==============================================================================

-- Enable UUID & Cryptographic extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Custom Enum Types
-- ------------------------------------------------------------------------------

do $$ begin
    create type user_role as enum ('super-admin', 'college-admin', 'faculty', 'student');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type tenant_status as enum ('Active', 'Suspended', 'Onboarding');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type tenant_plan as enum ('Enterprise', 'Growth', 'Starter');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type department_status as enum ('Active', 'Archived');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type batch_status as enum ('Active', 'Graduated', 'Archived');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type assessment_status as enum ('Draft', 'Pending review', 'Approved', 'Rejected', 'Published', 'Completed');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type assessment_type as enum ('MCQ', 'Coding', 'Lab', 'Short answer', 'Essay', 'Numerical');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type submission_status as enum ('In progress', 'Submitted', 'Evaluated', 'Flagged');
exception
    when duplicate_object then null;
end $$;

-- ------------------------------------------------------------------------------
-- 2. Utility Functions & Triggers
-- ------------------------------------------------------------------------------

-- Generic updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- ------------------------------------------------------------------------------
-- 3. Core Multi-Tenant Tables
-- ------------------------------------------------------------------------------

-- 3.1 Tenant (Institution / College)
create table if not exists tenant (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    domain text,
    plan tenant_plan not null default 'Growth',
    status tenant_status not null default 'Active',
    users_count integer not null default 0,
    exams_this_month integer not null default 0,
    mrr numeric(10, 2) not null default 0.00,
    settings jsonb default '{"proctoring_v2": true, "ai_item_analysis": true, "nba_reports": false, "offline_exams": false}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger trg_tenant_updated_at
    before update on tenant
    for each row execute function update_updated_at_column();

-- 3.2 User Account (Profile mapping to auth.users)
create table if not exists user_account (
    id uuid primary key default gen_random_uuid(),
    auth_user_id uuid references auth.users(id) on delete set null,
    tenant_id uuid references tenant(id) on delete cascade,
    email text not null,
    full_name text not null,
    first_name text generated always as (split_part(full_name, ' ', 1)) stored,
    last_name text generated always as (nullif(substr(full_name, length(split_part(full_name, ' ', 1)) + 2), '')) stored,
    role user_role not null default 'student',
    avatar_url text,
    phone text,
    status text not null default 'Active',
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_tenant_email unique (tenant_id, email)
);

create trigger trg_user_account_updated_at
    before update on user_account
    for each row execute function update_updated_at_column();

-- Helper functions for RLS
create or replace function current_user_tenant_id()
returns uuid as $$
    select tenant_id from user_account where auth_user_id = auth.uid() limit 1;
$$ language sql stable security definer;

create or replace function current_user_role()
returns user_role as $$
    select role from user_account where auth_user_id = auth.uid() limit 1;
$$ language sql stable security definer;

-- 3.3 Department
create table if not exists department (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenant(id) on delete cascade,
    name text not null,
    code text not null,
    hod_id uuid references user_account(id) on delete set null,
    faculty_count integer not null default 0,
    student_count integer not null default 0,
    course_count integer not null default 0,
    status department_status not null default 'Active',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_tenant_department_code unique (tenant_id, code)
);

create trigger trg_department_updated_at
    before update on department
    for each row execute function update_updated_at_column();

-- 3.4 Batch (Cohorts e.g. 2021-25 CSE A)
create table if not exists batch (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenant(id) on delete cascade,
    department_id uuid not null references department(id) on delete cascade,
    name text not null,
    code text not null,
    academic_year text not null,
    section text not null default 'A',
    student_count integer not null default 0,
    at_risk_count integer not null default 0,
    mentor_id uuid references user_account(id) on delete set null,
    status batch_status not null default 'Active',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_tenant_batch_code unique (tenant_id, code)
);

create trigger trg_batch_updated_at
    before update on batch
    for each row execute function update_updated_at_column();

-- 3.5 Student Profile
create table if not exists student_profile (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references user_account(id) on delete cascade,
    tenant_id uuid not null references tenant(id) on delete cascade,
    roll_number text not null,
    department_id uuid not null references department(id) on delete cascade,
    batch_id uuid references batch(id) on delete set null,
    semester integer not null default 1,
    cgpa numeric(4, 2) not null default 0.00,
    attendance_pct numeric(5, 2) not null default 100.00,
    credits_earned integer not null default 0,
    total_credits integer not null default 160,
    class_rank integer,
    status text not null default 'Active',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_tenant_student_roll unique (tenant_id, roll_number)
);

create trigger trg_student_profile_updated_at
    before update on student_profile
    for each row execute function update_updated_at_column();

-- 3.6 Faculty Profile
create table if not exists faculty_profile (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references user_account(id) on delete cascade,
    tenant_id uuid not null references tenant(id) on delete cascade,
    employee_id text not null,
    department_id uuid not null references department(id) on delete cascade,
    designation text not null default 'Assistant Professor',
    workload_pct integer not null default 60,
    grading_queue_count integer not null default 0,
    status text not null default 'Active',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_tenant_faculty_empid unique (tenant_id, employee_id)
);

create trigger trg_faculty_profile_updated_at
    before update on faculty_profile
    for each row execute function update_updated_at_column();

-- 3.7 Course
create table if not exists course (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenant(id) on delete cascade,
    department_id uuid not null references department(id) on delete cascade,
    code text not null,
    title text not null,
    faculty_id uuid references user_account(id) on delete set null,
    credits integer not null default 3,
    units integer not null default 5,
    semester integer not null default 1,
    students_count integer not null default 0,
    status text not null default 'Active',
    syllabus jsonb default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_tenant_course_code unique (tenant_id, code)
);

create trigger trg_course_updated_at
    before update on course
    for each row execute function update_updated_at_column();

-- 3.8 Course Enrollment
create table if not exists course_enrollment (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenant(id) on delete cascade,
    course_id uuid not null references course(id) on delete cascade,
    student_id uuid not null references user_account(id) on delete cascade,
    attendance_pct numeric(5, 2) not null default 100.00,
    progress_pct integer not null default 0,
    grade text default null,
    status text not null default 'Enrolled',
    enrolled_at timestamptz not null default now(),
    constraint uq_course_student unique (course_id, student_id)
);

-- 3.9 Assessment (Exams, Quizzes, Lab Tests)
create table if not exists assessment (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenant(id) on delete cascade,
    course_id uuid not null references course(id) on delete cascade,
    faculty_id uuid references user_account(id) on delete set null,
    title text not null,
    type assessment_type not null default 'MCQ',
    questions_count integer not null default 0,
    total_marks integer not null default 100,
    duration_minutes integer not null default 60,
    version text not null default 'v1',
    status assessment_status not null default 'Draft',
    schedule_start timestamptz,
    schedule_end timestamptz,
    instructions text,
    proctoring_config jsonb default '{"webcam_required": true, "screen_lock": true, "ai_suspicion_detection": true}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger trg_assessment_updated_at
    before update on assessment
    for each row execute function update_updated_at_column();

-- 3.10 Question Bank
create table if not exists question (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenant(id) on delete cascade,
    course_id uuid not null references course(id) on delete cascade,
    assessment_id uuid references assessment(id) on delete set null,
    stem text not null,
    type assessment_type not null default 'MCQ',
    bloom_level text not null default 'Understand',
    difficulty text not null default 'Medium',
    marks numeric(5, 2) not null default 2.00,
    used_in_count integer not null default 0,
    content jsonb not null default '{}'::jsonb,
    created_by uuid references user_account(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger trg_question_updated_at
    before update on question
    for each row execute function update_updated_at_column();

-- 3.11 Exam Submission
create table if not exists exam_submission (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenant(id) on delete cascade,
    assessment_id uuid not null references assessment(id) on delete cascade,
    student_id uuid not null references user_account(id) on delete cascade,
    status submission_status not null default 'In progress',
    score numeric(5, 2) default null,
    total_marks numeric(5, 2) not null default 100.00,
    started_at timestamptz not null default now(),
    submitted_at timestamptz,
    answers jsonb not null default '{}'::jsonb,
    proctoring_logs jsonb default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_assessment_student_submission unique (assessment_id, student_id)
);

create trigger trg_exam_submission_updated_at
    before update on exam_submission
    for each row execute function update_updated_at_column();

-- 3.12 Grading Record (Manual & Rubric Scoring)
create table if not exists grading_record (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenant(id) on delete cascade,
    submission_id uuid not null references exam_submission(id) on delete cascade,
    question_id uuid not null references question(id) on delete cascade,
    evaluator_id uuid references user_account(id) on delete set null,
    marks_awarded numeric(5, 2) not null default 0.00,
    rubric_scores jsonb default '[]'::jsonb,
    feedback text,
    graded_at timestamptz not null default now()
);

-- 3.13 Announcements
create table if not exists announcement (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenant(id) on delete cascade,
    author_id uuid references user_account(id) on delete set null,
    title text not null,
    content text not null,
    priority text not null default 'Normal',
    published_at timestamptz not null default now(),
    created_at timestamptz not null default now()
);

-- 3.14 Notifications
create table if not exists notification (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenant(id) on delete cascade,
    recipient_id uuid not null references user_account(id) on delete cascade,
    title text not null,
    body text not null,
    link text,
    read_at timestamptz default null,
    created_at timestamptz not null default now()
);

-- 3.15 Student Portfolio
create table if not exists student_portfolio (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references user_account(id) on delete cascade,
    headline text,
    bio text,
    resume_url text,
    skills text[] default '{}',
    links jsonb default '{"github": "", "linkedin": "", "portfolio": ""}'::jsonb,
    projects jsonb default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger trg_student_portfolio_updated_at
    before update on student_portfolio
    for each row execute function update_updated_at_column();

-- 3.16 Integration Account (OAuth tokens for GitHub & LinkedIn)
create table if not exists integration_account (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references user_account(id) on delete cascade,
    provider text not null,
    provider_username text,
    access_token_enc text,
    profile_data jsonb default '{}'::jsonb,
    connected_at timestamptz not null default now(),
    constraint uq_user_provider unique (user_id, provider)
);

-- 3.17 Department Course Coverage Matrix
create table if not exists department_course_coverage (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenant(id) on delete cascade,
    department_id uuid not null references department(id) on delete cascade,
    course_id uuid not null references course(id) on delete cascade,
    unit_1_pct integer not null default 0,
    unit_2_pct integer not null default 0,
    unit_3_pct integer not null default 0,
    unit_4_pct integer not null default 0,
    unit_5_pct integer not null default 0,
    overall_pct integer not null default 0,
    updated_at timestamptz not null default now(),
    constraint uq_dept_course_coverage unique (department_id, course_id)
);

-- 3.18 System Audit Log
create table if not exists system_audit_log (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid references tenant(id) on delete set null,
    actor_id uuid references user_account(id) on delete set null,
    action text not null,
    entity text not null,
    entity_id text,
    metadata jsonb default '{}'::jsonb,
    ip_address text,
    created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 4. Database Indexes for Performance & Multitenancy
-- ------------------------------------------------------------------------------

create index if not exists idx_user_account_tenant on user_account(tenant_id);
create index if not exists idx_user_account_auth on user_account(auth_user_id);
create index if not exists idx_department_tenant on department(tenant_id);
create index if not exists idx_batch_tenant on batch(tenant_id);
create index if not exists idx_batch_dept on batch(department_id);
create index if not exists idx_student_profile_tenant on student_profile(tenant_id);
create index if not exists idx_student_profile_roll on student_profile(roll_number);
create index if not exists idx_student_profile_batch on student_profile(batch_id);
create index if not exists idx_faculty_profile_tenant on faculty_profile(tenant_id);
create index if not exists idx_course_tenant on course(tenant_id);
create index if not exists idx_course_dept on course(department_id);
create index if not exists idx_enrollment_course on course_enrollment(course_id);
create index if not exists idx_enrollment_student on course_enrollment(student_id);
create index if not exists idx_assessment_tenant on assessment(tenant_id);
create index if not exists idx_assessment_course on assessment(course_id);
create index if not exists idx_question_course on question(course_id);
create index if not exists idx_submission_assessment on exam_submission(assessment_id);
create index if not exists idx_submission_student on exam_submission(student_id);
create index if not exists idx_notification_recipient on notification(recipient_id);
create index if not exists idx_announcement_tenant on announcement(tenant_id);
create index if not exists idx_audit_log_tenant on system_audit_log(tenant_id);

-- ------------------------------------------------------------------------------
-- 5. Row-Level Security (RLS) Policies
-- ------------------------------------------------------------------------------

-- Enable RLS across all tables
alter table tenant enable row level security;
alter table user_account enable row level security;
alter table department enable row level security;
alter table batch enable row level security;
alter table student_profile enable row level security;
alter table faculty_profile enable row level security;
alter table course enable row level security;
alter table course_enrollment enable row level security;
alter table assessment enable row level security;
alter table question enable row level security;
alter table exam_submission enable row level security;
alter table grading_record enable row level security;
alter table announcement enable row level security;
alter table notification enable row level security;
alter table student_portfolio enable row level security;
alter table integration_account enable row level security;
alter table department_course_coverage enable row level security;
alter table system_audit_log enable row level security;

-- 5.1 Tenant RLS
create policy "Public can view active tenants for login"
    on tenant for select using (status = 'Active');

create policy "Super admins have full tenant access"
    on tenant for all using (current_user_role() = 'super-admin');

-- 5.2 User Account RLS
create policy "Users can view members of their own tenant"
    on user_account for select using (
        tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
    );

create policy "Users can update their own account"
    on user_account for update using (auth_user_id = auth.uid());

create policy "Admins can manage accounts in their tenant"
    on user_account for all using (
        (tenant_id = current_user_tenant_id() and current_user_role() in ('college-admin', 'super-admin'))
        or current_user_role() = 'super-admin'
    );

-- 5.3 Department RLS
create policy "Tenant members can view departments"
    on department for select using (
        tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
    );

create policy "College admins can manage departments"
    on department for all using (
        (tenant_id = current_user_tenant_id() and current_user_role() in ('college-admin', 'super-admin'))
        or current_user_role() = 'super-admin'
    );

-- 5.4 Batch RLS
create policy "Tenant members can view batches"
    on batch for select using (
        tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
    );

create policy "College admins can manage batches"
    on batch for all using (
        (tenant_id = current_user_tenant_id() and current_user_role() in ('college-admin', 'super-admin'))
        or current_user_role() = 'super-admin'
    );

-- 5.5 Student & Faculty Profiles RLS
create policy "Tenant members can view student profiles"
    on student_profile for select using (
        tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
    );

create policy "Students can update their own profile"
    on student_profile for update using (
        user_id in (select id from user_account where auth_user_id = auth.uid())
    );

create policy "Tenant members can view faculty profiles"
    on faculty_profile for select using (
        tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
    );

-- 5.6 Courses & Enrollments RLS
create policy "Tenant members can view courses"
    on course for select using (
        tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
    );

create policy "Faculty and admins can manage courses"
    on course for all using (
        (tenant_id = current_user_tenant_id() and current_user_role() in ('faculty', 'college-admin', 'super-admin'))
        or current_user_role() = 'super-admin'
    );

create policy "Students and faculty can view enrollments"
    on course_enrollment for select using (
        tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
    );

-- 5.7 Assessments & Questions RLS
create policy "Tenant members can view published assessments"
    on assessment for select using (
        tenant_id = current_user_tenant_id() and (status = 'Published' or current_user_role() in ('faculty', 'college-admin', 'super-admin'))
    );

create policy "Faculty can manage assessments"
    on assessment for all using (
        (tenant_id = current_user_tenant_id() and current_user_role() in ('faculty', 'college-admin', 'super-admin'))
        or current_user_role() = 'super-admin'
    );

create policy "Faculty can view and manage question bank"
    on question for all using (
        (tenant_id = current_user_tenant_id() and current_user_role() in ('faculty', 'college-admin', 'super-admin'))
        or current_user_role() = 'super-admin'
    );

-- 5.8 Submissions & Grading RLS
create policy "Students can view and manage own submissions"
    on exam_submission for all using (
        student_id in (select id from user_account where auth_user_id = auth.uid())
    );

create policy "Faculty can view and evaluate submissions"
    on exam_submission for select using (
        tenant_id = current_user_tenant_id() and current_user_role() in ('faculty', 'college-admin', 'super-admin')
    );

create policy "Faculty can record grades"
    on grading_record for all using (
        (tenant_id = current_user_tenant_id() and current_user_role() in ('faculty', 'college-admin', 'super-admin'))
        or current_user_role() = 'super-admin'
    );

-- 5.9 Announcements & Notifications RLS
create policy "Tenant members can view announcements"
    on announcement for select using (
        tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
    );

create policy "Users can view and update their own notifications"
    on notification for all using (
        recipient_id in (select id from user_account where auth_user_id = auth.uid())
    );

-- 5.10 Student Portfolio & Integrations RLS
create policy "Portfolios are viewable by tenant members"
    on student_portfolio for select using (true);

create policy "Students manage own portfolio"
    on student_portfolio for all using (
        user_id in (select id from user_account where auth_user_id = auth.uid())
    );

create policy "Users manage own integration accounts"
    on integration_account for all using (
        user_id in (select id from user_account where auth_user_id = auth.uid())
    );

-- 5.11 Department Course Coverage & Audit Log RLS
create policy "Tenant members can view coverage matrix"
    on department_course_coverage for select using (
        tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
    );

create policy "Admins can view system audit logs"
    on system_audit_log for select using (
        current_user_role() in ('college-admin', 'super-admin')
    );
