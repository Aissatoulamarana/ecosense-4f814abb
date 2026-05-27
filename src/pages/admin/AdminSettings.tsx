import { useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Type,
  Building2,
  Phone,
  Save,
  Upload,
  RefreshCw,
  Globe,
  Mail,
  MapPin,
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  CheckCircle2,
  Eye,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = "brand" | "colors" | "typography";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "brand", label: "Identité & Contact", icon: Building2 },
  { id: "colors", label: "Couleurs", icon: Palette },
  { id: "typography", label: "Typographie", icon: Type },
];

const GOOGLE_FONTS = [
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Cormorant Garamond",
  "DM Serif Display",
  "Libre Baskerville",
  "Inter",
  "Plus Jakarta Sans",
  "DM Sans",
  "Outfit",
  "Sora",
  "Nunito",
  "Raleway",
  "Poppins",
  "Josefin Sans",
];

const COLOR_FIELDS: { key: string; label: string; description: string }[] = [
  {
    key: "primary",
    label: "Couleur principale",
    description: "Boutons, liens, accents",
  },
  {
    key: "primary_foreground",
    label: "Texte sur principal",
    description: "Lisibilité sur fond coloré",
  },
  {
    key: "accent",
    label: "Couleur d'accent",
    description: "Survol, badges, highlights",
  },
  {
    key: "background",
    label: "Fond de page",
    description: "Couleur de fond générale",
  },
  {
    key: "foreground",
    label: "Texte principal",
    description: "Corps de texte",
  },
  {
    key: "muted",
    label: "Fond neutre",
    description: "Cards, sections secondaires",
  },
  {
    key: "muted_foreground",
    label: "Texte secondaire",
    description: "Sous-titres, labels",
  },
  { key: "border", label: "Bordures", description: "Séparateurs, contours" },
  {
    key: "destructive",
    label: "Danger/Erreur",
    description: "Messages d'erreur, suppressions",
  },
];

// ─── Preset color palettes ────────────────────────────────────────────────────
const PRESETS = [
  {
    name: "Éco Vert",
    colors: {
      primary: "#16a34a",
      accent: "#4ade80",
      background: "#ffffff",
      foreground: "#0a0a0a",
      muted: "#f0fdf4",
      muted_foreground: "#6b7280",
      border: "#d1fae5",
      primary_foreground: "#ffffff",
      destructive: "#dc2626",
    },
  },
  {
    name: "Océan",
    colors: {
      primary: "#0369a1",
      accent: "#38bdf8",
      background: "#f0f9ff",
      foreground: "#0c1a2e",
      muted: "#e0f2fe",
      muted_foreground: "#475569",
      border: "#bae6fd",
      primary_foreground: "#ffffff",
      destructive: "#dc2626",
    },
  },
  {
    name: "Terre",
    colors: {
      primary: "#92400e",
      accent: "#f59e0b",
      background: "#fffbeb",
      foreground: "#1c1917",
      muted: "#fef3c7",
      muted_foreground: "#78716c",
      border: "#fde68a",
      primary_foreground: "#ffffff",
      destructive: "#dc2626",
    },
  },
  {
    name: "Nuit",
    colors: {
      primary: "#7c3aed",
      accent: "#a78bfa",
      background: "#0f0f13",
      foreground: "#fafafa",
      muted: "#1e1e2e",
      muted_foreground: "#94a3b8",
      border: "#2e2e3e",
      primary_foreground: "#ffffff",
      destructive: "#f87171",
    },
  },
];

