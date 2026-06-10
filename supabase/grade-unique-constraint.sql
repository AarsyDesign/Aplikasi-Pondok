-- Required for safe grade upsert behavior.
-- Run this after checking there are no duplicate grade rows for the same
-- student_id + subject_id + semester_id + academic_year_id.

alter table public.grades
add constraint grades_unique_student_subject_period
unique (
  student_id,
  subject_id,
  semester_id,
  academic_year_id
);
