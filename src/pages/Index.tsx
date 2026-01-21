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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/ui/service-card";
import heroBg from "@/assets/hero-bg.jpg";

const services = [
  {
    title: "Construction & Renovation",
    description:
      "Building and renovating essential sanitary infrastructure tailored to community needs.",
    icon: Building2,
    href: "/services#construction",
  },
  {
    title: "Awareness & Training",
    description:
      "Educating communities on hygiene best practices for lasting behavioral change.",
    icon: Users,
    href: "/services#training",
  },
  {
    title: "Clean & Safe Premises",
    description:
      "Maintaining pristine, safe environments that promote health and well-being.",
    icon: Sparkles,
    href: "/services#maintenance",
  },
  {
    title: "Waste Management",
    description:
      "Comprehensive waste solutions from collection to valorization and recycling.",
    icon: Recycle,
    href: "/services#waste",
  },
];

const stats = [
  { value: "50+", label: "Communities Served" },
  { value: "1000+", label: "Projects Completed" },
  { value: "95%", label: "Client Satisfaction" },
];

const values = [
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Environmental responsibility in every solution we deliver.",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "Putting the needs of communities at the heart of our work.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "Pioneering new approaches to sanitation challenges.",
  },
];

const blogPosts = [
  {
    title: "The Future of Sustainable Sanitation in West Africa",
    excerpt: "Exploring innovative approaches to community hygiene and infrastructure.",
    date: "Jan 15, 2026",
    slug: "future-sustainable-sanitation",
  },
  {
    title: "Community Engagement: Key to Lasting Change",
    excerpt: "How local involvement transforms sanitation outcomes.",
    date: "Jan 10, 2026",
    slug: "community-engagement",
  },
  {
    title: "Waste-to-Value: Turning Challenges into Opportunities",
    excerpt: "Innovative waste management practices creating economic value.",
    date: "Jan 5, 2026",
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
            alt="Sustainable community"
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
              Sustainable Sanitation Solutions
            </motion.span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-6">
              Innovating for a{" "}
              <span className="gradient-text">Cleaner, Healthier</span> Future
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Building sustainable sanitation infrastructure and empowering
              communities across Guinea with innovative hygiene solutions.
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
                  Explore Our Solutions
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 h-12 text-base"
              >
                <Link to="/contact">Request a Quote</Link>
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
            badge="Our Services"
            title="Comprehensive Solutions for Every Need"
            description="From infrastructure construction to community training, we deliver end-to-end sanitation services that create lasting impact."
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
                View All Services
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
                badge="Why Choose Us"
                title="Built on Values That Matter"
                description="Our commitment to sustainability, innovation, and community welfare drives everything we do."
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
                  Our Mission
                </h3>
                <p className="text-muted-foreground mb-6">
                  At Ecosense Solutions, we're dedicated to providing innovative and
                  sustainable solutions for sanitation and hygiene. We build and
                  renovate essential infrastructure tailored to community needs,
                  ensuring quality, safety, and positive impact in every
                  intervention.
                </p>
                <ul className="space-y-3">
                  {[
                    "Quality-driven construction",
                    "Community-focused approach",
                    "Sustainable practices",
                    "Lasting impact",
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
                Partner With Us
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Join us in creating sustainable impact. Whether you're an NGO,
                government body, or private organization, let's build a cleaner
                future together.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="px-8 h-12 text-base"
              >
                <Link to="/partnership">
                  Explore Partnership
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
            badge="Latest Insights"
            title="From Our Blog"
            description="Stay updated with the latest in sustainable sanitation and community development."
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
                    Read more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link to="/blog">View All Posts</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
