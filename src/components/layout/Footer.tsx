import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Mail, Globe, Facebook, Linkedin, Instagram, Twitter } from "lucide-react";
import logoEcosense from "@/assets/logo-ecosense.jpg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const footerLinks = {
  company: [
    { name: "À Propos", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Partenariat", href: "/partnership" },
    { name: "Blog", href: "/blog" },
  ],
  services: [
    { name: "Solutions Technologiques", href: "/services#tech" },
    { name: "Infrastructure & Rénovation", href: "/services#construction" },
    { name: "Sensibilisation & Éducation", href: "/services#training" },
    { name: "Gestion des Déchets", href: "/services#waste" },
  ],
  legal: [
    { name: "Politique de Confidentialité", href: "/privacy" },
    { name: "Conditions d'Utilisation", href: "/terms" },
  ],
};

export function Footer() {
  const { settings } = useSiteSettings();
  const b = settings.brand;

  const contactInfo = [
    { icon: Phone, label: "WhatsApp", value: b.phone, href: b.whatsapp || `tel:${b.phone}` },
    { icon: MapPin, label: "Adresse", value: b.address, href: "#" },
    { icon: Clock, label: "Heures", value: b.hours, href: "#" },
  ];

  const socials = [
    { icon: Facebook, href: b.facebook_url },
    { icon: Linkedin, href: b.linkedin_url },
    { icon: Instagram, href: b.instagram_url },
    { icon: Twitter, href: b.twitter_url },
  ].filter((s) => s.href);

  const websiteDisplay = (b.website || "").replace(/^https?:\/\//, "");

  return (
    <footer className="bg-foreground/[0.02] border-t border-border">
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <img
                src={b.logo_url || logoEcosense}
                alt={b.site_name}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              {b.tagline}
            </p>
            <div className="space-y-3">
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <item.icon className="w-4 h-4 text-primary" />
                  <span>{item.value}</span>
                </a>
              ))}
            </div>
            {socials.length > 0 && (
              <div className="flex items-center gap-3 mt-6">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Nous Contacter
                </Link>
              </li>
              {b.email && (
                <li>
                  <a
                    href={`mailto:${b.email}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    {b.email}
                  </a>
                </li>
              )}
              {b.website && (
                <li>
                  <a
                    href={b.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    {websiteDisplay}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {b.site_name}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
