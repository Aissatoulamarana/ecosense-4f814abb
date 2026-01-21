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
    title: "Sustainability",
    description:
      "Environmental responsibility guides every decision we make, ensuring our solutions protect the planet for future generations.",
  },
  {
    icon: Heart,
    title: "Community First",
    description:
      "We place communities at the center of our work, ensuring our solutions address real needs and create lasting value.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "We continuously seek new approaches and technologies to solve sanitation challenges more effectively.",
  },
  {
    icon: Award,
    title: "Quality",
    description:
      "Excellence is non-negotiable. We maintain the highest standards in everything we deliver.",
  },
];

const impactStats = [
  { value: "50+", label: "Communities Served", icon: Globe },
  { value: "1000+", label: "Projects Completed", icon: Award },
  { value: "5000+", label: "People Trained", icon: Users },
  { value: "95%", label: "Client Satisfaction", icon: Heart },
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
              Building a <span className="gradient-text">Sustainable</span> Future
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn about our mission, vision, and the values that drive us to
              create lasting positive change in sanitation and hygiene across
              Guinea.
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
            badge="Our Values"
            title="What We Stand For"
            description="The principles that guide our work and shape our culture."
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
            badge="Our Impact"
            title="Making a Difference"
            description="Numbers that reflect our commitment to sustainable change."
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
              badge="Our Approach"
              title="Integrated Solutions for Complex Challenges"
              description="We take a holistic approach to sanitation, addressing infrastructure, behavior, and systems together."
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 prose prose-lg mx-auto text-muted-foreground"
            >
              <p>
                At Ecosense Solutions, we understand that sustainable sanitation
                requires more than just building infrastructure. It demands an
                integrated approach that combines physical construction with
                community engagement, behavior change, and ongoing maintenance.
              </p>
              <p>
                Our multidisciplinary team brings together expertise in
                engineering, public health, community development, and
                environmental science to deliver comprehensive solutions that
                address the root causes of sanitation challenges.
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
                <Link to="/partnership">Partner With Us</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
