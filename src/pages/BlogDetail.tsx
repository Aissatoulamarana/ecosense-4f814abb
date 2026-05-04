import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  MessageCircle,
  Link2,
  CheckCheck,
  ChevronRight,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  read_time: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

// ─── Reading Progress Bar ─────────────────────────────────────────────────────

function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60]"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, hsl(201 100% 21%), hsl(152 50% 48%))",
      }}
    />
  );
}

// ─── Share Buttons ────────────────────────────────────────────────────────────

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/blog/${slug}`;
  const whatsappText = encodeURIComponent(`${title}\n${url}`);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground font-medium mr-1 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5" /> Partager
      </span>
      <a
        href={`https://wa.me/?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white text-xs font-medium transition-all duration-200"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        WhatsApp
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary text-xs font-medium transition-all duration-200"
      >
        {copied ? (
          <>
            <CheckCheck className="w-3.5 h-3.5" /> Copié !
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5" /> Copier
          </>
        )}
      </button>
    </div>
  );
}

// ─── Rich Content Renderer ────────────────────────────────────────────────────

function RenderContent({ text }: { text: string }) {
  const blocks = text.split("\n\n").filter(Boolean);

  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        const trimmed = block.trim();

        // H1 ── # Title
        if (trimmed.startsWith("# ")) {
          return (
            <h1
              key={i}
              className="text-3xl font-heading font-bold text-foreground mt-10 mb-4 leading-tight"
            >
              {trimmed.slice(2)}
            </h1>
          );
        }

        // H2 ── ## Title
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-2xl font-heading font-bold text-foreground mt-10 mb-4 leading-snug
              pb-3 border-b border-border/50"
            >
              {trimmed.slice(3)}
            </h2>
          );
        }

        // H3 ── ### Title OR **Bold heading**
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="text-xl font-heading font-semibold text-foreground mt-8 mb-3"
            >
              {trimmed.slice(4)}
            </h3>
          );
        }

        // Legacy **bold only** as heading
        if (/^\*\*[^*\n]+\*\*$/.test(trimmed)) {
          return (
            <h3
              key={i}
              className="text-xl font-heading font-semibold text-foreground mt-8 mb-3"
            >
              {trimmed.slice(2, -2)}
            </h3>
          );
        }

        // Blockquote ── > text
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={i}
              className="my-6 pl-5 border-l-4 border-primary/60 bg-primary/5 rounded-r-xl py-4 pr-4"
            >
              <p className="text-foreground/80 italic leading-relaxed text-base">
                {trimmed.slice(2)}
              </p>
            </blockquote>
          );
        }

        // Image ── ![alt](url)
        const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imgMatch) {
          return (
            <figure key={i} className="my-8">
              <img
                src={imgMatch[2]}
                alt={imgMatch[1]}
                className="w-full rounded-2xl object-cover max-h-[480px] shadow-md"
              />
              {imgMatch[1] && (
                <figcaption className="mt-2 text-center text-xs text-muted-foreground italic">
                  {imgMatch[1]}
                </figcaption>
              )}
            </figure>
          );
        }

        // Bullet list ── lines starting with - or •
        const listLines = trimmed.split("\n");
        const isList = listLines.every(
          (l) => /^[-•*]\s/.test(l.trim()) || l.trim() === "",
        );
        if (isList && listLines.some((l) => /^[-•*]\s/.test(l.trim()))) {
          return (
            <ul key={i} className="my-4 space-y-2">
              {listLines
                .filter((l) => /^[-•*]\s/.test(l.trim()))
                .map((line, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2.5 text-muted-foreground leading-relaxed"
                  >
                    <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-primary/70" />
                    <span>{renderInline(line.replace(/^[-•*]\s/, ""))}</span>
                  </li>
                ))}
            </ul>
          );
        }

        // Numbered list
        const isNumbered = listLines.every(
          (l) => /^\d+\.\s/.test(l.trim()) || l.trim() === "",
        );
        if (isNumbered && listLines.some((l) => /^\d+\.\s/.test(l.trim()))) {
          return (
            <ol key={i} className="my-4 space-y-2 list-decimal list-inside">
              {listLines
                .filter((l) => /^\d+\.\s/.test(l.trim()))
                .map((line, j) => (
                  <li
                    key={j}
                    className="text-muted-foreground leading-relaxed pl-1"
                  >
                    <span>{renderInline(line.replace(/^\d+\.\s/, ""))}</span>
                  </li>
                ))}
            </ol>
          );
        }

        // Horizontal rule
        if (trimmed === "---" || trimmed === "***") {
          return <hr key={i} className="my-8 border-border/40" />;
        }

        // Default paragraph with inline formatting
        return (
          <p
            key={i}
            className="text-muted-foreground leading-relaxed text-base mb-1"
          >
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Split by bold (**text**), italic (*text*), inline code (`code`), link [text](url)
  const parts = text.split(
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g,
  );
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (/^`[^`]+`$/.test(part)) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono text-primary"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

// ─── Related Posts Card ───────────────────────────────────────────────────────

function RelatedPostCard({ post }: { post: BlogPost }) {
  const date = new Date(
    post.published_at ?? post.created_at,
  ).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col p-5 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {post.cover_image_url && (
        <div className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-muted/30">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      {post.category && (
        <span className="inline-block px-2.5 py-0.5 mb-2 text-xs font-medium rounded-full bg-primary/10 text-primary w-fit">
          {post.category}
        </span>
      )}
      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 flex-1">
        {post.title}
      </h3>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
        <span className="text-xs text-muted-foreground">{date}</span>
        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      setPost((data as BlogPost) ?? null);

      // Fetch related (same category or just recent, exclude current)
      if (data) {
        const { data: relatedData } = await supabase
          .from("blog_posts")
          .select(
            "id, title, slug, excerpt, cover_image_url, category, read_time, published_at, created_at, status, content, excerpt",
          )
          .eq("status", "published")
          .neq("slug", slug)
          .order("published_at", { ascending: false })
          .limit(3);
        setRelated((relatedData as BlogPost[]) ?? []);
      }

      setLoading(false);
    };
    fetchPost();
    window.scrollTo({ top: 0 });
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
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-2">
            <Tag className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Article introuvable
          </h1>
          <p className="text-muted-foreground">
            Cet article n'existe pas ou n'est pas encore publié.
          </p>
          <Button asChild variant="outline">
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au blog
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const date = new Date(
    post.published_at ?? post.created_at,
  ).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const readTime =
    post.read_time ??
    `${Math.max(1, Math.ceil((post.content?.split(" ").length ?? 100) / 200))} min de lecture`;

  return (
    <Layout>
      {/* Reading progress bar */}
      <ReadingProgress />

      {/* ── Cover Image ─────────────────────────────────────────────────────── */}
      {post.cover_image_url ? (
        <div className="relative pt-[72px] h-[55vh] min-h-[380px] max-h-[560px] overflow-hidden">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
        </div>
      ) : (
        <div className="pt-[72px]" />
      )}

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        className={`${post.cover_image_url ? "-mt-32 relative z-10" : "pt-16 hero-gradient"} pb-12`}
      >
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            {/* Back link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Retour au blog
            </Link>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {post.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Tag className="w-3 h-3" />
                  {post.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {date}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight mb-5 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary/40 pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Share buttons */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Article Content ──────────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="section-container">
          <div className="max-w-3xl" ref={contentRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {post.content ? (
                /<\/?[a-z][\s\S]*>/i.test(post.content) ? (
                  <div
                    className="article-body article-html"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : (
                  <RenderContent text={post.content} />
                )
              ) : (
                <p className="text-muted-foreground italic">
                  Contenu non disponible.
                </p>
              )}
            </motion.div>

            {/* Bottom share + back */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-14 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <Button asChild variant="outline">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tous les articles
                </Link>
              </Button>
              <ShareButtons title={post.title} slug={post.slug} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Related Articles ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="section-container">
            <div className="max-w-3xl">
              <h2 className="text-xl font-heading font-bold text-foreground mb-6">
                À lire aussi
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <RelatedPostCard key={r.id} post={r} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-16">
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
                Contactez notre équipe pour en savoir plus sur nos projets et
                partenariats.
              </p>
              <Button asChild variant="secondary" size="lg">
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Prose styles ─────────────────────────────────────────────────────── */}
      <style>{`
        .article-body > * + * { margin-top: 1.25rem; }
        .article-body h2 + p,
        .article-body h3 + p { margin-top: 0.75rem; }
        .article-body blockquote + p { margin-top: 1.5rem; }

        /* HTML rendering (TipTap output) */
        .article-html p {
          color: hsl(var(--muted-foreground));
          line-height: 1.75; font-size: 1rem; margin: 1rem 0;
        }
        .article-html h2 {
          font-size: 1.5rem; font-weight: 700;
          color: hsl(var(--foreground));
          margin: 2.5rem 0 1rem; line-height: 1.3;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid hsl(var(--border) / 0.5);
        }
        .article-html h3 {
          font-size: 1.25rem; font-weight: 600;
          color: hsl(var(--foreground));
          margin: 2rem 0 0.75rem;
        }
        .article-html ul, .article-html ol {
          padding-left: 1.5rem; margin: 1rem 0;
          color: hsl(var(--muted-foreground));
        }
        .article-html ul { list-style: disc; }
        .article-html ol { list-style: decimal; }
        .article-html li { margin: 0.5rem 0; line-height: 1.7; }
        .article-html blockquote {
          border-left: 4px solid hsl(var(--primary) / 0.6);
          background: hsl(var(--primary) / 0.05);
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
          border-radius: 0 0.75rem 0.75rem 0;
          font-style: italic;
          color: hsl(var(--foreground) / 0.8);
        }
        .article-html blockquote p { margin: 0; color: inherit; }
        .article-html a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .article-html strong { color: hsl(var(--foreground)); font-weight: 600; }
        .article-html code {
          background: hsl(var(--muted));
          color: hsl(var(--primary));
          padding: 0.15rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .article-html img {
          max-width: 100%; height: auto;
          border-radius: 1rem; margin: 2rem 0;
          box-shadow: 0 8px 24px hsl(var(--foreground) / 0.08);
        }
        .article-html hr {
          border: 0; border-top: 1px solid hsl(var(--border) / 0.5);
          margin: 2rem 0;
        }
      `}</style>
    </Layout>
  );
}
