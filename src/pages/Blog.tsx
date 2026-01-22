import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/section-heading";

const categories = ["Tous", "Durabilité", "Communauté", "Innovation", "Santé"];

const blogPosts = [
  {
    slug: "future-sustainable-sanitation",
    title: "L'Avenir de l'Assainissement Durable en Afrique de l'Ouest",
    excerpt:
      "Explorer des approches innovantes pour l'hygiène communautaire et le développement d'infrastructures qui façonnent l'avenir de la santé publique dans la région.",
    category: "Innovation",
    date: "15 Janvier 2026",
    readTime: "5 min de lecture",
  },
  {
    slug: "community-engagement",
    title: "Engagement Communautaire : Clé du Changement Durable",
    excerpt:
      "Comment l'implication locale et l'appropriation transforment les résultats en matière d'assainissement et créent un changement comportemental durable.",
    category: "Communauté",
    date: "10 Janvier 2026",
    readTime: "4 min de lecture",
  },
  {
    slug: "waste-to-value",
    title: "Déchets en Valeur : Transformer les Défis en Opportunités",
    excerpt:
      "Pratiques innovantes de gestion des déchets qui créent de la valeur économique tout en protégeant l'environnement.",
    category: "Durabilité",
    date: "5 Janvier 2026",
    readTime: "6 min de lecture",
  },
  {
    slug: "hygiene-education-schools",
    title: "L'Éducation à l'Hygiène dans les Écoles : Construire des Habitudes Saines Tôt",
    excerpt:
      "L'impact des programmes complets d'éducation à l'hygiène sur la santé des élèves et le bien-être communautaire.",
    category: "Santé",
    date: "28 Décembre 2025",
    readTime: "5 min de lecture",
  },
  {
    slug: "sustainable-infrastructure",
    title: "Concevoir des Infrastructures d'Assainissement Durables",
    excerpt:
      "Meilleures pratiques pour construire des installations sanitaires durables et écologiques qui servent les communautés pendant des générations.",
    category: "Durabilité",
    date: "20 Décembre 2025",
    readTime: "7 min de lecture",
  },
  {
    slug: "partnership-impact",
    title: "Le Pouvoir des Partenariats en Santé Publique",
    excerpt:
      "Comment les approches collaboratives entre ONG, gouvernements et communautés amplifient les résultats de santé publique.",
    category: "Communauté",
    date: "15 Décembre 2025",
    readTime: "4 min de lecture",
  },
];

const categoryMap: Record<string, string> = {
  "Tous": "All",
  "Durabilité": "Durabilité",
  "Communauté": "Communauté",
  "Innovation": "Innovation",
  "Santé": "Santé",
};

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tous" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 hero-gradient">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              Blog
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
              Actualités & <span className="gradient-text">Connaissances</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Restez informé des dernières nouvelles sur l'assainissement durable,
              le développement communautaire et l'innovation en santé publique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="section-container">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="section-container">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Aucun article trouvé.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
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
                    className="block h-full p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                      <span className="text-sm text-primary font-medium flex items-center group-hover:underline">
                        Lire la suite
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-muted/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-xl mx-auto"
          >
            <SectionHeading
              badge="Restez Informé"
              title="Abonnez-vous à Notre Newsletter"
              description="Recevez les dernières actualités directement dans votre boîte mail."
            />
            <div className="mt-8 flex gap-3">
              <Input placeholder="Entrez votre email" className="flex-1" />
              <Button>S'abonner</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
