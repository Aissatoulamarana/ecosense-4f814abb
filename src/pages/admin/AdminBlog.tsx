import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Articles du Blog</h1>
          <p className="text-sm text-muted-foreground mt-1">{posts.length} articles</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Nouvel article</Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{isNew ? "Nouvel article" : "Modifier l'article"}</h2>
            <button onClick={closeForm}><X className="w-5 h-5" /></button>
          </div>
          <Input placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })} />
          <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Input placeholder="Extrait" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <Textarea placeholder="Contenu" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} />
          <div className="flex gap-4 items-center">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Titre</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Statut</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Date</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-border">
                <td className="p-4 text-sm font-medium text-foreground">{post.title}</td>
                <td className="p-4 hidden md:table-cell">
                  <span className={`px-2 py-1 text-xs rounded-full ${post.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {post.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                  {new Date(post.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEdit(post)} className="p-2 hover:bg-muted rounded-lg"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && !loading && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Aucun article</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
