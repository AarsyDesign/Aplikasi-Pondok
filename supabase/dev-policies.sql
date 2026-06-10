-- Temporary MVP/development policies.
-- These policies allow the publishable anon key to read and write MVP tables
-- before authentication and admin-only policies are implemented.
--
-- Do not use these policies as-is for production.

alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.subjects enable row level security;
alter table public.academic_years enable row level security;
alter table public.semesters enable row level security;
alter table public.grades enable row level security;
alter table public.teachers enable row level security;
alter table public.teacher_attendances enable row level security;
alter table public.spp_bills enable row level security;
alter table public.spp_payments enable row level security;
alter table public.institution_profile enable row level security;

drop policy if exists "dev anon read classes" on public.classes;
create policy "dev anon read classes"
on public.classes for select
to anon
using (true);

drop policy if exists "dev anon insert classes" on public.classes;
create policy "dev anon insert classes"
on public.classes for insert
to anon
with check (true);

drop policy if exists "dev anon update classes" on public.classes;
create policy "dev anon update classes"
on public.classes for update
to anon
using (true)
with check (true);

drop policy if exists "dev anon delete classes" on public.classes;
create policy "dev anon delete classes"
on public.classes for delete
to anon
using (true);

drop policy if exists "dev anon read students" on public.students;
create policy "dev anon read students"
on public.students for select
to anon
using (true);

drop policy if exists "dev anon insert students" on public.students;
create policy "dev anon insert students"
on public.students for insert
to anon
with check (true);

drop policy if exists "dev anon update students" on public.students;
create policy "dev anon update students"
on public.students for update
to anon
using (true)
with check (true);

drop policy if exists "dev anon delete students" on public.students;
create policy "dev anon delete students"
on public.students for delete
to anon
using (true);

drop policy if exists "dev anon read subjects" on public.subjects;
create policy "dev anon read subjects"
on public.subjects for select
to anon
using (true);

drop policy if exists "dev anon insert subjects" on public.subjects;
create policy "dev anon insert subjects"
on public.subjects for insert
to anon
with check (true);

drop policy if exists "dev anon update subjects" on public.subjects;
create policy "dev anon update subjects"
on public.subjects for update
to anon
using (true)
with check (true);

drop policy if exists "dev anon delete subjects" on public.subjects;
create policy "dev anon delete subjects"
on public.subjects for delete
to anon
using (true);

drop policy if exists "dev anon read academic years" on public.academic_years;
create policy "dev anon read academic years"
on public.academic_years for select
to anon
using (true);

drop policy if exists "dev anon insert academic years" on public.academic_years;
create policy "dev anon insert academic years"
on public.academic_years for insert
to anon
with check (true);

drop policy if exists "dev anon update academic years" on public.academic_years;
create policy "dev anon update academic years"
on public.academic_years for update
to anon
using (true)
with check (true);

drop policy if exists "dev anon delete academic years" on public.academic_years;
create policy "dev anon delete academic years"
on public.academic_years for delete
to anon
using (true);

drop policy if exists "dev anon read semesters" on public.semesters;
create policy "dev anon read semesters"
on public.semesters for select
to anon
using (true);

drop policy if exists "dev anon insert semesters" on public.semesters;
create policy "dev anon insert semesters"
on public.semesters for insert
to anon
with check (true);

drop policy if exists "dev anon update semesters" on public.semesters;
create policy "dev anon update semesters"
on public.semesters for update
to anon
using (true)
with check (true);

drop policy if exists "dev anon delete semesters" on public.semesters;
create policy "dev anon delete semesters"
on public.semesters for delete
to anon
using (true);

drop policy if exists "dev anon read grades" on public.grades;
create policy "dev anon read grades"
on public.grades for select
to anon
using (true);

drop policy if exists "dev anon insert grades" on public.grades;
create policy "dev anon insert grades"
on public.grades for insert
to anon
with check (true);

drop policy if exists "dev anon update grades" on public.grades;
create policy "dev anon update grades"
on public.grades for update
to anon
using (true)
with check (true);

drop policy if exists "dev anon delete grades" on public.grades;
create policy "dev anon delete grades"
on public.grades for delete
to anon
using (true);

drop policy if exists "dev anon read teachers" on public.teachers;
create policy "dev anon read teachers"
on public.teachers for select
to anon
using (true);

drop policy if exists "dev anon insert teachers" on public.teachers;
create policy "dev anon insert teachers"
on public.teachers for insert
to anon
with check (true);

drop policy if exists "dev anon update teachers" on public.teachers;
create policy "dev anon update teachers"
on public.teachers for update
to anon
using (true)
with check (true);

drop policy if exists "dev anon delete teachers" on public.teachers;
create policy "dev anon delete teachers"
on public.teachers for delete
to anon
using (true);

drop policy if exists "dev anon read teacher attendances" on public.teacher_attendances;
create policy "dev anon read teacher attendances"
on public.teacher_attendances for select
to anon
using (true);

drop policy if exists "dev anon insert teacher attendances" on public.teacher_attendances;
create policy "dev anon insert teacher attendances"
on public.teacher_attendances for insert
to anon
with check (true);

drop policy if exists "dev anon update teacher attendances" on public.teacher_attendances;
create policy "dev anon update teacher attendances"
on public.teacher_attendances for update
to anon
using (true)
with check (true);

drop policy if exists "dev anon delete teacher attendances" on public.teacher_attendances;
create policy "dev anon delete teacher attendances"
on public.teacher_attendances for delete
to anon
using (true);

drop policy if exists "dev anon read spp bills" on public.spp_bills;
create policy "dev anon read spp bills" on public.spp_bills for select to anon using (true);
drop policy if exists "dev anon insert spp bills" on public.spp_bills;
create policy "dev anon insert spp bills" on public.spp_bills for insert to anon with check (true);
drop policy if exists "dev anon update spp bills" on public.spp_bills;
create policy "dev anon update spp bills" on public.spp_bills for update to anon using (true) with check (true);
drop policy if exists "dev anon delete spp bills" on public.spp_bills;
create policy "dev anon delete spp bills" on public.spp_bills for delete to anon using (true);

drop policy if exists "dev anon read spp payments" on public.spp_payments;
create policy "dev anon read spp payments" on public.spp_payments for select to anon using (true);
drop policy if exists "dev anon insert spp payments" on public.spp_payments;
create policy "dev anon insert spp payments" on public.spp_payments for insert to anon with check (true);
drop policy if exists "dev anon update spp payments" on public.spp_payments;
create policy "dev anon update spp payments" on public.spp_payments for update to anon using (true) with check (true);
drop policy if exists "dev anon delete spp payments" on public.spp_payments;
create policy "dev anon delete spp payments" on public.spp_payments for delete to anon using (true);

drop policy if exists "dev anon read institution profile" on public.institution_profile;
create policy "dev anon read institution profile" on public.institution_profile for select to anon using (true);
drop policy if exists "dev anon insert institution profile" on public.institution_profile;
create policy "dev anon insert institution profile" on public.institution_profile for insert to anon with check (true);
drop policy if exists "dev anon update institution profile" on public.institution_profile;
create policy "dev anon update institution profile" on public.institution_profile for update to anon using (true) with check (true);
drop policy if exists "dev anon delete institution profile" on public.institution_profile;
create policy "dev anon delete institution profile" on public.institution_profile for delete to anon using (true);
