import { getStartups, updateStartup } from "../lib/storage";
import { verifyAdminSession, nodeToWebRequest, sendWebResponse } from "../lib/auth";
import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage | Request, res?: ServerResponse) {
  const isWebReq = req instanceof Request;
  const webReq = isWebReq ? req : await nodeToWebRequest(req);
  const method = webReq.method;

  // 1. Strict Server-Side Authentication & Email Authorization
  const admin = await verifyAdminSession(webReq);
  if (!admin) {
    const unauthorizedRes = new Response(
      JSON.stringify({
        error: "Unauthorized",
        message: "Access denied. Only the verified administrator (abhirupsarkar2jp@gmail.com) may access admin API routes.",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res && !isWebReq) {
      await sendWebResponse(unauthorizedRes, res);
      return;
    }
    return unauthorizedRes;
  }

  // 2. Process Authorized Startup Actions
  try {
    if (method === "GET") {
      const startups = getStartups();
      const jsonRes = new Response(JSON.stringify(startups), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
      if (res && !isWebReq) return sendWebResponse(jsonRes, res);
      return jsonRes;
    }

    if (method === "PUT") {
      const body = await webReq.json();
      if (!body.id) {
        const badReqRes = new Response(JSON.stringify({ error: "Startup ID is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
        if (res && !isWebReq) return sendWebResponse(badReqRes, res);
        return badReqRes;
      }

      const updated = updateStartup(body.id, {
        ...(body.name !== undefined && { name: String(body.name).trim() }),
        ...(body.status !== undefined && { status: String(body.status).trim() }),
        ...(body.link !== undefined && { link: String(body.link).trim() }),
        ...(body.accent_color !== undefined && { accent_color: String(body.accent_color).trim() }),
        ...(body.description !== undefined && { description: String(body.description).trim() }),
        ...(body.view1_name !== undefined && { view1_name: String(body.view1_name).trim() }),
        ...(body.view1_value !== undefined && { view1_value: String(body.view1_value).trim() }),
        ...(body.view2_name !== undefined && { view2_name: String(body.view2_name).trim() }),
        ...(body.view2_value !== undefined && { view2_value: String(body.view2_value).trim() }),
        ...(body.button_text !== undefined && { button_text: String(body.button_text).trim() }),
      });

      if (!updated) {
        const notFoundRes = new Response(JSON.stringify({ error: "Startup not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
        if (res && !isWebReq) return sendWebResponse(notFoundRes, res);
        return notFoundRes;
      }

      const jsonRes = new Response(JSON.stringify(updated), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
      if (res && !isWebReq) return sendWebResponse(jsonRes, res);
      return jsonRes;
    }

    const notAllowed = new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
    if (res && !isWebReq) return sendWebResponse(notAllowed, res);
    return notAllowed;
  } catch (err: unknown) {
    console.error("[Admin Startups Error]:", err);
    const message = err instanceof Error ? err.message : String(err);
    const errRes = new Response(JSON.stringify({ error: "Server error", message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
    if (res && !isWebReq) return sendWebResponse(errRes, res);
    return errRes;
  }
}

