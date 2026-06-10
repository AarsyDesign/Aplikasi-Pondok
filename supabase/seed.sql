insert into public.classes (name, level, description)
select seed.name, seed.level, seed.description
from (
  values
    ('Tarbiyatul Fityan 1', '1', 'Kelas Tarbiyatul Fityan tingkat 1'),
    ('Tarbiyatul Fityan 2', '2', 'Kelas Tarbiyatul Fityan tingkat 2'),
    ('Tarbiyatul Fityan 3', '3', 'Kelas Tarbiyatul Fityan tingkat 3'),
    ('Ta''sisiyah Kelas 3', '3', 'Kelas Ta''sisiyah tingkat 3'),
    ('Ta''sisiyah Kelas 4', '4', 'Kelas Ta''sisiyah tingkat 4'),
    ('Ta''sisiyah Kelas 5', '5', 'Kelas Ta''sisiyah tingkat 5')
) as seed(name, level, description)
where not exists (
  select 1 from public.classes c where lower(c.name) = lower(seed.name)
);

insert into public.subjects (name, class_id, description)
select seed.subject_name, c.id, 'Mata pelajaran awal'
from public.classes c
join (
  values
    ('Tarbiyatul Fityan 1', 'Tsalatsatul Usul'),
    ('Tarbiyatul Fityan 1', 'Safinatun Najah'),
    ('Tarbiyatul Fityan 1', 'Adabul-Masyi Ilas-Salah'),
    ('Tarbiyatul Fityan 1', 'Bahasa Arab'),
    ('Tarbiyatul Fityan 1', 'Matematika'),
    ('Tarbiyatul Fityan 1', 'Bahasa Indonesia'),
    ('Tarbiyatul Fityan 1', 'Al Qiroah'),
    ('Tarbiyatul Fityan 1', 'Nahwu Wadhih'),
    ('Tarbiyatul Fityan 2', 'Fathul Qarib'),
    ('Tarbiyatul Fityan 2', 'Awaaqibuth-Tholab'),
    ('Tarbiyatul Fityan 2', 'Bahasa Arab'),
    ('Tarbiyatul Fityan 2', 'Matematika'),
    ('Tarbiyatul Fityan 2', 'Bahasa Indonesia'),
    ('Tarbiyatul Fityan 2', 'Qawaidul-Arba'),
    ('Tarbiyatul Fityan 3', 'Tsalatsatul Usul'),
    ('Tarbiyatul Fityan 3', 'Ad-Durusul-Muhimmah'),
    ('Tarbiyatul Fityan 3', 'Adabul-Mufrad'),
    ('Tarbiyatul Fityan 3', 'Bahasa Arab'),
    ('Tarbiyatul Fityan 3', 'Matematika'),
    ('Tarbiyatul Fityan 3', 'Bahasa Indonesia')
) as seed(class_name, subject_name) on seed.class_name = c.name
where not exists (
  select 1
  from public.subjects s
  where lower(s.name) = lower(seed.subject_name)
    and s.class_id = c.id
);

insert into public.academic_years (name, is_active)
select '2026/2027', true
where not exists (
  select 1 from public.academic_years ay where ay.name = '2026/2027'
);

insert into public.semesters (name, academic_year_id, is_active)
select seed.semester_name, ay.id, seed.is_active
from public.academic_years ay
join (
  values
    ('Semester 1', true),
    ('Semester 2', false)
) as seed(semester_name, is_active) on ay.name = '2026/2027'
where not exists (
  select 1
  from public.semesters s
  where lower(s.name) = lower(seed.semester_name)
    and s.academic_year_id = ay.id
);

insert into public.teachers (full_name, phone, address, status)
select seed.full_name, seed.phone, seed.address, seed.status
from (
  values
    ('Ust. Ahmad Fauzi', '081234567001', 'Pontianak', 'aktif'),
    ('Ust. Hasan Basri', '081234567002', 'Pontianak', 'aktif'),
    ('Ustzh. Aminah', '081234567003', 'Pontianak', 'aktif')
) as seed(full_name, phone, address, status)
where not exists (
  select 1 from public.teachers t where lower(t.full_name) = lower(seed.full_name)
);

insert into public.institution_profile (
  name,
  short_name,
  city,
  default_report_note
)
select
  'MA''HAD TAQRIIBUSSUNNAH',
  'Taqriibussunnah',
  'Pontianak',
  'Semoga ananda semakin semangat dalam menuntut ilmu, memperbaiki adab, dan menjaga keistiqamahan dalam kebaikan.'
where not exists (select 1 from public.institution_profile);
