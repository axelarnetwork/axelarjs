import { NextApiRequest, NextApiResponse } from "next";

import { logger } from "~/lib/logger";
import { ofacSanctionsService } from "~/services/ofacSanctions/ofacSanctions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Verify this is a legitimate Vercel cron job
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    logger.error("CRON_SECRET is not configured");
    return res.status(500).json({ error: "Server misconfiguration" });
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    logger.error("Unauthorized cron job attempt");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await ofacSanctionsService.loadOFACDataset();

    if (result.success) {
      logger.info(
        `OFAC sanctions reloaded successfully: ${result.addressesLoaded} addresses`
      );
      return res.status(200).json({
        success: true,
        addressesLoaded: result.addressesLoaded,
        message: result.message,
      });
    } else {
      logger.error("OFAC sanctions reload failed:", result.message);
      return res.status(500).json({
        success: false,
        error: result.message || "Failed to reload OFAC sanctions data",
      });
    }
  } catch (error) {
    logger.error("Error reloading OFAC sanctions data:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to reload OFAC sanctions data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
