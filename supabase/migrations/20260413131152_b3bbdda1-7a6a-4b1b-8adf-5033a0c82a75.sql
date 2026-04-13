
-- Create storage bucket for blog cover images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-covers', 'blog-covers', true);

-- Anyone can view blog cover images
CREATE POLICY "Public can view blog covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-covers');

-- Admin can upload blog covers
CREATE POLICY "Admin can upload blog covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-covers' AND public.is_admin());

-- Admin can update blog covers
CREATE POLICY "Admin can update blog covers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-covers' AND public.is_admin());

-- Admin can delete blog covers
CREATE POLICY "Admin can delete blog covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-covers' AND public.is_admin());
