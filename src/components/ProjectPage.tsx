import ProjectDetail from "./ProjectDetail";
import { projectsData } from "../data/projects";
import type { ProjectRecord } from "../types/project";

interface ProjectPageProps {
  onBack: () => void;
  project?: ProjectRecord;
  slug?: string;
  initialCategory?: string;
  onSelectProject?: (project: ProjectRecord) => void;
}

export default function ProjectPage({
  onBack,
  project,
  slug,
  onSelectProject = () => {},
}: ProjectPageProps) {
  const activeProject =
    project ||
    (slug ? projectsData.find((p) => p.slug === slug || p.id === slug) : null) ||
    projectsData[0];

  return (
    <ProjectDetail
      project={activeProject}
      onBack={onBack}
      onSelectProject={onSelectProject}
    />
  );
}
