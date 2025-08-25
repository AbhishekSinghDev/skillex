"use client";

import { cn } from "@/lib/utils";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

const RichTextRenderer = ({ content, className }: RichTextRendererProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content ? JSON.parse(content) : "",
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
          "focus:outline-none",
          className
        ),
      },
    },
  });

  if (!content) {
    return <div className="text-muted-foreground">No content available</div>;
  }

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextRenderer;
