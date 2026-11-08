import { getProjects, createProject, updateProject, deleteProject } from "../lib/storage";
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

  // 2. Process Authorized Content Actions
  try {
    if (method === "GET") {
      // Return all projects including drafts for admin
      const allProjects = getProjects(true);
      const jsonRes = new Response(JSON.stringify(allProjects), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
      if (res && !isWebReq) return sendWebResponse(jsonRes, res);
      return jsonRes;
    }

    if (method === "POST") {
      // Create new project
      const body = await webReq.json();
      if (!body.title || !body.description) {
        const badReqRes = new Response(JSON.stringify({ error: "Title and description are required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
        if (res && !isWebReq) return sendWebResponse(badReqRes, res);
        return badReqRes;
      }

      const created = createProject({
        title: String(body.title).trim(),
        description: String(body.description).trim(),
        category: String(body.category || "Dev").trim(),
        link: body.link ? String(body.link).trim() : undefined,
        logo_url: body.logo_url ? String(body.logo_url).trim() : undefined,
        logo_type: body.logo_type === "image" ? "image" : "vector",
        display_order: Number(body.display_order ?? 0),
        is_published: Boolean(body.is_published),
      });

      const jsonRes = new Response(JSON.stringify(created), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
      if (res && !isWebReq) return sendWebResponse(jsonRes, res);
      return jsonRes;
    }

    if (method === "PUT") {
      // Update existing project
      const body = await webReq.json();
      if (!body.id) {
        const badReqRes = new Response(JSON.stringify({ error: "Project ID is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
        if (res && !isWebReq) return sendWebResponse(badReqRes, res);
        return badReqRes;
      }

      const updated = updateProject(body.id, {
        ...(body.title !== undefined && { title: String(body.title).trim() }),
        ...(body.description !== undefined && { description: String(body.description).trim() }),
        ...(body.category !== undefined && { category: String(body.category).trim() }),
        ...(body.link !== undefined && { link: body.link ? String(body.link).trim() : undefined }),
        ...(body.logo_url !== undefined && { logo_url: body.logo_url ? String(body.logo_url).trim() : undefined }),
        ...(body.logo_type !== undefined && { logo_type: body.logo_type === "image" ? "image" : "vector" }),
        ...(body.display_order !== undefined && { display_order: Number(body.display_order) }),
        ...(body.is_published !== undefined && { is_published: Boolean(body.is_published) }),
      });

      if (!updated) {
        const notFoundRes = new Response(JSON.stringify({ error: "Project not found" }), {
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

    if (method === "DELETE") {
      // Delete project
      const url = new URL(webReq.url);
      const id = url.searchParams.get("id");
      if (!id) {
        const badReqRes = new Response(JSON.stringify({ error: "Project ID query parameter is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
        if (res && !isWebReq) return sendWebResponse(badReqRes, res);
        return badReqRes;
      }

      const deleted = deleteProject(id);
      if (!deleted) {
        const notFoundRes = new Response(JSON.stringify({ error: "Project not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
        if (res && !isWebReq) return sendWebResponse(notFoundRes, res);
        return notFoundRes;
      }

      const jsonRes = new Response(JSON.stringify({ success: true, id }), {
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
    console.error("[Admin Projects Error]:", err);
    const message = err instanceof Error ? err.message : String(err);
    const errRes = new Response(JSON.stringify({ error: "Server error", message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
    if (res && !isWebReq) return sendWebResponse(errRes, res);
    return errRes;
  }
}

