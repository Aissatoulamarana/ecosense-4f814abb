import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  dynamicSupabase,
  getQueryErrorMessage,
} from "@/lib/supabase-dynamic";
import { motion } from "framer-motion";
import {
  Building2,
  Edit,
  ExternalLink,
  Handshake,
  Mail,
  MailOpen,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Partner {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

interface PartnerRequest {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

const emptyForm = {
  name: "",
  description: "",
  logo_url: "",
  website_url: "",
  display_order: "0",
  is_active: true,
};

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PartnerRequest | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchPartners = async () => {
    const { data, error } = await dynamicSupabase
      .from<Partner>("partners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Impossible de charger les partenaires");
    }
    setPartners(data ?? []);
    setLoading(false);
  };

  const fetchRequests = async () => {
    const { data } = await dynamicSupabase
      .from<PartnerRequest>("contact_messages")
      .select("*")
      .eq("subject", "partnership")
      .order("created_at", { ascending: false });

    setRequests(data ?? []);
  };

  useEffect(() => {
    fetchPartners();
    fetchRequests();
  }, []);

  const openNew = () => {
    setIsNew(true);
    setEditing(null);
    setForm({
      ...emptyForm,
      display_order: String(partners.length + 1),
    });
  };

  const openEdit = (partner: Partner) => {
    setIsNew(false);
    setEditing(partner);
    setForm({
      name: partner.name,
      description: partner.description ?? "",
      logo_url: partner.logo_url ?? "",
      website_url: partner.website_url ?? "",
      display_order: String(partner.display_order ?? 0),
      is_active: partner.is_active,
    });
  };

  const closeForm = () => {
    setIsNew(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Le nom du partenaire est requis");
      return;
    }

    const payload: Partial<Partner> = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      logo_url: form.logo_url || null,
      website_url: form.website_url.trim() || null,
      display_order: Number(form.display_order) || 0,
      is_active: form.is_active,
    };

    const query = isNew
      ? dynamicSupabase.from<Partner>("partners").insert(payload)
      : dynamicSupabase
          .from<Partner>("partners")
          .update(payload)
          .eq("id", editing?.id);

    const { error } = await query;
    if (error) {
      toast.error(getQueryErrorMessage(error));
      return;
    }

    toast.success(isNew ? "Partenaire ajouté" : "Partenaire mis à jour");
    closeForm();
    fetchPartners();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce partenaire ?")) return;
    const { error } = await dynamicSupabase
      .from<Partner>("partners")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(getQueryErrorMessage(error));
      return;
    }
    toast.success("Partenaire supprimé");
    fetchPartners();
  };

  const toggleActive = async (partner: Partner) => {
    const { error } = await dynamicSupabase
      .from<Partner>("partners")
      .update({ is_active: !partner.is_active })
      .eq("id", partner.id);

    if (error) {
      toast.error(getQueryErrorMessage(error));
      return;
    }
    fetchPartners();
  };

  const openRequest = async (request: PartnerRequest) => {
    setSelectedRequest(request);
    if (request.status === "unread") {
      await dynamicSupabase
        .from<PartnerRequest>("contact_messages")
        .update({ status: "read" })
        .eq("id", request.id);
      fetchRequests();
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Supprimer cette demande de partenariat ?")) return;
    const { error } = await dynamicSupabase
      .from<PartnerRequest>("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(getQueryErrorMessage(error));
      return;
    }
    if (selectedRequest?.id === id) setSelectedRequest(null);
    toast.success("Demande supprimée");
    fetchRequests();
  };

  const unreadCount = requests.filter((request) => request.status === "unread")
    .length;
  const showForm = isNew || editing;

  return (
    <AdminLayout>
      <div className="flex items-start justify-between mb-10 gap-4">
        <div>
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            Réseau
          </span>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Gestion des <span className="gradient-text">Partenaires</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {partners.filter((partner) => partner.is_active).length} partenaire(s)
            affiché(s) · {unreadCount} demande(s) non lue(s)
          </p>
        </div>
        <Button onClick={openNew} className="shadow-glow mt-2">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un partenaire
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
            <h2 className="text-lg font-heading font-semibold text-foreground">
              {isNew ? "Nouveau partenaire" : "Modifier le partenaire"}
            </h2>
            <button
              onClick={closeForm}
              className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Nom *
                  </label>
                  <Input
                    value={form.name}
                    placeholder="Nom du partenaire"
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Site web
                  </label>
                  <Input
                    value={form.website_url}
                    placeholder="https://exemple.org"
                    onChange={(event) =>
                      setForm({ ...form, website_url: event.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Description
                </label>
                <Textarea
                  value={form.description}
                  rows={5}
                  placeholder="Décrivez la collaboration ou le rôle du partenaire."
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <ImageUploader
                label="Logo du partenaire"
                value={form.logo_url}
                bucket="partner-logos"
                section="partners"
                onChange={(url) => setForm({ ...form, logo_url: url })}
              />

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Ordre d'affichage
                </label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(event) =>
                    setForm({ ...form, display_order: event.target.value })
                  }
                />
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-background">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    setForm({ ...form, is_active: event.target.checked })
                  }
                />
                <span className="text-sm text-foreground">
                  Afficher ce partenaire sur le site
                </span>
              </label>

              <Button onClick={handleSave} className="w-full shadow-glow">
                Enregistrer
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 premium-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-foreground">
              Partenaires affichés
            </h2>
            <span className="text-xs text-muted-foreground">
              Logos et informations publiques
            </span>
          </div>
          <table className="w-full">
            <thead className="bg-muted/40 border-b border-border/60">
              <tr>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Partenaire
                </th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                  Statut
                </th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner, index) => (
                <motion.tr
                  key={partner.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.04 }}
                  className="border-t border-border/60 hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt=""
                          className="w-12 h-12 rounded-lg object-contain bg-white border border-border/40 p-1 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate max-w-[220px]">
                          {partner.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                          {partner.website_url || "Aucun site web"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <button
                      onClick={() => toggleActive(partner)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                        partner.is_active
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {partner.is_active ? "Actif" : "Masqué"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      {partner.website_url && (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => openEdit(partner)}
                        className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(partner.id)}
                        className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {partners.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={3}
                    className="p-16 text-center text-muted-foreground"
                  >
                    <Handshake className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium mb-1">Aucun partenaire</p>
                    <p className="text-xs">
                      Ajoutez un partenaire avec son logo.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="xl:col-span-2 grid lg:grid-cols-2 xl:grid-cols-1 gap-6">
          <div className="premium-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border/60">
              <h2 className="font-heading font-semibold text-foreground">
                Demandes de partenariat
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Messages envoyés depuis le formulaire contact
              </p>
            </div>
            <div className="divide-y divide-border/60 max-h-[360px] overflow-y-auto">
              {requests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => openRequest(request)}
                  className={`w-full text-left p-4 hover:bg-muted/40 transition-colors ${
                    selectedRequest?.id === request.id
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {request.status === "unread" ? (
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <MailOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-sm font-medium text-foreground truncate">
                      {request.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate pl-6">
                    {request.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 pl-6">
                    {new Date(request.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </button>
              ))}
              {requests.length === 0 && (
                <div className="p-10 text-center text-muted-foreground">
                  <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Aucune demande reçue</p>
                </div>
              )}
            </div>
          </div>

          <div className="premium-card p-6 min-h-[260px]">
            {selectedRequest ? (
              <motion.div
                key={selectedRequest.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-heading font-semibold text-foreground">
                      {selectedRequest.name}
                    </h2>
                    <a
                      href={`mailto:${selectedRequest.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {selectedRequest.email}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteRequest(selectedRequest.id)}
                    className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  {new Date(selectedRequest.created_at).toLocaleString("fr-FR")}
                </p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedRequest.message}
                </p>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Sélectionnez une demande à lire</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
