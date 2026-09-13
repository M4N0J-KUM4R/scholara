-- CollegeCloud / Scholara — PostgreSQL schema (multi-tenant academic platform)
-- Idempotent: safe to re-run. Uses jsonb for flexible/semi-structured data.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- ---------------------------------------------------------------------------
-- Enum types
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE tenant_status       AS ENUM ('active','suspended','pending','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE user_status         AS ENUM ('invited','active','suspended','deactivated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE role_key            AS ENUM ('super_admin','college_admin','exam_controller','hod','faculty','student');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE batch_status        AS ENUM ('planned','active','completed','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE enrollment_status   AS ENUM ('enrolled','dropped','completed','withdrawn');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE question_type       AS ENUM ('mcq_single','mcq_multi','true_false','short_answer','long_answer','numeric','coding');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE difficulty_level    AS ENUM ('easy','medium','hard');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE assessment_type     AS ENUM ('quiz','assignment','midterm','final','practice');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE assessment_status   AS ENUM ('draft','submitted_for_validation','validated','rejected','scheduled','live','closed','graded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE validation_decision AS ENUM ('pending','approved','rejected','changes_requested');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE attempt_status      AS ENUM ('not_started','in_progress','submitted','auto_submitted','graded','flagged');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE grade_status        AS ENUM ('pending','provisional','published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE integration_provider AS ENUM ('github','linkedin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE integration_status  AS ENUM ('connected','disconnected','error','syncing');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE notification_channel AS ENUM ('in_app','email','sms');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- Utility: updated_at trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenant (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            citext NOT NULL UNIQUE,
  status          tenant_status NOT NULL DEFAULT 'pending',
  contact_email   citext NOT NULL,
  contact_phone   text,
  address         jsonb,
  branding        jsonb,
  onboarding_step smallint NOT NULL DEFAULT 0 CHECK (onboarding_step BETWEEN 0 AND 6),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tenant_settings (
  tenant_id           uuid PRIMARY KEY REFERENCES tenant(id) ON DELETE CASCADE,
  grading_scheme      jsonb NOT NULL DEFAULT '{"scale":"percentage","bands":[]}',
  exam_defaults       jsonb NOT NULL DEFAULT '{"duration_min":60,"shuffle":false,"neg_marking":false,"attempts":1}',
  validation_required boolean NOT NULL DEFAULT true,
  feature_flags       jsonb DEFAULT '{}',
  locale              text NOT NULL DEFAULT 'en-IN',
  timezone            text NOT NULL DEFAULT 'Asia/Kolkata',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS role (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         role_key NOT NULL UNIQUE,
  label       text NOT NULL,
  permissions jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS department (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  name         text NOT NULL,
  code         text NOT NULL,
  hod_user_id  uuid,
  description  text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_department_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS user_account (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  email         citext NOT NULL,
  full_name     text NOT NULL,
  password_hash text,
  status        user_status NOT NULL DEFAULT 'invited',
  avatar_url    text,
  last_login_at timestamptz,
  preferences   jsonb DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  CONSTRAINT uq_user_tenant_email UNIQUE (tenant_id, email)
);

-- Resolve circular reference: department HOD points at a user_account
DO $$ BEGIN
  ALTER TABLE department
    ADD CONSTRAINT fk_department_hod
    FOREIGN KEY (hod_user_id) REFERENCES user_account(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS user_role (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
  role_id    uuid NOT NULL REFERENCES role(id) ON DELETE RESTRICT,
  scope      jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_role UNIQUE (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS faculty_profile (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
  department_id   uuid NOT NULL REFERENCES department(id) ON DELETE RESTRICT,
  employee_code   text NOT NULL,
  designation     text,
  specializations jsonb DEFAULT '[]',
  max_weekly_load smallint NOT NULL DEFAULT 16,
  current_load    smallint NOT NULL DEFAULT 0,
  is_hod          boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_faculty_user     UNIQUE (user_id),
  CONSTRAINT uq_faculty_emp_code UNIQUE (tenant_id, employee_code)
);

CREATE TABLE IF NOT EXISTS batch (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  department_id  uuid NOT NULL REFERENCES department(id) ON DELETE RESTRICT,
  name           text NOT NULL,
  year           smallint NOT NULL,
  section        text,
  capacity       smallint NOT NULL DEFAULT 60,
  enrolled_count integer NOT NULL DEFAULT 0,
  status         batch_status NOT NULL DEFAULT 'planned',
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_batch_tenant_name UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS student_profile (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
  department_id   uuid NOT NULL REFERENCES department(id) ON DELETE RESTRICT,
  batch_id        uuid REFERENCES batch(id) ON DELETE SET NULL,
  roll_number     text NOT NULL,
  enrollment_year smallint NOT NULL,
  status          enrollment_status NOT NULL DEFAULT 'enrolled',
  guardian        jsonb,
  contact         jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_student_user UNIQUE (user_id),
  CONSTRAINT uq_student_roll UNIQUE (tenant_id, roll_number)
);

CREATE TABLE IF NOT EXISTS academic_term (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  name       text NOT NULL,
  starts_on  date NOT NULL,
  ends_on    date NOT NULL,
  is_current boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_term_tenant_name UNIQUE (tenant_id, name),
  CONSTRAINT chk_term_dates      CHECK (ends_on > starts_on)
);

CREATE TABLE IF NOT EXISTS course (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  department_id uuid NOT NULL REFERENCES department(id) ON DELETE RESTRICT,
  code          text NOT NULL,
  title         text NOT NULL,
  credits       numeric(3,1) NOT NULL DEFAULT 3.0 CHECK (credits > 0 AND credits <= 30),
  description   text,
  syllabus      jsonb DEFAULT '{"units":[]}',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_course_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS batch_course (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  batch_id   uuid NOT NULL REFERENCES batch(id) ON DELETE CASCADE,
  course_id  uuid NOT NULL REFERENCES course(id) ON DELETE RESTRICT,
  term_id    uuid NOT NULL REFERENCES academic_term(id) ON DELETE RESTRICT,
  faculty_id uuid REFERENCES faculty_profile(id) ON DELETE SET NULL,
  schedule   jsonb DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_batch_course UNIQUE (batch_id, course_id, term_id)
);

CREATE TABLE IF NOT EXISTS enrollment (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  student_id      uuid NOT NULL REFERENCES student_profile(id) ON DELETE CASCADE,
  batch_course_id uuid NOT NULL REFERENCES batch_course(id) ON DELETE CASCADE,
  status          enrollment_status NOT NULL DEFAULT 'enrolled',
  enrolled_at     timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_enrollment UNIQUE (student_id, batch_course_id)
);

-- ---------------------------------------------------------------------------
-- Assessment tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_bank (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  course_id   uuid NOT NULL REFERENCES course(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  tags        jsonb DEFAULT '[]',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS question (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  question_bank_id uuid NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
  author_id        uuid NOT NULL REFERENCES faculty_profile(id) ON DELETE RESTRICT,
  type             question_type NOT NULL,
  difficulty       difficulty_level NOT NULL DEFAULT 'medium',
  prompt           text NOT NULL,
  body             jsonb NOT NULL DEFAULT '{}',
  default_marks    numeric(6,2) NOT NULL DEFAULT 1,
  tags             jsonb DEFAULT '[]',
  is_active        boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessment (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  batch_course_id uuid NOT NULL REFERENCES batch_course(id) ON DELETE CASCADE,
  created_by      uuid NOT NULL REFERENCES user_account(id) ON DELETE RESTRICT,
  title           text NOT NULL,
  type            assessment_type NOT NULL,
  status          assessment_status NOT NULL DEFAULT 'draft',
  total_marks     numeric(6,2) NOT NULL,
  duration_min    smallint NOT NULL,
  opens_at        timestamptz,
  closes_at       timestamptz,
  config          jsonb NOT NULL DEFAULT '{"shuffle":false,"neg_marking":false,"attempts":1}',
  instructions    text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessment_question (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessment(id) ON DELETE CASCADE,
  question_id   uuid NOT NULL REFERENCES question(id) ON DELETE RESTRICT,
  position      smallint NOT NULL,
  marks         numeric(6,2) NOT NULL,
  section       text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_assessment_question UNIQUE (assessment_id, question_id)
);

CREATE TABLE IF NOT EXISTS validation_review (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES assessment(id) ON DELETE CASCADE,
  reviewer_id   uuid NOT NULL REFERENCES user_account(id) ON DELETE RESTRICT,
  decision      validation_decision NOT NULL DEFAULT 'pending',
  comments      text,
  checklist     jsonb DEFAULT '[]',
  reviewed_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exam_attempt (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES assessment(id) ON DELETE CASCADE,
  student_id    uuid NOT NULL REFERENCES student_profile(id) ON DELETE CASCADE,
  status        attempt_status NOT NULL DEFAULT 'not_started',
  started_at    timestamptz,
  submitted_at  timestamptz,
  time_spent_sec integer,
  proctoring    jsonb DEFAULT '{}',
  attempt_no    smallint NOT NULL DEFAULT 1,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_exam_attempt UNIQUE (assessment_id, student_id, attempt_no)
);

CREATE TABLE IF NOT EXISTS answer (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id             uuid NOT NULL REFERENCES exam_attempt(id) ON DELETE CASCADE,
  assessment_question_id uuid NOT NULL REFERENCES assessment_question(id) ON DELETE CASCADE,
  response               jsonb NOT NULL DEFAULT '{}',
  awarded_marks          numeric(6,2),
  is_correct             boolean,
  feedback               text,
  graded_by              uuid REFERENCES user_account(id) ON DELETE SET NULL,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_answer UNIQUE (attempt_id, assessment_question_id)
);

CREATE TABLE IF NOT EXISTS grade (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  attempt_id   uuid NOT NULL REFERENCES exam_attempt(id) ON DELETE CASCADE,
  student_id   uuid NOT NULL REFERENCES student_profile(id) ON DELETE CASCADE,
  score        numeric(6,2) NOT NULL,
  percentage   numeric(5,2) NOT NULL,
  letter_grade text,
  status       grade_status NOT NULL DEFAULT 'pending',
  published_at timestamptz,
  graded_by    uuid REFERENCES user_account(id) ON DELETE SET NULL,
  breakdown    jsonb DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_grade_attempt UNIQUE (attempt_id)
);

-- ---------------------------------------------------------------------------
-- Portfolio & integration tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  student_id        uuid NOT NULL REFERENCES student_profile(id) ON DELETE CASCADE,
  headline          text,
  summary           text,
  visibility        jsonb NOT NULL DEFAULT '{"github":true,"linkedin":true,"grades":false}',
  sections          jsonb DEFAULT '[]',
  last_generated_at timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_portfolio_student UNIQUE (student_id)
);

CREATE TABLE IF NOT EXISTS integration_account (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  student_id        uuid NOT NULL REFERENCES student_profile(id) ON DELETE CASCADE,
  provider          integration_provider NOT NULL,
  status            integration_status NOT NULL DEFAULT 'connected',
  external_username text,
  scopes            jsonb DEFAULT '[]',
  snapshot          jsonb DEFAULT '{}',
  access_token      text,
  refresh_token     text,
  token_expires_at  timestamptz,
  last_synced_at    timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_integration_student_provider UNIQUE (student_id, provider)
);

-- ---------------------------------------------------------------------------
-- System tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notification (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
  channel      notification_channel NOT NULL DEFAULT 'in_app',
  title        text NOT NULL,
  body         text,
  payload      jsonb DEFAULT '{}',
  read_at      timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  actor_id    uuid REFERENCES user_account(id) ON DELETE SET NULL,
  action      text NOT NULL,
  entity_type text NOT NULL,
  entity_id   uuid,
  metadata    jsonb DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_department_tenant       ON department (tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_tenant             ON user_account (tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_role_user          ON user_role (user_id);
CREATE INDEX IF NOT EXISTS idx_faculty_department      ON faculty_profile (department_id);
CREATE INDEX IF NOT EXISTS idx_student_department      ON student_profile (department_id);
CREATE INDEX IF NOT EXISTS idx_student_batch           ON student_profile (batch_id) WHERE batch_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_batch_department        ON batch (department_id);
CREATE INDEX IF NOT EXISTS idx_course_department       ON course (department_id);
CREATE INDEX IF NOT EXISTS idx_batch_course_batch      ON batch_course (batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_course_faculty    ON batch_course (faculty_id) WHERE faculty_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_enrollment_student      ON enrollment (student_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_batch_course ON enrollment (batch_course_id);
CREATE INDEX IF NOT EXISTS idx_question_bank_course    ON question_bank (course_id);
CREATE INDEX IF NOT EXISTS idx_question_bank_id        ON question (question_bank_id);
CREATE INDEX IF NOT EXISTS idx_assessment_batch_course ON assessment (batch_course_id);
CREATE INDEX IF NOT EXISTS idx_assessment_status       ON assessment (tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_aq_assessment           ON assessment_question (assessment_id);
CREATE INDEX IF NOT EXISTS idx_attempt_assessment      ON exam_attempt (assessment_id);
CREATE INDEX IF NOT EXISTS idx_attempt_student         ON exam_attempt (student_id);
CREATE INDEX IF NOT EXISTS idx_answer_attempt          ON answer (attempt_id);
CREATE INDEX IF NOT EXISTS idx_grade_student           ON grade (student_id);
CREATE INDEX IF NOT EXISTS idx_notification_recipient  ON notification (recipient_id) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_tenant            ON audit_log (tenant_id);

-- GIN indexes for jsonb querying
CREATE INDEX IF NOT EXISTS idx_question_tags        ON question USING gin (tags jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_integration_snapshot ON integration_account USING gin (snapshot jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_audit_metadata       ON audit_log USING gin (metadata jsonb_path_ops);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'tenant','tenant_settings','department','user_account','faculty_profile',
      'batch','student_profile','academic_term','course','batch_course','enrollment',
      'question_bank','question','assessment','exam_attempt','answer','grade',
      'portfolio','integration_account'
    ])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON %1$s;', t);
    EXECUTE format(
      'CREATE TRIGGER trg_%1$s_updated_at BEFORE UPDATE ON %1$s FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t);
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Enable RLS on every public table so nothing is reachable through the Data API
-- by default. Access policies are added when the application data layer is built;
-- seeding runs as the table owner (postgres) and bypasses RLS.
-- ---------------------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
  END LOOP;
END $$;
