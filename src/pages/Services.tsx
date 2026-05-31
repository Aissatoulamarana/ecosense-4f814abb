import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Sparkles,
  Recycle,
  ArrowRight,
  CheckCircle,
  Cog,
  ClipboardCheck,
  Wrench,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Magnetic } from "@/components/ui/magnetic-button";
import { ParallaxImage } from "@/components/ui/parallax-image";
import infrastructureImg from "@/assets/2026-services-infrastructure.jpg";
import educationImg from "@/assets/2026-education-handwashing.jpg";
import sustainabilityImg from "@/assets/2026-sustainability.jpg";
import aerialVillage from "@/assets/2026-aerial-village.jpg";
import engineerImg from "@/assets/2026-engineer-portrait.jpg";
import { dynamicSupabase } from "@/lib/supabase-dynamic";

interface PublicService {
  id: string;
  title: string;
  description: string;
  icon: typeof Cpu;
  image: string;
  features: string[];
}

interface ServiceRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  features: string[] | null;
  display_order: number;
  is_active: boolean;
}

const defaultServices: PublicService[] = [
  {
    id: "tech",
    title: "Solutions Technologiques Innovantes",
    description:
      "Développement et promotion de technologies avancées pour l'assainissement et les infrastructures écologiques. Nous concevons des solutions intelligentes qui répondent aux défis environnementaux actuels.",
    icon: Cpu,
    image: aerialVillage,
    features: [
      "Technologies d'assainissement avancées",
      "Systèmes de surveillance intelligents",
      "Solutions IoT pour la gestion des ressources",
      "Plateformes de données environnementales",
      "Innovation en infrastructures vertes",
    ],
  },
  {
    id: "construction",
    title: "Infrastructure et Rénovation",
    description:
      "Construction et rénovation de sanitaires, stations de lavage, et autres infrastructures essentielles. Nous livrons des solutions durables adaptées aux contextes locaux.",
    icon: Building2,
    image: infrastructureImg,
    features: [
      "Conception d'infrastructures sur mesure",
      "Matériaux et construction de qualité",
      "Conformité aux normes d'accessibilité",
      "Durabilité à long terme",
      "Intégration environnementale",
    ],
  },
  {
    id: "training",
    title: "Sensibilisation et Éducation Communautaire",
    description:
      "Programmes de sensibilisation pour encourager le changement de comportement et promouvoir des pratiques d'hygiène. Nous créons un changement comportemental durable.",
    icon: Users,
    image: educationImg,
    features: [
      "Ateliers communautaires",
      "Programmes scolaires",
      "Modules de formation des formateurs",
      "Matériaux éducatifs",
      "Évaluations de suivi",
    ],
  },
  {
    id: "maintenance",
    title: "Nettoyage et Entretien",
    description:
      "Services de nettoyage et maintenance pour les publics et les privés, assurant des environnements sains et durables. Nos équipes utilisent des produits écologiques.",
    icon: Sparkles,
    image: sustainabilityImg,
    features: [
      "Plannings de nettoyage réguliers",
      "Services de désinfection approfondie",
      "Produits écologiques",
      "Inspections qualité",
      "Intervention d'urgence",
    ],
  },
  {
    id: "waste",
    title: "Gestion des Déchets",
    description:
      "Solutions complètes pour la collecte, le tri, et la valorisation des déchets ménagers. Nous appliquons les principes de l'économie circulaire.",
    icon: Recycle,
    image: engineerImg,
    features: [
      "Systèmes de collecte des déchets",
      "Tri et recyclage",
      "Programmes de compostage",
      "Solutions déchets-énergie",
      "Suivi et reporting",
    ],
  },
];

const processSteps = [
  {
    icon: ClipboardCheck,
    title: "Consultation",
    description:
      "Nous évaluons vos besoins et développons un plan de solution sur mesure.",
  },
  {
    icon: Cog,
    title: "Mise en Œuvre",
    description:
      "Nos équipes d'experts exécutent le projet avec précision et soin.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description:
      "Un soutien continu assure le succès et la durabilité à long terme.",
  },
];

