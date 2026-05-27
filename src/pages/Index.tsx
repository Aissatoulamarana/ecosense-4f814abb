import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Leaf,
  Heart,
  TrendingUp,
  Cpu,
  Recycle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { Magnetic } from "@/components/ui/magnetic-button";
import { ParallaxImage } from "@/components/ui/parallax-image";
import heroCommunity from "@/assets/2026-hero-community.jpg";
import sustainabilityImg from "@/assets/2026-sustainability.jpg";
import aerialVillage from "@/assets/2026-aerial-village.jpg";
import educationImg from "@/assets/2026-education-handwashing.jpg";
import infrastructureImg from "@/assets/2026-services-infrastructure.jpg";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

interface HomeSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  secondary_button_text: string | null;
  secondary_button_link: string | null;
  image_url: string | null;
  is_active: boolean;
}

const services = [
  {
    title: "Solutions Technologiques",
    description: "Technologies avancées pour l'assainissement intelligent.",
    icon: Cpu,
    href: "/services#tech",
    image: infrastructureImg,
    accent: "from-primary/20 to-accent/10",
  },
  {
    title: "Infrastructure & Rénovation",
    description: "Construction durable de sanitaires et stations de lavage.",
    icon: Building2,
    href: "/services#construction",
    image: aerialVillage,
    accent: "from-accent/20 to-primary/10",
  },
  {
    title: "Sensibilisation & Éducation",
    description: "Programmes communautaires pour un changement durable.",
    icon: Users,
    href: "/services#training",
    image: educationImg,
    accent: "from-primary/15 to-accent/15",
  },
  {
    title: "Nettoyage & Entretien",
    description: "Maintenance professionnelle et écoresponsable.",
    icon: Sparkles,
    href: "/services#maintenance",
    accent: "from-accent/10 to-primary/20",
  },
  {
    title: "Gestion des Déchets",
    description: "Collecte, tri et valorisation circulaire.",
    icon: Recycle,
    href: "/services#waste",
    accent: "from-primary/10 to-accent/20",
  },
];

const values = [
  {
    icon: Leaf,
    title: "Durabilité",
    description: "Responsabilité environnementale dans chaque solution proposée.",
  },
  {
    icon: Heart,
    title: "Communauté d'abord",
    description: "Les besoins des communautés au cœur de notre travail quotidien.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "Développer de nouvelles approches face aux défis sanitaires.",
  },
];

