# scholara — CollegeCloud

A multi-tenant LMS and online examination platform. Each **institute (tenant)** gets an isolated workspace for departments, batches, courses, faculty, students, question banks, proctored assessments (MCQ / coding / lab), a submission → HOD → exam-cell validation workflow, grading & moderation, analytics, and student portfolios.

This repository currently contains a low-fidelity, grayscale **wireframe UI kit** (25 desktop screens in `components/wireframe/`) plus the data model that the production app is designed around. This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Roles

| Role | Scope | Summary |
| --- | --- | --- |
| Super Admin | Platform | Manages tenants, subscription plans, feature flags, user provisioning, identity routing. |
| College Admin / Exam Controller | Tenant | Departments, users, courses, exam pipeline, reports, tenant settings. |
| HOD | Department | Reviews/validates assessments, monitors faculty load and department readiness. |
| Faculty / Moderator | Course | Authors questions, builds assessments, grades and moderates. |
| Student | Self | Takes exams, views results, manages portfolio and external profile links. |
| Auditor | Tenant (read) | Views outcome-attainment and NAAC/NBA export reports. |

## Documentation

- **[docs/DATABASE.md](docs/DATABASE.md)** — Entity Relationship Diagram (ERD), data dictionary of every table, datatypes, and required fields.

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_PAnB5kujpcuoNWxaRFIKiUrjvos9)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the wireframe gallery.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
