-- KAVACH host-owner setup
-- 1) Supabase Dashboard -> Authentication -> Users.
-- 2) Copy the UUID of YOUR host/admin account.
-- 3) Replace YOUR_AUTH_USER_UUID below and run this once in SQL Editor.
-- 4) Do not add customer accounts to this table.
INSERT INTO public.admin_owners (user_id)
VALUES ('fbbd2fa8-3743-4e3d-9cce-004effd39b19'::uuid)
ON CONFLICT (user_id) DO NOTHING;
