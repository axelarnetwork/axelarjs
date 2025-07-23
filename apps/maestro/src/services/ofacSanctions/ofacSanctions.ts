import { kv } from "@vercel/kv";

import MaestroKVClient from "~/services/db/kv/MaestroKVClient";

const OFAC_BASE_URL =
  process.env.OFAC_BASE_URL || "https://sanctionslistservice.ofac.treas.gov";

export class OFACSanctionsService {
  private kvClient: MaestroKVClient;

  constructor() {
    this.kvClient = new MaestroKVClient(kv);
  }

  /**
   * Check if a wallet address is sanctioned
   */
  async isWalletSanctioned(address: string): Promise<boolean> {
    return this.kvClient.isWalletSanctioned(address.toLowerCase());
  }

  /**
   * Get the status of sanctions data
   */
  async getSanctionsStatus(): Promise<{
    hasData: boolean;
    lastUpdate: string | null;
  }> {
    const lastUpdate = await this.kvClient.getSanctionsLastUpdate();
    const hasData = (await this.kvClient.getSanctionedWalletsCount()) > 0;

    return {
      hasData,
      lastUpdate,
    };
  }

  /**
   * Load the full OFAC dataset from SDN.XML file and update the KV store
   */
  public async loadOFACDataset(): Promise<{
    success: boolean;
    addressesLoaded: number;
    message?: string;
  }> {
    const url = `${OFAC_BASE_URL}/api/download/SDN.XML`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlContent = await response.text();
      const addresses = this.parseOFACXML(xmlContent);

      if (addresses.length > 0) {
        await this.kvClient.setSanctionedWallets(addresses);
      }

      // Always set the last update timestamp to prevent re-downloading
      await this.kvClient.setSanctionsLastUpdate(new Date().toISOString());

      return {
        success: true,
        addressesLoaded: addresses.length,
        message: `Successfully loaded ${addresses.length} addresses`,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        return {
          success: false,
          addressesLoaded: 0,
          message: "Request timeout while downloading SDN.XML file",
        };
      }

      return {
        success: false,
        addressesLoaded: 0,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Parse OFAC SDN.XML file to extract digital currency addresses
   */
  private parseOFACXML(xmlContent: string): string[] {
    try {
      const addresses: string[] = [];

      // Extract all <id> elements
      const idPattern =
        /<id>\s*<uid>([^<]+)<\/uid>\s*<idType>([^<]+)<\/idType>\s*<idNumber>([^<]+)<\/idNumber>\s*<\/id>/g;

      let match;
      while ((match = idPattern.exec(xmlContent)) !== null) {
        const [, , idType, idNumber] = match;

        // Only process Digital Currency Address entries
        if (idType.includes("Digital Currency Address")) {
          // Clean and validate the address
          const cleanAddress = idNumber.trim();
          addresses.push(cleanAddress);
        }
      }

      console.info(
        `Parsed ${addresses.length} digital currency addresses from OFAC XML`
      );
      return addresses;
    } catch (error) {
      console.error("Error parsing OFAC XML:", error);
      throw new Error(
        `Failed to parse OFAC XML: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}

// Export singleton instance for easy access
export const ofacSanctionsService = new OFACSanctionsService();
