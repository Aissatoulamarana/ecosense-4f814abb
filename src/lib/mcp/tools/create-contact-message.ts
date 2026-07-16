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
  name: "create_contact_message",
  title: "Envoyer un message de contact",
  description:
    "Enregistre un nouveau message de contact pour Ecosense Solutions (nom, email, sujet, message).",
  inputSchema: {
    name: z.string().trim().min(1).max(200),
    email: z.string().trim().email(),
    subject: z.string().trim().max(300).optional(),
    message: z.string().trim().min(1).max(5000),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ name, email, subject, message }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text", text: "Non authentifié." }],
        isError: true,
      };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("contact_messages")
      .insert({ name, email, subject: subject ?? null, message })
      .select()
      .maybeSingle();
    if (error) {
      return {
        content: [{ type: "text", text: error.message }],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `Message enregistré (id: ${data?.id ?? "?"}).`,
        },
      ],
      structuredContent: { message: data },
    };
  },
});
