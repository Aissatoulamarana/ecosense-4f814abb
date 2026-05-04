import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Leaf,
  Heart,
  TrendingUp,
  Users,
  Award,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Magnetic } from "@/components/ui/magnetic-button";
import { ParallaxImage } from "@/components/ui/parallax-image";
import engineerImg from "@/assets/2026-engineer-portrait.jpg";
import sustainabilityImg from "@/assets/2026-sustainability.jpg";
import aerialVillage from "@/assets/2026-aerial-village.jpg";
import educationImg from "@/assets/2026-education-handwashing.jpg";

const values = [
  {
    icon: Leaf,
    title: "Durabilité",
    description:
      "La responsabilité environnementale guide chaque décision pour protéger la planète.",
  },
  {
    icon: Heart,
    title: "Communauté d'abord",
    description:
      "Nous plaçons les besoins des communautés au centre de chaque solution proposée.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "Recherche continue de nouvelles approches pour résoudre les défis sanitaires.",
  },
  {
    icon: Award,
    title: "Qualité",
    description:
      "L'excellence est non négociable dans chaque livrable que nous fournissons.",
  },
];

const impactStats = [
  { value: "44+", label: "Villages servis", icon: Globe },
  { value: "1000+", label: "Projets réalisés", icon: Award },
  { value: "5000+", label: "Personnes formées", icon: Users },
  { value: "95%", label: "Satisfaction client", icon: Heart },
];

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <Layout>
      {/* Hero immersif avec photo */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src={engineerImg}
            alt="Ingénieure sur un site de construction d'assainissement"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative section-container pt-32 pb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-medium uppercase tracking-widest rounded-full bg-background/70 backdrop-blur-md border border-border/40 text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              À propos
            </span>
            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-heading font-bold text-foreground tracking-[-0.03em] leading-[0.95] mb-8">
              Construire un avenir
              <br />
              <span className="gradient-text italic font-light">durable</span>
              <span className="text-foreground">, ensemble.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Découvrez notre mission, notre vision et les valeurs qui nous
              poussent à créer un changement positif durable en matière
              d'assainissement et d'hygiène.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 lg:py-32">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <ScrollReveal direction="left">
              <div className="relative h-full p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-background border border-border/50 overflow-hidden group">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <span className="block text-xs uppercase tracking-widest text-accent mb-3">
                    Notre Mission
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-5 leading-tight">
                    Apporter des solutions <span className="gradient-text italic font-light">durables</span> à chaque communauté.
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Chez ECOSENSE SOLUTIONS, nous fournissons des solutions
                    innovantes et durables pour l'assainissement et l'hygiène,
                    en construisant et rénovant des infrastructures sanitaires
                    adaptées aux besoins des communautés.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.1}>
              <div className="relative h-full p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-accent/5 via-background to-background border border-border/50 overflow-hidden group">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-6">
                    <Eye className="w-7 h-7 text-accent" />
                  </div>
                  <span className="block text-xs uppercase tracking-widest text-accent mb-3">
                    Notre Vision
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-5 leading-tight">
                    Des communautés <span className="gradient-text italic font-light">résilientes</span> et saines.
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Voir des communautés propres, saines et résilientes, où chaque
                    individu bénéficie d'un environnement sûr et d'infrastructures
                    sanitaires durables, grâce à l'innovation et à des pratiques
                    responsables.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values — bento horizontal */}
      <section className="relative py-24 lg:py-32 bg-muted/30 overflow-hidden">
        <div className="section-container">
          <ScrollReveal>
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-4">
              — Nos Valeurs
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground tracking-tight max-w-3xl leading-[1.05] mb-4">
              Ce que nous <span className="gradient-text italic font-light">défendons</span>.
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Les principes qui guident notre travail et façonnent notre culture
              au quotidien.
            </p>
          </ScrollReveal>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.08}>
                <div className="group relative h-full p-7 rounded-3xl bg-background border border-border/50 hover:border-primary/40 hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 mb-5 group-hover:scale-110 transition-transform">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
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
      </section>

      {/* Impact stats sur image immersive */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <ParallaxImage
          src={aerialVillage}
          alt="Vue aérienne d'un village avec infrastructures durables"
          className="absolute inset-0"
          speed={0.2}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />

        <div className="relative section-container">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-4">
                — Notre Impact
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground tracking-tight leading-[1.05]">
                Des chiffres qui <span className="gradient-text italic font-light">parlent</span>.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {impactStats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.1} direction="scale">
                <div className="glass-card p-8 text-center group hover:shadow-glow transition-shadow duration-500">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 mb-5 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-5xl font-heading font-bold gradient-text mb-3">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach — split with image */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="section-container">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <ScrollReveal direction="left" className="lg:col-span-5">
              <ParallaxImage
                src={educationImg}
                alt="Engagement communautaire"
                className="aspect-[4/5] rounded-3xl shadow-xl"
                speed={0.12}
              />
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.1} className="lg:col-span-7">
              <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-4">
                — Notre Approche
              </span>
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground tracking-tight leading-[1.05] mb-6">
                Des solutions <span className="gradient-text italic font-light">intégrées</span>
                <br />
                pour des défis complexes.
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed mb-10">
                <p>
                  L'assainissement durable nécessite plus que la simple
                  construction d'infrastructures. Cela demande une approche
                  intégrée qui combine la construction physique avec
                  l'engagement communautaire et le changement de comportement.
                </p>
                <p>
                  Notre équipe multidisciplinaire réunit ingénierie, santé
                  publique, développement communautaire et sciences de
                  l'environnement pour offrir des solutions qui s'attaquent aux
                  causes profondes.
                </p>
              </div>
              <Magnetic strength={0.18}>
                <Button asChild size="lg" className="shadow-glow">
                  <Link to="/partnership">Devenez partenaire</Link>
                </Button>
              </Magnetic>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
