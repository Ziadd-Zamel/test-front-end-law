"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Underline as UnderlineIcon,
} from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  className?: string;
}

export default function TextEditor({
  value,
  onChange,
  placeholder = "Start writing here...",
  minHeight = "7rem",
  disabled = false,
  className = "",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none p-3`,
        style: `min-height: ${minHeight}`,
      },
      transformPastedHTML(html) {
        // Strip all HTML tags and only keep text content
        const temp = document.createElement("div");
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || "";
      },
      handlePaste(view, event) {
        // Get plain text from clipboard
        const text = event.clipboardData?.getData("text/plain");
        if (text) {
          event.preventDefault();
          // Insert as plain text
          view.dispatch(view.state.tr.insertText(text));
          return true;
        }
        return false;
      },
      handleKeyDown(view, event) {
        // Block all code-related characters
        const blockedKeys = ["<", ">", "{", "}", "[", "]", "`", "$", "\\"];
        if (blockedKeys.includes(event.key)) {
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
  });

  if (!editor) return null;

  return (
    <div
      className={`border rounded-md overflow-hidden ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        {/* Bold */}
        {/* <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("bold") ? "bg-gray-300" : ""
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button> */}

        {/* Italic */}
        {/* <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("italic") ? "bg-gray-300" : ""
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button> */}

        {/* Underline */}
        {/* <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("underline") ? "bg-gray-300" : ""
          }`}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button> */}

        {/* <div className="w-px h-6 bg-gray-300 mx-1" /> */}

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("bulletList") ? "bg-gray-300" : ""
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("orderedList") ? "bg-gray-300" : ""
          }`}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        {/* <div className="w-px h-6 bg-gray-300 mx-1" /> */}

        {/* Alignment */}
        {/* <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align Left"
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : ""
          }`}
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : ""
          }`}
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Align Right"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : ""
          }`}
        >
          <AlignRight className="h-4 w-4" />
        </button> */}
      </div>

      {/* Editor Content */}
      <EditorContent dir="rtl" editor={editor} />
    </div>
  );
}
