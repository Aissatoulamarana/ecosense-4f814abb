import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  X,
  FileText,
  Eye,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

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

const CATEGORIES = [
  "Général",
  "Innovation",
  "Communauté",
  "Durabilité",
  "Santé",
];

const FORMATTING_HELP = [
  { syntax: "## Titre", result: "Titre H2 (section)" },
  { syntax: "### Sous-titre", result: "Titre H3" },
  { syntax: "**texte**", result: "Texte en gras" },
  { syntax: "*texte*", result: "Texte en italique" },
  { syntax: "> texte", result: "Citation / mise en avant" },
  { syntax: "- item", result: "Liste à puces" },
  { syntax: "1. item", result: "Liste numérotée" },
  { syntax: "![alt](url)", result: "Image inline" },
  { syntax: "[texte](url)", result: "Lien cliquable" },
];

export default function AdminBlog() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Général",
    read_time: "5 min de lecture",
    cover_image_url: "",
    status: "draft",
  });

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data as BlogPost[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openNew = () => {
    setIsNew(true);
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Général",
      read_time: "5 min de lecture",
      cover_image_url: "",
      status: "draft",
    });
  };

  const openEdit = (post: BlogPost) => {
    setIsNew(false);
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      category: post.category ?? "Général",
      read_time: post.read_time ?? "5 min de lecture",
      cover_image_url: post.cover_image_url ?? "",
      status: post.status,
    });
  };

  const closeForm = () => {
    setEditing(null);
    setIsNew(false);
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  // Auto-estimate read time from content (strip HTML tags first)
  const estimateReadTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, " ").trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min de lecture`;
  };

  const wordCount = (html: string) =>
    html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Le titre est requis");
      return;
    }

    const slug = form.slug || generateSlug(form.title);
    const payload = {
      title: form.title,
      slug,
      excerpt: form.excerpt || null,
      content: form.content || null,
      cover_image_url: form.cover_image_url || null,
      category: form.category,
      read_time: form.read_time || estimateReadTime(form.content),
      status: form.status,
      published_at:
        form.status === "published" ? new Date().toISOString() : null,
      author_id: user?.id,
    };

    if (isNew) {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) {
        toast.error("Erreur lors de la création");
        return;
      }
      toast.success("Article créé !");
    } else if (editing) {
      const { error } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", editing.id);
      if (error) {
        toast.error("Erreur lors de la mise à jour");
        return;
      }
      toast.success("Article mis à jour !");
    }
    closeForm();
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article définitivement ?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("Article supprimé");
    fetchPosts();
  };

  const toggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    await supabase
      .from("blog_posts")
      .update({
        status: newStatus,
        published_at:
          newStatus === "published" ? new Date().toISOString() : null,
      })
      .eq("id", post.id);
    fetchPosts();
  };

  const showForm = isNew || editing;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            Contenu
          </span>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Articles du <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {posts.filter((p) => p.status === "published").length} publié(s) ·{" "}
            {posts.filter((p) => p.status === "draft").length} brouillon(s)
          </p>
        </div>
        <Button onClick={openNew} className="shadow-glow mt-2">
          <Plus className="w-4 h-4 mr-2" /> Nouvel article
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6 mb-8"
        >
          {/* Form header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
            <h2 className="text-lg font-heading font-semibold text-foreground">
              {isNew ? "Nouvel article" : "Modifier l'article"}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10"
              >
                {showHelp ? "Masquer" : "Aide mise en forme"}
              </button>
              <button
                onClick={closeForm}
                className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Formatting help */}
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 rounded-xl bg-muted/40 border border-border/40"
            >
              <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
                Guide de mise en forme
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {FORMATTING_HELP.map((h) => (
                  <div
                    key={h.syntax}
                    className="flex items-center gap-3 text-xs"
                  >
                    <code className="px-2 py-0.5 bg-background border border-border rounded text-primary font-mono whitespace-nowrap">
                      {h.syntax}
                    </code>
                    <span className="text-muted-foreground">→ {h.result}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Séparez les paragraphes par une <strong>ligne vide</strong>.
              </p>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: main fields */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Titre *
                  </label>
                  <Input
                    placeholder="Titre de l'article"
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                        slug: generateSlug(e.target.value),
                        read_time: estimateReadTime(form.content),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Slug (URL)
                  </label>
                  <Input
                    placeholder="url-de-larticle"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Extrait (résumé affiché dans les cartes)
                </label>
                <Textarea
                  placeholder="Une brève description de l'article..."
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm({ ...form, excerpt: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Contenu de l'article
                </label>
                <Textarea
                  placeholder={`## Introduction\n\nVotre contenu ici...\n\n> Une citation importante\n\n- Point 1\n- Point 2`}
                  value={form.content}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      content: e.target.value,
                      read_time: estimateReadTime(e.target.value),
                    })
                  }
                  rows={16}
                  className="font-mono text-sm leading-relaxed"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {form.content.trim().split(/\s+/).filter(Boolean).length} mots
                  · {form.read_time}
                </p>
              </div>
            </div>

            {/* Right: meta + cover */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Catégorie
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Temps de lecture
                </label>
                <Input
                  placeholder="5 min de lecture"
                  value={form.read_time}
                  onChange={(e) =>
                    setForm({ ...form, read_time: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Statut
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>

              <ImageUploader
                label="Image de couverture"
                value={form.cover_image_url}
                bucket="blog-covers"
                section="blog"
                onChange={(url) => setForm({ ...form, cover_image_url: url })}
              />
              <Button onClick={handleSave} className="w-full shadow-glow">
                {form.status === "published"
                  ? "Publier l'article"
                  : "Sauvegarder le brouillon"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Posts table */}
      <div className="premium-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/40 border-b border-border/60">
            <tr>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Article
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                Catégorie
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                Date
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                Statut
              </th>
              <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => (
              <motion.tr
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="border-t border-border/60 hover:bg-muted/20 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt=""
                        className="w-12 h-9 rounded-lg object-cover border border-border/40 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-9 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {post.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                    {post.category ?? "Général"}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">
                  {new Date(post.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-4 hidden md:table-cell">
                  <button
                    onClick={() => toggleStatus(post)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                      post.status === "published"
                        ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    {post.status === "published" ? "Publié" : "Brouillon"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {post.status === "published" && (
                      <Link
                        to={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                        title="Voir l'article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    <button
                      onClick={() => openEdit(post)}
                      className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {posts.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={5}
                  className="p-16 text-center text-muted-foreground"
                >
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium mb-1">
                    Aucun article pour l'instant
                  </p>
                  <p className="text-xs">
                    Cliquez sur "Nouvel article" pour commencer.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
