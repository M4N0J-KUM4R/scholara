-- ==============================================================================
-- CollegeCloud (Scholara) - Supabase Seed Script
-- Realistic Multi-Tenant Seed Data matching Frontend Prototypes & Operational Views
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Seed Tenants
-- ------------------------------------------------------------------------------

insert into tenant (id, name, slug, domain, plan, status, users_count, exams_this_month, mrr)
values
    ('11111111-1111-1111-1111-111111111111', 'Hindustan University', 'hindustan', 'hindustan.edu', 'Enterprise', 'Active', 18420, 38, 4200.00),
    ('22222222-2222-2222-2222-222222222222', 'Ridgeview Institute of Technology', 'ridgeview', 'ridgeview.edu', 'Growth', 'Active', 6210, 21, 1600.00),
    ('33333333-3333-3333-3333-333333333333', 'St. Meridian College', 'meridian', 'meridian.edu', 'Growth', 'Active', 4380, 12, 1150.00),
    ('44444444-4444-4444-4444-444444444444', 'Lakeport Polytechnic', 'lakeport', 'lakeport.edu', 'Starter', 'Suspended', 1290, 0, 0.00),
    ('55555555-5555-5555-5555-555555555555', 'Nova Science Academy', 'nova', 'nova.edu', 'Starter', 'Onboarding', 860, 2, 250.00)
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 2. Seed User Accounts
-- ------------------------------------------------------------------------------

-- Super Admin
insert into user_account (id, tenant_id, email, full_name, role, status)
values
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'superadmin@collegecloud.ai', 'Platform Administrator', 'super-admin', 'Active')
on conflict (tenant_id, email) do nothing;

-- College Admin
insert into user_account (id, tenant_id, email, full_name, role, status)
values
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'admin@hindustan.edu', 'Dr. Rajesh Varma', 'college-admin', 'Active')
on conflict (tenant_id, email) do nothing;

