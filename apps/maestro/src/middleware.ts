import { Maybe } from "@axelarjs/utils";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Extract country
  const country = Maybe.of(req.geo?.country).valueOr("US");

  // Specify the correct pathname
  if (BLOCKED_COUNTRIES.includes(country)) {
    req.nextUrl.pathname = "/restricted";
  }

  // Rewrite to URL
  return NextResponse.rewrite(req.nextUrl);
}

/**
 * Blocked sanctioned or embargoed countries
 * based on https://orpa.princeton.edu/export-controls/sanctioned-countries
 */
const BLOCKED_COUNTRIES: string[] = [
  "CU", // Cuba
  "IR", // Iran
  "KP", // North Korea
  "RU", // Russia
  "SY", // Syria
  "UA-CR", // Crimea (Ukraine)
  "UA-DN", // Donetsk (Ukraine)
  "UA-LU", // Luhansk (Ukraine)
  "BA", // Balkans
  "BY", // Belarus
  "MM", // Burma (Myanmar)
  "CD", // Congo, Dem. Rep. of
  "ET", // Ethiopia
  "HK", // Hong Kong
  "SD", // Sudan
  "VE", // Venezuela
  "YE", // Yemen
  "ZW", // Zimbabwe
];
