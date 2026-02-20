import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Static fallback posts (same as Blog.tsx)
const staticPosts: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}> = {
  "future-sustainable-sanitation": {
    slug: "future-sustainable-sanitation",
    title: "L'Avenir de l'Assainissement Durable en Afrique de l'Ouest",
    excerpt: "Explorer des approches innovantes pour l'hygiène communautaire et le développement d'infrastructures qui façonnent l'avenir de la santé publique dans la région.",
    category: "Innovation",
    date: "15 Janvier 2026",
    readTime: "5 min de lecture",
    content: `L'Afrique de l'Ouest fait face à des défis sanitaires majeurs, mais aussi à des opportunités sans précédent pour innover dans le domaine de l'assainissement durable.

Les approches traditionnelles ont montré leurs limites. Face à une urbanisation rapide et à des ressources limitées, les communautés ont besoin de solutions adaptées à leur réalité locale.

**Des innovations prometteuses**

Plusieurs technologies émergent comme des réponses concrètes : les toilettes à compostage qui transforment les déchets en ressources agricoles, les systèmes de collecte d'eau de pluie intégrés aux infrastructures sanitaires, et les plateformes numériques de suivi de la qualité de l'eau.

**Le rôle des communautés**

L'implication des communautés dans la conception et la gestion des infrastructures est un facteur clé de succès. Lorsque les habitants sont propriétaires de leurs solutions, la durabilité s'en trouve considérablement renforcée.

**Perspectives d'avenir**

Ecosense Solutions s'engage à continuer d'explorer et de déployer ces innovations, en partenariat avec les communautés locales, les gouvernements et les organisations internationales. L'avenir de l'assainissement en Afrique de l'Ouest passe par cette collaboration multisectorielle.`,
  },
  "community-engagement": {
    slug: "community-engagement",
    title: "Engagement Communautaire : Clé du Changement Durable",
    excerpt: "Comment l'implication locale et l'appropriation transforment les résultats en matière d'assainissement et créent un changement comportemental durable.",
    category: "Communauté",
    date: "10 Janvier 2026",
    readTime: "4 min de lecture",
    content: `L'expérience d'Ecosense Solutions sur le terrain a démontré une vérité fondamentale : les projets d'assainissement ne réussissent que lorsque les communautés en sont les protagonistes, pas les bénéficiaires passifs.

**Le changement vient de l'intérieur**

Quand une communauté s'approprie un projet — en participant à sa conception, sa construction et sa gestion — les résultats sont radicalement différents. Les infrastructures sont mieux entretenues, les pratiques d'hygiène sont adoptées plus rapidement et de manière plus durable.

**Nos méthodes d'engagement**

Nous travaillons avec des référents communautaires formés localement, qui deviennent des ambassadeurs du changement. Ces leaders comprennent les dynamiques sociales, les résistances culturelles et les leviers de motivation propres à leur environnement.

**Des résultats mesurables**

Dans les 44 villages où nous intervenons, nous avons observé une réduction significative des maladies hydriques et une augmentation du taux d'utilisation des infrastructures sanitaires, directement corrélées à l'intensité de l'engagement communautaire.`,
  },
  "waste-to-value": {
    slug: "waste-to-value",
    title: "Déchets en Valeur : Transformer les Défis en Opportunités",
    excerpt: "Pratiques innovantes de gestion des déchets qui créent de la valeur économique tout en protégeant l'environnement.",
    category: "Durabilité",
    date: "5 Janvier 2026",
    readTime: "6 min de lecture",
    content: `La gestion des déchets représente l'un des défis environnementaux les plus pressants, mais aussi l'une des opportunités économiques les plus sous-exploitées dans nos régions.

**De la contrainte à l'opportunité**

Chez Ecosense Solutions, nous avons développé une approche qui transforme les déchets organiques en compost de qualité, les plastiques récupérés en matériaux de construction, et les eaux usées traitées en ressource agricole.

**L'économie circulaire en pratique**

Cette approche circulaire crée non seulement de la valeur environnementale, mais aussi des emplois locaux et des revenus pour les communautés. Des coopératives de récupération emploient aujourd'hui plusieurs centaines de personnes dans notre zone d'intervention.

**Innovation technologique**

Nous intégrons des technologies adaptées au contexte local : biodigesteurs pour la valorisation énergétique des déchets organiques, plateformes de tri selectif, et unités de compostage communautaires.

**Impact mesuré**

En 2025, nos programmes ont détourné plus de 500 tonnes de déchets des décharges sauvages, généré des revenus supplémentaires pour 120 familles, et réduit les émissions de méthane de manière significative.`,
  },
  "hygiene-education-schools": {
    slug: "hygiene-education-schools",
    title: "L'Éducation à l'Hygiène dans les Écoles : Construire des Habitudes Saines Tôt",
    excerpt: "L'impact des programmes complets d'éducation à l'hygiène sur la santé des élèves et le bien-être communautaire.",
    category: "Santé",
    date: "28 Décembre 2025",
    readTime: "5 min de lecture",
    content: `Investir dans l'éducation à l'hygiène dès le plus jeune âge est l'un des leviers les plus puissants pour un changement durable. Les enfants sont non seulement les bénéficiaires directs, mais aussi des vecteurs de transformation au sein de leurs familles.

**Programme scolaire intégré**

Nos programmes couvrent le lavage des mains, la sécurité alimentaire, la gestion des déchets et la compréhension du cycle de l'eau. Ils sont conçus de manière ludique et participative pour maximiser l'engagement des élèves.

**Formation des enseignants**

Nous formons les enseignants comme premiers relais. Une formation solide leur permet d'intégrer ces thèmes naturellement dans les programmes existants, sans surcharger leur emploi du temps.

**Résultats dans nos écoles partenaires**

Les écoles participant à nos programmes ont enregistré une baisse de 35% des absences liées aux maladies gastro-intestinales et une amélioration notable des pratiques d'hygiène mesurées par nos équipes.`,
  },
  "sustainable-infrastructure": {
    slug: "sustainable-infrastructure",
    title: "Concevoir des Infrastructures d'Assainissement Durables",
    excerpt: "Meilleures pratiques pour construire des installations sanitaires durables et écologiques qui servent les communautés pendant des générations.",
    category: "Durabilité",
    date: "20 Décembre 2025",
    readTime: "7 min de lecture",
    content: `La durabilité d'une infrastructure sanitaire ne se mesure pas seulement à sa solidité physique, mais aussi à sa pertinence sociale, environnementale et économique sur le long terme.

**Principes de conception durable**

Chaque projet démarre par une analyse approfondie du contexte : ressources disponibles localement, pratiques culturelles, capacités de maintenance communautaire, et conditions climatiques. Cette analyse oriente des choix de conception qui favorisent la résilience.

**Matériaux et techniques adaptés**

Nous privilégions les matériaux locaux et les techniques accessibles pour les réparations. Une infrastructure qui nécessite des pièces importées ou une expertise extérieure pour sa maintenance est vouée à l'abandon.

**Participation à la construction**

En impliquant les communautés dans la construction, nous transférons les compétences nécessaires pour l'entretien futur. C'est aussi une source de fierté collective qui renforce l'appropriation.

**Suivi et accompagnement**

Nos équipes assurent un suivi régulier les 3 premières années après la livraison d'un ouvrage, période critique pour ancrer les bonnes pratiques de maintenance.`,
  },
  "partnership-impact": {
    slug: "partnership-impact",
    title: "Le Pouvoir des Partenariats en Santé Publique",
    excerpt: "Comment les approches collaboratives entre ONG, gouvernements et communautés amplifient les résultats de santé publique.",
    category: "Communauté",
    date: "15 Décembre 2025",
    readTime: "4 min de lecture",
    content: `Aucune organisation ne peut relever seule les défis de la santé publique dans nos régions. La collaboration entre acteurs de différentes natures est non seulement souhaitable, elle est indispensable.

**L'écosystème partenarial d'Ecosense**

Nous travaillons avec plus de 50 partenaires : ONG locales et internationales, agences gouvernementales, collectivités locales, entreprises privées, et organisations communautaires. Chacun apporte des ressources, une expertise et un réseau complémentaires.

**Modèles de partenariat gagnant-gagnant**

Les partenariats les plus efficaces sont ceux où chaque partie trouve un intérêt clair. Nous avons développé des modèles adaptés à chaque type de partenaire, qu'il s'agisse de co-financement, de mise à disposition d'expertise, de partage de réseaux, ou de plaidoyer conjoint.

**Coordination et transparence**

La coordination entre partenaires est souvent le maillon faible des projets multi-acteurs. Nous avons mis en place des outils de suivi partagés et des réunions régulières pour maintenir l'alignement et la confiance.

**Amplifier l'impact**

Notre réseau de 50+ partenaires nous permet d'intervenir dans 65% du territoire guinéen, un impact qui serait impossible à atteindre seuls. La multiplication des forces est la clé de notre portée.`,
  },
};

