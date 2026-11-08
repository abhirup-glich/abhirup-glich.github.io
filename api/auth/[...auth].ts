import { Auth } from "@auth/core";
import { getAuthConfig, nodeToWebRequest, sendWebResponse } from "../lib/auth";
import type { IncomingMessage, ServerResponse } from "http";

/**
 * Universal Handler for Auth.js endpoints:
 * - /api/auth/signin
 * - /api/auth/signin/google
 * - /api/auth/callback/google
 * - /api/auth/session
 * - /api/auth/signout
 * - /api/auth/csrf
 * - /api/auth/providers
 */
export default async function handler(req: IncomingMessage | Request, res?: ServerResponse) {
  const config = getAuthConfig();

  // If called in standard Web fetch context (Edge runtime or custom Web request)
  if (req instanceof Request) {
    return Auth(req, config);
  }

  // Node.js Serverless Function context (Vercel Node or Vite dev middleware)
  try {
    const webReq = await nodeToWebRequest(req);
    const webRes = await Auth(webReq, config);
    if (res) {
      await sendWebResponse(webRes, res);
      return;
    }
    return webRes;
  } catch (err: unknown) {
    console.error("[Auth.js Handler Error]:", err);
    const message = err instanceof Error ? err.message : String(err);
    if (res) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Internal Auth Error", message }));
      return;
    }
    return new Response(JSON.stringify({ error: "Internal Auth Error" }), { status: 500 });
  }
}

