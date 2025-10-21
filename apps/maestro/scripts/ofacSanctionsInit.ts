import dotenv from "dotenv";

import { ofacSanctionsService } from "../src/services/ofacSanctions";

dotenv.config();

async function logSanctionsStatusFallback() {
  try {
    const status = await ofacSanctionsService.getSanctionsStatus();
    if (status.hasData) {
      console.warn("🔄 Application will continue with existing sanctions data");
      console.warn(`📅 Existing data was updated at ${status.lastUpdate}`);
    } else {
      console.warn(
        "🚨 No sanctions data available - all wallets will be allowed"
      );
      console.warn(
        "🔧 Consider running initialization manually when OFAC service is available"
      );
    }
  } catch {
    console.warn(
      "⚠️ Unable to retrieve sanctions status; proceeding without additional status details"
    );
  }
}

/**
 * OFAC Sanctions Initialization Script
 *
 * This script is run after the build process to ensure the OFAC blocklist
 * is properly initialized before the application starts serving requests.
 *
 * Usage:
 * - Automatically runs via postbuild script
 * - Can be run manually: pnpm ts-node scripts/ofacSanctionsInit.ts
 *
 * Note: This script will NOT fail the build if OFAC service is unavailable.
 * It will log warnings and continue, allowing the application to start
 * with no or potentially outdated sanctions data.
 */

async function main() {
  try {
    const result = await ofacSanctionsService.loadOFACDataset();

    if (result.success) {
      console.log(
        `✅ OFAC sanctions loaded: ${result.addressesLoaded} addresses`
      );
      if (result.message) {
        console.log(`📝 ${result.message}`);
      }
    } else {
      console.warn("⚠️ OFAC sanctions loading failed");
      console.warn(`📝 ${result.message || "Unknown error"}`);
      await logSanctionsStatusFallback();
    }

    process.exit(0);
  } catch (error) {
    console.error("💥 Unexpected error loading OFAC sanctions:", error);
    await logSanctionsStatusFallback();
    process.exit(0);
  }
}

void main();
