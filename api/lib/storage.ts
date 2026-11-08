import fs from "fs";
import path from "path";

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

export interface PortfolioData {
  startups: StartupItem[];
  projects: ProjectItem[];
}

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

// Server file storage path
const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "portfolio-store.json");

// In-memory cache for speed
let inMemoryData: PortfolioData | null = null;

function ensureDataFile(): PortfolioData {
  if (inMemoryData) {
    return inMemoryData;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      inMemoryData = {
        startups: Array.isArray(parsed.startups) && parsed.startups.length > 0 ? parsed.startups : DEFAULT_STARTUPS,
        projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PROJECTS,
      };
      return inMemoryData;
    }
  } catch (err) {
    console.warn("[Storage] Failed to read data file, using defaults:", err);
  }

  inMemoryData = {
    startups: DEFAULT_STARTUPS,
    projects: DEFAULT_PROJECTS,
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(inMemoryData, null, 2), "utf-8");
  } catch (err) {
    console.warn("[Storage] Note: running in readonly filesystem or serverless context:", err);
  }

  return inMemoryData;
}

function persistData(data: PortfolioData) {
  inMemoryData = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("[Storage] Could not persist to local file system:", err);
  }
}

// ---------------------------------------------------------------------------
// Startups Data Access
// ---------------------------------------------------------------------------
export function getStartups(): StartupItem[] {
  const data = ensureDataFile();
  return data.startups;
}

export function updateStartup(id: string, updates: Partial<StartupItem>): StartupItem | null {
  const data = ensureDataFile();
  const index = data.startups.findIndex((s) => s.id === id);
  if (index === -1) {
    return null;
  }

  const updated: StartupItem = {
    ...data.startups[index],
    ...updates,
    id, // protect id
  };

  data.startups[index] = updated;
  persistData(data);
  return updated;
}

// ---------------------------------------------------------------------------
// Projects Data Access
// ---------------------------------------------------------------------------
export function getProjects(includeDrafts = false): ProjectItem[] {
  const data = ensureDataFile();
  const list = includeDrafts ? data.projects : data.projects.filter((p) => p.is_published);
  return [...list].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export function createProject(projectData: Omit<ProjectItem, "id" | "created_at" | "updated_at">): ProjectItem {
  const data = ensureDataFile();
  const newProject: ProjectItem = {
    ...projectData,
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  data.projects.push(newProject);
  persistData(data);
  return newProject;
}

export function updateProject(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
  const data = ensureDataFile();
  const index = data.projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return null;
  }

  const updated: ProjectItem = {
    ...data.projects[index],
    ...updates,
    id, // protect id
    updated_at: new Date().toISOString(),
  };

  data.projects[index] = updated;
  persistData(data);
  return updated;
}

export function deleteProject(id: string): boolean {
  const data = ensureDataFile();
  const index = data.projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return false;
  }

  data.projects.splice(index, 1);
  persistData(data);
  return true;
}