-- Faculty Members
insert into user_account (id, tenant_id, email, full_name, role, status)
values
    ('f1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'ananya.rao@hindustan.edu', 'Dr. Ananya Rao', 'faculty', 'Active'),
    ('f2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'rahul.menon@hindustan.edu', 'Prof. Rahul Menon', 'faculty', 'Active'),
    ('f3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'sneha.iyer@hindustan.edu', 'Dr. Sneha Iyer', 'faculty', 'Active'),
    ('f4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'vikram.shetty@hindustan.edu', 'Dr. Vikram Shetty', 'faculty', 'Active'),
    ('f5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'divya.nair@hindustan.edu', 'Prof. Divya Nair', 'faculty', 'Active'),
    ('f6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'farhan.ali@hindustan.edu', 'Dr. Farhan Ali', 'faculty', 'Active'),
    ('f7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'kavya.reddy@hindustan.edu', 'Prof. Kavya Reddy', 'faculty', 'Active'),
    ('f8888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'leena.mathew@hindustan.edu', 'Dr. Leena Mathew', 'faculty', 'Active')
on conflict (tenant_id, email) do nothing;

-- Students (Aarav, Diya, Rohan, Ishita, Kabir, etc.)
insert into user_account (id, tenant_id, email, full_name, role, status)
values
    ('s0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'aarav.sharma@hindustan.edu', 'Aarav Sharma', 'student', 'Active'),
    ('s0000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'diya.patel@hindustan.edu', 'Diya Patel', 'student', 'Active'),
    ('s0000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'rohan.gupta@hindustan.edu', 'Rohan Gupta', 'student', 'Active'),
    ('s0000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'ishita.verma@hindustan.edu', 'Ishita Verma', 'student', 'Active'),
    ('s0000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'kabir.singh@hindustan.edu', 'Kabir Singh', 'student', 'Active'),
    ('s0000006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'ananya.roy@hindustan.edu', 'Ananya Roy', 'student', 'Active'),
    ('s0000007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'karthik.s@hindustan.edu', 'Karthik S', 'student', 'Active'),
    ('s0000008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'pooja.nair@hindustan.edu', 'Pooja Nair', 'student', 'Active'),
    ('s0000009-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'siddharth.rao@hindustan.edu', 'Siddharth Rao', 'student', 'Active'),
    ('s0000010-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'tanvi.kulkarni@hindustan.edu', 'Tanvi Kulkarni', 'student', 'Active'),
    ('s0000011-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', 'varun.mehta@hindustan.edu', 'Varun Mehta', 'student', 'Active'),
    ('s0000012-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', 'riya.sen@hindustan.edu', 'Riya Sen', 'student', 'Active'),
    ('s0000013-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', 'nikhil.joshi@hindustan.edu', 'Nikhil Joshi', 'student', 'Active'),
    ('s0000014-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', 'sneha.paul@hindustan.edu', 'Sneha Paul', 'student', 'Active'),
    ('s0000015-0000-0000-0000-000000000015', '11111111-1111-1111-1111-111111111111', 'aditya.pillai@hindustan.edu', 'Aditya Pillai', 'student', 'Active')
on conflict (tenant_id, email) do nothing;

-- ------------------------------------------------------------------------------
-- 3. Seed Departments
-- ------------------------------------------------------------------------------

insert into department (id, tenant_id, name, code, hod_id, faculty_count, student_count, course_count, status)
values
    ('d1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Computer Science & Engineering', 'CSE', 'f1111111-1111-1111-1111-111111111111', 24, 840, 18, 'Active'),
    ('d2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Electronics & Communication', 'ECE', 'f4444444-4444-4444-4444-444444444444', 19, 620, 14, 'Active'),
    ('d3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Mechanical Engineering', 'MECH', 'f6666666-6666-6666-6666-666666666666', 16, 540, 12, 'Active'),
    ('d4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Civil Engineering', 'CIVIL', null, 11, 380, 9, 'Active'),
    ('d5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Business Administration', 'MBA', 'f8888888-8888-8888-8888-888888888888', 9, 410, 8, 'Active'),
    ('d6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Applied Sciences', 'AS', null, 7, 290, 6, 'Archived')
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 4. Seed Batches
-- ------------------------------------------------------------------------------

insert into batch (id, tenant_id, department_id, name, code, academic_year, section, student_count, at_risk_count, mentor_id, status)
values
    ('ba111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'B.Tech CSE 2021–25 Section A', '2021–25 A', '2021-2025', 'A', 64, 4, 'f1111111-1111-1111-1111-111111111111', 'Active'),
    ('ba222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'B.Tech CSE 2021–25 Section B', '2021–25 B', '2021-2025', 'B', 62, 7, 'f2222222-2222-2222-2222-222222222222', 'Active'),
    ('ba333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'B.Tech CSE 2022–26 Section A', '2022–26 A', '2022-2026', 'A', 68, 2, 'f3333333-3333-3333-3333-333333333333', 'Active')
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 5. Seed Faculty Profiles
-- ------------------------------------------------------------------------------

insert into faculty_profile (user_id, tenant_id, employee_id, department_id, designation, workload_pct, grading_queue_count, status)
values
    ('f1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'EMP-1001', 'd1111111-1111-1111-1111-111111111111', 'HOD', 82, 4, 'Active'),
    ('f2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'EMP-1002', 'd1111111-1111-1111-1111-111111111111', 'Associate Professor', 108, 14, 'Overloaded'),
    ('f3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'EMP-1003', 'd1111111-1111-1111-1111-111111111111', 'Assistant Professor', 76, 8, 'Active'),
    ('f4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'EMP-1004', 'd2222222-2222-2222-2222-222222222222', 'HOD', 70, 2, 'Active'),
    ('f5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'EMP-1005', 'd2222222-2222-2222-2222-222222222222', 'Professor', 64, 0, 'On leave'),
    ('f6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'EMP-1006', 'd3333333-3333-3333-3333-333333333333', 'HOD', 88, 11, 'Active'),
    ('f7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'EMP-1007', 'd3333333-3333-3333-3333-333333333333', 'Assistant Professor', 72, 6, 'Active'),
    ('f8888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'EMP-1008', 'd5555555-5555-5555-5555-555555555555', 'HOD', 58, 3, 'Active')
on conflict (user_id) do nothing;

-- ------------------------------------------------------------------------------
-- 6. Seed Student Profiles
-- ------------------------------------------------------------------------------

insert into student_profile (user_id, tenant_id, roll_number, department_id, batch_id, semester, cgpa, attendance_pct, credits_earned, class_rank, status)
values
    ('s0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '21CSE001', 'd1111111-1111-1111-1111-111111111111', 'ba111111-1111-1111-1111-111111111111', 5, 8.74, 91.4, 108, 4, 'Active'),
    ('s0000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '21CSE002', 'd1111111-1111-1111-1111-111111111111', 'ba111111-1111-1111-1111-111111111111', 5, 9.42, 96.2, 108, 1, 'Active'),
    ('s0000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '21CSE003', 'd1111111-1111-1111-1111-111111111111', 'ba111111-1111-1111-1111-111111111111', 5, 5.82, 68.4, 92, 58, 'At risk'),
    ('s0000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', '21CSE004', 'd1111111-1111-1111-1111-111111111111', 'ba222222-2222-2222-2222-222222222222', 5, 7.70, 84.1, 104, 18, 'Active'),
    ('s0000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', '21CSE005', 'd1111111-1111-1111-1111-111111111111', 'ba222222-2222-2222-2222-222222222222', 5, 4.40, 52.0, 78, 64, 'Suspended')
on conflict (user_id) do nothing;

-- ------------------------------------------------------------------------------
-- 7. Seed Courses
-- ------------------------------------------------------------------------------

insert into course (id, tenant_id, department_id, code, title, faculty_id, credits, units, semester, students_count, status)
values
    ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'CS301', 'Data Structures & Algorithms', 'f1111111-1111-1111-1111-111111111111', 4, 5, 5, 124, 'Active'),
    ('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'CS305', 'Operating Systems', 'f2222222-2222-2222-2222-222222222222', 4, 5, 5, 118, 'Active'),
    ('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'CS310', 'Database Management Systems', 'f3333333-3333-3333-3333-333333333333', 4, 4, 5, 132, 'Active'),
    ('c4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'EC210', 'Digital Signal Processing', 'f4444444-4444-4444-4444-444444444444', 3, 5, 5, 96, 'Active'),
    ('c5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'd3333333-3333-3333-3333-333333333333', 'ME220', 'Thermodynamics', 'f6666666-6666-6666-6666-666666666666', 3, 4, 3, 88, 'Active'),
    ('c6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'd5555555-5555-5555-5555-555555555555', 'MB110', 'Organisational Behaviour', 'f8888888-8888-8888-8888-888888888888', 3, 3, 1, 74, 'Draft')
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 8. Seed Course Enrollments (for student Aarav Sharma)
-- ------------------------------------------------------------------------------

insert into course_enrollment (tenant_id, course_id, student_id, attendance_pct, progress_pct, grade, status)
values
    ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 's0000001-0000-0000-0000-000000000001', 94.0, 68, 'A', 'Enrolled'),
    ('11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 's0000001-0000-0000-0000-000000000001', 89.5, 54, 'B+', 'Enrolled'),
    ('11111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 's0000001-0000-0000-0000-000000000001', 92.0, 71, 'A-', 'Enrolled'),
    ('11111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444', 's0000001-0000-0000-0000-000000000001', 88.0, 40, 'B', 'Enrolled')
on conflict (course_id, student_id) do nothing;

-- ------------------------------------------------------------------------------
-- 9. Seed Assessments
-- ------------------------------------------------------------------------------

insert into assessment (id, tenant_id, course_id, faculty_id, title, type, questions_count, total_marks, duration_minutes, version, status, schedule_start)
values
    ('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'DSA Midterm — MCQ', 'MCQ', 42, 100, 90, 'v3', 'Published', now() + interval '2 days'),
    ('e2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', 'OS Quiz 2 — Coding', 'Coding', 20, 40, 45, 'v2', 'Approved', now() + interval '4 days'),
    ('e3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'f3333333-3333-3333-3333-333333333333', 'DBMS Lab Final — Sandbox', 'Lab', 35, 80, 60, 'v3', 'Pending review', now() + interval '6 days'),
    ('e4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444', 'f4444444-4444-4444-4444-444444444444', 'DSP Final Exam', 'Numerical', 12, 100, 120, 'v1', 'Draft', now() + interval '10 days')
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 10. Seed Questions
-- ------------------------------------------------------------------------------

insert into question (id, tenant_id, course_id, assessment_id, stem, type, bloom_level, difficulty, marks, used_in_count, content)
values
    ('q1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111',
     'Which data structure gives O(1) amortized push and pop operations?', 'MCQ', 'Understand', 'Easy', 2.00, 4,
     '{"options": ["Queue", "Two stacks", "Dynamic Array / Stack", "Linked List"], "correct_option": 2}'::jsonb),

    ('q2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111',
     'Implement an LRU Cache with get/put operations in O(1) time complexity.', 'Coding', 'Create', 'Hard', 10.00, 2,
     '{"languages": ["cpp", "python", "java"], "test_cases": [{"input": "put(1,1), put(2,2), get(1)", "expected": "1"}]}'::jsonb),

    ('q3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222',
     'Explain the architectural difference between paging and segmentation in modern virtual memory systems.', 'Short answer', 'Understand', 'Medium', 5.00, 3,
     '{"rubric": [{"criterion": "Address translation", "marks": 2}, {"criterion": "Fragmentation impact", "marks": 3}]}'::jsonb),

    ('q4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333',
     'Containerize a Python microservice with a health endpoint and run on port 8080.', 'Lab', 'Create', 'Hard', 15.00, 1,
     '{"steps": ["Write Dockerfile", "Expose port 8080", "Verify GET /health curl check"]}'::jsonb)
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 11. Seed Announcements & Notifications
-- ------------------------------------------------------------------------------

insert into announcement (tenant_id, author_id, title, content, priority, published_at)
values
    ('11111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'Mid-Term Exam Schedule Released', 'The timetable for Semester 5 mid-term proctored assessments is now live. Ensure system check passes.', 'High', now() - interval '2 hours'),
    ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Campus Placement Drive: GitHub & LinkedIn Sync', 'All graduating batch students must connect their GitHub and LinkedIn profiles to export verified transcripts.', 'Normal', now() - interval '1 day'),
    ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Annual Research Symposium Paper Submissions', 'Faculty and student collaborative papers for IEEE symposium close on October 15.', 'Normal', now() - interval '3 days')
on conflict (id) do nothing;

insert into notification (tenant_id, recipient_id, title, body, link, read_at)
values
    ('11111111-1111-1111-1111-111111111111', 's0000001-0000-0000-0000-000000000001', 'DSA Midterm Hall Ticket is Ready', 'Download your verified exam pass and complete camera calibration.', '/student/exams', null),
    ('11111111-1111-1111-1111-111111111111', 's0000001-0000-0000-0000-000000000001', 'OS Quiz 2 practice set published', '15 review questions added by Prof. Rahul Menon.', '/student/courses', null),
    ('11111111-1111-1111-1111-111111111111', 's0000001-0000-0000-0000-000000000001', 'Grading complete for Signals Quiz', 'Score: 66/100 recorded. View breakdown.', '/student/results', now() - interval '1 day')
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 12. Seed CSE Department Course Coverage Matrix
-- ------------------------------------------------------------------------------

insert into department_course_coverage (tenant_id, department_id, course_id, unit_1_pct, unit_2_pct, unit_3_pct, unit_4_pct, unit_5_pct, overall_pct)
values
    ('11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 100, 95, 80, 45, 10, 66),
    ('11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 100, 100, 60, 20, 0, 56),
    ('11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 100, 100, 100, 85, 30, 83)
on conflict (department_id, course_id) do update
set unit_1_pct = excluded.unit_1_pct,
    unit_2_pct = excluded.unit_2_pct,
    unit_3_pct = excluded.unit_3_pct,
    unit_4_pct = excluded.unit_4_pct,
    unit_5_pct = excluded.unit_5_pct,
    overall_pct = excluded.overall_pct;
