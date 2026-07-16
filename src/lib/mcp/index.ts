import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listBlogPosts from "./tools/list-blog-posts";
import getBlogPost from "./tools/get-blog-post";
import createContactMessage from "./tools/create-contact-message";
import listContactMessages from "./tools/list-contact-messages";

const projectRef =
  import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "ecosense-mcp",
  title: "Ecosense Solutions",
  version: "0.1.0",
  instructions:
    "Outils Ecosense Solutions : consulter les articles du blog, envoyer un message de contact, et — pour les administrateurs — consulter les messages reçus. Toutes les actions s'exécutent au nom de l'utilisateur connecté (RLS appliquée).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listBlogPosts, getBlogPost, createContactMessage, listContactMessages],
});
