import * as Sentry from "@sentry/react";
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

export function initSentry() {
  if (typeof window !== "undefined") {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing({
          // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
          tracePropagationTargets: [
            "localhost",
            String(process.env.NEXT_PUBLIC_VERCEL_URL),
          ],
        }),
        new Sentry.Replay(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  }
}
