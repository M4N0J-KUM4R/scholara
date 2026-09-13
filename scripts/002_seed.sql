-- CollegeCloud / Scholara — sample data covering every user role and core workflow.
-- Idempotent: uses fixed UUIDs + ON CONFLICT so it can be re-run safely.
-- NOTE: password_hash values are placeholder bcrypt-style strings for testing only.

-- ---------------------------------------------------------------------------
-- Roles (static catalog)
-- ---------------------------------------------------------------------------
INSERT INTO role (id, key, label, permissions) VALUES
  ('d0000000-0000-0000-0000-000000000001','super_admin','Super Admin','{"all":true}'),
  ('d0000000-0000-0000-0000-000000000002','college_admin','College Admin','{"manage_tenant":true,"manage_users":true,"manage_departments":true}'),
  ('d0000000-0000-0000-0000-000000000003','exam_controller','Exam Controller','{"validate_assessments":true,"schedule_exams":true,"publish_grades":true}'),
  ('d0000000-0000-0000-0000-000000000004','hod','Head of Department','{"manage_faculty":true,"rebalance_load":true,"validate_assessments":true}'),
  ('d0000000-0000-0000-0000-000000000005','faculty','Faculty','{"manage_courses":true,"create_assessments":true,"grade":true}'),
  ('d0000000-0000-0000-0000-000000000006','student','Student','{"take_assessments":true,"view_grades":true,"manage_portfolio":true}')
ON CONFLICT (key) DO UPDATE SET label = EXCLUDED.label, permissions = EXCLUDED.permissions;

