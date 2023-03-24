export type LogSeverity = "log" | "info" | "warn" | "error";

export const getLogger = (severity: LogSeverity) => {
  switch (severity) {
    case "info":
      return console.log;
    case "warn":
      return console.warn;
    case "error":
      return console.error;
    default:
      return console.log;
  }
};

export type LoggerConfig = {
  env: "development" | "production" | "test";
  getLogger?: typeof getLogger;
};

type LogArgs<T extends unknown[]> =
  | [severity: LogSeverity, alwaysLog: boolean | undefined]
  | [severity: LogSeverity, alwaysLog: boolean | undefined, message: T];

class Logger {
  isDevEnviroment: boolean = false;

  public configure(config: LoggerConfig) {
    this.isDevEnviroment = ["development", "dev"].includes(config.env);
  }

  public static init(config: LoggerConfig) {
    const logger = new Logger();
    logger.configure(config);
    return logger;
  }

  private logMessage<T extends unknown[]>(...args: LogArgs<T>) {
    const [severity, alwaysLog, message] = args;

    if (message && message) {
      const logger = getLogger(severity);
      logger(...message);
    } else {
      return (...messages: T) => this.logMessage(severity, alwaysLog, messages);
    }
  }

  public log = this.logMessage("log", false);
  public info = this.logMessage("info", false);
  public warn = this.logMessage("warn", false);
  public error = this.logMessage("error", false);

  public always = {
    log: this.logMessage("log", true),
    info: this.logMessage("info", true),
    warn: this.logMessage("warn", true),
    error: this.logMessage("error", true),
  } as {
    [key in LogSeverity]: <T extends unknown[]>(...message: T) => void;
  };
}

export const logger = new Logger();
