import type MaestroKVClient from "~/services/db/kv/MaestroKVClient";

const SLACK_WEBHOOK_URL = process.env.WEBHOOK_SLACK_INFO_ALERTS_ITS_CHANNEL;

function getWebhookUrl(): string | null {
  if (!SLACK_WEBHOOK_URL) {
    console.warn(
      "WEBHOOK_SLACK_INFO_ALERTS_ITS_CHANNEL environment variable is not set"
    );
    return null;
  }

  return SLACK_WEBHOOK_URL;
}

/**
 * Send a notification to Slack about RPC node issues
 * @param chainName The name of the chain with the problematic RPC node
 * @param status The status of the RPC node (down or timeout)
 * @param url The URL of the RPC node
 * @param environment The environment (mainnet, testnet, etc.)
 */
export async function sendRpcNodeIssueNotification(
  chainName: string,
  status: "down" | "timeout",
  url: string,
  environment: string
): Promise<void> {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    console.warn(
      `Slack webhook URL not available for environment: ${environment}. Skipping RPC issue notification.`
    );
    return;
  }

  // Create a message with relevant information
  const message = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `⚠️ RPC Node Issue: ${chainName} (${environment})`,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Chain:*\n${chainName}`,
          },
          {
            type: "mrkdwn",
            text: `*Status:*\n${status === "down" ? "🔴 Down" : "🟡 ⏱️ Timeout (25s)"}`,
          },
          {
            type: "mrkdwn",
            text: `*Environment:*\n${environment}`,
          },
          {
            type: "mrkdwn",
            text: `*Time:*\n${new Date().toISOString()}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*RPC URL:*\n\`${url}\``,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Sent from Axelar Maestro RPC Health Monitoring`,
          },
        ],
      },
    ],
  };

  try {
    // Send the notification to Slack
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error(
        "Failed to send Slack notification:",
        await response.text()
      );
    }
  } catch (error) {
    console.error("Error sending Slack notification:", error);
  }
}

/**
 * Minimum time between notifications for the same RPC node issue (in seconds)
 * Default: 30 minutes
 */
const NOTIFICATION_COOLDOWN_SECONDS = 30 * 60;

/**
 * Send a notification to Slack about RPC node issues, with rate limiting
 * to prevent notification spam using Vercel KV for persistence
 */
export async function sendRpcNodeIssueNotificationWithRateLimit(
  chainName: string,
  status: "down" | "timeout",
  url: string,
  environment: string,
  kvClient?: MaestroKVClient
): Promise<void> {
  if (!kvClient) {
    console.warn(
      "KV client not provided, sending notification without rate limiting"
    );
    await sendRpcNodeIssueNotification(chainName, status, url, environment);
    return;
  }

  // Create a cache key for the notification cooldown
  // Format: notification:rpc-health:{env}:{chainName}
  const cacheKey = `notification:rpc-health:${environment}:${chainName}`;

  try {
    // Check if we've sent a notification recently
    const lastNotification = await kvClient.getCached<{ timestamp: number }>(
      cacheKey
    );

    if (lastNotification) {
      const now = Date.now();
      const elapsedSeconds = (now - lastNotification.timestamp) / 1000;

      // If we're still in the cooldown period, skip this notification
      if (elapsedSeconds < NOTIFICATION_COOLDOWN_SECONDS) {
        console.log(
          `Skipping notification for ${chainName} RPC node - within cooldown period (${Math.round(elapsedSeconds)}s elapsed of ${NOTIFICATION_COOLDOWN_SECONDS}s cooldown)`
        );
        return;
      }
    }

    // Send the notification
    await sendRpcNodeIssueNotification(chainName, status, url, environment);

    // Update the cache with the current timestamp
    await kvClient.setCached(
      cacheKey,
      { timestamp: Date.now() },
      NOTIFICATION_COOLDOWN_SECONDS
    );
  } catch (error) {
    console.error("Error with notification rate limiting:", error);
    // If there's an error with the cache, still send the notification
    await sendRpcNodeIssueNotification(chainName, status, url, environment);
  }
}
