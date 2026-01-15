import { initTRPC, TRPCError } from '@trpc/server';
import pino from 'pino';
import superjson from 'superjson';

import type { Context } from './context';

const t = initTRPC.context<Context>().create({
	transformer: superjson
});

// Structured pino logger (development: pretty print)
const logger = (() => {
	if (process.env.NODE_ENV === 'development') {
		// pretty-print transport for dev
		return pino({
			transport: {
				target: 'pino-pretty',
				options: { colorize: true }
			}
		});
	}
	return pino();
})();

// Development-only request/response logger middleware
const devLogger = t.middleware(async ({ path, type, input, next }) => {
	if (process.env.NODE_ENV !== 'development') return next();

	const start = Date.now();
	try {
		const result = await next();
		const duration = Date.now() - start;
		logger.debug(
			{ path, type, duration, input, output: result.ok ? result.data : null },
			'trpc call'
		);
		return result;
	} catch (err) {
		const duration = Date.now() - start;
		logger.error({ path, type, duration, err }, 'trpc error');
		throw err;
	}
});

// Export a devProcedure that routers can opt into for extra logging in development
export const devProcedure = t.procedure.use(devLogger);
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
// Use a base procedure that includes the devLogger in development so all procedures
// log request/response automatically without requiring opt-in.
const baseProcedure =
	process.env.NODE_ENV === 'development' ? t.procedure.use(devLogger) : t.procedure;
export const publicProcedure = baseProcedure;

const isAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	return next({
		ctx: {
			...ctx,
			user: ctx.user as NonNullable<typeof ctx.user>
		}
	});
});

export const protectedProcedure = baseProcedure.use(isAuthed);
