import { motion } from "framer-motion";
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
import { SectionHeading } from "@/components/ui/section-heading";

const values = [
  {
    icon: Leaf,
    title: "Durabilité",
    description:
      "La responsabilité environnementale guide chaque décision que nous prenons, garantissant que nos solutions protègent la planète pour les générations futures.",
  },
  {
    icon: Heart,
    title: "Communauté d'Abord",
    description:
      "Nous plaçons les communautés au centre de notre travail, garantissant que nos solutions répondent à des besoins réels et créent une valeur durable.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "Nous recherchons continuellement de nouvelles approches et technologies pour résoudre les défis d'assainissement plus efficacement.",
  },
  {
    icon: Award,
    title: "Qualité",
    description:
      "L'excellence est non négociable. Nous maintenons les normes les plus élevées dans tout ce que nous livrons.",
  },
];

const impactStats = [
  { value: "50+", label: "Communautés Servies", icon: Globe },
  { value: "1000+", label: "Projets Réalisés", icon: Award },
  { value: "5000+", label: "Personnes Formées", icon: Users },
  { value: "95%", label: "Satisfaction Client", icon: Heart },
];

export default function About() {
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
              À Propos
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
              Construire un Avenir <span className="gradient-text">Durable</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Découvrez notre mission, notre vision et les valeurs qui nous
              poussent à créer un changement positif durable en matière
              d'assainissement et d'hygiène à travers la Guinée.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 lg:p-10"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-6">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Notre Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Chez ECOSENSE SOLUTIONS, nous avons pour mission de fournir des
                solutions innovantes et durables pour l'assainissement et
                l'hygiène, en construisant et rénovant des infrastructures
                sanitaires adaptées aux besoins des communautés. Nous nous
                engageons à garantir qualité, sécurité et impact positif dans
                toutes nos interventions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 lg:p-10"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-6">
                <Eye className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Notre Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Notre vision est de voir des communautés propres, saines et
                résilientes, où chaque individu bénéficie d'un environnement sûr
                et d'infrastructures sanitaires durables, grâce à l'innovation
                et à des pratiques responsables.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30">
        <div className="section-container">
          <SectionHeading
            badge="Nos Valeurs"
            title="Ce Que Nous Défendons"
            description="Les principes qui guident notre travail et façonnent notre culture."
          />

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24">
        <div className="section-container">
          <SectionHeading
            badge="Notre Impact"
            title="Faire la Différence"
            description="Des chiffres qui reflètent notre engagement envers un changement durable."
          />

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-24 bg-muted/30">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading
              badge="Notre Approche"
              title="Des Solutions Intégrées pour des Défis Complexes"
              description="Nous adoptons une approche holistique de l'assainissement, abordant ensemble l'infrastructure, le comportement et les systèmes."
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 prose prose-lg mx-auto text-muted-foreground"
            >
              <p>
                Chez Ecosense Solutions, nous comprenons que l'assainissement
                durable nécessite plus que la simple construction
                d'infrastructures. Cela demande une approche intégrée qui combine
                la construction physique avec l'engagement communautaire, le
                changement de comportement et la maintenance continue.
              </p>
              <p>
                Notre équipe multidisciplinaire réunit une expertise en
                ingénierie, santé publique, développement communautaire et
                sciences de l'environnement pour offrir des solutions complètes
                qui s'attaquent aux causes profondes des défis d'assainissement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <Button asChild size="lg" className="shadow-glow">
                <Link to="/partnership">Devenez Partenaire</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
