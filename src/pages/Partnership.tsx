import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Handshake,
  CheckCircle,
  ArrowRight,
  Building,
  Globe,
  Users,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Magnetic } from "@/components/ui/magnetic-button";
import { ParallaxImage } from "@/components/ui/parallax-image";
import partnershipImg from "@/assets/2026-partnership-handshake.jpg";
import aerialVillage from "@/assets/2026-aerial-village.jpg";
import { dynamicSupabase } from "@/lib/supabase-dynamic";

interface Partner {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
}

const benefits = [
  {
    icon: Globe,
    title: "Portée étendue",
    description:
      "Profitez de notre expertise locale et de nos réseaux pour étendre votre impact.",
  },
  {
    icon: Lightbulb,
    title: "Accès à l'innovation",
    description:
      "Bénéficiez de nos approches de pointe en matière de solutions durables.",
  },
  {
    icon: Users,
    title: "Confiance communautaire",
    description:
      "Profitez de nos relations établies avec les communautés locales.",
  },
  {
    icon: Building,
    title: "Excellence opérationnelle",
    description:
      "Une équipe reconnue pour la qualité d'exécution et la fiabilité.",
  },
];

const partnerTypes = [
  {
    title: "ONG & Organisations de développement",
    description:
      "Collaborez sur des projets alignés sur les objectifs de développement durable et créant un impact communautaire durable.",
  },
  {
    title: "Organismes gouvernementaux",
    description:
      "Partenariat pour mettre en œuvre des initiatives de santé publique et des programmes d'infrastructures.",
  },
  {
    title: "Secteur privé",
    description:
      "Partenariats d'entreprise pour les initiatives RSE et les pratiques commerciales durables.",
  },
  {
    title: "Institutions académiques",
    description:
      "Collaborations de recherche et partenariats éducatifs pour faire progresser l'innovation.",
  },
];

const caseStudies = [
  {
    title: "Projet d'assainissement communautaire — Conakry",
    description:
      "Construction de 50 latrines modernes et formation de 500 membres de la communauté.",
    outcome: "Réduction de 80% des maladies hydriques",
  },
  {
    title: "Initiative d'hygiène scolaire",
    description:
      "Collaboration avec le Ministère de l'Éducation pour 20 écoles équipées.",
    outcome: "Plus de 5 000 élèves touchés",
  },
  {
    title: "Programme de gestion des déchets",
    description:
      "Coentreprise pour mettre en place une collecte des déchets communautaire.",
    outcome: "+70% de couverture de collecte",
  },
];

export default function Partnership() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await dynamicSupabase
        .from<Partner>("partners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error) {
        setPartners(data ?? []);
      }
    };

    fetchPartners();
  }, []);

  return (
    <Layout>
      {/* Hero immersif */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <ParallaxImage
          src={partnershipImg}
          alt="Poignée de main symbolisant un partenariat solide"
          className="absolute inset-0"
          speed={0.2}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        <div className="relative section-container text-center pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-medium uppercase tracking-widest rounded-full bg-background/70 backdrop-blur-md border border-border/40 text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Partenariat
            </span>
            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-heading font-bold text-foreground tracking-[-0.03em] leading-[0.95] mb-8">
              Des partenariats
              <br />
              {/* <span className="gradient-text italic font-light">utiles</span> */}
              <span className="gradient-text">utiles et durables.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
              ONG, institutions publiques, entreprises ou acteurs academiques :
              construisons des collaborations claires, mesurables et alignees
              sur les besoins des communautes.
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Rejoignez-nous pour créer un impact durable. Nous avons des
              opportunités de partenariat alignées sur votre mission.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 lg:py-32">
        <div className="section-container">
          <ScrollReveal>
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-4">
              — Pourquoi devenir partenaire
            </span>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground tracking-tight max-w-3xl leading-[1.05] mb-12">
              Débloquer de nouvelles{" "}
              <span className="gradient-text italic font-light">
                possibilités
              </span>
              .
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={benefit.title} delay={index * 0.08}>
                <div className="group relative h-full p-7 rounded-3xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 mb-5 group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partner types */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="section-container">
          <ScrollReveal>
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-4">
              — Avec qui nous travaillons
            </span>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground tracking-tight max-w-3xl leading-[1.05] mb-12">
              Des collaborations{" "}
              <span className="gradient-text italic font-light">diverses</span>.
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-5">
            {partnerTypes.map((type, index) => (
              <ScrollReveal
                key={type.title}
                delay={index * 0.08}
                direction={index % 2 === 0 ? "left" : "right"}
              >
                <div className="group flex items-start gap-5 p-7 rounded-3xl bg-background border border-border/50 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Handshake className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                      {type.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <ParallaxImage
          src={aerialVillage}
          alt="Vue aérienne"
          className="absolute inset-0"
          speed={0.15}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />

        <div className="relative section-container">
          <ScrollReveal>
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-4">
              — Histoires de succès
            </span>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground tracking-tight max-w-3xl leading-[1.05] mb-12">
              Des partenariats qui{" "}
              <span className="gradient-text italic font-light">
                transforment
              </span>
              .
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5">
            {caseStudies.map((study, index) => (
              <ScrollReveal
                key={study.title}
                delay={index * 0.1}
                direction="up"
              >
                <div className="glass-card p-8 h-full hover:shadow-glow transition-shadow duration-500">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
                    {study.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {study.description}
                  </p>
                  <div className="flex items-center gap-2 text-accent font-medium text-sm pt-4 border-t border-border/40">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    {study.outcome}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {partners.length > 0 && (
        <section className="py-20">
          <div className="section-container">
            <ScrollReveal>
              <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-4">
                — Nos partenaires
              </span>
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground tracking-tight max-w-3xl leading-[1.05] mb-12">
                Ils avancent{" "}
                <span className="gradient-text italic font-light">
                  avec nous
                </span>
                .
              </h2>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {partners.map((partner, index) => {
                const content = (
                  <div className="h-full p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                    <div className="h-24 rounded-2xl bg-background border border-border/40 flex items-center justify-center p-4 mb-5">
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <Building className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">
                      {partner.name}
                    </h3>
                    {partner.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {partner.description}
                      </p>
                    )}
                  </div>
                );

                return (
                  <ScrollReveal key={partner.id} delay={index * 0.08}>
                    {partner.website_url ? (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="section-container">
          <ScrollReveal direction="scale">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-12 lg:p-16 text-center">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/30 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-accent/40 blur-3xl" />
              </div>
              <div className="relative max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-6 leading-tight">
                  Prêt à devenir partenaire ?
                </h2>
                <p className="text-primary-foreground/85 text-lg mb-8">
                  Discutons de la façon dont nous pouvons travailler ensemble
                  pour créer un impact durable.
                </p>
                <Magnetic strength={0.2}>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="px-8 h-12"
                  >
                    <Link to="/contact">
                      Démarrer une conversation
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </Magnetic>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
