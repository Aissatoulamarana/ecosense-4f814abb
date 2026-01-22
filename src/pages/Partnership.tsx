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
import { SectionHeading } from "@/components/ui/section-heading";

const benefits = [
  {
    icon: Globe,
    title: "Portée Étendue",
    description:
      "Profitez de notre expertise locale et de nos réseaux pour étendre votre impact à travers la Guinée.",
  },
  {
    icon: Lightbulb,
    title: "Accès à l'Innovation",
    description:
      "Bénéficiez de nos approches de pointe en matière de solutions d'assainissement durables.",
  },
  {
    icon: Users,
    title: "Confiance Communautaire",
    description:
      "Profitez de nos relations établies avec les communautés et les leaders locaux.",
  },
  {
    icon: Building,
    title: "Excellence Opérationnelle",
    description:
      "Partenariat avec une équipe reconnue pour la qualité d'exécution et la fiabilité.",
  },
];

const partnerTypes = [
  {
    title: "ONG & Organisations de Développement",
    description:
      "Collaborez sur des projets alignés sur les objectifs de développement durable et créant un impact communautaire durable.",
  },
  {
    title: "Organismes Gouvernementaux",
    description:
      "Partenariat pour mettre en œuvre des initiatives de santé publique et des programmes de développement d'infrastructures.",
  },
  {
    title: "Secteur Privé",
    description:
      "Partenariats d'entreprise pour les initiatives RSE, la gestion des installations et les pratiques commerciales durables.",
  },
  {
    title: "Institutions Académiques",
    description:
      "Collaborations de recherche et partenariats éducatifs pour faire progresser les connaissances et l'innovation en assainissement.",
  },
];

const caseStudies = [
  {
    title: "Projet d'Assainissement Communautaire - Conakry",
    description:
      "Partenariat avec une ONG internationale pour construire 50 latrines modernes et former 500 membres de la communauté.",
    outcome: "Réduction de 80% des maladies hydriques",
  },
  {
    title: "Initiative d'Hygiène Scolaire",
    description:
      "Collaboration avec le Ministère de l'Éducation pour améliorer les installations sanitaires dans 20 écoles.",
    outcome: "Plus de 5 000 élèves touchés",
  },
  {
    title: "Programme de Gestion des Déchets",
    description:
      "Coentreprise avec le gouvernement local pour mettre en place une collecte des déchets communautaire.",
    outcome: "Augmentation de 70% de la couverture de collecte",
  },
];

export default function Partnership() {
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
              Partenariat
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
              Ensemble pour un <span className="gradient-text">Avenir Meilleur</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Rejoignez-nous pour créer un impact durable. Que vous soyez une ONG,
              un organisme gouvernemental ou une organisation privée, nous avons
              des opportunités de partenariat alignées sur votre mission.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="section-container">
          <SectionHeading
            badge="Pourquoi Devenir Partenaire"
            title="Débloquer de Nouvelles Possibilités"
            description="Découvrez les avantages d'un partenariat avec Ecosense Solutions."
          />

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-5">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-24 bg-muted/30">
        <div className="section-container">
          <SectionHeading
            badge="Avec Qui Nous Travaillons"
            title="Opportunités de Collaboration Diverses"
            description="Nous travaillons avec des organisations de tous secteurs pour maximiser l'impact."
          />

          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {partnerTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border/50"
              >
                <div className="shrink-0">
                  <Handshake className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {type.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24">
        <div className="section-container">
          <SectionHeading
            badge="Histoires de Succès"
            title="Des Partenariats Qui Ont Fait la Différence"
            description="Des exemples concrets de ce que nous avons accompli avec nos partenaires."
          />

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {study.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {study.description}
                </p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                  <CheckCircle className="w-4 h-4" />
                  {study.outcome}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Prêt à Devenir Partenaire ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Discutons de la façon dont nous pouvons travailler ensemble pour
              créer un impact durable. Contactez-nous pour démarrer la conversation.
            </p>
            <Button asChild size="lg" className="shadow-glow">
              <Link to="/contact">
                Démarrer une Conversation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
