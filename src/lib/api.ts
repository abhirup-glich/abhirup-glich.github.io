export interface StartupItem {
  id: string;
  name: string;
  status: string;
  link: string;
  accent_color: string;
  description: string;
  view1_name: string;
  view1_value: string;
  view2_name: string;
  view2_value: string;
  button_text: string;
  order?: string;
  logo_url?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: string;
  link?: string;
  logo_url?: string;
  logo_type?: "image" | "vector";
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthSession {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
  expires?: string;
}

export const ALLOWED_ADMIN_EMAIL = "abhirupsarkar2jp@gmail.com";

export const DEFAULT_STARTUPS: StartupItem[] = [
  {
    id: "virtual-valley",
    name: "Virtual Valley",
    status: "Established",
    link: "https://virtual-valley.vercel.app",
    accent_color: "monochrome",
    description: "A premium digital agency specializing in high-performance web development, bespoke UI/UX architecture, and digital media production.",
    view1_name: "Total Clients",
    view1_value: "50+",
    view2_name: "Delivered Projects",
    view2_value: "120+",
    button_text: "Visit Virtual Valley",
    order: "left",
  },
  {
    id: "tipflow",
    name: "TipFlow",
    status: "Under Establishment",
    link: "https://tipflowapp.vercel.app",
    accent_color: "orange",
    description: "Control beyond touch. Next-generation computer control, spatial interaction, and offline-first workflow automation.",
    view1_name: "Current Release",
    view1_value: "v4.2.2",
    view2_name: "Architecture",
    view2_value: "100% Offline",
    button_text: "Visit TipFlow",
    order: "right",
  },
];

export const DEFAULT_PROJECTS: ProjectItem[] = [];

// ---------------------------------------------------------------------------
// Public API Calls
// ---------------------------------------------------------------------------
export async function fetchStartups(): Promise<StartupItem[]> {
  try {
    const res = await fetch("/api/startups");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return DEFAULT_STARTUPS;
  } catch (err) {
    return DEFAULT_STARTUPS;
  }
}

export async function fetchPublishedProjects(): Promise<ProjectItem[]> {
  try {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
    return DEFAULT_PROJECTS;
  } catch (err) {
    return DEFAULT_PROJECTS;
  }
}

// ---------------------------------------------------------------------------
// Auth.js Session & Google Sign-In
// ---------------------------------------------------------------------------
export async function fetchSession(): Promise<AuthSession | null> {
  try {
    const res = await fetch("/api/auth/session", {
      credentials: "same-origin",
    });
    if (!res.ok) return null;
    const session = await res.json();
    if (session && session.user && session.user.email) {
      return session;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function signInWithGoogle(callbackUrl = "/admin"): Promise<void> {
  // 1. Fetch CSRF token from Auth.js
  const csrfRes = await fetch("/api/auth/csrf");
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;

  // 2. Submit form to /api/auth/signin/google
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/api/auth/signin/google";

  const csrfInput = document.createElement("input");
  csrfInput.type = "hidden";
  csrfInput.name = "csrfToken";
  csrfInput.value = csrfToken;
  form.appendChild(csrfInput);

  const callbackInput = document.createElement("input");
  callbackInput.type = "hidden";
  callbackInput.name = "callbackUrl";
  callbackInput.value = callbackUrl;
  form.appendChild(callbackInput);

  document.body.appendChild(form);
  form.submit();
}

export async function signOutAdmin(): Promise<void> {
  try {
    const csrfRes = await fetch("/api/auth/csrf");
    const csrfData = await csrfRes.json();
    const csrfToken = csrfData.csrfToken;

    await fetch("/api/auth/signout", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken,
        callbackUrl: "/admin",
      }),
      credentials: "same-origin",
    });

    window.location.href = "/admin";
  } catch (err) {
    window.location.reload();
  }
}

// ---------------------------------------------------------------------------
// Server-Enforced Admin Mutations
// ---------------------------------------------------------------------------
export async function fetchAdminProjects(): Promise<ProjectItem[]> {
  const res = await fetch("/api/admin/projects", { credentials: "same-origin" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch admin projects (${res.status})`);
  }
  return res.json();
}

export async function createAdminProject(project: Partial<ProjectItem>): Promise<ProjectItem> {
  const res = await fetch("/api/admin/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
    credentials: "same-origin",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to create project (${res.status})`);
  }
  return res.json();
}

export async function updateAdminProject(project: Partial<ProjectItem>): Promise<ProjectItem> {
  const res = await fetch("/api/admin/projects", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
    credentials: "same-origin",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update project (${res.status})`);
  }
  return res.json();
}

export async function deleteAdminProject(id: string): Promise<void> {
  const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to delete project (${res.status})`);
  }
}

export async function fetchAdminStartups(): Promise<StartupItem[]> {
  const res = await fetch("/api/admin/startups", { credentials: "same-origin" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch admin startups (${res.status})`);
  }
  return res.json();
}

export async function updateAdminStartup(startup: StartupItem): Promise<StartupItem> {
  const res = await fetch("/api/admin/startups", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(startup),
    credentials: "same-origin",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update startup (${res.status})`);
  }
  return res.json();
}

