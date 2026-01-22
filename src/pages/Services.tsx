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
import { SectionHeading } from "@/components/ui/section-heading";

const services = [
  {
    id: "tech",
    title: "Solutions Technologiques Innovantes",
    description:
      "Développement et promotion de technologies avancées pour l'assainissement et les infrastructures écologiques. Nous concevons des solutions intelligentes qui répondent aux défis environnementaux actuels.",
    icon: Cpu,
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
    description: "Nous évaluons vos besoins et développons un plan de solution sur mesure.",
  },
  {
    icon: Cog,
    title: "Mise en Œuvre",
    description: "Nos équipes d'experts exécutent le projet avec précision et soin.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description: "Un soutien continu assure le succès et la durabilité à long terme.",
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 hero-gradient">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              Ce Que Nous Offrons
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
              Services d'<span className="gradient-text">Assainissement</span> Complets
            </h1>
            <p className="text-lg text-muted-foreground">
              De la construction d'infrastructures à la formation communautaire, nous
              offrons des solutions de bout en bout qui créent un impact positif
              durable sur la santé publique et la durabilité environnementale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="section-container space-y-24">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {service.title}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild>
                  <Link to="/contact">
                    Demander un Devis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="glass-card p-8 lg:p-12 aspect-square flex items-center justify-center">
                  <service.icon className="w-32 h-32 text-primary/20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-muted/30">
        <div className="section-container">
          <SectionHeading
            badge="Notre Processus"
            title="Comment Nous Travaillons"
            description="Une méthodologie éprouvée qui garantit des résultats de qualité et la satisfaction client."
          />

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute top-8 left-1/2 w-full h-px bg-border hidden md:block" />
                <span className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Prêt à Commencer ?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Contactez-nous aujourd'hui pour discuter de votre projet et découvrir
            comment nous pouvons aider à créer un environnement plus propre et
            plus sain pour votre communauté.
          </p>
          <Button asChild size="lg" className="shadow-glow">
            <Link to="/contact">
              Nous Contacter
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer Note */}
      <section className="pb-12">
        <div className="section-container">
          <p className="text-center text-sm text-muted-foreground italic">
            * Nos services sont personnalisables selon les besoins spécifiques de votre organisation ou communauté.
          </p>
        </div>
      </section>
    </Layout>
  );
}
