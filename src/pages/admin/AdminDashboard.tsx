import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Handshake,
  MessageSquare,
  Settings2,
  Users,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { dynamicSupabase } from "@/lib/supabase-dynamic";

interface Stats {
  posts: number;
  messages: number;
  unreadMessages: number;
  services: number;
  partners: number;
  partnerRequests: number;
  users: number;
}

const initialStats: Stats = {
  posts: 0,
  messages: 0,
  unreadMessages: 0,
  services: 0,
  partners: 0,
  partnerRequests: 0,
  users: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(initialStats);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        postsRes,
        messagesRes,
        unreadRes,
        usersRes,
        servicesRes,
        partnersRes,
        partnerRequestsRes,
      ] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase
          .from("contact_messages")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("contact_messages")
          .select("id", { count: "exact", head: true })
          .eq("status", "unread"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        dynamicSupabase.from<{ id: string }>("services").select("id"),
        dynamicSupabase.from<{ id: string }>("partners").select("id"),
        supabase
          .from("contact_messages")
          .select("id", { count: "exact", head: true })
          .eq("subject", "partnership"),
      ]);

      setStats({
        posts: postsRes.count ?? 0,
        messages: messagesRes.count ?? 0,
        unreadMessages: unreadRes.count ?? 0,
        services: servicesRes.data?.length ?? 0,
        partners: partnersRes.data?.length ?? 0,
        partnerRequests: partnerRequestsRes.count ?? 0,
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
      description: "Articles publies et brouillons",
      accent: "bg-primary/10 text-primary border-primary/20",
      href: "/admin/blog",
    },
    {
      label: "Services",
      value: stats.services,
      icon: Settings2,
      description: "Offres gerees dans le catalogue",
      accent: "bg-primary/10 text-primary border-primary/20",
      href: "/admin/services",
    },
    {
      label: "Partenaires",
      value: stats.partners,
      icon: Handshake,
      description: `${stats.partnerRequests} demande${stats.partnerRequests > 1 ? "s" : ""}`,
      accent: "bg-accent/10 text-accent border-accent/20",
      href: "/admin/partners",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      description: `${stats.unreadMessages} non lu${stats.unreadMessages > 1 ? "s" : ""}`,
      accent: "bg-accent/10 text-accent border-accent/20",
      href: "/admin/messages",
    },
    {
      label: "Utilisateurs",
      value: stats.users,
      icon: Users,
      description: "Comptes enregistres",
      accent: "bg-primary/10 text-primary border-primary/20",
      href: "/admin/users",
    },
  ];

  const shortcuts = [
    {
      title: "Mettre a jour les services",
      description:
        "Ajoutez une offre, sa photo, ses points cles et son ordre d'affichage.",
      icon: Settings2,
      href: "/admin/services",
    },
    {
      title: "Gerer les partenaires",
      description:
        "Publiez les logos et consultez les nouvelles demandes de partenariat.",
      icon: Handshake,
      href: "/admin/partners",
    },
    {
      title: "Rediger un article",
      description:
        "Creez une actualite avec image de couverture et contenu enrichi.",
      icon: FileText,
      href: "/admin/blog",
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
        <p className="text-muted-foreground text-sm mt-2">
          Pilotez les contenus publics, les demandes et les acces admin.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="premium-card p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium text-muted-foreground">
                {card.label}
              </span>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center border ${card.accent}`}
              >
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-4xl font-heading font-bold gradient-text mb-1">
              {card.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
            <Link
              to={card.href}
              className="mt-5 inline-flex items-center text-xs font-medium text-primary hover:underline"
            >
              Ouvrir
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.href}
            to={shortcut.href}
            className="premium-card p-6 hover:border-primary/30 transition-colors"
          >
            <shortcut.icon className="w-6 h-6 text-primary mb-4" />
            <h2 className="font-heading font-semibold text-foreground mb-2">
              {shortcut.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {shortcut.description}
            </p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