const Index = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<HomeSection | null>(null);
  const [stats, setStats] = useState([]);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  const fetchHero = async () => {
    const { data, error } = await supabase
      .from("homepage_sections" as any)
      .select("*")
      .eq("section_key", "hero")
      .single<HomeSection>();

    if (!error && data) {
      setHero(data);
    }
  };

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from("homepage_stats")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    setStats(data || []);
  };

  useEffect(() => {
    fetchPosts();
    fetchHero();
    fetchStats();
  }, []);

  return (
    <Layout>
      {/* ─── Hero — Editorial scroll-driven ─────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Parallax background */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <img
            src={hero?.image_url || heroBg}
            alt={hero?.title || "Communauté durable"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/30" />
        </motion.div>

        {/* Animated soft orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[28rem] h-[28rem] rounded-full blur-3xl"
              style={{
                background: i % 2 ? "hsl(var(--accent) / 0.08)" : "hsl(var(--primary) / 0.08)",
                left: `${10 + i * 22}%`,
                top: `${15 + (i % 2) * 30}%`,
              }}
              animate={{
                x: [0, 60, 0],
                y: [0, -40, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 section-container pt-32 pb-20 grid lg:grid-cols-12 gap-8 items-end"
        >
          <div className="lg:col-span-8">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-medium tracking-wider uppercase rounded-full bg-background/60 backdrop-blur-md border border-border/40 text-foreground"
            >

             
           

           

           

              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
         {hero?.subtitle}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-[clamp(2.5rem,7vw,5.5rem)] font-heading font-bold text-foreground tracking-[-0.03em] leading-[0.95] mb-8"
            >
                  {hero?.title}
              <br />
              <span className="gradient-text italic font-light">plus propre</span>
              <span className="text-foreground">, plus </span>
              <span className="gradient-text italic font-light">sain</span>
              <span className="text-foreground">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
            >
                  {hero?.description}
            </motion.p>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >

              <Magnetic strength={0.2}>
                <Button asChild size="lg" className="px-8 h-12 text-base shadow-glow group">
                  <Link to={hero?.button_link}>
                  {hero?.button_text}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Button asChild variant="outline" size="lg" className="px-8 h-12 text-base backdrop-blur-md bg-background/40">
                  <Link to={hero?.secondary_button_link}>
                  {hero?.secondary_button_text}
                </Button>
              </Magnetic>

            </motion.div>
          </div>

          {/* Stats card glassy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-4"
          >
            <div className="glass-card p-6 lg:p-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
                Impact 2026
              </p>
              <div className="space-y-5">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-baseline justify-between border-b border-border/40 last:border-0 pb-4 last:pb-0"
                  >
                    <span className="text-3xl lg:text-4xl font-heading font-bold gradient-text">
                      {s.value}
                      {s.suffix}
                    </span>
                    <span className="text-xs text-muted-foreground text-right max-w-[8rem]">
                      {s.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-muted-foreground tracking-widest uppercase"
        >
          <span>Défiler</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-muted-foreground/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* ─── Bento Grid Services ────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="section-container">
          <div className="grid lg:grid-cols-12 gap-6 mb-12 items-end">
            <ScrollReveal className="lg:col-span-7">
              <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-4">
                — Nos Services
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground tracking-tight leading-[1.05]">
                Des solutions complètes
                <br />
                pour <span className="gradient-text italic font-light">chaque défi</span>.
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.15} className="lg:col-span-5">
              <p className="text-muted-foreground text-lg leading-relaxed">
                De la conception d'infrastructures à la formation communautaire,
                nous offrons un accompagnement de bout en bout qui crée un
                impact mesurable et durable.
              </p>
            </ScrollReveal>
          </div>

          {/* Bento layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-6">
            {/* Large featured card */}
            <ScrollReveal delay={0.05} className="md:col-span-4 md:row-span-2">
              <Link
                to={services[0].href}
                className="group relative block h-full min-h-[420px] rounded-3xl overflow-hidden border border-border/50"
              >
                <img
                  src={services[0].image}
                  alt={services[0].title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-background/80 backdrop-blur-md border border-border/40 mb-4">
                    <Cpu className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
                    {services[0].title}
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    {services[0].description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm text-primary font-medium">
                    En savoir plus
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>

            {/* Medium card with image */}
            <ScrollReveal delay={0.1} className="md:col-span-2 md:row-span-1">
              <Link
                to={services[1].href}
                className="group relative block h-full min-h-[200px] rounded-3xl overflow-hidden border border-border/50"
              >
                <img
                  src={services[1].image}
                  alt={services[1].title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <Building2 className="w-6 h-6 text-primary-foreground mb-2" />
                  <h3 className="text-lg font-heading font-bold text-primary-foreground">
                    {services[1].title}
                  </h3>
                </div>
              </Link>
            </ScrollReveal>

            {/* Small icon card */}
            <ScrollReveal delay={0.15} className="md:col-span-2 md:row-span-1">
              <TiltCard className="group h-full">
                <Link
                  to={services[3].href}
                  className={`relative block h-full min-h-[200px] rounded-3xl p-6 bg-gradient-to-br ${services[3].accent} border border-border/50 overflow-hidden`}
                >
                  <Sparkles className="w-7 h-7 text-primary mb-3" />
                  <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                    {services[3].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{services[3].description}</p>
                  <ArrowUpRight className="absolute top-6 right-6 w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </Link>
              </TiltCard>
            </ScrollReveal>

            {/* Education with image */}
            <ScrollReveal delay={0.2} className="md:col-span-2 md:row-span-1">
              <Link
                to={services[2].href}
                className="group relative block h-full min-h-[200px] rounded-3xl overflow-hidden border border-border/50"
              >
                <img
                  src={services[2].image}
                  alt={services[2].title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <Users className="w-6 h-6 text-accent-foreground mb-2" />
                  <h3 className="text-lg font-heading font-bold text-accent-foreground">
                    {services[2].title}
                  </h3>
                </div>
              </Link>
            </ScrollReveal>

            {/* Waste */}
            <ScrollReveal delay={0.25} className="md:col-span-2 md:row-span-1">
              <TiltCard className="group h-full">
                <Link
                  to={services[4].href}
                  className={`relative block h-full min-h-[200px] rounded-3xl p-6 bg-gradient-to-br ${services[4].accent} border border-border/50 overflow-hidden`}
                >
                  <Recycle className="w-7 h-7 text-primary mb-3" />
                  <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                    {services[4].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{services[4].description}</p>
                  <ArrowUpRight className="absolute top-6 right-6 w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </Link>
              </TiltCard>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3} className="mt-12 text-center">
            <Magnetic strength={0.18}>
              <Button asChild variant="outline" size="lg">
                <Link to="/services">
                  Voir tous les services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </Magnetic>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Mission split — image + text ───────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="left">
              <ParallaxImage
                src={sustainabilityImg}
                alt="Mains tenant une jeune pousse, symbole de durabilité"
                className="aspect-[4/5] rounded-3xl"
                speed={0.15}
              />
            </ScrollReveal>

            <div>
              <ScrollReveal>
                <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-4">
                  — Pourquoi nous choisir
                </span>
                <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground tracking-tight leading-[1.05] mb-6">
                  Fondés sur des valeurs
                  <br />
                  <span className="gradient-text italic font-light">qui comptent</span>.
                </h2>
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                  Notre engagement envers la durabilité, l'innovation et le
                  bien-être communautaire guide tout ce que nous entreprenons.
                </p>
              </ScrollReveal>

              <div className="space-y-4">
                {values.map((value, i) => (
                  <ScrollReveal
                    key={value.title}
                    delay={0.1 + i * 0.08}
                    direction="up"
                  >
                    <div className="group flex items-start gap-5 p-5 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/40 hover:border-primary/40 transition-all duration-300">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-foreground mb-1">
                          {value.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mission card — full width image ────────────────────────────── */}
      <section className="relative py-24 lg:py-40 overflow-hidden">
        <ParallaxImage
          src={aerialVillage}
          alt="Vue aérienne d'un village avec infrastructures durables"
          className="absolute inset-0"
          speed={0.2}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />

        <div className="relative section-container">
          <ScrollReveal direction="scale">
            <div className="max-w-3xl mx-auto text-center glass-card p-10 lg:p-14">
              <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-4">
                — Notre Mission
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
                Construire un avenir où chaque communauté a accès à
                l'<span className="gradient-text">assainissement digne</span>.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Chez Ecosense Solutions, nous concevons et déployons des
                infrastructures essentielles adaptées aux réalités locales,
                garantissant qualité, sécurité et impact positif durable.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
                {[
                  "Construction axée sur la qualité",
                  "Approche centrée communauté",
                  "Pratiques durables",
                  "Impact mesurable",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Partnership CTA ─────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="section-container">
          <ScrollReveal direction="scale">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-10 lg:p-16">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/30 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-accent/40 blur-3xl" />
              </div>
              <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="inline-block text-xs font-medium uppercase tracking-widest text-primary-foreground/80 mb-4">
                    — Partenariat
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground leading-tight mb-6">
                    Construisons ensemble un impact qui dure.
                  </h2>
                  <p className="text-primary-foreground/85 text-lg mb-8">
                    ONG, organismes gouvernementaux ou entreprises : rejoignez-nous
                    pour transformer durablement la santé publique.
                  </p>
                  <Magnetic strength={0.2}>
                    <Button asChild size="lg" variant="secondary" className="px-8 h-12">
                      <Link to="/partnership">
                        Explorer le partenariat
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </Magnetic>
                </div>
                <div className="hidden lg:flex justify-end">
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    {[
                      { v: "44+", l: "Villages" },
                      { v: "50+", l: "Partenaires" },
                      { v: "5K+", l: "Personnes" },
                      { v: "95%", l: "Satisfaction" },
                    ].map((s) => (
                      <div
                        key={s.l}
                        className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 p-5"
                      >
                        <div className="text-3xl font-heading font-bold text-primary-foreground">
                          {s.v}
                        </div>
                        <div className="text-xs text-primary-foreground/70 mt-1">
                          {s.l}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Blog ────────────────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="py-24 lg:py-32 bg-muted/30">
          <div className="section-container">
            <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
              <ScrollReveal>
                <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-4">
                  — Dernières actualités
                </span>
                <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground tracking-tight">
                  Notre <span className="gradient-text italic font-light">journal</span>.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <Button asChild variant="outline">
                  <Link to="/blog">
                    Tous les articles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </ScrollReveal>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 0.1}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block h-full rounded-3xl overflow-hidden bg-card border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                  >
                    {post.cover_image_url && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <time className="text-xs text-muted-foreground uppercase tracking-wider">
                        {post.published_at &&
                          new Date(post.published_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                      </time>
                      <h3 className="text-lg font-heading font-semibold text-foreground mt-3 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <span className="text-sm text-primary font-medium inline-flex items-center">
                        Lire la suite
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Index;
