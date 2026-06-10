create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'admin',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  nis text unique,
  full_name text not null,
  gender text,
  birth_place text,
  birth_date date,
  guardian_name text,
  guardian_phone text,
  address text,
  class_id uuid references public.classes(id) on delete set null,
  status text not null default 'aktif',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint students_status_check check (status in ('aktif', 'nonaktif', 'lulus', 'pindah')),
  constraint students_gender_check check (gender in ('laki-laki', 'perempuan') or gender is null)
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class_id uuid references public.classes(id) on delete cascade,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.semesters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  academic_year_id uuid references public.academic_years(id) on delete cascade,
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  semester_id uuid references public.semesters(id) on delete cascade,
  academic_year_id uuid references public.academic_years(id) on delete cascade,
  daily_score numeric,
  task_score numeric,
  exam_score numeric,
  final_score numeric,
  teacher_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint grades_daily_score_check check (daily_score between 0 and 100 or daily_score is null),
  constraint grades_task_score_check check (task_score between 0 and 100 or task_score is null),
  constraint grades_exam_score_check check (exam_score between 0 and 100 or exam_score is null),
  constraint grades_final_score_check check (final_score between 0 and 100 or final_score is null),
  constraint grades_unique_student_subject_period unique (
    student_id,
    subject_id,
    semester_id,
    academic_year_id
  )
);

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  address text,
  status text not null default 'aktif',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint teachers_status_check check (status in ('aktif', 'nonaktif'))
);

create table if not exists public.teacher_attendances (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references public.teachers(id) on delete cascade,
  attendance_date date not null,
  status text not null,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint teacher_attendances_status_check check (status in ('hadir', 'izin', 'sakit', 'alfa')),
  constraint teacher_attendances_unique_teacher_date unique (teacher_id, attendance_date)
);

create table if not exists public.spp_bills (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  class_id uuid references public.classes(id) on delete set null,
  bill_month integer not null,
  bill_year integer not null,
  amount numeric not null default 0,
  status text not null default 'belum_bayar',
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint spp_bills_month_check check (bill_month between 1 and 12),
  constraint spp_bills_amount_check check (amount >= 0),
  constraint spp_bills_status_check check (status in ('belum_bayar', 'sebagian', 'lunas')),
  constraint spp_bills_unique_student_month_year unique (student_id, bill_month, bill_year)
);

create table if not exists public.spp_payments (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid references public.spp_bills(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  payment_date date not null,
  amount_paid numeric not null default 0,
  payment_method text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint spp_payments_amount_check check (amount_paid >= 0)
);

create table if not exists public.institution_profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text,
  address text,
  city text,
  phone text,
  email text,
  headmaster_name text,
  default_homeroom_teacher_name text,
  default_report_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists institution_profile_singleton_idx
on public.institution_profile ((true));

create index if not exists students_class_id_idx on public.students(class_id);
create index if not exists subjects_class_id_idx on public.subjects(class_id);
create index if not exists grades_student_id_idx on public.grades(student_id);
create index if not exists grades_class_id_idx on public.grades(class_id);
create index if not exists grades_subject_id_idx on public.grades(subject_id);
create index if not exists grades_semester_id_idx on public.grades(semester_id);
create index if not exists grades_academic_year_id_idx on public.grades(academic_year_id);
create index if not exists teacher_attendances_teacher_id_idx on public.teacher_attendances(teacher_id);
create index if not exists teacher_attendances_attendance_date_idx on public.teacher_attendances(attendance_date);
create index if not exists spp_bills_student_id_idx on public.spp_bills(student_id);
create index if not exists spp_bills_class_id_idx on public.spp_bills(class_id);
create index if not exists spp_payments_bill_id_idx on public.spp_payments(bill_id);
create index if not exists spp_payments_student_id_idx on public.spp_payments(student_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_classes_updated_at on public.classes;
create trigger set_classes_updated_at
before update on public.classes
for each row execute function public.set_updated_at();

drop trigger if exists set_students_updated_at on public.students;
create trigger set_students_updated_at
before update on public.students
for each row execute function public.set_updated_at();

drop trigger if exists set_subjects_updated_at on public.subjects;
create trigger set_subjects_updated_at
before update on public.subjects
for each row execute function public.set_updated_at();

drop trigger if exists set_academic_years_updated_at on public.academic_years;
create trigger set_academic_years_updated_at
before update on public.academic_years
for each row execute function public.set_updated_at();

drop trigger if exists set_semesters_updated_at on public.semesters;
create trigger set_semesters_updated_at
before update on public.semesters
for each row execute function public.set_updated_at();

drop trigger if exists set_grades_updated_at on public.grades;
create trigger set_grades_updated_at
before update on public.grades
for each row execute function public.set_updated_at();

drop trigger if exists set_teachers_updated_at on public.teachers;
create trigger set_teachers_updated_at
before update on public.teachers
for each row execute function public.set_updated_at();

drop trigger if exists set_teacher_attendances_updated_at on public.teacher_attendances;
create trigger set_teacher_attendances_updated_at
before update on public.teacher_attendances
for each row execute function public.set_updated_at();

drop trigger if exists set_spp_bills_updated_at on public.spp_bills;
create trigger set_spp_bills_updated_at
before update on public.spp_bills
for each row execute function public.set_updated_at();

drop trigger if exists set_spp_payments_updated_at on public.spp_payments;
create trigger set_spp_payments_updated_at
before update on public.spp_payments
for each row execute function public.set_updated_at();

drop trigger if exists set_institution_profile_updated_at on public.institution_profile;
create trigger set_institution_profile_updated_at
before update on public.institution_profile
for each row execute function public.set_updated_at();
