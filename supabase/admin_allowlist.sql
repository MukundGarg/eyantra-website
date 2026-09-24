-- =========================================================
-- e-Yantra MSIT Admin Allowlist Security Migration
-- =========================================================

-- 1. Create admin allowlist table
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to check only their own admin status
GRANT SELECT ON public.admin_users TO authenticated;

DROP POLICY IF EXISTS "Users can check own admin status"
ON public.admin_users;

CREATE POLICY "Users can check own admin status"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());


-- =========================================================
-- 2. Remove old generic authenticated write policies
-- =========================================================

DROP POLICY IF EXISTS "Authenticated users can insert team_members"
ON public.team_members;

DROP POLICY IF EXISTS "Authenticated users can update team_members"
ON public.team_members;

DROP POLICY IF EXISTS "Authenticated users can delete team_members"
ON public.team_members;

DROP POLICY IF EXISTS "Authenticated users can insert projects"
ON public.projects;

DROP POLICY IF EXISTS "Authenticated users can update projects"
ON public.projects;

DROP POLICY IF EXISTS "Authenticated users can delete projects"
ON public.projects;

DROP POLICY IF EXISTS "Authenticated users can insert events"
ON public.events;

DROP POLICY IF EXISTS "Authenticated users can update events"
ON public.events;

DROP POLICY IF EXISTS "Authenticated users can delete events"
ON public.events;


-- =========================================================
-- 3. Admin-only policies: team_members
-- =========================================================

DROP POLICY IF EXISTS "Admins can insert team_members"
ON public.team_members;

DROP POLICY IF EXISTS "Admins can update team_members"
ON public.team_members;

DROP POLICY IF EXISTS "Admins can delete team_members"
ON public.team_members;


CREATE POLICY "Admins can insert team_members"
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


CREATE POLICY "Admins can update team_members"
ON public.team_members
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


CREATE POLICY "Admins can delete team_members"
ON public.team_members
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


-- =========================================================
-- 4. Admin-only policies: projects
-- =========================================================

DROP POLICY IF EXISTS "Admins can insert projects"
ON public.projects;

DROP POLICY IF EXISTS "Admins can update projects"
ON public.projects;

DROP POLICY IF EXISTS "Admins can delete projects"
ON public.projects;


CREATE POLICY "Admins can insert projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


CREATE POLICY "Admins can update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


CREATE POLICY "Admins can delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


-- =========================================================
-- 5. Admin-only policies: events
-- =========================================================

DROP POLICY IF EXISTS "Admins can insert events"
ON public.events;

DROP POLICY IF EXISTS "Admins can update events"
ON public.events;

DROP POLICY IF EXISTS "Admins can delete events"
ON public.events;


CREATE POLICY "Admins can insert events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


CREATE POLICY "Admins can update events"
ON public.events
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


CREATE POLICY "Admins can delete events"
ON public.events
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


-- =========================================================
-- 6. Remove old generic storage write policies
-- =========================================================

DROP POLICY IF EXISTS "Admin Upload Access"
ON storage.objects;

DROP POLICY IF EXISTS "Admin Update Access"
ON storage.objects;

DROP POLICY IF EXISTS "Admin Delete Access"
ON storage.objects;

DROP POLICY IF EXISTS "Admins can upload to buckets"
ON storage.objects;

DROP POLICY IF EXISTS "Admins can update buckets"
ON storage.objects;

DROP POLICY IF EXISTS "Admins can delete from buckets"
ON storage.objects;


-- =========================================================
-- 7. Admin-only Supabase Storage policies
-- =========================================================

CREATE POLICY "Admins can upload to buckets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN ('team', 'projects', 'events')
  AND EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


CREATE POLICY "Admins can update buckets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id IN ('team', 'projects', 'events')
  AND EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id IN ('team', 'projects', 'events')
  AND EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


CREATE POLICY "Admins can delete from buckets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id IN ('team', 'projects', 'events')
  AND EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


-- =========================================================
-- 8. Add an existing Supabase Auth user as admin
-- =========================================================

-- Replace USER_UUID with the user's UID from:
-- Supabase Dashboard -> Authentication -> Users

-- Example:
-- INSERT INTO public.admin_users (user_id)
-- VALUES ('USER_UUID');
-- =========================================================
-- 9. Admin SELECT policies for content tables
-- =========================================================

DROP POLICY IF EXISTS "Admins can view all team_members"
ON public.team_members;

DROP POLICY IF EXISTS "Admins can view all projects"
ON public.projects;

DROP POLICY IF EXISTS "Admins can view all events"
ON public.events;


CREATE POLICY "Admins can view all team_members"
ON public.team_members
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


CREATE POLICY "Admins can view all projects"
ON public.projects
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);


CREATE POLICY "Admins can view all events"
ON public.events
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

-- =========================================================
-- 10. Drop old insecure policies from admin_rls.sql
-- =========================================================
-- In case admin_rls.sql is ever run again, we should drop the file or clear it.
