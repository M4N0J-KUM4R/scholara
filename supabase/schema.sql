-- ==============================================================================
-- CollegeCloud (Scholara) - Consolidated Supabase Schema & Seed Script
-- Instructions: You can copy and paste this entire script directly into the
-- Supabase Dashboard SQL Editor (Project -> SQL Editor -> New Query -> Run)
-- to initialize the database with tables, indexes, RLS policies, and demo data.
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. ENUM TYPES
do $$ begin
    create type user_role as enum ('super-admin', 'college-admin', 'faculty', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
    create type tenant_status as enum ('Active', 'Suspended', 'Onboarding');
exception when duplicate_object then null; end $$;

do $$ begin
    create type tenant_plan as enum ('Enterprise', 'Growth', 'Starter');
exception when duplicate_object then null; end $$;

do $$ begin
    create type department_status as enum ('Active', 'Archived');
exception when duplicate_object then null; end $$;

do $$ begin
    create type batch_status as enum ('Active', 'Graduated', 'Archived');
exception when duplicate_object then null; end $$;

do $$ begin
    create type assessment_status as enum ('Draft', 'Pending review', 'Approved', 'Rejected', 'Published', 'Completed');
exception when duplicate_object then null; end $$;

do $$ begin
    create type assessment_type as enum ('MCQ', 'Coding', 'Lab', 'Short answer', 'Essay', 'Numerical');
exception when duplicate_object then null; end $$;

do $$ begin
    create type submission_status as enum ('In progress', 'Submitted', 'Evaluated', 'Flagged');
exception when duplicate_object then null; end $$;

-- 3. TRIGGER FUNCTION
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 4. TABLES
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

create or replace function current_user_tenant_id()
returns uuid as $$
    select tenant_id from user_account where auth_user_id = auth.uid() limit 1;
$$ language sql stable security definer;

create or replace function current_user_role()
returns user_role as $$
    select role from user_account where auth_user_id = auth.uid() limit 1;
$$ language sql stable security definer;

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

-- 5. ROW-LEVEL SECURITY
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

-- Policies
create policy "tenant_select_active" on tenant for select using (status = 'Active');
create policy "tenant_admin_all" on tenant for all using (current_user_role() = 'super-admin');

create policy "user_account_select_tenant" on user_account for select using (
    tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
);
create policy "user_account_update_self" on user_account for update using (auth_user_id = auth.uid());
create policy "user_account_admin_all" on user_account for all using (
    (tenant_id = current_user_tenant_id() and current_user_role() in ('college-admin', 'super-admin'))
    or current_user_role() = 'super-admin'
);

create policy "department_select_tenant" on department for select using (
    tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
);
create policy "batch_select_tenant" on batch for select using (
    tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
);
create policy "course_select_tenant" on course for select using (
    tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
);
create policy "assessment_select_tenant" on assessment for select using (
    tenant_id = current_user_tenant_id() and (status = 'Published' or current_user_role() in ('faculty', 'college-admin', 'super-admin'))
);
create policy "question_select_faculty" on question for all using (
    (tenant_id = current_user_tenant_id() and current_user_role() in ('faculty', 'college-admin', 'super-admin'))
    or current_user_role() = 'super-admin'
);
create policy "submission_student_all" on exam_submission for all using (
    student_id in (select id from user_account where auth_user_id = auth.uid())
);
create policy "submission_faculty_select" on exam_submission for select using (
    tenant_id = current_user_tenant_id() and current_user_role() in ('faculty', 'college-admin', 'super-admin')
);
create policy "announcement_select_tenant" on announcement for select using (
    tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
);
create policy "notification_recipient_all" on notification for all using (
    recipient_id in (select id from user_account where auth_user_id = auth.uid())
);
create policy "portfolio_select_all" on student_portfolio for select using (true);
create policy "portfolio_student_all" on student_portfolio for all using (
    user_id in (select id from user_account where auth_user_id = auth.uid())
);
create policy "coverage_select_tenant" on department_course_coverage for select using (
    tenant_id = current_user_tenant_id() or current_user_role() = 'super-admin'
);

-- 6. SEED DATA
insert into tenant (id, name, slug, domain, plan, status, users_count, exams_this_month, mrr)
values
    ('11111111-1111-1111-1111-111111111111', 'Hindustan University', 'hindustan', 'hindustan.edu', 'Enterprise', 'Active', 18420, 38, 4200.00),
    ('22222222-2222-2222-2222-222222222222', 'Ridgeview Institute of Technology', 'ridgeview', 'ridgeview.edu', 'Growth', 'Active', 6210, 21, 1600.00),
    ('33333333-3333-3333-3333-333333333333', 'St. Meridian College', 'meridian', 'meridian.edu', 'Growth', 'Active', 4380, 12, 1150.00),
    ('44444444-4444-4444-4444-444444444444', 'Lakeport Polytechnic', 'lakeport', 'lakeport.edu', 'Starter', 'Suspended', 1290, 0, 0.00),
    ('55555555-5555-5555-5555-555555555555', 'Nova Science Academy', 'nova', 'nova.edu', 'Starter', 'Onboarding', 860, 2, 250.00)
on conflict (id) do nothing;

insert into user_account (id, tenant_id, email, full_name, role, status)
values
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'superadmin@collegecloud.ai', 'Platform Administrator', 'super-admin', 'Active'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'admin@hindustan.edu', 'Dr. Rajesh Varma', 'college-admin', 'Active'),
    ('f1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'ananya.rao@hindustan.edu', 'Dr. Ananya Rao', 'faculty', 'Active'),
    ('f2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'rahul.menon@hindustan.edu', 'Prof. Rahul Menon', 'faculty', 'Active'),
    ('f3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'sneha.iyer@hindustan.edu', 'Dr. Sneha Iyer', 'faculty', 'Active'),
    ('s0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'aarav.sharma@hindustan.edu', 'Aarav Sharma', 'student', 'Active'),
    ('s0000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'diya.patel@hindustan.edu', 'Diya Patel', 'student', 'Active'),
    ('s0000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'rohan.gupta@hindustan.edu', 'Rohan Gupta', 'student', 'Active')
on conflict (tenant_id, email) do nothing;

insert into department (id, tenant_id, name, code, hod_id, faculty_count, student_count, course_count, status)
values
    ('d1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Computer Science & Engineering', 'CSE', 'f1111111-1111-1111-1111-111111111111', 24, 840, 18, 'Active'),
    ('d2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Electronics & Communication', 'ECE', null, 19, 620, 14, 'Active')
on conflict (id) do nothing;

insert into batch (id, tenant_id, department_id, name, code, academic_year, section, student_count, at_risk_count, status)
values
    ('ba111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'B.Tech CSE 2021–25 Section A', '2021–25 A', '2021-2025', 'A', 64, 4, 'Active')
on conflict (id) do nothing;

insert into student_profile (user_id, tenant_id, roll_number, department_id, batch_id, semester, cgpa, attendance_pct, credits_earned, class_rank, status)
values
    ('s0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '21CSE001', 'd1111111-1111-1111-1111-111111111111', 'ba111111-1111-1111-1111-111111111111', 5, 8.74, 91.4, 108, 4, 'Active')
on conflict (user_id) do nothing;

insert into course (id, tenant_id, department_id, code, title, faculty_id, credits, units, semester, students_count, status)
values
    ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'CS301', 'Data Structures & Algorithms', 'f1111111-1111-1111-1111-111111111111', 4, 5, 5, 124, 'Active'),
    ('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'CS305', 'Operating Systems', 'f2222222-2222-2222-2222-222222222222', 4, 5, 5, 118, 'Active')
on conflict (id) do nothing;

insert into assessment (id, tenant_id, course_id, faculty_id, title, type, questions_count, total_marks, duration_minutes, version, status)
values
    ('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'DSA Midterm — MCQ', 'MCQ', 42, 100, 90, 'v3', 'Published')
on conflict (id) do nothing;

insert into announcement (tenant_id, author_id, title, content, priority, published_at)
values
    ('11111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'Mid-Term Exam Schedule Released', 'The timetable for Semester 5 proctored assessments is live.', 'High', now())
on conflict (id) do nothing;

insert into notification (tenant_id, recipient_id, title, body, link)
values
    ('11111111-1111-1111-1111-111111111111', 's0000001-0000-0000-0000-000000000001', 'DSA Midterm Hall Ticket is Ready', 'Download your verified exam pass.', '/student/exams')
on conflict (id) do nothing;
