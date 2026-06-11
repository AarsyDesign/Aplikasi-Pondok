-- Basic authenticated-only Row Level Security for the MVP.
--
-- Run this after schema.sql and seed.sql.
-- This script does not drop tables or delete data. It can be run again safely.
-- It intentionally does not create any policy for the anon role.

do $$
declare
  secured_table record;
  policy_action record;
begin
  for secured_table in
    select *
    from (
      values
        ('profiles', 'profiles'),
        ('students', 'students'),
        ('classes', 'classes'),
        ('subjects', 'subjects'),
        ('academic_years', 'academic years'),
        ('semesters', 'semesters'),
        ('grades', 'grades'),
        ('teachers', 'teachers'),
        ('teacher_attendances', 'teacher attendances'),
        ('spp_bills', 'spp bills'),
        ('spp_payments', 'spp payments'),
        ('institution_profile', 'institution profile')
    ) as tables(table_name, policy_label)
  loop
    if to_regclass(format('public.%I', secured_table.table_name)) is null then
      raise notice 'Skipping public.% because the table does not exist.', secured_table.table_name;
      continue;
    end if;

    -- RLS blocks access unless a matching policy allows it.
    execute format('alter table public.%I enable row level security', secured_table.table_name);

    -- Remove temporary anon development policies when this production-safe MVP RLS is applied.
    execute format('drop policy if exists %I on public.%I', 'dev anon read ' || secured_table.policy_label, secured_table.table_name);
    execute format('drop policy if exists %I on public.%I', 'dev anon insert ' || secured_table.policy_label, secured_table.table_name);
    execute format('drop policy if exists %I on public.%I', 'dev anon update ' || secured_table.policy_label, secured_table.table_name);
    execute format('drop policy if exists %I on public.%I', 'dev anon delete ' || secured_table.policy_label, secured_table.table_name);

    for policy_action in
      select *
      from (
        values
          ('read', 'select'),
          ('insert', 'insert'),
          ('update', 'update'),
          ('delete', 'delete')
      ) as actions(action_label, sql_command)
    loop
      execute format(
        'drop policy if exists %I on public.%I',
        'Authenticated users can ' || policy_action.action_label || ' ' || secured_table.policy_label,
        secured_table.table_name
      );

      if policy_action.sql_command = 'insert' then
        execute format(
          'create policy %I on public.%I for insert to authenticated with check (true)',
          'Authenticated users can insert ' || secured_table.policy_label,
          secured_table.table_name
        );
      elsif policy_action.sql_command = 'update' then
        execute format(
          'create policy %I on public.%I for update to authenticated using (true) with check (true)',
          'Authenticated users can update ' || secured_table.policy_label,
          secured_table.table_name
        );
      else
        execute format(
          'create policy %I on public.%I for %s to authenticated using (true)',
          'Authenticated users can ' || policy_action.action_label || ' ' || secured_table.policy_label,
          secured_table.table_name,
          policy_action.sql_command
        );
      end if;
    end loop;
  end loop;
end $$;
