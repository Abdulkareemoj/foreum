import React, { useCallback, useMemo } from "react";
import {
  createEditor,
  Transforms,
  Text,
  Editor,
  BaseEditor,
  Descendant,
  Element as SlateElement,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
  ReactEditor,
} from "slate-react";
import { withHistory } from "slate-history";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Undo,
  Redo,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Separator } from "./separator";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

type CustomElement = {
  type:
    | "paragraph"
    | "heading-one"
    | "heading-two"
    | "heading-three"
    | "blockquote"
    | "list-item"
    | "numbered-list-item"
    | "link";
  children: CustomText[];
  url?: string;
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  toolbarClassName?: string;
  contentClassName?: string;
  autoFocus?: boolean;
  id?: string;
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "blockquote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "list-item":
      return (
        <ul {...attributes}>
          <li>{children}</li>
        </ul>
      );
    case "numbered-list-item":
      return (
        <ol {...attributes}>
          <li>{children}</li>
        </ol>
      );
    case "link":
      return (
        <a href={element.url} {...attributes}>
          {children}
        </a>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let newChildren = children;

  if (leaf.bold) {
    newChildren = <strong>{newChildren}</strong>;
  }

  if (leaf.italic) {
    newChildren = <em>{newChildren}</em>;
  }

  if (leaf.underline) {
    newChildren = <u>{newChildren}</u>;
  }

  if (leaf.strikethrough) {
    newChildren = <s>{newChildren}</s>;
  }

  if (leaf.code) {
    newChildren = <code>{newChildren}</code>;
  }

  return <span {...attributes}>{newChildren}</span>;
};

interface ToolbarProps {
  editor: Editor;
  className?: string;
  disabled?: boolean;
}

function Toolbar({ editor, className, disabled }: ToolbarProps) {
  const isMarkActive = (format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format as keyof typeof marks] === true : false;
  };

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isBlockActive = (format: string) => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  };

  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(format);
    const isList = ["list-item", "numbered-list-item"].includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        ["list-item", "numbered-list-item"].includes(
          !Editor.isEditor(n) && SlateElement.isElement(n) ? n.type : "",
        ),
      split: true,
    });

    const newProperties: Partial<CustomElement> = {
      type: (isActive
        ? "paragraph"
        : isList
          ? "list-item"
          : format) as CustomElement["type"],
    };

    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block: CustomElement = {
        type: format as CustomElement["type"],
        children: [],
      };
      Transforms.wrapNodes(editor, block);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-md border bg-background p-1",
        className,
      )}
    >
      {/* Undo/Redo */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.undo()}
            disabled={disabled || !editor.undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.redo()}
            disabled={disabled || !editor.redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Text Formatting */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMark("bold")}
            disabled={disabled}
            data-state={isMarkActive("bold") ? "on" : "off"}
          >
            <Bold className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bold</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMark("italic")}
            disabled={disabled}
            data-state={isMarkActive("italic") ? "on" : "off"}
          >
            <Italic className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Italic</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMark("underline")}
            disabled={disabled}
            data-state={isMarkActive("underline") ? "on" : "off"}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Underline</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMark("strikethrough")}
            disabled={disabled}
            data-state={isMarkActive("strikethrough") ? "on" : "off"}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Strikethrough</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMark("code")}
            disabled={disabled}
            data-state={isMarkActive("code") ? "on" : "off"}
          >
            <Code className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Code</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Block Types */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleBlock("heading-one")}
            disabled={disabled}
            data-state={isBlockActive("heading-one") ? "on" : "off"}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 1</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleBlock("heading-two")}
            disabled={disabled}
            data-state={isBlockActive("heading-two") ? "on" : "off"}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 2</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleBlock("heading-three")}
            disabled={disabled}
            data-state={isBlockActive("heading-three") ? "on" : "off"}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 3</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleBlock("blockquote")}
            disabled={disabled}
            data-state={isBlockActive("blockquote") ? "on" : "off"}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Quote</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Lists */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleBlock("list-item")}
            disabled={disabled}
            data-state={isBlockActive("list-item") ? "on" : "off"}
          >
            <List className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bulleted List</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleBlock("numbered-list-item")}
            disabled={disabled}
            data-state={isBlockActive("numbered-list-item") ? "on" : "off"}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Numbered List</TooltipContent>
      </Tooltip>
    </div>
  );
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  className,
  disabled = false,
  readOnly = false,
  maxLength,
  showCharacterCount = false,
  toolbarClassName,
  contentClassName,
  autoFocus = false,
  id,
}: RichTextEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue = useMemo(() => {
    if (!value) return [{ type: "paragraph", children: [{ text: "" }] }];
    try {
      return JSON.parse(value);
    } catch {
      return [{ type: "paragraph", children: [{ text: value }] }];
    }
  }, [value]);

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      const serialized = JSON.stringify(newValue);
      onChange?.(serialized);
    },
    [onChange],
  );

  const characterCount = useMemo(() => {
    if (!value) return 0;
    try {
      const parsed = JSON.parse(value);
      return parsed.reduce((count: number, node: any) => {
        if (node.text) return count + node.text.length;
        if (node.children) {
          return (
            count +
            node.children.reduce((childCount: number, child: any) => {
              return childCount + (child.text || "").length;
            }, 0)
          );
        }
        return count;
      }, 0);
    } catch {
      return value.length;
    }
  }, [value]);

  const isMaxLengthReached = maxLength && characterCount >= maxLength;

  return (
    <div className={cn("relative w-full", className)}>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={handleChange}
      >
        <div className="flex flex-col space-y-2">
          <Toolbar
            editor={editor}
            className={toolbarClassName}
            disabled={disabled || readOnly}
          />

          <div className="relative">
            <Editable
              className={cn(
                "min-h-37.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                contentClassName,
                disabled && "cursor-not-allowed opacity-50",
                readOnly && "cursor-default",
              )}
              placeholder={placeholder}
              spellCheck
              autoFocus={autoFocus}
              readOnly={readOnly || disabled}
              renderElement={Element}
              renderLeaf={Leaf}
            />
          </div>

          {showCharacterCount && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {characterCount} character{characterCount !== 1 ? "s" : ""}
                {maxLength && ` / ${maxLength}`}
              </span>
              {isMaxLengthReached && (
                <span className="text-destructive">
                  Maximum character limit reached
                </span>
              )}
            </div>
          )}
        </div>
      </Slate>
    </div>
  );
}

export default RichTextEditor;
