import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createLogger } from '~/server/lib/logger'

export const paginationInputSchema = z.object({
	limit: z.number().min(1).max(100).default(25),
	offset: z.number().min(0).default(0),
})

export const paginationOutputSchema = z.object({
	total: z.number(),
})

export type PaginationInput = z.infer<typeof paginationInputSchema>

export function apiError(code: 'NOT_FOUND' | 'FORBIDDEN' | 'BAD_REQUEST' | 'CONFLICT' | 'INTERNAL_SERVER_ERROR', message: string) {
	return new TRPCError({ code, message })
}

export async function procedure<T>(namespace: string, fn: () => Promise<T>): Promise<T> {
	const logger = createLogger(namespace)
	try {
		return await fn()
	} catch (error) {
		if (error instanceof TRPCError) throw error
		logger.error({ err: error }, 'Procedure failed')
		throw new TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'An unexpected error occurred',
		})
	}
}
