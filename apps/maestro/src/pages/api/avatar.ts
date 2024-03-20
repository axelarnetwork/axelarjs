import { NextResponse, type NextRequest } from "next/server";

import { kv } from "@vercel/kv";

import { hex64Literal } from "~/lib/utils/validation";
import MaestroKVClient from "~/services/db/kv/MaestroKVClient";

export const config = {
  runtime: "edge",
};

const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"];

export default async function handler(req: NextRequest) {
  const tokenId = req.nextUrl.searchParams.get("tokenId");

  if (!tokenId) {
    return new Response("Token ID is required", { status: 400 });
  }

  const parsedTokenId = hex64Literal().safeParse(tokenId);

  if (!parsedTokenId.success) {
    return new Response("Invalid token ID", { status: 400 });
  }

  const kvClient = new MaestroKVClient(kv);

  const meta = await kvClient.getTokenMeta(parsedTokenId.data);

  if (!meta?.iconUrl) {
    return new Response("Token not found", { status: 404 });
  }

  const imageResponse = await fetch(meta.iconUrl);

  if (!imageResponse.ok) {
    return new Response("Failed to fetch image", {
      status: imageResponse.status,
    });
  }

  const contentType = imageResponse.headers.get("Content-Type") || "";

  if (!SUPPORTED_IMAGE_FORMATS.some((f) => contentType.startsWith(f))) {
    return new Response(
      "Invalid image format. Only JPG, PNG and WEBP are supported.",
      { status: 400 },
    );
  }

  // Clone the response to modify headers for security enhancements and CORS
  const headers = new Headers(imageResponse.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Content-Type", contentType);
  // set 24h cache
  headers.set("Cache-Control", "public, max-age=86400");

  const responseBody = await imageResponse.arrayBuffer(); // Use arrayBuffer for binary data handling
  return new NextResponse(responseBody, {
    status: imageResponse.status,
    headers,
  });
}
