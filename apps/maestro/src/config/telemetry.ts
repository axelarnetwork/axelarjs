import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";

const APP_ID = String(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID);

export function initLogRocket() {
  if (typeof window !== "undefined") {
    LogRocket.init(APP_ID);
    // plugins should also only be initialized when in the browser
    setupLogRocketReact(LogRocket);
  }
}
