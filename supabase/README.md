# Supabase Setup

This folder contains the first database foundation for the MVP.

## 1. Create a Supabase project

Create a new project from the Supabase dashboard. Keep the project URL and anon public key ready.

## 2. Copy environment variables

Copy `.env.example` to `.env.local`, then fill:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do not add a service role key to the frontend app.

## 3. Run the schema

Open Supabase SQL Editor and run `supabase/schema.sql`.

This creates:

- `profiles`
- `students`
- `classes`
- `subjects`
- `academic_years`
- `semesters`
- `grades`
- `teachers`
- `teacher_attendances`
- `spp_bills`
- `spp_payments`
- `institution_profile`

It also adds basic indexes, score checks, status/gender checks, and `updated_at` triggers.

## 4. Run seed data

After the schema succeeds, run `supabase/seed.sql` in the SQL Editor.

The seed file adds initial classes, subjects, the active academic year `2026/2027`, and two semesters.
It also adds a few sample teachers for local attendance testing.

## 5. Run temporary development policies

If the app shows a row-level security error while using the publishable key, run `supabase/dev-policies.sql` in the SQL Editor.

These policies are only for MVP/local development before authentication is implemented. Replace them with authenticated admin-only policies before production deployment.

## 6. Add grade duplicate protection

For safe grade upsert behavior, run `supabase/grade-unique-constraint.sql` after confirming there are no duplicate grade rows for the same santri, mapel, semester, and tahun ajaran.

## 7. Next development step

The recommended next step is to connect read-only Supabase data to the dashboard pages, then add authenticated admin-only create/update/delete actions after the basic login flow is ready.
