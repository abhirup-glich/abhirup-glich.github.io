import { getStartups } from "./lib/storage";
import { sendWebResponse } from "./lib/auth";
import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage | Request, res?: ServerResponse) {
  const isWebReq = req instanceof Request;
  const method = isWebReq ? req.method : req.method;

  if (method !== "GET") {
    if (res) {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
      return;
    }
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
  }

  const startups = getStartups();

  const jsonResponse = new Response(JSON.stringify(startups), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
    },
  });

  if (res && !isWebReq) {
    await sendWebResponse(jsonResponse, res);
    return;
  }

  return jsonResponse;
}
