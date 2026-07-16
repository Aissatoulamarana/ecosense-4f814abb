import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Loader2 } from "lucide-react";

// Local typed wrapper for the beta supabase.auth.oauth namespace.
type OAuthResult = {
  data: {
    client?: { name?: string; client_id?: string; redirect_uris?: string[] };
    scope?: string;
    redirect_url?: string;
    redirect_to?: string;
  } | null;
  error: { message: string } | null;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authOAuth = (supabase.auth as any).oauth as {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<OAuthResult["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Paramètre authorization_id manquant.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/admin/login?next=" + encodeURIComponent(next);
        return;
      }
      try {
        const { data, error } = await authOAuth.getAuthorizationDetails(
          authorizationId,
        );
        if (!active) return;
        if (error) {
          setError(error.message);
          return;
        }
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    try {
      const { data, error } = approve
        ? await authOAuth.approveAuthorization(authorizationId)
        : await authOAuth.denyAuthorization(authorizationId);
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setError("Aucune URL de redirection renvoyée.");
        setBusy(false);
        return;
      }
      window.location.href = target;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold">Autorisation d'accès</h1>
            <p className="text-xs text-muted-foreground">
              Connecter une application à votre compte Ecosense
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            {error}
          </div>
        )}

        {!details && !error && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-6">
            <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
          </div>
        )}

        {details && (
          <>
            <p className="text-sm text-foreground mb-4">
              <strong>{details.client?.name ?? "Une application"}</strong> demande
              à se connecter à Ecosense Solutions en votre nom.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 mb-6 list-disc list-inside">
              <li>Cette application pourra utiliser les outils Ecosense en tant que vous.</li>
              <li>
                Les politiques d'accès (RLS) de l'application continuent de
                s'appliquer.
              </li>
              {details.scope && (
                <li>
                  Portées demandées :{" "}
                  <code className="text-xs">{details.scope}</code>
                </li>
              )}
            </ul>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => decide(true)}
                disabled={busy}
                className="flex-1"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Autoriser"}
              </Button>
              <Button
                onClick={() => decide(false)}
                disabled={busy}
                variant="outline"
                className="flex-1"
              >
                Refuser
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
