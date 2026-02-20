import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MailOpen, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchMessages = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data ?? []);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (msg: Message) => {
    setSelected(msg);
    if (msg.status === "unread") {
      await supabase.from("contact_messages").update({ status: "read" }).eq("id", msg.id);
      fetchMessages();
    }
  };

  const deleteMsg = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    if (selected?.id === id) setSelected(null);
    toast.success("Message supprimé");
    fetchMessages();
  };

  const unreadCount = messages.filter(m => m.status === "unread").length;

  return (
    <AdminLayout>
      <div className="mb-10">
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
          Boîte de réception
        </span>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Mes <span className="gradient-text">Messages</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {unreadCount > 0
            ? `${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`
            : "Tout est lu"}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 premium-card overflow-hidden">
          {messages.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Aucun message reçu</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60 max-h-[600px] overflow-y-auto">
              {messages.map((msg, i) => (
                <motion.button
                  key={msg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => markRead(msg)}
                  className={`w-full text-left p-4 hover:bg-muted/40 transition-colors ${selected?.id === msg.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.status === "unread" ? (
                      <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <MailOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={`text-sm font-medium truncate ${msg.status === "unread" ? "text-foreground" : "text-muted-foreground"}`}>
                      {msg.name}
                    </span>
                    {msg.status === "unread" && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate pl-6">
                    {msg.subject || msg.message.substring(0, 60)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 pl-6">
                    {new Date(msg.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 premium-card p-6">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-heading font-semibold text-foreground">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-sm text-primary hover:underline">
                    {selected.email}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(selected.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => deleteMsg(selected.id)}
                    className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 hover:bg-muted/60 text-muted-foreground rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selected.subject && (
                <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/15">
                  <p className="text-sm font-medium text-foreground">Objet : {selected.subject}</p>
                </div>
              )}

              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </p>
            </motion.div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