interface DBPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [dbPost, setDbPost] = useState<DBPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      setDbPost(data ?? null);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </Layout>
    );
  }

  // Prefer DB post, fallback to static
  const staticPost = slug ? staticPosts[slug] : null;

  if (!dbPost && !staticPost) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">Article introuvable</h1>
          <p className="text-muted-foreground">Cet article n'existe pas ou n'est pas encore publié.</p>
          <Button asChild variant="outline">
            <Link to="/blog"><ArrowLeft className="w-4 h-4 mr-2" />Retour au blog</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const title = dbPost?.title ?? staticPost!.title;
  const excerpt = dbPost?.excerpt ?? staticPost!.excerpt;
  const content = dbPost?.content ?? staticPost!.content;
  const category = staticPost?.category ?? "Article";
  const date = dbPost
    ? new Date(dbPost.published_at ?? dbPost.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : staticPost!.date;
  const readTime = staticPost?.readTime ?? `${Math.ceil((content?.split(" ").length ?? 100) / 200)} min de lecture`;

  // Render content with basic markdown-like formatting
  const renderContent = (text: string) => {
    return text.split("\n\n").map((paragraph, i) => {
      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        return (
          <h3 key={i} className="text-xl font-heading font-semibold text-foreground mt-8 mb-3">
            {paragraph.slice(2, -2)}
          </h3>
        );
      }
      // Inline bold
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-muted-foreground leading-relaxed mb-4">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>
            ) : part
          )}
        </p>
      );
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 hero-gradient">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                <Tag className="w-3 h-3" />
                {category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {date}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight mb-6">
              {title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {excerpt}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="section-container">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose-custom"
            >
              {content ? renderContent(content) : (
                <p className="text-muted-foreground">Contenu non disponible.</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pt-8 border-t border-border/60"
            >
              <Button asChild variant="outline">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tous les articles
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-10 text-center max-w-2xl mx-auto"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_50%)]" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-heading font-bold text-primary-foreground mb-3">
                Intéressé par nos solutions ?
              </h2>
              <p className="text-primary-foreground/80 mb-6 text-sm">
                Contactez notre équipe pour en savoir plus sur nos projets et partenariats.
              </p>
              <Button asChild variant="secondary" size="lg">
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
