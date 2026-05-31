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
  Edit,
  Eye,
  ImageIcon,
  Plus,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  features: string[] | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  image_url: "",
  features: "",
  display_order: "0",
  is_active: true,
};

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const splitFeatures = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export default function AdminServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchServices = async () => {
    const { data, error } = await dynamicSupabase
      .from<ServiceItem>("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Impossible de charger les services");
    }
    setServices(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openNew = () => {
    setIsNew(true);
    setEditing(null);
    setForm({
      ...emptyForm,
      display_order: String(services.length + 1),
    });
  };

  const openEdit = (service: ServiceItem) => {
    setIsNew(false);
    setEditing(service);
    setForm({
      title: service.title,
      slug: service.slug,
      description: service.description ?? "",
      image_url: service.image_url ?? "",
      features: (service.features ?? []).join("\n"),
      display_order: String(service.display_order ?? 0),
      is_active: service.is_active,
    });
  };

  const closeForm = () => {
    setIsNew(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Le titre du service est requis");
      return;
    }

    const payload: Partial<ServiceItem> = {
      title: form.title.trim(),
      slug: form.slug.trim() || generateSlug(form.title),
      description: form.description.trim() || null,
      image_url: form.image_url || null,
      features: splitFeatures(form.features),
      display_order: Number(form.display_order) || 0,
      is_active: form.is_active,
    };

    const query = isNew
      ? dynamicSupabase.from<ServiceItem>("services").insert(payload)
      : dynamicSupabase
          .from<ServiceItem>("services")
          .update(payload)
          .eq("id", editing?.id);

    const { error } = await query;
    if (error) {
      toast.error(getQueryErrorMessage(error));
      return;
    }

    toast.success(isNew ? "Service ajouté" : "Service mis à jour");
    closeForm();
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce service ?")) return;
    const { error } = await dynamicSupabase
      .from<ServiceItem>("services")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(getQueryErrorMessage(error));
      return;
    }
    toast.success("Service supprimé");
    fetchServices();
  };

  const toggleActive = async (service: ServiceItem) => {
    const { error } = await dynamicSupabase
      .from<ServiceItem>("services")
      .update({ is_active: !service.is_active })
      .eq("id", service.id);

    if (error) {
      toast.error(getQueryErrorMessage(error));
      return;
    }
    fetchServices();
  };

  const showForm = isNew || editing;

  return (
    <AdminLayout>
      <div className="flex items-start justify-between mb-10 gap-4">
        <div>
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            Catalogue
          </span>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Gestion des <span className="gradient-text">Services</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {services.filter((service) => service.is_active).length} actif(s) ·{" "}
            {services.length} service(s) au total
          </p>
        </div>
        <Button onClick={openNew} className="shadow-glow mt-2">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un service
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
              {isNew ? "Nouveau service" : "Modifier le service"}
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
                    Titre *
                  </label>
                  <Input
                    value={form.title}
                    placeholder="Ex: Gestion des déchets"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        title: event.target.value,
                        slug: generateSlug(event.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Identifiant URL
                  </label>
                  <Input
                    value={form.slug}
                    placeholder="gestion-des-dechets"
                    className="font-mono text-sm"
                    onChange={(event) =>
                      setForm({ ...form, slug: event.target.value })
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
                  placeholder="Décrivez le service, son objectif et son impact."
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Points clés
                </label>
                <Textarea
                  value={form.features}
                  rows={6}
                  placeholder={"Un point par ligne\nCollecte et tri\nSuivi qualité"}
                  onChange={(event) =>
                    setForm({ ...form, features: event.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <ImageUploader
                label="Photo du service"
                value={form.image_url}
                bucket="service-images"
                section="services"
                onChange={(url) => setForm({ ...form, image_url: url })}
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
                  Afficher ce service sur le site
                </span>
              </label>

              <Button onClick={handleSave} className="w-full shadow-glow">
                Enregistrer
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="premium-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/40 border-b border-border/60">
            <tr>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Service
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                Points clés
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
            {services.map((service, index) => (
              <motion.tr
                key={service.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                className="border-t border-border/60 hover:bg-muted/20 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt=""
                        className="w-14 h-10 rounded-lg object-cover border border-border/40 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-10 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate max-w-[240px]">
                        {service.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        #{service.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                  {(service.features ?? []).slice(0, 2).join(" · ") || "Aucun"}
                </td>
                <td className="p-4 hidden md:table-cell">
                  <button
                    onClick={() => toggleActive(service)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                      service.is_active
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {service.is_active ? "Actif" : "Masqué"}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/services#${service.slug}`}
                      target="_blank"
                      className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openEdit(service)}
                      className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {services.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={4}
                  className="p-16 text-center text-muted-foreground"
                >
                  <Settings2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium mb-1">Aucun service enregistré</p>
                  <p className="text-xs">
                    Ajoutez votre premier service avec sa photo.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
