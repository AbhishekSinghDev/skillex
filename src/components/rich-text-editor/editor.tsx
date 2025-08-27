"use client";

import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import Menubar from "./menubar";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = forwardRef<any, RichTextEditorProps>(
  ({ value, onChange }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ],
      content: value,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
        },
      },
      onUpdate({ editor }) {
        const editorStateJson = editor.getJSON();
        onChange(JSON.stringify(editorStateJson));
      },
    });

    useImperativeHandle(ref, () => editor, [editor]);

    useEffect(() => {
      if (editor && value) {
        try {
          const parsedContent =
            typeof value === "string" ? JSON.parse(value) : value;
          if (
            JSON.stringify(editor.getJSON()) !== JSON.stringify(parsedContent)
          ) {
            editor.commands.setContent(parsedContent);
          }
        } catch (error) {
          console.error("Error parsing editor content:", error);
        }
      }
    }, [editor, value]);

    return (
      <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
        <Menubar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
