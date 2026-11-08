import { Auth } from "@auth/core";
import Google from "@auth/core/providers/google";
import { getToken } from "@auth/core/jwt";
import type { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import path from "path";

export const ALLOWED_ADMIN_EMAIL = "abhirupsarkar2jp@gmail.com";

/**
 * Dynamically parse .env file if process.env values are not populated
 */
export function loadEnvFile() {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (val) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch {
    // Ignore in read-only / serverless environment
  }
}

// Initial load
loadEnvFile();

export function getAuthSecret(): string {
  loadEnvFile();
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "abhirup-portfolio-auth-secret-key-32chars-min";
}

export function getGoogleCredentials() {
  loadEnvFile();
  const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
  return { clientId, clientSecret };
}

export const AUTH_SECRET = getAuthSecret();
export const GOOGLE_CLIENT_ID = getGoogleCredentials().clientId;
export const GOOGLE_CLIENT_SECRET = getGoogleCredentials().clientSecret;

export const isAuthConfigured = Boolean(
  GOOGLE_CLIENT_ID && 
  GOOGLE_CLIENT_SECRET && 
  GOOGLE_CLIENT_ID.length > 5 &&
  GOOGLE_CLIENT_SECRET.length > 5
);

export function getAuthConfig(): Parameters<typeof Auth>[1] {
  const { clientId, clientSecret } = getGoogleCredentials();
  const secret = getAuthSecret();

  return {
    basePath: "/api/auth",
    secret,
    trustHost: true,
    providers: [
      Google({
        clientId: clientId || "placeholder-id",
        clientSecret: clientSecret || "placeholder-secret",
      }),
    ],
    callbacks: {
      async signIn({ user }) {
        if (!user?.email || user.email.toLowerCase() !== ALLOWED_ADMIN_EMAIL.toLowerCase()) {
          console.warn(`[Auth.js] Sign-in denied for unauthorized email: ${user?.email}`);
          return false; // Server-side rejection of non-admin Google accounts
        }
        return true;
      },
      async jwt({ token, user }) {
        if (user) {
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user && token.email) {
          session.user.email = token.email as string;
          session.user.name = (token.name as string) || "Abhirup Sarkar";
          session.user.image = (token.picture as string) || "";
        }
        return session;
      },
    },
  };
}

export const authConfig = getAuthConfig();

/**
 * Convert Node.js IncomingMessage to standard Web Request
 */
export async function nodeToWebRequest(req: IncomingMessage): Promise<Request> {
  const protocol = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "localhost:5173";
  const url = new URL(req.url || "/", `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, val] of Object.entries(req.headers)) {
    if (Array.isArray(val)) {
      val.forEach((v) => headers.append(key, v));
    } else if (typeof val === "string") {
      headers.set(key, val);
    }
  }

  let body: BodyInit | null = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    // Check if body was already parsed by bodyParser / framework
    const reqWithBody = req as IncomingMessage & { body?: unknown };
    if (reqWithBody.body) {
      if (typeof reqWithBody.body === "string") {
        body = reqWithBody.body;
      } else if (Buffer.isBuffer(reqWithBody.body)) {
        body = new Uint8Array(reqWithBody.body);
      } else {
        body = JSON.stringify(reqWithBody.body);
        if (!headers.has("content-type")) {
          headers.set("content-type", "application/json");
        }
      }
    } else {
      const rawBuf = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
        req.on("end", () => resolve(Buffer.concat(chunks)));
        req.on("error", reject);
      });
      body = new Uint8Array(rawBuf);
    }
  }

  return new Request(url, {
    method: req.method,
    headers,
    body,
  });
}

/**
 * Pipe Web Response back to Node.js ServerResponse
 */
export async function sendWebResponse(webRes: Response, res: ServerResponse) {
  res.statusCode = webRes.status;
  webRes.headers.forEach((val, key) => {
    // Set headers (handle multiple set-cookie if needed)
    if (key.toLowerCase() === "set-cookie") {
      const headersWithCookies = webRes.headers as unknown as { getSetCookie?: () => string[] };
      if (typeof headersWithCookies.getSetCookie === "function") {
        res.setHeader("set-cookie", headersWithCookies.getSetCookie.call(webRes.headers));
      } else {
        res.setHeader(key, val);
      }
    } else {
      res.setHeader(key, val);
    }
  });

  const arrayBuffer = await webRes.arrayBuffer();
  res.end(Buffer.from(arrayBuffer));
}

/**
 * Enforce administrator verification on the server
 */
export async function verifyAdminSession(req: IncomingMessage | Request): Promise<{ email: string; name?: string } | null> {
  try {
    const webReq = req instanceof Request ? req : await nodeToWebRequest(req);
    const token = await getToken({
      req: webReq,
      secret: getAuthSecret(),
    });

    if (!token?.email || token.email.toLowerCase() !== ALLOWED_ADMIN_EMAIL.toLowerCase()) {
      return null;
    }

    return {
      email: token.email,
      name: token.name as string | undefined,
    };
  } catch (err) {
    console.error("[Auth] Session verification error:", err);
    return null;
  }
}