-- ---------------------------------------------------------------------------
-- Tenant + settings
-- ---------------------------------------------------------------------------
INSERT INTO tenant (id, name, slug, status, contact_email, contact_phone, address, branding, onboarding_step) VALUES
  ('a0000000-0000-0000-0000-000000000001','Scholara Institute of Technology','scholara','active','admin@scholara.edu','+91-80-4000-1234',
   '{"line1":"12 Knowledge Park","city":"Bengaluru","state":"Karnataka","country":"India","postal_code":"560100"}',
   '{"logo_url":"/logo.png","primary_color":"#0ea5e9","secondary_color":"#111827"}', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status;

INSERT INTO tenant_settings (tenant_id, grading_scheme, exam_defaults, validation_required, feature_flags) VALUES
  ('a0000000-0000-0000-0000-000000000001',
   '{"scale":"percentage","bands":[{"grade":"A+","min":90,"max":100},{"grade":"A","min":80,"max":89},{"grade":"B","min":70,"max":79},{"grade":"C","min":60,"max":69},{"grade":"D","min":50,"max":59},{"grade":"F","min":0,"max":49}]}',
   '{"duration_min":60,"shuffle":true,"neg_marking":false,"attempts":1}', true,
   '{"portfolios":true,"proctoring":true,"integrations":true}')
ON CONFLICT (tenant_id) DO UPDATE SET grading_scheme = EXCLUDED.grading_scheme;

-- ---------------------------------------------------------------------------
-- Departments (HOD FK set after users exist)
-- ---------------------------------------------------------------------------
INSERT INTO department (id, tenant_id, name, code, description) VALUES
  ('b0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','Computer Science & Engineering','CSE','Core CS, AI/ML, systems'),
  ('b0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','Electronics & Communication','ECE','Signals, VLSI, embedded')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ---------------------------------------------------------------------------
-- Users — one (or more) per role
--   c...01 super_admin   c...02 college_admin  c...03 exam_controller
--   c...04 hod (CSE)     c...05 faculty (CSE)  c...06 faculty (ECE)
--   c...07..09 students
-- ---------------------------------------------------------------------------
INSERT INTO user_account (id, tenant_id, email, full_name, password_hash, status, last_login_at, preferences) VALUES
  ('c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','super@scholara.edu','Priya Nair','$2b$10$seedhashsuperadminxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','active', now() - interval '2 hours','{"theme":"dark"}'),
  ('c0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','admin@scholara.edu','Rahul Verma','$2b$10$seedhashcollegeadminxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','active', now() - interval '1 day','{"theme":"light"}'),
  ('c0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000001','exam.controller@scholara.edu','Sunita Rao','$2b$10$seedhashexamctrlxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','active', now() - interval '3 hours','{}'),
  ('c0000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000001','hod.cse@scholara.edu','Arun Kumar','$2b$10$seedhashhodxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','active', now() - interval '5 hours','{}'),
  ('c0000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000001','meena.iyer@scholara.edu','Meena Iyer','$2b$10$seedhashfaculty1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','active', now() - interval '6 hours','{}'),
  ('c0000000-0000-0000-0000-000000000006','a0000000-0000-0000-0000-000000000001','vikram.singh@scholara.edu','Vikram Singh','$2b$10$seedhashfaculty2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','active', now() - interval '8 hours','{}'),
  ('c0000000-0000-0000-0000-000000000007','a0000000-0000-0000-0000-000000000001','anita.desai@student.scholara.edu','Anita Desai','$2b$10$seedhashstudent1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','active', now() - interval '30 minutes','{"theme":"dark"}'),
  ('c0000000-0000-0000-0000-000000000008','a0000000-0000-0000-0000-000000000001','karan.mehta@student.scholara.edu','Karan Mehta','$2b$10$seedhashstudent2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','active', now() - interval '1 hour','{}'),
  ('c0000000-0000-0000-0000-000000000009','a0000000-0000-0000-0000-000000000001','sara.khan@student.scholara.edu','Sara Khan','$2b$10$seedhashstudent3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','invited', NULL,'{}')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, status = EXCLUDED.status;

-- Assign HODs now that users exist
UPDATE department SET hod_user_id = 'c0000000-0000-0000-0000-000000000004' WHERE id = 'b0000000-0000-0000-0000-000000000001';
UPDATE department SET hod_user_id = 'c0000000-0000-0000-0000-000000000006' WHERE id = 'b0000000-0000-0000-0000-000000000002';

-- ---------------------------------------------------------------------------
-- Role assignments (scope narrows HOD/faculty to a department)
-- ---------------------------------------------------------------------------
INSERT INTO user_role (tenant_id, user_id, role_id, scope) VALUES
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','d0000000-0000-0000-0000-000000000001','{}'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000002','{}'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000003','d0000000-0000-0000-0000-000000000003','{}'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000004','d0000000-0000-0000-0000-000000000004','{"department_id":"b0000000-0000-0000-0000-000000000001"}'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000004','d0000000-0000-0000-0000-000000000005','{"department_id":"b0000000-0000-0000-0000-000000000001"}'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000005','d0000000-0000-0000-0000-000000000005','{"department_id":"b0000000-0000-0000-0000-000000000001"}'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000006','d0000000-0000-0000-0000-000000000004','{"department_id":"b0000000-0000-0000-0000-000000000002"}'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000006','d0000000-0000-0000-0000-000000000005','{"department_id":"b0000000-0000-0000-0000-000000000002"}'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000007','d0000000-0000-0000-0000-000000000006','{}'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000008','d0000000-0000-0000-0000-000000000006','{}'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000009','d0000000-0000-0000-0000-000000000006','{}')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Faculty profiles (HOD is a faculty member with is_hod = true)
-- ---------------------------------------------------------------------------
INSERT INTO faculty_profile (id, tenant_id, user_id, department_id, employee_code, designation, specializations, max_weekly_load, current_load, is_hod) VALUES
  ('e0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000004','b0000000-0000-0000-0000-000000000001','EMP-CSE-001','Professor & HOD','["Distributed Systems","Databases"]',14,12,true),
  ('e0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000005','b0000000-0000-0000-0000-000000000001','EMP-CSE-002','Associate Professor','["Machine Learning","Algorithms"]',16,15,false),
  ('e0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000006','b0000000-0000-0000-0000-000000000002','EMP-ECE-001','Professor & HOD','["VLSI","Embedded Systems"]',14,9,true)
ON CONFLICT (user_id) DO UPDATE SET designation = EXCLUDED.designation, current_load = EXCLUDED.current_load;

-- ---------------------------------------------------------------------------
-- Batch
-- ---------------------------------------------------------------------------
INSERT INTO batch (id, tenant_id, department_id, name, year, section, capacity, enrolled_count, status) VALUES
  ('f1000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','CSE-2024-A',2024,'A',60,3,'active')
ON CONFLICT (id) DO UPDATE SET enrolled_count = EXCLUDED.enrolled_count;

-- ---------------------------------------------------------------------------
-- Student profiles
-- ---------------------------------------------------------------------------
INSERT INTO student_profile (id, tenant_id, user_id, department_id, batch_id, roll_number, enrollment_year, status, guardian, contact) VALUES
  ('f2000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000007','b0000000-0000-0000-0000-000000000001','f1000000-0000-0000-0000-000000000001','CSE24001',2024,'enrolled','{"name":"R. Desai","phone":"+91-98450-11111","relation":"father"}','{"phone":"+91-98450-22222","address":"Bengaluru"}'),
  ('f2000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000008','b0000000-0000-0000-0000-000000000001','f1000000-0000-0000-0000-000000000001','CSE24002',2024,'enrolled','{"name":"S. Mehta","phone":"+91-98450-33333","relation":"mother"}','{"phone":"+91-98450-44444"}'),
  ('f2000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000009','b0000000-0000-0000-0000-000000000001','f1000000-0000-0000-0000-000000000001','CSE24003',2024,'enrolled',NULL,NULL)
ON CONFLICT (user_id) DO UPDATE SET status = EXCLUDED.status;

-- ---------------------------------------------------------------------------
-- Academic term
-- ---------------------------------------------------------------------------
INSERT INTO academic_term (id, tenant_id, name, starts_on, ends_on, is_current) VALUES
  ('a1000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','Fall 2025','2025-08-01','2025-12-20',true)
ON CONFLICT (id) DO UPDATE SET is_current = EXCLUDED.is_current;

-- ---------------------------------------------------------------------------
-- Course + offering + enrollments
-- ---------------------------------------------------------------------------
INSERT INTO course (id, tenant_id, department_id, code, title, credits, description, syllabus) VALUES
  ('a2000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','CS301','Data Structures & Algorithms',4.0,'Core DSA course',
   '{"units":[{"title":"Arrays & Lists","topics":["arrays","linked lists"]},{"title":"Trees & Graphs","topics":["bst","dfs","bfs"]}]}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO batch_course (id, tenant_id, batch_id, course_id, term_id, faculty_id, schedule) VALUES
  ('a3000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','f1000000-0000-0000-0000-000000000001','a2000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000001','e0000000-0000-0000-0000-000000000002',
   '[{"day":"Mon","start":"10:00","end":"11:00","room":"CS-201"},{"day":"Wed","start":"10:00","end":"11:00","room":"CS-201"}]')
ON CONFLICT (batch_id, course_id, term_id) DO NOTHING;

INSERT INTO enrollment (tenant_id, student_id, batch_course_id, status) VALUES
  ('a0000000-0000-0000-0000-000000000001','f2000000-0000-0000-0000-000000000001','a3000000-0000-0000-0000-000000000001','enrolled'),
  ('a0000000-0000-0000-0000-000000000001','f2000000-0000-0000-0000-000000000002','a3000000-0000-0000-0000-000000000001','enrolled'),
  ('a0000000-0000-0000-0000-000000000001','f2000000-0000-0000-0000-000000000003','a3000000-0000-0000-0000-000000000001','enrolled')
ON CONFLICT (student_id, batch_course_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Question bank + questions (multiple types)
-- ---------------------------------------------------------------------------
INSERT INTO question_bank (id, tenant_id, course_id, name, description, tags) VALUES
  ('a4000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','a2000000-0000-0000-0000-000000000001','DSA Unit 1-2 Bank','Arrays, lists, trees','["unit-1","unit-2"]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question (id, tenant_id, question_bank_id, author_id, type, difficulty, prompt, body, default_marks, tags) VALUES
  ('a5000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','a4000000-0000-0000-0000-000000000001','e0000000-0000-0000-0000-000000000002','mcq_single','easy',
   'What is the time complexity of binary search on a sorted array?',
   '{"options":["O(n)","O(log n)","O(n log n)","O(1)"],"correct":[1]}',1,'["complexity","searching"]'),
  ('a5000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','a4000000-0000-0000-0000-000000000001','e0000000-0000-0000-0000-000000000002','mcq_multi','medium',
   'Which of the following are self-balancing binary search trees?',
   '{"options":["AVL Tree","Red-Black Tree","Binary Heap","B-Tree"],"correct":[0,1,3]}',2,'["trees"]'),
  ('a5000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000001','a4000000-0000-0000-0000-000000000001','e0000000-0000-0000-0000-000000000002','true_false','easy',
   'A stack follows FIFO ordering.',
   '{"correct":false}',1,'["stack"]'),
  ('a5000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000001','a4000000-0000-0000-0000-000000000001','e0000000-0000-0000-0000-000000000002','coding','hard',
   'Implement a function reverse(head) that reverses a singly linked list and returns the new head.',
   '{"language":"python","starter_code":"def reverse(head):\n    pass","test_cases":[{"in":"1->2->3","out":"3->2->1"},{"in":"1","out":"1"}],"rubric":"correctness + O(n) time"}',5,'["linked-list","coding"]')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Assessment (graded) + composition
-- ---------------------------------------------------------------------------
INSERT INTO assessment (id, tenant_id, batch_course_id, created_by, title, type, status, total_marks, duration_min, opens_at, closes_at, config, instructions) VALUES
  ('a6000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','a3000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000005','DSA Midterm - Unit 1 & 2','midterm','graded',9,60,
   now() - interval '7 days', now() - interval '7 days' + interval '60 minutes',
   '{"shuffle":true,"neg_marking":false,"attempts":1,"proctoring":true}','Answer all questions. No external resources.')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

INSERT INTO assessment_question (id, assessment_id, question_id, position, marks, section) VALUES
  ('a7000000-0000-0000-0000-000000000001','a6000000-0000-0000-0000-000000000001','a5000000-0000-0000-0000-000000000001',1,1,'Section A'),
  ('a7000000-0000-0000-0000-000000000002','a6000000-0000-0000-0000-000000000001','a5000000-0000-0000-0000-000000000002',2,2,'Section A'),
  ('a7000000-0000-0000-0000-000000000003','a6000000-0000-0000-0000-000000000001','a5000000-0000-0000-0000-000000000003',3,1,'Section A'),
  ('a7000000-0000-0000-0000-000000000004','a6000000-0000-0000-0000-000000000001','a5000000-0000-0000-0000-000000000004',4,5,'Section B')
ON CONFLICT (assessment_id, question_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Validation review (approved by exam controller)
-- ---------------------------------------------------------------------------
INSERT INTO validation_review (id, tenant_id, assessment_id, reviewer_id, decision, comments, checklist, reviewed_at) VALUES
  ('a8000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','a6000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000003','approved','Balanced difficulty, marks total correct.',
   '[{"item":"Marks add up","ok":true},{"item":"No duplicate questions","ok":true},{"item":"Difficulty spread","ok":true}]', now() - interval '8 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Exam attempts + answers + grades (2 graded students, 1 in-progress)
-- ---------------------------------------------------------------------------
INSERT INTO exam_attempt (id, tenant_id, assessment_id, student_id, status, started_at, submitted_at, time_spent_sec, attempt_no) VALUES
  ('a9000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','a6000000-0000-0000-0000-000000000001','f2000000-0000-0000-0000-000000000001','graded', now() - interval '7 days', now() - interval '7 days' + interval '52 minutes',3120,1),
  ('a9000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','a6000000-0000-0000-0000-000000000001','f2000000-0000-0000-0000-000000000002','graded', now() - interval '7 days', now() - interval '7 days' + interval '58 minutes',3480,1),
  ('a9000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000001','a6000000-0000-0000-0000-000000000001','f2000000-0000-0000-0000-000000000003','in_progress', now() - interval '5 minutes', NULL, NULL,1)
ON CONFLICT (assessment_id, student_id, attempt_no) DO NOTHING;

INSERT INTO answer (attempt_id, assessment_question_id, response, awarded_marks, is_correct, feedback, graded_by) VALUES
  -- Anita (8/9)
  ('a9000000-0000-0000-0000-000000000001','a7000000-0000-0000-0000-000000000001','{"selected":[1]}',1,true,NULL,'c0000000-0000-0000-0000-000000000005'),
  ('a9000000-0000-0000-0000-000000000001','a7000000-0000-0000-0000-000000000002','{"selected":[0,1,3]}',2,true,NULL,'c0000000-0000-0000-0000-000000000005'),
  ('a9000000-0000-0000-0000-000000000001','a7000000-0000-0000-0000-000000000003','{"selected":false}',1,true,NULL,'c0000000-0000-0000-0000-000000000005'),
  ('a9000000-0000-0000-0000-000000000001','a7000000-0000-0000-0000-000000000004','{"code":"def reverse(head):\n    prev=None\n    while head:\n        head.next,prev,head=prev,head,head.next\n    return prev"}',4,true,'Correct, minor style note','c0000000-0000-0000-0000-000000000005'),
  -- Karan (5/9)
  ('a9000000-0000-0000-0000-000000000002','a7000000-0000-0000-0000-000000000001','{"selected":[1]}',1,true,NULL,'c0000000-0000-0000-0000-000000000005'),
  ('a9000000-0000-0000-0000-000000000002','a7000000-0000-0000-0000-000000000002','{"selected":[0,1]}',1,false,'Missed B-Tree','c0000000-0000-0000-0000-000000000005'),
  ('a9000000-0000-0000-0000-000000000002','a7000000-0000-0000-0000-000000000003','{"selected":false}',1,true,NULL,'c0000000-0000-0000-0000-000000000005'),
  ('a9000000-0000-0000-0000-000000000002','a7000000-0000-0000-0000-000000000004','{"code":"def reverse(head):\n    return head"}',2,false,'Does not reverse; partial for signature','c0000000-0000-0000-0000-000000000005')
ON CONFLICT (attempt_id, assessment_question_id) DO NOTHING;

INSERT INTO grade (id, tenant_id, attempt_id, student_id, score, percentage, letter_grade, status, published_at, graded_by, breakdown) VALUES
  ('aa000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','a9000000-0000-0000-0000-000000000001','f2000000-0000-0000-0000-000000000001',8,88.89,'A','published', now() - interval '6 days','c0000000-0000-0000-0000-000000000005','{"Section A":4,"Section B":4}'),
  ('aa000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','a9000000-0000-0000-0000-000000000002','f2000000-0000-0000-0000-000000000002',5,55.56,'D','published', now() - interval '6 days','c0000000-0000-0000-0000-000000000005','{"Section A":3,"Section B":2}')
ON CONFLICT (attempt_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Portfolio + integrations (student-facing feature)
-- ---------------------------------------------------------------------------
INSERT INTO portfolio (id, tenant_id, student_id, headline, summary, visibility, sections, last_generated_at) VALUES
  ('ab000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','f2000000-0000-0000-0000-000000000001','Aspiring Software Engineer','CSE sophomore focused on backend & ML.',
   '{"github":true,"linkedin":true,"grades":false}',
   '[{"type":"education"},{"type":"projects"},{"type":"skills"}]', now() - interval '2 days')
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO integration_account (id, tenant_id, student_id, provider, status, external_username, scopes, snapshot, last_synced_at) VALUES
  ('ac000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','f2000000-0000-0000-0000-000000000001','github','connected','anita-desai','["read:user","repo"]',
   '{"repos":[{"name":"pathfinder","stars":24,"lang":"Python"},{"name":"notes-api","stars":8,"lang":"TypeScript"}],"public_repos":12}', now() - interval '1 day'),
  ('ac000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','f2000000-0000-0000-0000-000000000001','linkedin','connected','anita-desai','["r_liteprofile"]',
   '{"skills":["Python","SQL","React"],"certs":[{"name":"AWS Cloud Practitioner","year":2025}]}', now() - interval '3 days'),
  ('ac000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000001','f2000000-0000-0000-0000-000000000002','github','error','karan-mehta','["read:user"]',
   '{"error":"token_expired"}', now() - interval '10 days')
ON CONFLICT (student_id, provider) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Notifications + audit log
-- ---------------------------------------------------------------------------
INSERT INTO notification (tenant_id, recipient_id, channel, title, body, payload, read_at) VALUES
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000007','in_app','Grade published','Your DSA Midterm grade is available.','{"link":"/grades/aa000000...1"}', NULL),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000005','in_app','Assessment validated','Your DSA Midterm was approved by the exam controller.','{"assessment_id":"a6000000-0000-0000-0000-000000000001"}', now() - interval '8 days'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000004','email','Faculty load alert','Meena Iyer is at 15/16 weekly load.','{"faculty_id":"e0000000-0000-0000-0000-000000000002"}', NULL);

INSERT INTO audit_log (tenant_id, actor_id, action, entity_type, entity_id, metadata) VALUES
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000003','assessment.validated','assessment','a6000000-0000-0000-0000-000000000001','{"decision":"approved"}'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000005','grade.published','grade','aa000000-0000-0000-0000-000000000001','{"percentage":88.89}'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000002','user.invited','user_account','c0000000-0000-0000-0000-000000000009','{"role":"student"}');
