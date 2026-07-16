import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import logoEcosense from "@/assets/logo-ecosense.jpg";

function safeNext(next: string | null): string | null {
  if (!next) return null;
  // Same-origin relative path only.
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));

  useEffect(() => {
    if (!authLoading && user) {
      if (next) {
        window.location.href = next;
      } else {
        navigate("/admin");
      }
    }
  }, [user, authLoading, navigate, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError("Email ou mot de passe incorrect.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient p-4 relative overflow-hidden">
      {/* Floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-72 h-72 rounded-full bg-primary/5 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
            style={{ left: `${10 + i * 22}%`, top: `${15 + (i % 2) * 40}%` }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            src={logoEcosense}
            alt="Ecosense"
            className="h-14 mx-auto mb-5 rounded-xl shadow-md"
          />
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Administration
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecosensesolutions.co"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full shadow-glow"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
