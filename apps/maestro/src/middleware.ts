import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

import { logger } from "~/lib/logger";
import { ofacSanctionsService } from "~/services/ofacSanctions/ofacSanctions";

logger.configure({
  env:
    process.env.NODE_ENV === "development" ||
    ["preview", "development"].includes(String(process.env.VERCEL_ENV))
      ? "development"
      : "production",
});

type WalletAddress = string;

// Limit middleware pathname config
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|logos|_next/static|_next/image|favicon.ico).*)",
  ],
};

export async function middleware(req: NextRequest) {
  // Extract country
  const country = req.geo?.country ?? "US";

  try {
    const walletAddress = await getAuthenticatedWalletAddress(req);
    if (!walletAddress) {
      return NextResponse.rewrite(req.nextUrl);
    }

    const isRestricted =
      RESTRICTED_COUNTRIES.includes(country) ||
      (await checkWalletAddresses(walletAddress));

    if (!isRestricted && req.nextUrl.pathname === "/restricted") {
      req.nextUrl.pathname = "/";
      return NextResponse.redirect(req.nextUrl);
    }

    if (isRestricted) {
      console.info("unauthorized_access_attempt:", {
        ...(req.geo ?? {}),
        ip: req.ip,
        walletAddress,
        userAgent: req.headers.get("user-agent"),
      });

      req.nextUrl.pathname = "/restricted";
    }
  } catch (error) {
    console.error("Error getting wallet address:", error);
  }

  // Rewrite to URL
  return NextResponse.rewrite(req.nextUrl);
}

/**
 * Check if the authenticated user's wallet address is sanctioned
 */
async function checkWalletAddresses(address: WalletAddress): Promise<boolean> {
  return await ofacSanctionsService.isWalletSanctioned(address);
}

/**
 * Get the authenticated user's wallet address from the session cookie
 */
async function getAuthenticatedWalletAddress(
  req: NextRequest
): Promise<WalletAddress | null> {
  const token = await getToken({ req });
  if (!token) {
    return null;
  }

  if (!token.sub) {
    throw new Error("No wallet address found in token");
  }

  return token.sub;
}

/**
 * Sanctioned or embargoed regions
 */
const RESTRICTED_COUNTRIES: string[] = [
  "AL", // Albania
  "BY", // Belarus
  "BJ", // Benin
  "BG", // Bulgaria
  "BI", // Burundi
  "CF", // Central African Republic
  "CU", // Cuba
  "IR", // Iran
  "IQ", // Iraq
  "XK", // Kosovo (Note: 'XK' is a user-assigned code, not officially assigned)
  "LA", // Laos
  "LB", // Lebanon
  "LY", // Libya
  "ML", // Mali
  "MT", // Malta
  "MZ", // Mozambique
  "NI", // Nicaragua
  "KP", // North Korea
  "CG", // Republic of Congo
  "RU", // Russian Federation
  "RS", // Serbia
  "SO", // Somalia
  "SS", // South Sudan
  "SD", // Sudan
  "SY", // Syria
  "TZ", // Tanzania
  "UA-CR", // Crimea (Ukraine)
  "UA-DN", // Donetsk (Ukraine)
  "UA-LU", // Luhansk (Ukraine)
  "VE", // Venezuela
  "YE", // Yemen
  "ZW", // Zimbabwe
];
