import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Use this whenever rendering user-generated or admin-generated HTML via dangerouslySetInnerHTML.
 */
export function sanitizeHTML(html: string): string {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: [
			'p', 'br', 'strong', 'em', 'u', 's', 'a', 'img',
			'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
			'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
			'table', 'thead', 'tbody', 'tr', 'th', 'td',
			'div', 'span', 'hr', 'figure', 'figcaption',
			'sub', 'sup', 'mark', 'abbr', 'details', 'summary',
		],
		ALLOWED_ATTR: [
			'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
			'class', 'id', 'title', 'colspan', 'rowspan',
			'data-value', 'data-label',
		],
		ALLOW_DATA_ATTR: false,
	});
}

/**
 * Sanitize HTML for search snippets.
 * Allows minimal formatting tags from ts_headline output.
 */
export function sanitizeSnippet(html: string): string {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: ['mark', 'b', 'em', 'span'],
		ALLOWED_ATTR: [],
	});
}
