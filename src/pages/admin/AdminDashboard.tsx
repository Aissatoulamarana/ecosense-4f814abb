import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { FileText, MessageSquare, Users } from "lucide-react";
import { motion } from "framer-motion";

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
    {
      label: "Articles",
      value: stats.posts,
      icon: FileText,
      description: "Articles publiés et brouillons",
      accent: "bg-primary/10 text-primary border-primary/20",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      description: `${stats.unreadMessages} non lu${stats.unreadMessages > 1 ? "s" : ""}`,
      accent: "bg-accent/10 text-accent border-accent/20",
    },
    {
      label: "Utilisateurs",
      value: stats.users,
      icon: Users,
      description: "Comptes enregistrés",
      accent: "bg-primary/10 text-primary border-primary/20",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-10">
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
          Vue d'ensemble
        </span>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Tableau de <span className="gradient-text">bord</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-2">Bienvenue dans l'espace d'administration Ecosense</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${card.accent}`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-4xl font-heading font-bold gradient-text mb-1">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
}
