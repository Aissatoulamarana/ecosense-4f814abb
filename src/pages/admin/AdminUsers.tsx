import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Shield, ShieldOff, Users } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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

  const fetchData = async () => {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    setProfiles(p ?? []);
    setRoles(r ?? []);
  };

  useEffect(() => { fetchData(); }, []);

  const isAdmin = (userId: string) => roles.some((r) => r.user_id === userId && r.role === "admin");

  const toggleAdmin = async (userId: string) => {
    if (isAdmin(userId)) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      toast.success("Rôle admin retiré");
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      toast.success("Rôle admin ajouté");
    }
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
          Gestion
        </span>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Utilisateurs
        </h1>
        <p className="text-sm text-muted-foreground mt-2">{profiles.length} utilisateur{profiles.length > 1 ? "s" : ""} enregistré{profiles.length > 1 ? "s" : ""}</p>
      </div>

      <div className="premium-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/40 border-b border-border/60">
            <tr>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Nom</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Date d'inscription</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rôle</th>
              <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
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
                <td className="p-4 text-sm font-medium text-foreground">{p.email ?? "—"}</td>
                <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                  {[p.first_name, p.last_name].filter(Boolean).join(" ") || "—"}
                </td>
                <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                  {new Date(p.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                    isAdmin(p.user_id)
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}>
                    {isAdmin(p.user_id) ? "Admin" : "Utilisateur"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleAdmin(p.user_id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isAdmin(p.user_id)
                        ? "hover:bg-destructive/10 text-primary hover:text-destructive"
                        : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                    }`}
                    title={isAdmin(p.user_id) ? "Retirer admin" : "Rendre admin"}
                  >
                    {isAdmin(p.user_id) ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </button>
                </td>
              </motion.tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-muted-foreground">
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
