import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Code,
  Minus,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL du lien", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  }, [editor]);

  const addImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const ext = file.name.split(".").pop();
      const path = `inline/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("blog-covers")
        .upload(path, file, { cacheControl: "3600" });
      if (error) {
        toast.error("Échec de l'upload de l'image");
        return;
      }
      const { data } = supabase.storage.from("blog-covers").getPublicUrl(path);
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
    };
    input.click();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/30 rounded-t-lg">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Gras (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italique (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Souligné (Ctrl+U)"
      >
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Barré"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Code inline"
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>

      <span className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        active={editor.isActive("heading", { level: 2 })}
        title="Titre H2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        active={editor.isActive("heading", { level: 3 })}
        title="Titre H3"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <span className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Liste à puces"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Liste numérotée"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Citation"
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Séparateur"
      >
        <Minus className="w-4 h-4" />
      </ToolbarButton>

      <span className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        onClick={setLink}
        active={editor.isActive("link")}
        title="Insérer un lien"
      >
        <LinkIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={addImage} title="Insérer une image">
        <ImageIcon className="w-4 h-4" />
      </ToolbarButton>

      <span className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Annuler"
      >
        <Undo2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Rétablir"
      >
        <Redo2 className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl my-4 max-w-full h-auto",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Commencez à rédiger votre article...",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class:
          "prose-editor focus:outline-none min-h-[400px] px-4 py-3 text-foreground",
      },
    },
  });

  // Sync external value changes (e.g., when switching between articles)
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML() && value !== "") {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-border rounded-lg bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <style>{`
        .prose-editor p { margin: 0.5rem 0; line-height: 1.7; }
        .prose-editor h2 {
          font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.75rem;
          font-family: var(--font-heading, inherit);
        }
        .prose-editor h3 {
          font-size: 1.25rem; font-weight: 600; margin: 1.25rem 0 0.5rem;
          font-family: var(--font-heading, inherit);
        }
        .prose-editor ul, .prose-editor ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose-editor ul { list-style: disc; }
        .prose-editor ol { list-style: decimal; }
        .prose-editor li { margin: 0.25rem 0; }
        .prose-editor blockquote {
          border-left: 3px solid hsl(var(--primary) / 0.6);
          padding: 0.5rem 1rem; margin: 1rem 0;
          background: hsl(var(--primary) / 0.05);
          border-radius: 0 0.5rem 0.5rem 0;
          font-style: italic; color: hsl(var(--foreground) / 0.8);
        }
        .prose-editor code {
          background: hsl(var(--muted));
          padding: 0.1rem 0.35rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          color: hsl(var(--primary));
        }
        .prose-editor hr {
          border: 0; border-top: 1px solid hsl(var(--border));
          margin: 1.5rem 0;
        }
        .prose-editor a { color: hsl(var(--primary)); text-decoration: underline; }
        .prose-editor img { max-width: 100%; border-radius: 0.75rem; margin: 1rem 0; }
        .prose-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left; color: hsl(var(--muted-foreground));
          pointer-events: none; height: 0;
        }
      `}</style>
    </div>
  );
}