// ─── Reusable field components ────────────────────────────────────────────────
function FieldRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div>
        <Label className="text-sm font-semibold text-foreground">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function ColorPicker({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="w-10 h-10 rounded-lg border-2 border-border shadow-sm cursor-pointer transition-transform group-hover:scale-110"
            style={{ backgroundColor: value }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
          {value}
        </code>
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-8 h-8"
          />
          <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <Palette className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminSettings() {
  const { settings, updateSettings } = useSiteSettings();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>("brand");
  const [saving, setSaving] = useState<string | null>(null);
  const [savedGroup, setSavedGroup] = useState<string | null>(null);

  // Local state mirrors for each group
  const [brand, setBrand] = useState(settings.brand);
  const [colors, setColors] = useState(settings.colors);
  const [typography, setTypography] = useState(settings.typography);

  // Sync local state when settings load
  useState(() => {
    setBrand(settings.brand);
    setColors(settings.colors);
    setTypography(settings.typography);
  });

  const handleSave = async (group: Tab) => {
    setSaving(group);
    try {
      const value =
        group === "brand" ? brand : group === "colors" ? colors : typography;
      await updateSettings(group, value as unknown);
      setSavedGroup(group);
      setTimeout(() => setSavedGroup(null), 3000);
      toast({
        title: "✓ Sauvegardé",
        description: "Les modifications sont appliquées en direct.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder.",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  // ─── Tab: Brand ─────────────────────────────────────────────────────────────
  const BrandTab = () => (
    <div className="space-y-8">
      {/* Identity */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" /> Identité visuelle
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow
            label="Nom du site"
            description="Affiché dans le header et le titre"
          >
            <Input
              value={brand.site_name}
              onChange={(e) =>
                setBrand((p) => ({ ...p, site_name: e.target.value }))
              }
              placeholder="Ecosense Solutions"
            />
          </FieldRow>
          <FieldRow label="Slogan" description="Tagline sous le nom">
            <Input
              value={brand.tagline}
              onChange={(e) =>
                setBrand((p) => ({ ...p, tagline: e.target.value }))
              }
              placeholder="Solutions durables..."
            />
          </FieldRow>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow
            label="URL du logo"
            description="Lien direct vers l'image (.png, .svg, .jpg)"
          >
            <div className="flex gap-2">
              <Input
                value={brand.logo_url}
                onChange={(e) =>
                  setBrand((p) => ({ ...p, logo_url: e.target.value }))
                }
                placeholder="https://..."
              />
              {brand.logo_url && (
                <img
                  src={brand.logo_url}
                  alt="logo preview"
                  className="w-10 h-10 rounded-lg object-contain border border-border"
                />
              )}
            </div>
          </FieldRow>
          <FieldRow
            label="URL du favicon"
            description="Icône de l'onglet navigateur"
          >
            <div className="flex gap-2">
              <Input
                value={brand.favicon_url}
                onChange={(e) =>
                  setBrand((p) => ({ ...p, favicon_url: e.target.value }))
                }
                placeholder="https://..."
              />
              {brand.favicon_url && (
                <img
                  src={brand.favicon_url}
                  alt="favicon preview"
                  className="w-10 h-10 rounded-lg object-contain border border-border"
                />
              )}
            </div>
          </FieldRow>
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* Contact */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" /> Coordonnées
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Téléphone">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                value={brand.phone}
                onChange={(e) => setBrand((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+224 xxx xxx xxx"
              />
            </div>
          </FieldRow>
          <FieldRow label="WhatsApp" description="Lien complet (https://wa.me/...)">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                value={brand.whatsapp}
                onChange={(e) => setBrand((p) => ({ ...p, whatsapp: e.target.value }))}
                placeholder="https://wa.me/224625718467"
              />
            </div>
          </FieldRow>
          <FieldRow label="Email">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                value={brand.email}
                onChange={(e) => setBrand((p) => ({ ...p, email: e.target.value }))}
                placeholder="contact@..."
              />
            </div>
          </FieldRow>
          <FieldRow label="Site web" description="URL publique du site">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                value={brand.website}
                onChange={(e) => setBrand((p) => ({ ...p, website: e.target.value }))}
                placeholder="https://www.ecosensesolutions.co"
              />
            </div>
          </FieldRow>
          <FieldRow label="Adresse" description="Affichée dans le footer / contact">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                value={brand.address}
                onChange={(e) => setBrand((p) => ({ ...p, address: e.target.value }))}
                placeholder="Lambanyi, Conakry, Guinée"
              />
            </div>
          </FieldRow>
          <FieldRow label="Horaires" description="Jours et heures d'ouverture">
            <Input
              value={brand.hours}
              onChange={(e) => setBrand((p) => ({ ...p, hours: e.target.value }))}
              placeholder="Lundi – Vendredi : 09:00 – 17:00"
            />
          </FieldRow>
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* Social */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" /> Réseaux sociaux
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              key: "facebook_url",
              label: "Facebook",
              icon: Facebook,
              placeholder: "https://facebook.com/...",
            },
            {
              key: "linkedin_url",
              label: "LinkedIn",
              icon: Linkedin,
              placeholder: "https://linkedin.com/company/...",
            },
            {
              key: "instagram_url",
              label: "Instagram",
              icon: Instagram,
              placeholder: "https://instagram.com/...",
            },
            {
              key: "twitter_url",
              label: "Twitter / X",
              icon: Twitter,
              placeholder: "https://twitter.com/...",
            },
          ].map(({ key, label, icon: Icon, placeholder }) => (
            <FieldRow key={key} label={label}>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  value={(brand as unknown)[key]}
                  onChange={(e) =>
                    setBrand((p) => ({ ...p, [key]: e.target.value }))
                  }
                  placeholder={placeholder}
                />
              </div>
            </FieldRow>
          ))}
        </div>
      </section>
    </div>
  );

  // ─── Tab: Colors ─────────────────────────────────────────────────────────────
  const ColorsTab = () => (
    <div className="space-y-8">
      {/* Presets */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" /> Palettes prédéfinies
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setColors((c) => ({ ...c, ...preset.colors }))}
              className="group p-3 rounded-xl border border-border hover:border-primary transition-all hover:shadow-md"
            >
              <div className="flex gap-1 mb-2 justify-center">
                {[
                  preset.colors.primary,
                  preset.colors.accent,
                  preset.colors.background,
                  preset.colors.muted,
                ].map((c, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border border-border/50"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="text-xs font-medium text-center text-foreground group-hover:text-primary transition-colors">
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* Custom colors */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-4">
          Couleurs personnalisées
        </h3>
        <div className="space-y-2">
          {COLOR_FIELDS.map(({ key, label, description }) => (
            <ColorPicker
              key={key}
              label={label}
              description={description}
              value={(colors as unknown)[key] || "#000000"}
              onChange={(v) => setColors((c) => ({ ...c, [key]: v }))}
            />
          ))}
        </div>
      </section>

      {/* Live preview */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" /> Aperçu en direct
        </h3>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="p-4" style={{ backgroundColor: colors.background }}>
            <div className="flex gap-2 mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: colors.primary }}
              >
                Bouton principal
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: colors.muted,
                  color: colors.muted_foreground,
                }}
              >
                Badge neutre
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: colors.destructive }}
              >
                Erreur
              </span>
            </div>
            <p
              className="text-sm font-bold mb-1"
              style={{ color: colors.foreground }}
            >
              Titre de section
            </p>
            <p className="text-xs" style={{ color: colors.muted_foreground }}>
              Texte secondaire et description de la page.
            </p>
            <div
              className="mt-2 h-px"
              style={{ backgroundColor: colors.border }}
            />
            <p className="text-xs mt-2" style={{ color: colors.accent }}>
              Lien / Accent →
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  // ─── Tab: Typography ──────────────────────────────────────────────────────────
  const TypographyTab = () => (
    <div className="space-y-8">
      <section>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Type className="w-4 h-4 text-primary" /> Polices Google Fonts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldRow
            label="Police des titres"
            description="Headings, H1-H6, titres de sections"
          >
            <select
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={typography.font_heading}
              onChange={(e) =>
                setTypography((p) => ({ ...p, font_heading: e.target.value }))
              }
            >
              {GOOGLE_FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <div
              className="mt-2 p-3 rounded-lg border border-border bg-muted/30 text-2xl"
              style={{ fontFamily: `'${typography.font_heading}', serif` }}
            >
              Ecosense Solutions
            </div>
          </FieldRow>

          <FieldRow
            label="Police du corps"
            description="Paragraphes, listes, descriptions"
          >
            <select
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={typography.font_body}
              onChange={(e) =>
                setTypography((p) => ({ ...p, font_body: e.target.value }))
              }
            >
              {GOOGLE_FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <div
              className="mt-2 p-3 rounded-lg border border-border bg-muted/30 text-sm leading-relaxed"
              style={{ fontFamily: `'${typography.font_body}', sans-serif` }}
            >
              Nous offrons des solutions durables et innovantes pour les
              entreprises souhaitant réduire leur empreinte carbone.
            </div>
          </FieldRow>
        </div>
      </section>

      <div className="h-px bg-border" />

      <section>
        <h3 className="text-base font-semibold text-foreground mb-4">
          Taille & Espacement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FieldRow
            label="Taille de base (px)"
            description="Corps de texte standard"
          >
            <Input
              type="number"
              min={12}
              max={24}
              value={typography.font_size_base}
              onChange={(e) =>
                setTypography((p) => ({ ...p, font_size_base: e.target.value }))
              }
            />
          </FieldRow>
          <FieldRow
            label="Graisse des titres"
            description="400 = normal, 700 = bold, 800 = extra-bold"
          >
            <select
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={typography.heading_weight}
              onChange={(e) =>
                setTypography((p) => ({ ...p, heading_weight: e.target.value }))
              }
            >
              {["400", "500", "600", "700", "800", "900"].map((w) => (
                <option key={w} value={w} style={{ fontWeight: w }}>
                  {w} —{" "}
                  {w === "400"
                    ? "Normal"
                    : w === "700"
                      ? "Bold"
                      : w === "800"
                        ? "Extra Bold"
                        : w === "900"
                          ? "Black"
                          : ""}
                </option>
              ))}
            </select>
          </FieldRow>
          <FieldRow
            label="Letter-spacing titres"
            description="Espacement entre lettres"
          >
            <select
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={typography.letter_spacing_heading}
              onChange={(e) =>
                setTypography((p) => ({
                  ...p,
                  letter_spacing_heading: e.target.value,
                }))
              }
            >
              <option value="-0.04em">Très serré (-0.04em)</option>
              <option value="-0.02em">Serré (-0.02em)</option>
              <option value="0em">Normal (0)</option>
              <option value="0.02em">Élargi (+0.02em)</option>
              <option value="0.05em">Très élargi (+0.05em)</option>
              <option value="0.1em">Espacé (+0.1em)</option>
            </select>
          </FieldRow>
        </div>
      </section>

      {/* Typography preview */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" /> Aperçu
        </h3>
        <div className="rounded-xl border border-border p-6 bg-muted/20 space-y-3">
          <h1
            className="text-4xl"
            style={{
              fontFamily: `'${typography.font_heading}', serif`,
              fontWeight: typography.heading_weight,
              letterSpacing: typography.letter_spacing_heading,
            }}
          >
            Titre principal H1
          </h1>
          <h2
            className="text-2xl"
            style={{
              fontFamily: `'${typography.font_heading}', serif`,
              fontWeight: typography.heading_weight,
            }}
          >
            Sous-titre H2
          </h2>
          <p
            className="text-base leading-relaxed text-muted-foreground"
            style={{
              fontFamily: `'${typography.font_body}', sans-serif`,
              fontSize: `${typography.font_size_base}px`,
            }}
          >
            Corps de texte standard — Nous accompagnons les entreprises dans
            leur transition écologique avec des solutions innovantes et adaptées
            à leur contexte.
          </p>
        </div>
      </section>
    </div>
  );

  const tabContent: Record<Tab, React.ReactNode> = {
    brand: <BrandTab />,
    colors: <ColorsTab />,
    typography: <TypographyTab />,
  };

  return (
    <AdminLayout>
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            Configuration
          </span>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Paramètres du <span className="gradient-text">site</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Personnalisez l'apparence et les informations affichées sur le site public.
          </p>
        </div>
        <Button
          onClick={() => handleSave(activeTab)}
          disabled={saving === activeTab}
          className="gap-2 shadow-sm"
        >
          {saving === activeTab ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Sauvegarde...</>
          ) : savedGroup === activeTab ? (
            <><CheckCircle2 className="w-4 h-4" /> Sauvegardé !</>
          ) : (
            <><Save className="w-4 h-4" /> Sauvegarder</>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="premium-card p-2 mb-6 inline-flex flex-wrap gap-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="premium-card p-6 md:p-8"
        >
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex justify-end">
        <Button
          size="lg"
          onClick={() => handleSave(activeTab)}
          disabled={saving === activeTab}
          className="gap-2 px-8 shadow-md"
        >
          {saving === activeTab ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Sauvegarde en cours...</>
          ) : (
            <><Save className="w-4 h-4" /> Sauvegarder les modifications</>
          )}
        </Button>
      </div>
    </AdminLayout>
  );
}
