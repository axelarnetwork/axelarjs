export type LogSeverity = "log" | "info" | "warn" | "error";

export const getLogger = (severity: LogSeverity) => {
  switch (severity) {
    case "info":
      return console.log;
    case "warn":
      return console.warn;
    case "error":
      return console.warn;
    default:
      return console.log;
  }
};

export type LoggerConfig = {
  env: "development" | "production" | "test";
  getLogger?: typeof getLogger;
};

type LogArgs<T extends unknown[]> =
  | [severity: LogSeverity, logFrequency: LogFrequency | undefined]
  | [severity: LogSeverity, logFrequency: LogFrequency | undefined, message: T];

type LoggerFn = <T extends unknown[]>(...message: T) => void;

const PREFIXES: Record<LogSeverity, string> = {
  log: "⚡ :",
  info: "💡 :",
  warn: "💣 :",
  error: "💥 :",
};

type LogFrequency = "always" | "once" | "default";

class Logger {
  isDevEnviroment: boolean = false;

  // Tracks keys that have been logged once
  ackedKeys = new Set<string>();

  public configure(config: LoggerConfig) {
    this.isDevEnviroment = ["development", "dev"].includes(config.env);
  }

  public static init(config: LoggerConfig) {
    const logger = new Logger();
    logger.configure(config);
    return logger;
  }

  private logMessage<T extends unknown[]>(...args: LogArgs<T>) {
    const [severity, frequency, message] = args;

    if (message) {
      const logger = getLogger(severity);
      const prefix = PREFIXES[severity];

      if (frequency === "once") {
        // Only log once
        const key = JSON.stringify(message);
        if (this.ackedKeys.has(key)) return;
        this.ackedKeys.add(key);
      }

      if (frequency === "default") {
        // Only log in dev enviroment
        if (!this.isDevEnviroment) return;
      }

      logger(prefix, ...message);
    } else {
      return (...messages: T) => this.logMessage(severity, frequency, messages);
    }
  }

  public log = this.logMessage("log", "default") as LoggerFn;
  public info = this.logMessage("info", "default") as LoggerFn;
  public warn = this.logMessage("warn", "default") as LoggerFn;
  public error = this.logMessage("error", "default") as LoggerFn;

  public always = {
    log: this.logMessage("log", "always"),
    info: this.logMessage("info", "always"),
    warn: this.logMessage("warn", "always"),
    error: this.logMessage("error", "always"),
  } as Record<LogSeverity, LoggerFn>;

  public once = {
    log: this.logMessage("log", "once"),
    info: this.logMessage("info", "once"),
    warn: this.logMessage("warn", "once"),
    error: this.logMessage("error", "once"),
  } as Record<LogSeverity, LoggerFn>;
}

export const logger = new Logger();
