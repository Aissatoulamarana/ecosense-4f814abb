import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Sparkles,
  Recycle,
  ArrowRight,
  CheckCircle,
  Leaf,
  Heart,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/ui/service-card";
import heroBg from "@/assets/hero-bg.jpg";

const services = [
  {
    title: "Solutions Technologiques",
    description:
      "Développement et promotion de technologies avancées pour l'assainissement et les infrastructures écologiques.",
    icon: Cpu,
    href: "/services#tech",
  },
  {
    title: "Infrastructure & Rénovation",
    description:
      "Construction et rénovation de sanitaires, stations de lavage, et autres infrastructures essentielles.",
    icon: Building2,
    href: "/services#construction",
  },
  {
    title: "Sensibilisation & Éducation",
    description:
      "Programmes de sensibilisation pour encourager le changement de comportement et promouvoir des pratiques d'hygiène.",
    icon: Users,
    href: "/services#training",
  },
  {
    title: "Nettoyage & Entretien",
    description:
      "Services de nettoyage et maintenance pour les publics et les privés, assurant des environnements sains.",
    icon: Sparkles,
    href: "/services#maintenance",
  },
];

const stats = [
  { value: "+44", label: "Villages" },
  { value: "+50", label: "Partenaires" },
  { value: "65%", label: "La Guinée" },
];

const values = [
  {
    icon: Leaf,
    title: "Durabilité",
    description: "Responsabilité environnementale dans chaque solution que nous proposons.",
  },
  {
    icon: Heart,
    title: "Communauté d'Abord",
    description: "Placer les besoins des communautés au cœur de notre travail.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "Développer de nouvelles approches face aux défis sanitaires.",
  },
];

const blogPosts = [
  {
    title: "L'Avenir de l'Assainissement Durable en Afrique de l'Ouest",
    excerpt: "Explorer des approches innovantes pour l'hygiène communautaire et les infrastructures.",
    date: "15 Jan 2026",
    slug: "future-sustainable-sanitation",
  },
  {
    title: "Engagement Communautaire : Clé du Changement Durable",
    excerpt: "Comment l'implication locale transforme les résultats en matière d'assainissement.",
    date: "10 Jan 2026",
    slug: "community-engagement",
  },
  {
    title: "Déchets en Valeur : Transformer les Défis en Opportunités",
    excerpt: "Pratiques innovantes de gestion des déchets créant de la valeur économique.",
    date: "5 Jan 2026",
    slug: "waste-to-value",
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Communauté durable"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Animated floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full bg-primary/5 blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 section-container text-center pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              Solutions d'Assainissement Durables
            </motion.span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground tracking-tight mb-6">
              Innover pour un Avenir{" "}
              <span className="gradient-text">Plus Propre et Plus Sain</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Construire des infrastructures d'assainissement durables et autonomiser
              les communautés à travers la Guinée avec des solutions d'hygiène innovantes.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="px-8 h-12 text-base shadow-glow"
              >
                <Link to="/services">
                  Découvrir Nos Solutions
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 h-12 text-base"
              >
                <Link to="/contact">Demander un Devis</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-24 lg:py-32">
        <div className="section-container">
          <SectionHeading
            badge="Nos Services"
            title="Des Solutions Complètes pour Chaque Besoin"
            description="De la construction d'infrastructures à la formation communautaire, nous offrons des services d'assainissement de bout en bout qui créent un impact durable."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={service.title} {...service} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Button asChild variant="outline" size="lg">
              <Link to="/services">
                Voir Tous les Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeading
                badge="Pourquoi Nous Choisir"
                title="Fondés sur des Valeurs Qui Comptent"
                description="Notre engagement envers la durabilité, l'innovation et le bien-être communautaire guide tout ce que nous faisons."
                align="left"
              />

              <div className="mt-8 space-y-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <value.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card p-8 lg:p-10">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Notre Mission
                </h3>
                <p className="text-muted-foreground mb-6">
                  Chez Ecosense Solutions, nous nous consacrons à fournir des solutions
                  innovantes et durables pour l'assainissement et l'hygiène. Nous
                  construisons et rénovons des infrastructures essentielles adaptées
                  aux besoins des communautés, garantissant qualité, sécurité et
                  impact positif dans chaque intervention.
                </p>
                <ul className="space-y-3">
                  {[
                    "Construction axée sur la qualité",
                    "Approche centrée sur la communauté",
                    "Pratiques durables",
                    "Impact durable",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="py-24 lg:py-32">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-12 lg:p-16 text-center"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_50%)]" />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Devenez Partenaire
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Rejoignez-nous pour créer un impact durable. Que vous soyez une ONG,
                un organisme gouvernemental ou une organisation privée, construisons
                ensemble un avenir plus propre.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="px-8 h-12 text-base"
              >
                <Link to="/partnership">
                  Explorer le Partenariat
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="section-container">
          <SectionHeading
            badge="Dernières Actualités"
            title="Notre Blog"
            description="Restez informé des dernières nouvelles en matière d'assainissement durable et de développement communautaire."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="block p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <time className="text-xs text-muted-foreground">
                    {post.date}
                  </time>
                  <h3 className="text-lg font-semibold text-foreground mt-2 mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <span className="text-sm text-primary font-medium flex items-center">
                    Lire la suite
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link to="/blog">Voir Tous les Articles</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
