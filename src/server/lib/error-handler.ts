import { TRPCError } from '@trpc/server';
import type { ZodError } from 'zod';

/**
 * Standardized error codes and messages for the application
 */
export const ERROR_MESSAGES: Record<string, string> = {
	// Auth errors
	UNAUTHORIZED: 'You must be logged in to perform this action',
	FORBIDDEN: 'You do not have permission to perform this action',
	INVALID_CREDENTIALS: 'Invalid email or password',
	EMAIL_NOT_VERIFIED: 'Please verify your email before signing in',
	USER_NOT_FOUND: 'User not found',

	// Resource errors
	NOT_FOUND: 'Resource not found',
	ALREADY_EXISTS: 'This resource already exists',
	CONFLICT: 'This action conflicts with an existing resource',

	// Validation errors
	BAD_REQUEST: 'Invalid request data',
	INVALID_INPUT: 'The provided input is invalid',

	// Server errors
	INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again later',
	SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
	TIMEOUT: 'Request timeout',

	// Business logic errors
	RATE_LIMITED: 'You are making requests too quickly. Please slow down',
	INVALID_STATE: 'Invalid operation for current state',
	INVALID_ACTION: 'This action cannot be performed',

	// Thread/content errors
	THREAD_LOCKED: 'This thread is locked and cannot be modified',
	THREAD_ARCHIVED: 'This thread has been archived',
	REPLY_NOT_FOUND: 'Reply not found',
	CATEGORY_NOT_FOUND: 'Category not found',

	// Group errors
	GROUP_NOT_FOUND: 'Group not found',
	GROUP_FULL: 'Group is at maximum capacity',
	ALREADY_MEMBER: 'You are already a member of this group',
	NOT_MEMBER: 'You are not a member of this group'
};

export type ErrorCode = keyof typeof ERROR_MESSAGES;

/**
 * Get user-friendly error message
 */
export function getUserMessage(code: string): string {
	return ERROR_MESSAGES[code as ErrorCode] || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
}

/**
 * Format Zod validation errors into user-friendly messages
 */
export function formatZodError(error: ZodError): Record<string, string> {
	const formatted: Record<string, string> = {};
	error.errors.forEach((err) => {
		const path = err.path.join('.');
		formatted[path] = err.message;
	});
	return formatted;
}

/**
 * Standardized error throwing helper
 */
export function throwTRPCError(code: TRPCError['code'], message?: string, cause?: unknown) {
	const userMessage = message || getUserMessage(code);
	throw new TRPCError({
		code,
		message: userMessage,
		cause
	});
}

/**
 * Safe operation wrapper for error handling
 */
export async function safeOperation<T>(
	operation: () => Promise<T>,
	errorCode: TRPCError['code'] = 'INTERNAL_SERVER_ERROR'
): Promise<T> {
	try {
		return await operation();
	} catch (error) {
		if (error instanceof TRPCError) throw error;
		console.error('Operation failed:', error);
		throwTRPCError(errorCode, undefined, error);
	}
}
