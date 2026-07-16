
-- 1. Move SECURITY DEFINER helpers out of the public (API) schema
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

ALTER FUNCTION public.is_admin() SET SCHEMA private;
ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;

-- Lock down execute: only roles that evaluate RLS policies need it
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

-- 2. Stop public listing of the blog-covers bucket (direct object URLs still work
--    because the bucket itself is public; only the storage.objects listing policy
--    is removed).
DROP POLICY IF EXISTS "Public can view blog covers" ON storage.objects;

CREATE POLICY "Admin can list blog covers"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'blog-covers' AND private.is_admin());

-- 3. Replace the always-true INSERT policy on contact_messages with basic validation
DROP POLICY IF EXISTS "Anyone can submit messages" ON public.contact_messages;

CREATE POLICY "Anyone can submit valid messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 200
  AND char_length(email) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(message) BETWEEN 1 AND 5000
  AND (subject IS NULL OR char_length(subject) <= 300)
);
