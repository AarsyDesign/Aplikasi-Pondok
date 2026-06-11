-- Basic profile roles for the MVP.
--
-- Run this after supabase/schema.sql and supabase/rls.sql.
-- This script does not drop tables or delete existing profile data.

do $$
begin
  if to_regclass('public.profiles') is null then
    raise notice 'Skipping roles setup because public.profiles does not exist.';
    return;
  end if;

  -- Make sure existing data is clean before adding the role check.
  if exists (
    select 1
    from public.profiles
    where role is null
      or role not in ('admin', 'guru', 'bendahara')
  ) then
    raise exception 'profiles.role contains values outside admin, guru, bendahara. Fix those rows before running roles.sql.';
  end if;

  if exists (
    select user_id
    from public.profiles
    where user_id is not null
    group by user_id
    having count(*) > 1
  ) then
    raise exception 'profiles.user_id contains duplicate values. Keep one profile per auth user before running roles.sql.';
  end if;

  alter table public.profiles
    alter column role set default 'admin',
    alter column role set not null;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('admin', 'guru', 'bendahara'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_user_id_fkey'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_user_id_unique'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_user_id_unique unique (user_id);
  end if;
end $$;

create index if not exists profiles_user_id_idx
on public.profiles(user_id);
