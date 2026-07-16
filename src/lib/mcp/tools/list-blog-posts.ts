import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export default defineTool({
  name: "list_blog_posts",
  title: "Lister les articles de blog",
  description:
    "Liste les articles du blog Ecosense visibles pour l'utilisateur connecté (publiés, ou tous les articles si l'utilisateur est administrateur).",
  inputSchema: {
    status: z
      .enum(["published", "draft", "all"])
      .optional()
      .describe("Filtrer par statut. 'all' réservé aux administrateurs."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("Nombre maximum d'articles à retourner (défaut 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text", text: "Non authentifié." }],
        isError: true,
      };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, category, status, published_at, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (!status || status === "published") {
      query = query.eq("status", "published");
    } else if (status === "draft") {
      query = query.eq("status", "draft");
    }
    const { data, error } = await query;
    if (error) {
      return {
        content: [{ type: "text", text: error.message }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { posts: data ?? [] },
    };
  },
});
