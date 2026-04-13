import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Image } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      setPost(data ?? null);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">Article introuvable</h1>
          <p className="text-muted-foreground">Cet article n'existe pas ou n'est pas encore publié.</p>
          <Button asChild variant="outline">
            <Link to="/blog"><ArrowLeft className="w-4 h-4 mr-2" />Retour au blog</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const date = new Date(post.published_at ?? post.created_at).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
  const readTime = `${Math.max(1, Math.ceil((post.content?.split(" ").length ?? 100) / 200))} min de lecture`;

  const renderContent = (text: string) => {
    return text.split("\n\n").map((paragraph, i) => {
      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        return (
          <h3 key={i} className="text-xl font-heading font-semibold text-foreground mt-8 mb-3">
            {paragraph.slice(2, -2)}
          </h3>
        );
      }
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-muted-foreground leading-relaxed mb-4">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>
            ) : part
          )}
        </p>
      );
    });
  };

  return (
    <Layout>
      {/* Cover image */}
      {post.cover_image_url && (
        <div className="pt-20">
          <div className="w-full max-h-[480px] overflow-hidden">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Hero */}
      <section className={`${post.cover_image_url ? "pt-12" : "pt-32"} pb-12 hero-gradient`}>
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {date}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight mb-6">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="section-container">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose-custom"
            >
              {post.content ? renderContent(post.content) : (
                <p className="text-muted-foreground">Contenu non disponible.</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pt-8 border-t border-border/60"
            >
              <Button asChild variant="outline">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tous les articles
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-10 text-center max-w-2xl mx-auto"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_50%)]" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-heading font-bold text-primary-foreground mb-3">
                Intéressé par nos solutions ?
              </h2>
              <p className="text-primary-foreground/80 mb-6 text-sm">
                Contactez notre équipe pour en savoir plus sur nos projets et partenariats.
              </p>
              <Button asChild variant="secondary" size="lg">
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
