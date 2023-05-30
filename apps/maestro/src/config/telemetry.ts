import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";

export const LOGROCKET_APP_ID = String(
  process.env.NEXT_PUBLIC_LOGROCKET_APP_ID
);

export const SENTRY_DSN = String(process.env.NEXT_PUBLIC_SENTRY_DSN);

export function initLogRocket() {
  if (typeof window !== "undefined") {
    LogRocket.init(LOGROCKET_APP_ID);
    // plugins should also only be initialized when in the browser
    setupLogRocketReact(LogRocket);
  }
}

export function logError(error: Error) {
  if (typeof window !== "undefined") {
    LogRocket.captureException(error);
  }
}
