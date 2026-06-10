-- Non-destructive duplicate checks for stabilization.
-- Run this in Supabase SQL Editor and review rows where duplicate_count > 1.

select 'classes.name' as check_name, lower(name) as duplicate_key, count(*) as duplicate_count
from public.classes
group by lower(name)
having count(*) > 1;

select 'subjects.class_id+name' as check_name, class_id::text || '|' || lower(name) as duplicate_key, count(*) as duplicate_count
from public.subjects
group by class_id, lower(name)
having count(*) > 1;

select 'students.nis' as check_name, nis as duplicate_key, count(*) as duplicate_count
from public.students
where nis is not null and nis <> ''
group by nis
having count(*) > 1;

select 'teachers.full_name' as check_name, lower(full_name) as duplicate_key, count(*) as duplicate_count
from public.teachers
group by lower(full_name)
having count(*) > 1;

select 'academic_years.name' as check_name, lower(name) as duplicate_key, count(*) as duplicate_count
from public.academic_years
group by lower(name)
having count(*) > 1;

select 'semesters.academic_year_id+name' as check_name, academic_year_id::text || '|' || lower(name) as duplicate_key, count(*) as duplicate_count
from public.semesters
group by academic_year_id, lower(name)
having count(*) > 1;

select 'spp_bills.student_id+month+year' as check_name, student_id::text || '|' || bill_month || '|' || bill_year as duplicate_key, count(*) as duplicate_count
from public.spp_bills
group by student_id, bill_month, bill_year
having count(*) > 1;

select 'academic_years.active' as check_name, 'active_rows' as duplicate_key, count(*) as duplicate_count
from public.academic_years
where is_active = true
having count(*) > 1;

select 'semesters.active_per_year' as check_name, academic_year_id::text as duplicate_key, count(*) as duplicate_count
from public.semesters
where is_active = true
group by academic_year_id
having count(*) > 1;

select 'institution_profile.rows' as check_name, 'profile_rows' as duplicate_key, count(*) as duplicate_count
from public.institution_profile
having count(*) > 1;
