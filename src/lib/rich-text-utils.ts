import { Descendant, Element, Text } from "slate";

export function richTextToPlainText(content: string): string {
  if (!content) return "";

  try {
    const parsed = JSON.parse(content) as Descendant[];
    return extractTextFromNodes(parsed);
  } catch {
    return content;
  }
}

function extractTextFromNodes(nodes: Descendant[]): string {
  return nodes.reduce((text: string, node) => {
    if (Text.isText(node)) {
      return text + node.text;
    }

    if (Element.isElement(node) && node.children) {
      return text + extractTextFromNodes(node.children);
    }

    return text;
  }, "");
}

export function isRichTextEmpty(content: string): boolean {
  if (!content) return true;

  try {
    const parsed = JSON.parse(content) as Descendant[];
    const plainText = extractTextFromNodes(parsed);
    return plainText.trim().length === 0;
  } catch {
    return content.trim().length === 0;
  }
}

export function getRichTextCharacterCount(content: string): number {
  if (!content) return 0;

  try {
    const parsed = JSON.parse(content) as Descendant[];
    return extractTextFromNodes(parsed).length;
  } catch {
    return content.length;
  }
}
