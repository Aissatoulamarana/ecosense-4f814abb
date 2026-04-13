import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BrandSettings {
  site_name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  phone: string;
  email: string;
  address: string;
  facebook_url: string;
  linkedin_url: string;
  instagram_url: string;
  twitter_url: string;
}

export interface ColorSettings {
  primary: string;
  primary_foreground: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  muted_foreground: string;
  border: string;
  destructive: string;
}

export interface TypographySettings {
  font_heading: string;
  font_body: string;
  font_size_base: string;
  heading_weight: string;
  letter_spacing_heading: string;
}

export interface SiteSettings {
  brand: BrandSettings;
  colors: ColorSettings;
  typography: TypographySettings;
}

const defaultSettings: SiteSettings = {
  brand: {
    site_name: "Ecosense Solutions",
    tagline: "Solutions durables pour un avenir meilleur",
    logo_url: "",
    favicon_url: "",
    phone: "+224 000 000 000",
    email: "contact@ecosensesolutions.co",
    address: "Conakry, Guinée",
    facebook_url: "",
    linkedin_url: "",
    instagram_url: "",
    twitter_url: "",
  },
  colors: {
    primary: "#16a34a",
    primary_foreground: "#ffffff",
    secondary: "#f0fdf4",
    accent: "#4ade80",
    background: "#ffffff",
    foreground: "#0a0a0a",
    muted: "#f4f4f5",
    muted_foreground: "#71717a",
    border: "#e4e4e7",
    destructive: "#dc2626",
  },
  typography: {
    font_heading: "Playfair Display",
    font_body: "Inter",
    font_size_base: "16",
    heading_weight: "700",
    letter_spacing_heading: "-0.02em",
  },
};

// Convert hex to HSL for Tailwind CSS variables
function hexToHSL(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function applySettingsToDOM(settings: SiteSettings) {
  const root = document.documentElement;
  const { colors, typography } = settings;

  // Apply color CSS variables (HSL format for Tailwind)
  if (colors.primary)
    root.style.setProperty("--primary", hexToHSL(colors.primary));
  if (colors.primary_foreground)
    root.style.setProperty(
      "--primary-foreground",
      hexToHSL(colors.primary_foreground),
    );
  if (colors.secondary)
    root.style.setProperty("--secondary", hexToHSL(colors.secondary));
  if (colors.accent)
    root.style.setProperty("--accent", hexToHSL(colors.accent));
  if (colors.background)
    root.style.setProperty("--background", hexToHSL(colors.background));
  if (colors.foreground)
    root.style.setProperty("--foreground", hexToHSL(colors.foreground));
  if (colors.muted) root.style.setProperty("--muted", hexToHSL(colors.muted));
  if (colors.muted_foreground)
    root.style.setProperty(
      "--muted-foreground",
      hexToHSL(colors.muted_foreground),
    );
  if (colors.border)
    root.style.setProperty("--border", hexToHSL(colors.border));
  if (colors.destructive)
    root.style.setProperty("--destructive", hexToHSL(colors.destructive));

  // Apply typography
  if (typography.font_size_base) {
    root.style.setProperty(
      "--font-size-base",
      `${typography.font_size_base}px`,
    );
    (document.body as HTMLElement).style.fontSize =
      `${typography.font_size_base}px`;
  }

  // Load Google Fonts dynamically
  const fontsToLoad = [typography.font_heading, typography.font_body].filter(
    Boolean,
  );
  if (fontsToLoad.length > 0) {
    const existingLink = document.getElementById("dynamic-google-fonts");
    if (existingLink) existingLink.remove();
    const link = document.createElement("link");
    link.id = "dynamic-google-fonts";
    link.rel = "stylesheet";
    const query = fontsToLoad
      .map((f) => `family=${encodeURIComponent(f)}:wght@400;600;700;800`)
      .join("&");
    link.href = `https://fonts.googleapis.com/css2?${query}&display=swap`;
    document.head.appendChild(link);
  }

  if (typography.font_heading) {
    root.style.setProperty(
      "--font-heading",
      `'${typography.font_heading}', serif`,
    );
  }
  if (typography.font_body) {
    root.style.setProperty(
      "--font-body",
      `'${typography.font_body}', sans-serif`,
    );
    (document.body as HTMLElement).style.fontFamily =
      `'${typography.font_body}', sans-serif`;
  }
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSettings: (
    group: keyof SiteSettings,
    values: Partial<SiteSettings[keyof SiteSettings]>,
  ) => Promise<void>;
  refetch: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  loading: true,
  updateSettings: async () => {},
  refetch: async () => {},
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    // Try to load settings from page_content table
    const { data, error } = await supabase
      .from("page_content")
      .select("slug, content")
      .in("slug", ["settings_brand", "settings_colors", "settings_typography"]);

    if (error || !data || data.length === 0) {
      applySettingsToDOM(defaultSettings);
      setLoading(false);
      return;
    }

    const parsed: Partial<SiteSettings> = {};
    for (const row of data) {
      if (row.slug === "settings_brand") parsed.brand = row.content as unknown as BrandSettings;
      if (row.slug === "settings_colors") parsed.colors = row.content as unknown as ColorSettings;
      if (row.slug === "settings_typography") parsed.typography = row.content as unknown as TypographySettings;
    }

    const merged: SiteSettings = {
      brand: { ...defaultSettings.brand, ...parsed.brand },
      colors: { ...defaultSettings.colors, ...parsed.colors },
      typography: { ...defaultSettings.typography, ...parsed.typography },
    };

    setSettings(merged);
    applySettingsToDOM(merged);
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (
    group: keyof SiteSettings,
    values: Partial<SiteSettings[keyof SiteSettings]>,
  ) => {
    const updated = {
      ...settings[group],
      ...values,
    } as SiteSettings[typeof group];
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: group, value: updated }, { onConflict: "key" });
    if (error) throw error;

    const newSettings = { ...settings, [group]: updated };
    setSettings(newSettings);
    applySettingsToDOM(newSettings);
  };

  return (
    <SiteSettingsContext.Provider
      value={{ settings, loading, updateSettings, refetch: fetchSettings }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
