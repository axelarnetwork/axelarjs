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

type LogArgs<T> =
  | [severity: LogSeverity]
  | [severity: LogSeverity, message: T, alwaysLog?: boolean];

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

  private logMessage<T>(...args: LogArgs<T>) {
    const [severity, message, alwaysLog] = args;
    if (message) {
      this.logMessage(severity, message, alwaysLog);
    } else {
      return (message: T, alwaysLog?: boolean) =>
        this.logMessage(severity, message, alwaysLog);
    }
  }

  public log = this.logMessage("log");
  public info = this.logMessage("info");
  public warn = this.logMessage("warn");
  public error = this.logMessage("error");
}

export const logger = new Logger();
