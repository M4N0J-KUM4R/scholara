# CollegeCloud Neo-Brutalist Redesign — Design Spec

Date: 2026-09-14
Repo: `/Users/manojkumar/mv/scholara` (Next.js 16, React 19, Tailwind v4 CSS-first, shadcn tokens)

## Goal

Convert the 25-screen grayscale wireframe kit into a real, usable production UI in
**neo-brutalist style** — bright colors, boxy (zero-radius) edges, thick black borders,
hard offset shadows — referencing the Beastwork Video Editor App (dribbble.com/shots/21155583).
Additionally scaffold a **Python FastAPI microservices** backend with **Supabase** as the database.

User pre-approved the direction in the kickoff brief (style, colors, stack), so this spec
records the decisions rather than re-asking.

## Design tokens

| Token | Value | Use |
|---|---|---|
| ink | `#0A0A0A` | borders (2–3px solid), text, shadows |
| paper | `#FFFBEF` | app background (warm cream) |
| yellow | `#FFDC58` | primary accent, logo, CTA highlights, active nav |
| pink | `#FF90E8` | secondary accent, badges, marketing panels |
| blue | `#90A8ED` | info panels, links, data tables |
| green | `#B1F3A8` | success / approved states |
| orange | `#FF9B6A` | warnings, pending states |
| red | `#FF5C5C` | destructive, errors, rejected |
| purple | `#C4A1FF` | charts, tertiary |

- **Radius: 0 everywhere.** Boxy edges, no rounded corners (except the toggle pill).
- **Shadows: hard offsets only** — `3px 3px 0` (buttons), `4px 4px 0` (cards), `6px 6px 0` (hero panels). No blur, ever.
- **Borders: `2px solid #0A0A0A`** standard, `3px` for emphasis panels.
- **Hover:** element translates `-2px,-2px` and shadow grows one step; **active/press:** translates `2px,2px`, shadow `0`.
- **Type:** Archivo Black (display/headings, via next/font), Space Grotesk (body). Eyebrows 10–11px uppercase bold. Body 13–14px medium.
- **Shadcn token mapping** (so existing token consumers keep working): background→paper, foreground→ink, primary→yellow, secondary→pink, accent→blue, muted→#F1EBDD, destructive→red, border→ink, radius→0rem.

## Transformation strategy (frontend)

The wireframe kit is primitive-driven: every screen renders through `components/wireframe/kit.tsx`
primitives + `shell.tsx` chrome. So the cascade is:

1. `app/globals.css` — replace achromatic oklch tokens with the palette above, radius 0, add `nb-*` utilities (borders, hard shadows, press-hover, bright hatch stripes).
2. `app/layout.tsx` — load Archivo Black + Space Grotesk via next/font.
3. `components/wireframe/kit.tsx` — restyle every primitive to its production brutal equivalent while keeping component APIs identical (`Btn`, `Field`, `Badge`, `Panel`, `Stat`, `Table`, `BarChart`, `LineChart`, `Donut`, `Avatar`, `Icon`, `Note`, …). Placeholder squiggles become colorful content bars; hatch fills become color-coded stripes.
4. `components/wireframe/shell.tsx` — brutal chrome: black top bar with yellow "CC" logo block, boxy tenant switcher, colored sidebar with yellow active state, thick-bordered breadcrumbs.
5. `app/page.tsx` — gallery chrome: black hero header with yellow headline, index chips as brutal badges, colored section cards.
6. `components/live-data-panel.tsx` — restyle to match; keep SWR/Supabase logic untouched.
7. Sweep screens-part1–4 for hardcoded `neutral-*` classes and squiggle-only content, converting to palette classes. Screens keep their structure and interactivity.

## Backend (scaffold)

`services/` directory — Python FastAPI microservices, one bounded context each:

- `services/auth_service` — `/health`, `/me` (verifies Supabase JWT)
- `services/academics_service` — tenants, departments, courses, batches (CRUD via Supabase REST)
- `services/exams_service` — assessments, questions, submissions, grading
- `services/common` — shared pydantic-settings + supabase client factory (pip-installed as path dep)
- Each service: `main.py`, `requirements.txt`, `Dockerfile`; root `docker-compose.yml` wires them with `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` env.
- `supabase/schema.sql` — tables the frontend already expects (`tenant`, `user_account`, `department`, `course`, `assessment`, `announcement`, `notification`) + RLS policies.

Frontend does not call the microservices yet (screens are self-contained); wiring routes to
the gateway is the documented next step.

## Validation

- `pnpm install && pnpm build` passes.
- `pnpm dev` boots; browser-test the page: screenshots of top gallery, several screens
  (login, super-admin, exam-taking, reports), check no console errors, verify brutal styling renders.
- FastAPI services: `python -c import` smoke check or uvicorn boot without Supabase creds (health endpoint only).

## Out of scope

- Real auth flows, route-per-screen navigation, responsive overhaul beyond existing behaviors,
  CI/CD, deployments.
