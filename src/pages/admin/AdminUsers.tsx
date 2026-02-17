import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Shield, ShieldOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-foreground">Utilisateurs</h1>
        <p className="text-sm text-muted-foreground mt-1">{profiles.length} utilisateurs</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Nom</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Date</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rôle</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-4 text-sm text-foreground">{p.email ?? "—"}</td>
                <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                  {[p.first_name, p.last_name].filter(Boolean).join(" ") || "—"}
                </td>
                <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                  {new Date(p.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${isAdmin(p.user_id) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {isAdmin(p.user_id) ? "Admin" : "Utilisateur"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleAdmin(p.user_id)}
                    className="p-2 hover:bg-muted rounded-lg"
                    title={isAdmin(p.user_id) ? "Retirer admin" : "Rendre admin"}
                  >
                    {isAdmin(p.user_id) ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
