import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { generateHTML } from '@tiptap/html';
import type { JSONContent } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function normalizeUsername(username: string): string {
	return username
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-') // spaces -> dash
		.replace(/[^a-z0-9_-]/g, ''); // remove invalid chars
}

export const verificationTemplate = `<!DOCTYPE html>  
<html>  
<head>  
    <meta charset="utf-8">  
    <title>Verify Your Email</title>  
</head>  
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">  
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px;">  
        <h1 style="color: #333; text-align: center;">Verify Your Email Address</h1>  
        <p>Hello {{username}},</p>  
        <p>Please click the button below to verify your email address:</p>  
        <div style="text-align: center; margin: 30px 0;">  
            <a href="{{url}}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">  
                Verify Email  
            </a>  
        </div>  
    </div>  
</body>  
</html>`;

export const resetTemplate = `<!DOCTYPE html>  
<html>  
<head>  
    <meta charset="utf-8">  
    <title>Reset Your Password</title>  
</head>  
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">  
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px;">  
        <h1 style="color: #333; text-align: center;">Reset Your Password</h1>  
        <p>Hello {{username}},</p>  
        <p>We received a request to reset your password. Click the button below to reset it:</p>  
        <div style="text-align: center; margin: 30px 0;">  
            <a href="{{url}}" style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">  
                Reset Password  
            </a>  
        </div>  
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>  
    </div>  
</body>  
</html>`;

export const resetConfirmTemplate = `<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Password Reset Successful</title>
	</head>
	<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px">
		<div
			style="
				max-width: 600px;
				margin: 0 auto;
				background-color: white;
				padding: 20px;
				border-radius: 8px;
			"
		>
			<h1 style="color: #333; text-align: center">Password Reset Successful</h1>
			<p>Hello {{username}},</p>
			<p>Your password has been successfully reset. You can now sign in with your new password.</p>
			<p style="color: #999; font-size: 12px">
				If you didn't make this change, please contact support immediately.
			</p>
		</div>
	</body>
</html>
`;

export function renderTipTap(content: unknown): string {
	if (!content) return '';

	// If content is a string, it might already be HTML, plain text, or a
	// stringified TipTap JSON document. Handle each case.
	if (typeof content === 'string') {
		const trimmed = content.trim();

		// If it looks like HTML, return as-is (assume it's safe/already sanitized)
		if (trimmed.startsWith('<')) return content;

		// If it looks like JSON, try to parse and render
		if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
			try {
				const parsed = JSON.parse(trimmed);
				return generateHTML(parsed, [
					StarterKit,
					Link,
					Image,
					Table,
					TableRow,
					TableHeader,
					TableCell
				]);
			} catch (err) {
				console.error('Failed to parse TipTap JSON string:', err);
				// fall through to treat as plain text
			}
		}

		// Plain text: escape and wrap in a paragraph
		return `<p>${String(trimmed)
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')}</p>`;
	}

	// Otherwise assume it's already a TipTap JSON document/object
	try {
		// Normalize a few legacy or alternate shapes we've seen in the wild:
		// - { root: { children: [...] } }
		// - { type: 'root', children: [...] }
		// - { children: [...] } (no `content` key)
		let doc: unknown = content;

		if (typeof content === 'object' && content !== null) {
			const c = content as Record<string, unknown>;

			if (c.root && typeof c.root === 'object') {
				const maybeRoot = c.root as Record<string, unknown>;
				if (Array.isArray(maybeRoot.children)) {
					doc = { type: 'doc', content: maybeRoot.children };
				}
			} else if (c.type === 'root' && Array.isArray(c.children)) {
				doc = { type: 'doc', content: c.children };
			} else if (Array.isArray(c.children) && !('content' in c)) {
				doc = { type: 'doc', content: c.children };
			}
		}

		return generateHTML(doc as JSONContent, [
			StarterKit,
			Link,
			Image,
			Table,
			TableRow,
			TableHeader,
			TableCell
		]);
	} catch (err) {
		console.error('Failed to render TipTap JSON:', err);
		return '';
	}
}
