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
    title: "Extended Reach",
    description:
      "Leverage our local expertise and networks to expand your impact across Guinea.",
  },
  {
    icon: Lightbulb,
    title: "Innovation Access",
    description:
      "Benefit from our cutting-edge approaches to sustainable sanitation solutions.",
  },
  {
    icon: Users,
    title: "Community Trust",
    description:
      "Tap into our established relationships with communities and local leaders.",
  },
  {
    icon: Building,
    title: "Operational Excellence",
    description:
      "Partner with a team known for quality execution and reliable delivery.",
  },
];

const partnerTypes = [
  {
    title: "NGOs & Development Organizations",
    description:
      "Collaborate on projects that align with sustainable development goals and create lasting community impact.",
  },
  {
    title: "Government Bodies",
    description:
      "Partner with us to implement public health initiatives and infrastructure development programs.",
  },
  {
    title: "Private Sector",
    description:
      "Corporate partnerships for CSR initiatives, facility management, and sustainable business practices.",
  },
  {
    title: "Academic Institutions",
    description:
      "Research collaborations and educational partnerships to advance sanitation knowledge and innovation.",
  },
];

const caseStudies = [
  {
    title: "Community Sanitation Project - Conakry",
    description:
      "Partnered with an international NGO to build 50 modern latrines and train 500 community members.",
    outcome: "80% reduction in waterborne diseases",
  },
  {
    title: "School Hygiene Initiative",
    description:
      "Collaborated with the Ministry of Education to improve sanitation facilities in 20 schools.",
    outcome: "Reached 5,000+ students",
  },
  {
    title: "Waste Management Program",
    description:
      "Joint venture with local government to implement community-based waste collection.",
    outcome: "70% increase in waste collection coverage",
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
              Partnership
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
              Together for a <span className="gradient-text">Better</span> Tomorrow
            </h1>
            <p className="text-lg text-muted-foreground">
              Join us in creating sustainable impact. Whether you're an NGO,
              government body, or private organization, we have partnership
              opportunities that align with your mission.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="section-container">
          <SectionHeading
            badge="Why Partner With Us"
            title="Unlock New Possibilities"
            description="Discover the advantages of partnering with Ecosense Solutions."
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
            badge="Who We Partner With"
            title="Diverse Collaboration Opportunities"
            description="We work with organizations across sectors to maximize impact."
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
            badge="Success Stories"
            title="Partnerships That Made a Difference"
            description="Real examples of what we've achieved together with our partners."
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
              Ready to Partner?
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss how we can work together to create sustainable impact.
              Reach out to start the conversation.
            </p>
            <Button asChild size="lg" className="shadow-glow">
              <Link to="/contact">
                Start a Conversation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
