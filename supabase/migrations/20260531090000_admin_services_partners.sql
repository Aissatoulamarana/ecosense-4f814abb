-- Services managed from the admin area
CREATE TABLE IF NOT EXISTS public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin can insert services"
  ON public.services FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update services"
  ON public.services FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin can delete services"
  ON public.services FOR DELETE
  USING (public.is_admin());

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Partners displayed on the partnership page
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active partners"
  ON public.partners FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin can insert partners"
  ON public.partners FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update partners"
  ON public.partners FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin can delete partners"
  ON public.partners FOR DELETE
  USING (public.is_admin());

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public buckets for service photos and partner logos
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('service-images', 'service-images', true),
  ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view service images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-images');

CREATE POLICY "Admin can upload service images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'service-images' AND public.is_admin());

CREATE POLICY "Admin can update service images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'service-images' AND public.is_admin());

CREATE POLICY "Admin can delete service images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'service-images' AND public.is_admin());

CREATE POLICY "Public can view partner logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'partner-logos');

CREATE POLICY "Admin can upload partner logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'partner-logos' AND public.is_admin());

CREATE POLICY "Admin can update partner logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'partner-logos' AND public.is_admin());

CREATE POLICY "Admin can delete partner logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'partner-logos' AND public.is_admin());
