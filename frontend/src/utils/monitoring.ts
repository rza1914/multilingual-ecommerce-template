// frontend/src/utils/monitoring.ts
export interface LogData {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
  timestamp?: Date;
  userId?: number | null;
}

export interface MonitoringConfig {
  enabled: boolean;
  endpoint?: string;
  sampleRate?: number; // 0 to 1, percentage of errors to send
  userId?: number | null;
}

class MonitoringService {
  private config: MonitoringConfig;
  private pendingLogs: LogData[] = [];

  constructor(config: MonitoringConfig) {
    this.config = {
      enabled: config.enabled ?? true,
      sampleRate: config.sampleRate ?? 1.0,
      endpoint: config.endpoint,
      userId: config.userId
    };
  }

  init(): void {
    // Set up error handlers
    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  private shouldSend(): boolean {
    return this.config.enabled && Math.random() < (this.config.sampleRate || 1.0);
  }

  private handleError = (event: ErrorEvent): void => {
    if (!this.shouldSend()) return;
    
    this.log({
      level: 'error',
      message: event.error?.message || event.message,
      context: {
        type: 'window.error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      },
      userId: this.config.userId
    });
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    if (!this.shouldSend()) return;
    
    this.log({
      level: 'error',
      message: event.reason?.message || String(event.reason),
      context: {
        type: 'unhandledrejection',
        reason: event.reason
      },
      userId: this.config.userId
    });
  };

  log(data: LogData): void {
    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date();
    }

    // In development, always log to console
    if (import.meta.env.MODE === 'development') {
      console[data.level]('Monitoring Log:', data);
    }

    // In production, send to endpoint if configured
    if (this.config.enabled && this.config.endpoint && this.shouldSend()) {
      this.sendLog(data);
    } else {
      // Store in memory for sending later (in case of offline or network issues)
      this.pendingLogs.push(data);
      if (this.pendingLogs.length > 100) { // Limit to prevent memory issues
        this.pendingLogs.shift();
      }
    }
  }

  private async sendLog(data: LogData): Promise<void> {
    // Don't send logs if monitoring is disabled to prevent 404 errors on Vercel
    if (!this.config.enabled || !this.config.endpoint) return;

    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Failed to send log to monitoring service:', error);
      // Store for retry
      this.pendingLogs.push(data);
    }
  }

  // Try to send stored logs when back online
  async flushPendingLogs(): Promise<void> {
    if (!this.config.enabled || !this.config.endpoint || this.pendingLogs.length === 0) return;

    const logsToSend = [...this.pendingLogs];
    this.pendingLogs = [];

    for (const log of logsToSend) {
      try {
        await this.sendLog(log);
      } catch (error) {
        // Put back in pending list if sending fails
        this.pendingLogs.push(log);
      }
    }
  }

  // Method to manually send an error
  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.shouldSend()) return;
    
    this.log({
      level: 'error',
      message: error.message,
      context: {
        ...context,
        stack: error.stack
      },
      userId: this.config.userId
    });
  }

  // Method to manually send a message
  captureMessage(message: string, level: 'info' | 'warn' | 'error' | 'debug' = 'info', context?: Record<string, any>): void {
    this.log({
      level,
      message,
      context,
      userId: this.config.userId
    });
  }
}

export const monitoringService = new MonitoringService({
  enabled: false, // Disabled to prevent 404 POST /api/logs error on Vercel
  endpoint: import.meta.env.VITE_MONITORING_ENDPOINT || '/api/logs',
  sampleRate: 1.0 // Send all errors in demo; in production you might want to sample
});