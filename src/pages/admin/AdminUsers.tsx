/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Shield, ShieldOff, Users, Plus, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    is_admin: false,
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      (supabase as any).from("user_roles").select("user_id, role"),
    ]);
    setProfiles(p ?? []);
    setRoles(r ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isAdmin = (userId: string) =>
    roles.some((r) => r.user_id === userId && r.role === "admin");

  const openNew = () => {
    setEditing(null);
    setForm({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      is_admin: false,
    });
    setShowForm(true);
  };

  const openEdit = (profile: Profile) => {
    setEditing(profile);
    setForm({
      email: profile.email ?? "",
      password: "",
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
      is_admin: isAdmin(profile.user_id),
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.email.trim()) {
      toast.error("L'email est requis");
      return;
    }
    setSaving(true);

    if (editing) {
      // Mise à jour du profil
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: form.first_name || null,
          last_name: form.last_name || null,
          email: form.email,
        })
        .eq("user_id", editing.user_id);

      if (error) {
        toast.error("Erreur lors de la mise à jour");
        setSaving(false);
        return;
      }

      // Gestion du rôle admin
      const wasAdmin = isAdmin(editing.user_id);
      if (form.is_admin && !wasAdmin) {
        await (supabase as any)
          .from("user_roles")
          .insert({ user_id: editing.user_id, role: "admin" });
      } else if (!form.is_admin && wasAdmin) {
        await (supabase as any)
          .from("user_roles")
          .delete()
          .eq("user_id", editing.user_id)
          .eq("role", "admin");
      }

      toast.success("Utilisateur mis à jour");
    } else {
      // Création via Supabase Admin API (edge function ou inviteUser)
      if (!form.password || form.password.length < 6) {
        toast.error("Mot de passe requis (min. 6 caractères)");
        setSaving(false);
        return;
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email: form.email,
        password: form.password,
        email_confirm: true,
        user_metadata: {
          first_name: form.first_name,
          last_name: form.last_name,
        },
      });

      if (error || !data.user) {
        toast.error("Erreur création : " + error?.message);
        setSaving(false);
        return;
      }

      if (form.is_admin) {
        await (supabase as any)
          .from("user_roles")
          .insert({ user_id: data.user.id, role: "admin" });
      }

      toast.success("Utilisateur créé");
    }

    setSaving(false);
    closeForm();
    fetchData();
  };

  const handleDelete = async (profile: Profile) => {
    if (!confirm(`Supprimer l'utilisateur ${profile.email} définitivement ?`))
      return;

    const { error } = await supabase.auth.admin.deleteUser(profile.user_id);
    if (error) {
      toast.error("Erreur suppression : " + error.message);
      return;
    }
    toast.success("Utilisateur supprimé");
    fetchData();
  };

  const toggleAdmin = async (userId: string) => {
    if (isAdmin(userId)) {
      await (supabase as any)
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");
      toast.success("Rôle admin retiré");
    } else {
      await (supabase as any)
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      toast.success("Rôle admin ajouté");
    }
    fetchData();
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            Gestion
          </span>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Utilisateurs
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {profiles.length} utilisateur{profiles.length > 1 ? "s" : ""}{" "}
            enregistré{profiles.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={openNew} className="shadow-glow mt-2">
          <Plus className="w-4 h-4 mr-2" /> Nouvel utilisateur
        </Button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6 mb-8 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-semibold text-foreground">
              {editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </h2>
            <button
              onClick={closeForm}
              className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Prénom
              </label>
              <Input
                placeholder="Prénom"
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Nom
              </label>
              <Input
                placeholder="Nom"
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Email *
            </label>
            <Input
              type="email"
              placeholder="email@exemple.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!!editing}
            />
            {editing && (
              <p className="text-xs text-muted-foreground mt-1">
                L'email ne peut pas être modifié.
              </p>
            )}
          </div>

          {!editing && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Mot de passe *
              </label>
              <Input
                type="password"
                placeholder="Min. 6 caractères"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_admin"
              checked={form.is_admin}
              onChange={(e) => setForm({ ...form, is_admin: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <label
              htmlFor="is_admin"
              className="text-sm text-foreground cursor-pointer"
            >
              Accès administrateur
            </label>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="shadow-glow"
          >
            {saving
              ? "Enregistrement..."
              : editing
                ? "Mettre à jour"
                : "Créer l'utilisateur"}
          </Button>
        </motion.div>
      )}

      {/* Table */}
      <div className="premium-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/40 border-b border-border/60">
            <tr>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                Nom
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                Date d'inscription
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Rôle
              </th>
              <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-t border-border/60 hover:bg-muted/20 transition-colors"
              >
                <td className="p-4 text-sm font-medium text-foreground">
                  {p.email ?? "—"}
                </td>
                <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                  {[p.first_name, p.last_name].filter(Boolean).join(" ") || "—"}
                </td>
                <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                  {new Date(p.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                      isAdmin(p.user_id)
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {isAdmin(p.user_id) ? "Admin" : "Utilisateur"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => toggleAdmin(p.user_id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isAdmin(p.user_id)
                          ? "hover:bg-destructive/10 text-primary hover:text-destructive"
                          : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                      }`}
                      title={
                        isAdmin(p.user_id) ? "Retirer admin" : "Rendre admin"
                      }
                    >
                      {isAdmin(p.user_id) ? (
                        <ShieldOff className="w-4 h-4" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-muted-foreground"
                >
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Aucun utilisateur enregistré</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
