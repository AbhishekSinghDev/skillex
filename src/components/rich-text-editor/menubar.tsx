"use client";

import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

interface ToolbarItem {
  id: string;
  title: string;
  icon: LucideIcon;
  command: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}

interface MenubarProps {
  editor: Editor | null;
  className?: string;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const notificationVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: -10 },
  exit: { opacity: 0, y: -20 },
};

const lineVariants = {
  initial: { scaleX: 0, x: "-50%" },
  animate: {
    scaleX: 1,
    x: "0%",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    scaleX: 0,
    x: "50%",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const transition = { type: "spring", bounce: 0, duration: 0.4 };

const Menubar = ({ editor, className }: MenubarProps) => {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [activeNotification, setActiveNotification] = React.useState<
    string | null
  >(null);

  if (!editor) return null;

  const toolbarItems: ToolbarItem[] = [
    {
      id: "bold",
      title: "Bold",
      icon: Bold,
      command: (editor) => editor.chain().focus().toggleBold().run(),
      isActive: (editor) => editor.isActive("bold"),
    },
    {
      id: "italic",
      title: "Italic",
      icon: Italic,
      command: (editor) => editor.chain().focus().toggleItalic().run(),
      isActive: (editor) => editor.isActive("italic"),
    },
    {
      id: "underline",
      title: "Underline",
      icon: Underline,
      command: (editor) => editor.chain().focus().toggleUnderline().run(),
      isActive: (editor) => editor.isActive("underline"),
    },
    {
      id: "strike",
      title: "Strikethrough",
      icon: Strikethrough,
      command: (editor) => editor.chain().focus().toggleStrike().run(),
      isActive: (editor) => editor.isActive("strike"),
    },
    {
      id: "heading1",
      title: "Heading 1",
      icon: Heading1,
      command: (editor) =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 1 }),
    },
    {
      id: "heading2",
      title: "Heading 2",
      icon: Heading2,
      command: (editor) =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 2 }),
    },
    {
      id: "heading3",
      title: "Heading 3",
      icon: Heading3,
      command: (editor) =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 3 }),
    },
    {
      id: "alignLeft",
      title: "Align Left",
      icon: AlignLeft,
      command: (editor) => editor.chain().focus().setTextAlign("left").run(),
      isActive: (editor) => editor.isActive({ textAlign: "left" }),
    },
    {
      id: "alignCenter",
      title: "Align Center",
      icon: AlignCenter,
      command: (editor) => editor.chain().focus().setTextAlign("center").run(),
      isActive: (editor) => editor.isActive({ textAlign: "center" }),
    },
    {
      id: "alignRight",
      title: "Align Right",
      icon: AlignRight,
      command: (editor) => editor.chain().focus().setTextAlign("right").run(),
      isActive: (editor) => editor.isActive({ textAlign: "right" }),
    },
    {
      id: "bulletList",
      title: "Bullet List",
      icon: List,
      command: (editor) => editor.chain().focus().toggleBulletList().run(),
      isActive: (editor) => editor.isActive("bulletList"),
    },
    {
      id: "orderedList",
      title: "Numbered List",
      icon: ListOrdered,
      command: (editor) => editor.chain().focus().toggleOrderedList().run(),
      isActive: (editor) => editor.isActive("orderedList"),
    },
    {
      id: "blockquote",
      title: "Quote",
      icon: Quote,
      command: (editor) => editor.chain().focus().toggleBlockquote().run(),
      isActive: (editor) => editor.isActive("blockquote"),
    },
    {
      id: "code",
      title: "Code",
      icon: Code,
      command: (editor) => editor.chain().focus().toggleCode().run(),
      isActive: (editor) => editor.isActive("code"),
    },
    {
      id: "undo",
      title: "Undo",
      icon: Undo,
      command: (editor) => editor.chain().focus().undo().run(),
      isActive: () => false,
    },
    {
      id: "redo",
      title: "Redo",
      icon: Redo,
      command: (editor) => editor.chain().focus().redo().run(),
      isActive: () => false,
    },
  ];

  const handleItemClick = (item: ToolbarItem) => {
    item.command(editor);
    const isCurrentlyActive = item.isActive(editor);
    setSelected(isCurrentlyActive ? item.id : null);
    setActiveNotification(item.id);
    setTimeout(() => setActiveNotification(null), 1500);
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex items-center gap-3 p-2 relative",
          "bg-background",
          "border-t-0 border-x-0",
          "transition-all duration-200",
          className
        )}
      >
        <AnimatePresence>
          {activeNotification && (
            <motion.div
              variants={notificationVariants as any}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs">
                {
                  toolbarItems.find((item) => item.id === activeNotification)
                    ?.title
                }{" "}
                applied!
              </div>
              <motion.div
                variants={lineVariants as any}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute -bottom-1 left-1/2 w-full h-[2px] bg-primary origin-left"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 flex-wrap">
          {toolbarItems.map((item) => {
            const isActive = item.isActive(editor);
            return (
              <motion.button
                key={item.id}
                type="button"
                variants={buttonVariants as any}
                initial={false}
                animate="animate"
                custom={isActive}
                onClick={() => handleItemClick(item)}
                transition={transition as any}
                className={cn(
                  "relative flex items-center rounded-none px-3 py-2",
                  "text-xs font-medium transition-colors duration-300",
                  isActive
                    ? "bg-primary rounded"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon size={16} className={cn(isActive && "text-white")} />
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      variants={spanVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={transition as any}
                      className="overflow-hidden text-nowrap"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Menubar;
