import { NextRequest, NextResponse } from "next/server";

// Gateway URL — set GATEWAY_INTERNAL_URL env var in Cloud Run, e.g. http://34.26.153.99
const GATEWAY_URL = process.env.GATEWAY_INTERNAL_URL || "http://34.26.153.99";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Forward multipart form data as-is
    const body = await req.arrayBuffer();

    const gatewayRes = await fetch(
      `${GATEWAY_URL}/api/public/trial/detect`,
      {
        method: "POST",
        headers: {
          "content-type": contentType,
          "x-forwarded-for":
            req.headers.get("x-forwarded-for") ||
            req.headers.get("x-real-ip") ||
            "",
          "x-real-ip":
            req.headers.get("x-real-ip") ||
            req.headers.get("x-forwarded-for") ||
            "",
        },
        body,
        // @ts-expect-error -- Node 18 fetch doesn't have duplex in types
        duplex: "half",
      }
    );

    const responseBody = await gatewayRes.arrayBuffer();

    return new NextResponse(responseBody, {
      status: gatewayRes.status,
      headers: {
        "content-type":
          gatewayRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (err) {
    console.error("[trial/detect proxy] Error:", err);
    return NextResponse.json(
      { error: "Gateway unreachable" },
      { status: 502 }
    );
  }
}
