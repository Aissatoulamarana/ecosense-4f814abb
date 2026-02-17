import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MailOpen, Trash2, X } from "lucide-react";
import { toast } from "sonner";

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

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">{messages.filter(m => m.status === "unread").length} non lus</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          {messages.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground">Aucun message</p>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => markRead(msg)}
                  className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${selected?.id === msg.id ? "bg-muted/50" : ""}`}
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
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.subject || msg.message.substring(0, 60)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(msg.created_at).toLocaleDateString("fr-FR")}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-sm text-primary hover:underline">{selected.email}</a>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(selected.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => deleteMsg(selected.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setSelected(null)} className="p-2 hover:bg-muted rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {selected.subject && (
                <p className="font-medium text-foreground mb-3">Objet : {selected.subject}</p>
              )}
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selected.message}</p>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
