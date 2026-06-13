-- SPP mukim/non-mukim stabilization for v1.0.
-- Safe to run on an existing database. This script does not drop tables,
-- delete data, or reset the database.

alter table public.students
add column if not exists residence_type text default 'non_mukim';

update public.students
set residence_type = 'non_mukim'
where residence_type is null or residence_type not in ('mukim', 'non_mukim');

alter table public.students
alter column residence_type set default 'non_mukim';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'students_residence_type_check'
      and conrelid = 'public.students'::regclass
  ) then
    alter table public.students
    add constraint students_residence_type_check
    check (residence_type in ('mukim', 'non_mukim'));
  end if;
end $$;

create index if not exists students_residence_type_idx
on public.students(residence_type);

create table if not exists public.spp_settings (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid references public.academic_years(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  residence_type text,
  amount numeric not null default 0,
  due_day integer not null default 10,
  is_active boolean default true,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.spp_settings
add column if not exists residence_type text;

alter table public.spp_settings
add column if not exists academic_year_id uuid references public.academic_years(id) on delete cascade;

alter table public.spp_settings
add column if not exists class_id uuid references public.classes(id) on delete cascade;

alter table public.spp_settings
add column if not exists amount numeric not null default 0;

alter table public.spp_settings
add column if not exists due_day integer not null default 10;

alter table public.spp_settings
add column if not exists is_active boolean default true;

alter table public.spp_settings
add column if not exists note text;

alter table public.spp_settings
add column if not exists created_at timestamptz default now();

alter table public.spp_settings
add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'spp_settings_residence_type_check'
      and conrelid = 'public.spp_settings'::regclass
  ) then
    alter table public.spp_settings
    add constraint spp_settings_residence_type_check
    check (residence_type in ('mukim', 'non_mukim') or residence_type is null);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'spp_settings_amount_check'
      and conrelid = 'public.spp_settings'::regclass
  ) then
    alter table public.spp_settings
    add constraint spp_settings_amount_check
    check (amount >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'spp_settings_due_day_check'
      and conrelid = 'public.spp_settings'::regclass
  ) then
    alter table public.spp_settings
    add constraint spp_settings_due_day_check
    check (due_day between 1 and 28);
  end if;
end $$;

create index if not exists spp_settings_academic_year_id_idx
on public.spp_settings(academic_year_id);

create index if not exists spp_settings_class_id_idx
on public.spp_settings(class_id);

create index if not exists spp_settings_residence_type_idx
on public.spp_settings(residence_type);

alter table public.spp_bills
add column if not exists due_date date;

alter table public.spp_bills
add column if not exists generated_by text;

alter table public.spp_bills
add column if not exists generated_at timestamptz;

drop trigger if exists set_spp_settings_updated_at on public.spp_settings;
create trigger set_spp_settings_updated_at
before update on public.spp_settings
for each row execute function public.set_updated_at();

alter table public.spp_settings enable row level security;

drop policy if exists "Authenticated users can read spp settings" on public.spp_settings;
create policy "Authenticated users can read spp settings"
on public.spp_settings for select to authenticated using (true);

drop policy if exists "Authenticated users can insert spp settings" on public.spp_settings;
create policy "Authenticated users can insert spp settings"
on public.spp_settings for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update spp settings" on public.spp_settings;
create policy "Authenticated users can update spp settings"
on public.spp_settings for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete spp settings" on public.spp_settings;
create policy "Authenticated users can delete spp settings"
on public.spp_settings for delete to authenticated using (true);
