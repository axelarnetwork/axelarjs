import { NextResponse, type NextRequest } from "next/server";

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

export function middleware(req: NextRequest) {
  // Extract country
  const country = req.geo?.country ?? "US";

  const isRestricted = RESTRICTED_COUNTRIES.includes(country);

  if (!isRestricted && req.nextUrl.pathname === "/restricted") {
    req.nextUrl.pathname = "/";
    return NextResponse.redirect(req.nextUrl);
  }

  if (isRestricted) {
    console.info("unauthorized_access_attempt:", {
      ...(req.geo ?? {}),
      ip: req.ip,
      userAgent: req.headers.get("user-agent"),
    });

    req.nextUrl.pathname = "/restricted";
  }

  // Rewrite to URL
  return NextResponse.rewrite(req.nextUrl);
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
