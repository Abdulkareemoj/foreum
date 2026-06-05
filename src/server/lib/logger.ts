import pino from 'pino'

const isDev = process.env.NODE_ENV !== 'production'

export const rootLogger = pino({
	level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
	...(
		isDev
			? {
					transport: {
						target: 'pino-pretty',
						options: { colorize: true, translateTime: 'HH:MM:ss.l' },
					},
				}
			: {}
	),
})

export function createLogger(namespace: string) {
	return rootLogger.child({ namespace })
}
