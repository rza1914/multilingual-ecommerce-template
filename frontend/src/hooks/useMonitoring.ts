// frontend/src/hooks/useMonitoring.ts
import { monitoringService } from '../utils/monitoring';

export const useMonitoring = () => {
  const logInfo = (message: string, context?: Record<string, any>) => {
    monitoringService.log({
      level: 'info',
      message,
      context
    });
  };

  const logWarning = (message: string, context?: Record<string, any>) => {
    monitoringService.log({
      level: 'warn',
      message,
      context
    });
  };

  const logError = (error: Error | string, context?: Record<string, any>) => {
    if (typeof error === 'string') {
      monitoringService.captureMessage(error, 'error', context);
    } else {
      monitoringService.captureException(error, context);
    }
  };

  const logDebug = (message: string, context?: Record<string, any>) => {
    monitoringService.log({
      level: 'debug',
      message,
      context
    });
  };

  return {
    logInfo,
    logWarning,
    logError,
    logDebug,
    monitoringService
  };
};