import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

export default function AdminBlog() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "", status: "draft" });

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const openNew = () => {
    setIsNew(true);
    setEditing(null);
    setForm({ title: "", slug: "", content: "", excerpt: "", status: "draft" });
  };

  const openEdit = (post: BlogPost) => {
    setIsNew(false);
    setEditing(post);
    setForm({ title: post.title, slug: post.slug, content: post.content ?? "", excerpt: post.excerpt ?? "", status: post.status });
  };

  const closeForm = () => { setEditing(null); setIsNew(false); };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSave = async () => {
    const slug = form.slug || generateSlug(form.title);
    const payload = {
      title: form.title,
      slug,
      content: form.content,
      excerpt: form.excerpt,
      status: form.status,
      published_at: form.status === "published" ? new Date().toISOString() : null,
      author_id: user?.id,
    };

    if (isNew) {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) { toast.error("Erreur lors de la création"); return; }
      toast.success("Article créé");
    } else if (editing) {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id);
      if (error) { toast.error("Erreur lors de la mise à jour"); return; }
      toast.success("Article mis à jour");
    }
    closeForm();
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("Article supprimé");
    fetchPosts();
  };

  const showForm = isNew || editing;

  return (
    <AdminLayout>
      <div className="flex items-start justify-between mb-10">
        <div>
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            Contenu
          </span>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Articles du <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">{posts.length} article{posts.length > 1 ? "s" : ""}</p>
        </div>
        <Button onClick={openNew} className="shadow-glow mt-2">
          <Plus className="w-4 h-4 mr-2" />Nouvel article
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6 mb-8 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-semibold text-foreground">
              {isNew ? "Nouvel article" : "Modifier l'article"}
            </h2>
            <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <Input placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })} />
          <Input placeholder="Slug (URL)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Input placeholder="Extrait (résumé court)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <Textarea placeholder="Contenu de l'article..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} />
          <div className="flex gap-4 items-center">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
            <Button onClick={handleSave} className="shadow-glow">Enregistrer</Button>
          </div>
        </motion.div>
      )}

      <div className="premium-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/40 border-b border-border/60">
            <tr>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Titre</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Statut</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Date</th>
              <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
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
                <td className="p-4 text-sm font-medium text-foreground">{post.title}</td>
                <td className="p-4 hidden md:table-cell">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                    post.status === "published"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}>
                    {post.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                  {new Date(post.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-4 text-right space-x-1">
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
                </td>
              </motion.tr>
            ))}
            {posts.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Aucun article pour l'instant</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
