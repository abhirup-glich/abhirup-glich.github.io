export type ProjectCategory =
  | "Applications & Software"
  | "AI & Automation"
  | "Web Development"
  | "UI/UX & Product Design"
  | "Cybersecurity & Networking"
  | "Startups & Business"
  | "Experiments & Concepts"
  | "Creative & Publishing";

export type ProjectStatus =
  | "Launched"
  | "Built / Worked On"
  | "In Development"
  | "Prototype"
  | "Experimental"
  | "Concept"
  | "Client Work"
  | "Learning / Lab Work";

export interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  primaryCategory: ProjectCategory;
  categoryTags: string[];
  technologies: string[];
  status: ProjectStatus;
  statusLabel?: string;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  coverImage?: string;
  galleryImages?: string[];
  implementedFeatures: string[];
  plannedFeatures?: string[];
  technicalImplementation?: string;
  technicalChallenges?: string[];
  timeline?: string;
  relatedProjectIds?: string[];
}
