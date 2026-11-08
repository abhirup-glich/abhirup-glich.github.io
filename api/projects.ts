import { getProjects } from "./lib/storage";
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

  // Public projects only (is_published = true)
  const publishedProjects = getProjects(false);

  const jsonResponse = new Response(JSON.stringify(publishedProjects), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
    },
  });

  if (res && !isWebReq) {
    await sendWebResponse(jsonResponse, res);
    return;
  }

  return jsonResponse;
}
