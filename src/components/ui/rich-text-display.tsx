import React from "react";
import { Descendant, Element, Text } from "slate";
import { richTextToPlainText } from "~/lib/rich-text-utils";

interface RichTextDisplayProps {
  content: string;
  className?: string;
  plainText?: boolean;
}

const ElementComponent = ({
  element,
  children,
}: {
  element: any;
  children: React.ReactNode;
}) => {
  switch (element.type) {
    case "heading-one":
      return <h1 className="text-2xl font-bold mb-4">{children}</h1>;
    case "heading-two":
      return <h2 className="text-xl font-bold mb-3">{children}</h2>;
    case "heading-three":
      return <h3 className="text-lg font-bold mb-2">{children}</h3>;
    case "blockquote":
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
          {children}
        </blockquote>
      );
    case "list-item":
      return (
        <ul className="list-disc list-inside my-2">
          <li>{children}</li>
        </ul>
      );
    case "numbered-list-item":
      return (
        <ol className="list-decimal list-inside my-2">
          <li>{children}</li>
        </ol>
      );
    case "link":
      return (
        <a
          href={element.url}
          className="text-blue-600 hover:text-blue-800 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    default:
      return <p className="mb-2">{children}</p>;
  }
};

const LeafComponent = ({ leaf }: { leaf: any }) => {
  let content = leaf.text;

  if (leaf.bold) {
    content = <strong>{content}</strong>;
  }

  if (leaf.italic) {
    content = <em>{content}</em>;
  }

  if (leaf.underline) {
    content = <u>{content}</u>;
  }

  if (leaf.strikethrough) {
    content = <s>{content}</s>;
  }

  if (leaf.code) {
    content = (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{content}</code>
    );
  }

  return <>{content}</>;
};

const renderNode = (node: Descendant): React.ReactNode => {
  if (Text.isText(node)) {
    return <LeafComponent leaf={node} />;
  }

  if (Element.isElement(node)) {
    return (
      <ElementComponent element={node}>
        {node.children.map((child, index) => (
          <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
        ))}
      </ElementComponent>
    );
  }

  return null;
};

export function RichTextDisplay({
  content,
  className,
  plainText = false,
}: RichTextDisplayProps) {
  if (plainText || !content) {
    return <span className={className}>{richTextToPlainText(content)}</span>;
  }

  try {
    const parsed = JSON.parse(content) as Descendant[];
    return (
      <div className={className}>
        {parsed.map((node, index) => (
          <React.Fragment key={index}>{renderNode(node)}</React.Fragment>
        ))}
      </div>
    );
  } catch {
    // Fallback to plain text if JSON parsing fails
    return <div className={className}>{content}</div>;
  }
}

export default RichTextDisplay;
