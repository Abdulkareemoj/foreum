import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { generateHTML } from '@tiptap/html';
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

export function renderTipTap(content: any): string {
	if (!content) return '';

	try {
		return generateHTML(content, [
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
