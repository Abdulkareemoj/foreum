import { db } from '$server/db';

export interface HealthCheck {
	status: 'healthy' | 'degraded' | 'unhealthy';
	timestamp: string;
	checks: {
		database: {
			status: 'ok' | 'error';
			latency?: number;
			error?: string;
		};
		server: {
			status: 'ok';
			uptime: number;
		};
	};
	version?: string;
}

const SERVER_START_TIME = Date.now();

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<HealthCheck['checks']['database']> {
	try {
		const start = Date.now();
		// Simple query to verify connection
		await db.execute('SELECT 1');
		const latency = Date.now() - start;
		return { status: 'ok', latency };
	} catch (error) {
		return {
			status: 'error',
			error: error instanceof Error ? error.message : 'Unknown database error'
		};
	}
}

/**
 * Perform comprehensive health check
 */
export async function performHealthCheck(): Promise<HealthCheck> {
	const dbCheck = await checkDatabase();

	const checks = {
		database: dbCheck,
		server: {
			status: 'ok' as const,
			uptime: Date.now() - SERVER_START_TIME
		}
	};

	const hasError = dbCheck.status === 'error';
	const status = hasError ? ('unhealthy' as const) : ('healthy' as const);

	return {
		status,
		timestamp: new Date().toISOString(),
		checks,
		version: '1.0.0'
	};
}

/**
 * Perform readiness check (can accept traffic)
 */
export async function performReadinessCheck(): Promise<HealthCheck> {
	const dbCheck = await checkDatabase();

	// App is ready if database is accessible
	const ready = dbCheck.status === 'ok';

	return {
		status: ready ? 'healthy' : 'unhealthy',
		timestamp: new Date().toISOString(),
		checks: {
			database: dbCheck,
			server: {
				status: 'ok',
				uptime: Date.now() - SERVER_START_TIME
			}
		}
	};
}
