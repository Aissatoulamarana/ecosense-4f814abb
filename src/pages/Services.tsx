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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/section-heading";

const services = [
  {
    id: "construction",
    title: "Construction & Renovation",
    subtitle: "La construction et la rénovation d'infrastructures essentielles",
    description:
      "We design and build modern sanitary infrastructure that meets international standards while being adapted to local contexts. From latrines to water treatment facilities, we deliver durable solutions.",
    icon: Building2,
    features: [
      "Custom infrastructure design",
      "Quality materials and construction",
      "Accessibility compliance",
      "Long-term durability",
      "Environmental integration",
    ],
  },
  {
    id: "training",
    title: "Awareness & Training",
    subtitle: "La sensibilisation et la formation des communautés",
    description:
      "We empower communities with knowledge and skills for maintaining proper hygiene practices. Our training programs create lasting behavioral change and build local capacity.",
    icon: Users,
    features: [
      "Community workshops",
      "School programs",
      "Train-the-trainer modules",
      "Educational materials",
      "Follow-up assessments",
    ],
  },
  {
    id: "maintenance",
    title: "Clean & Safe Premises",
    subtitle: "Le maintien de locaux propres et sûrs",
    description:
      "We provide professional cleaning and maintenance services that ensure healthy, safe environments. Our teams use eco-friendly products and proven methodologies.",
    icon: Sparkles,
    features: [
      "Regular cleaning schedules",
      "Deep sanitization services",
      "Eco-friendly products",
      "Quality inspections",
      "Emergency response",
    ],
  },
  {
    id: "waste",
    title: "Waste Management",
    subtitle: "La gestion efficace des déchets, de la collecte à la valorisation",
    description:
      "Comprehensive waste management from collection to valorization. We implement circular economy principles to turn waste challenges into opportunities.",
    icon: Recycle,
    features: [
      "Waste collection systems",
      "Sorting and recycling",
      "Composting programs",
      "Waste-to-energy solutions",
      "Monitoring and reporting",
    ],
  },
];

const processSteps = [
  {
    icon: ClipboardCheck,
    title: "Consultation",
    description: "We assess your needs and develop a tailored solution plan.",
  },
  {
    icon: Cog,
    title: "Implementation",
    description: "Our expert teams execute the project with precision and care.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description: "Ongoing support ensures long-term success and sustainability.",
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
              What We Offer
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
              Comprehensive <span className="gradient-text">Sanitation</span> Services
            </h1>
            <p className="text-lg text-muted-foreground">
              From infrastructure construction to community training, we deliver
              end-to-end solutions that create lasting positive impact on public
              health and environmental sustainability.
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
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {service.title}
                </h2>
                <p className="text-sm text-primary italic mb-4">
                  {service.subtitle}
                </p>
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
                    Request a Quote
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
            badge="Our Process"
            title="How We Work"
            description="A proven methodology that ensures quality outcomes and client satisfaction."
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
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Contact us today to discuss your project and learn how we can help
            create a cleaner, healthier environment for your community.
          </p>
          <Button asChild size="lg" className="shadow-glow">
            <Link to="/contact">
              Contact Us
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
