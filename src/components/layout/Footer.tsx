import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Mail } from "lucide-react";

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

const contactInfo = [
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+224 625 71 84 67",
    href: "https://wa.me/224625718467",
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "Lambanyi, Conakry, Guinée",
    href: "#",
  },
  {
    icon: Clock,
    label: "Heures",
    value: "09:00 – 17:00",
    href: "#",
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground/[0.02] border-t border-border">
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">E</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-lg leading-tight">
                  Ecosense
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Solutions
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Innover pour un avenir plus propre et plus sain grâce à des 
              solutions d'assainissement et d'hygiène durables pour les 
              communautés à travers la Guinée.
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
              <li>
                <a
                  href="mailto:contact@ecosense.gn"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  contact@ecosense.gn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ecosense Solutions. Tous droits réservés.
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
