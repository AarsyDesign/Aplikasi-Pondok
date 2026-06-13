-- Required for safe user profile management.
-- Run duplicate-checks.sql first and resolve any duplicate profiles.user_id rows.
-- This migration is non-destructive when no duplicates exist.

alter table public.profiles
add constraint profiles_unique_user_id
unique (user_id);
