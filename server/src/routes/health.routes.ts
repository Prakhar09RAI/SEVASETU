import { Router } from 'express';
import type { Request, Response } from 'express';
import type { ApiResponse, HealthStatus } from '@sevasetu/shared';
import { config } from '../config/index.js';
import { checkDatabaseConnection } from '../config/database.js';

export const healthRouter = Router();

/**
 * Liveness Probe: Quick check that the process is running and responding.
 */
healthRouter.get('/health/live', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Readiness Probe: Checks that critical dependencies (PostgreSQL) are operational.
 * Returns HTTP 503 if database is disconnected to prevent routing traffic to degraded containers.
 */
healthRouter.get('/health/ready', async (_req: Request, res: Response) => {
  const dbHealth = await checkDatabaseConnection();
  if (!dbHealth.connected) {
    res.status(503).json({
      success: false,
      status: 'not_ready',
      message: 'PostgreSQL database is disconnected or unreachable.',
      database: dbHealth,
    });
    return;
  }

  res.status(200).json({
    success: true,
    status: 'ready',
    timestamp: new Date().toISOString(),
    database: dbHealth,
  });
});

/**
 * Full Telemetry Endpoint: Returns comprehensive system, database, and process telemetry.
 */
healthRouter.get('/health', async (_req: Request, res: Response<ApiResponse<HealthStatus>>) => {
  const dbHealth = await checkDatabaseConnection();
  const isHealthy = dbHealth.connected;

  const healthData: HealthStatus = {
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: config.nodeEnv,
    service: 'sevasetu-api',
    version: '1.0.0',
    database: dbHealth,
  };

  const statusCode = isHealthy ? 200 : 503;
  res.status(statusCode).json({
    success: isHealthy,
    data: healthData,
    message: isHealthy
      ? 'All systems fully operational'
      : 'Service operational with degraded components: PostgreSQL is not connected',
  });
});