export default function Services() {
  const [services, setServices] = useState<PublicService[]>(defaultServices);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await dynamicSupabase
        .from<ServiceRow>("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error || !data?.length) return;

      setServices(
        data.map((service) => ({
          id: service.slug,
          title: service.title,
          description: service.description ?? "",
          icon: Cpu,
          image: service.image_url || infrastructureImg,
          features: service.features?.length ? service.features : [],
        })),
      );
    };

    fetchServices();
  }, []);

  return (
    <Layout>
      {/* Hero éditorial avec image immersive */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <ParallaxImage
          src={infrastructureImg}
          alt="Infrastructure d'assainissement moderne"
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
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              Ce que nous offrons
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground tracking-tight mb-6">
              Des services complets
              <span className="gradient-text"> et sur-mesure.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              De la construction d'infrastructures a la formation communautaire,
              nous deployons des solutions d'assainissement durables, lisibles
              et adaptees aux besoins de chaque terrain.
            </p>
            <p className="hidden">
              De la construction d'infrastructures à la formation communautaire,
              nous offrons des solutions de bout en bout qui créent un impact
              positif durable sur la santé publique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services en alternance avec vraies images */}
      <section className="py-24 lg:py-32">
        <div className="section-container space-y-28 lg:space-y-40">
          {services.map((service, index) => {
            const reversed = index % 2 === 1;
            return (
              <div
                key={service.id}
                id={service.id}
                className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              >
                <ScrollReveal
                  direction={reversed ? "right" : "left"}
                  className={`lg:col-span-6 ${reversed ? "lg:order-2" : ""}`}
                >
                  <div className="relative">
                    <ParallaxImage
                      src={service.image}
                      alt={service.title}
                      className="aspect-[4/5] rounded-3xl shadow-xl"
                      speed={0.12}
                    />
                    {/* Decorative number */}
                    <div
                      className={`absolute -top-6 ${reversed ? "-right-4" : "-left-4"} w-16 h-16 rounded-2xl bg-background border border-border/60 shadow-lg flex items-center justify-center`}
                    >
                      <span className="text-2xl font-heading font-bold gradient-text">
                        0{index + 1}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal
                  direction={reversed ? "left" : "right"}
                  delay={0.1}
                  className={`lg:col-span-6 ${reversed ? "lg:order-1" : ""}`}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 mb-6">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight mb-5 leading-[1.1]">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * i }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-3.5 h-3.5 text-accent" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <Magnetic strength={0.18}>
                    <Button asChild>
                      <Link to="/contact">
                        Demander un devis
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </Magnetic>
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process Section */}
      <section className="relative py-24 lg:py-32 bg-muted/30 overflow-hidden">
        <div className="section-container">
          <ScrollReveal>
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-4">
              — Notre Processus
            </span>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground tracking-tight max-w-3xl leading-[1.05] mb-4">
              Comment nous{" "}
              <span className="gradient-text italic font-light">
                travaillons
              </span>
              .
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Une méthodologie éprouvée qui garantit des résultats de qualité et
              la satisfaction de chaque partenaire.
            </p>
          </ScrollReveal>

          <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {processSteps.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 0.12}>
                <div className="relative text-center p-8 rounded-3xl bg-background border border-border/50 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
                    <step.icon className="w-9 h-9 text-primary" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="section-container">
          <ScrollReveal direction="scale">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-12 lg:p-16 text-center">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,white_0%,transparent_50%)]" />
              </div>
              <div className="relative max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-6 leading-tight">
                  Prêt à commencer votre projet ?
                </h2>
                <p className="text-primary-foreground/85 text-lg mb-8">
                  Discutons de votre vision et créons ensemble des solutions
                  d'assainissement adaptées à votre communauté.
                </p>
                <Magnetic strength={0.2}>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="px-8 h-12"
                  >
                    <Link to="/contact">
                      Nous contacter
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </Magnetic>
              </div>
            </div>
          </ScrollReveal>
          <p className="text-center text-sm text-muted-foreground italic mt-8">
            * Nos services sont personnalisables selon les besoins spécifiques
            de votre organisation ou communauté.
          </p>
        </div>
      </section>
    </Layout>
  );
}
