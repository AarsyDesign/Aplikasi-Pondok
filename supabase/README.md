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

## 5. Run basic Row Level Security

After `supabase/schema.sql` and `supabase/seed.sql` succeed, run `supabase/rls.sql` in the SQL Editor.

This RLS stage only separates access into:

- not logged in: cannot access internal app data
- logged in: can read and manage internal app data

Detailed roles such as admin, guru, bendahara, and wali santri are not implemented yet. Do not use a service role key in the frontend.

If data suddenly looks empty after RLS is enabled, check whether the user is logged in. If a query returns an empty array, the user may not be authenticated yet or the RLS policy may not match the request.

In Supabase Table Editor, confirm that RLS is enabled on the important tables, policies exist for the `authenticated` role, and no policy is left for the `anon` role.

## 6. Run basic profile roles

After RLS is active, run `supabase/roles.sql` in the SQL Editor.

This adds the simple app roles:

- `admin`
- `guru`
- `bendahara`

Create app users manually in Supabase Authentication, copy each user id, then add one profile per user:

```sql
insert into profiles (user_id, full_name, role)
values ('USER_ID_DARI_SUPABASE_AUTH', 'Nama Admin', 'admin');
```

Use `guru` or `bendahara` for non-admin users.

After an admin profile exists, profiles can also be managed from `/dashboard/pengaturan/pengguna`. That dashboard page only manages `public.profiles`; it does not create or delete Supabase Authentication users.

## 7. Temporary development policies

If the app shows a row-level security error while using the publishable key, run `supabase/dev-policies.sql` in the SQL Editor.

These policies are only for MVP/local development before authentication is implemented. Do not run `supabase/dev-policies.sql` after `supabase/rls.sql` unless you intentionally want temporary public development access again.

## 8. Check duplicate data before constraints

Run `supabase/duplicate-checks.sql` before adding stabilization constraints to an existing database.

Review rows where `duplicate_count > 1` for:

- nilai santri per santri + mapel + semester + tahun ajaran
- absensi guru per guru + tanggal
- tagihan SPP per santri + bulan + tahun
- profil pengguna per `user_id`

Do not delete production data blindly. Resolve duplicates manually after backup.

## 9. Add grade duplicate protection

For safe grade upsert behavior, run `supabase/grade-unique-constraint.sql` after confirming there are no duplicate grade rows for the same santri, mapel, semester, and tahun ajaran.

## 10. Add profile duplicate protection

For safe profile management, run `supabase/profile-unique-constraint.sql` after confirming there are no duplicate `profiles.user_id` rows.

## 11. Add SPP mukim/non-mukim support

Run `supabase/spp_residence_type_v1.sql` to add santri residence type, SPP settings, due date fields, indexes, and RLS policies for `spp_settings`.

This script is non-destructive. It does not drop tables, delete data, or reset the database.

## 12. Next development step

The recommended next step is to keep the app working with authenticated RLS, then add a simple role field flow for admin, guru, and bendahara after the basic login flow is stable.
