import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { FileText, MessageSquare, Users, Eye } from "lucide-react";

interface Stats {
  posts: number;
  messages: number;
  unreadMessages: number;
  users: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ posts: 0, messages: 0, unreadMessages: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [postsRes, messagesRes, unreadRes, usersRes] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "unread"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        posts: postsRes.count ?? 0,
        messages: messagesRes.count ?? 0,
        unreadMessages: unreadRes.count ?? 0,
        users: usersRes.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Articles", value: stats.posts, icon: FileText, color: "text-primary" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, color: "text-accent-foreground", sub: `${stats.unreadMessages} non lus` },
    { label: "Utilisateurs", value: stats.users, icon: Users, color: "text-primary" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de votre site</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{card.value}</p>
            {card.sub && <p className="text-sm text-muted-foreground mt-1">{card.sub}</p>}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
