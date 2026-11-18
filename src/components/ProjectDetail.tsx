import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Cpu,
  Share2,
  ChevronRight,
  ShieldAlert,
  Globe,
  Terminal,
  Code2,
  Palette,
  Laptop
} from "lucide-react";
import type { ProjectRecord } from "../types/project";
import { projectsData } from "../data/projects";

interface ProjectDetailProps {
  project: ProjectRecord;
  onBack: () => void;
  onSelectProject: (project: ProjectRecord) => void;
}

// Category Icon Component
function CategoryIcon({ category, className }: { category: string; className?: string }) {
  switch (category) {
    case "Applications & Software":
      return <Laptop className={className} />;
    case "AI & Automation":
      return <Cpu className={className} />;
    case "Web Development":
      return <Globe className={className} />;
    case "UI/UX & Product Design":
      return <Layers className={className} />;
    case "Cybersecurity & Networking":
      return <ShieldAlert className={className} />;
    case "Startups & Business":
      return <Sparkles className={className} />;
    case "Experiments & Concepts":
      return <Terminal className={className} />;
    case "Creative & Publishing":
      return <Palette className={className} />;
    default:
      return <Code2 className={className} />;
  }
}

// Status badge helper
function getStatusConfig(status: string) {
  switch (status) {
    case "Launched":
      return {
        bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
        dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
      };
    case "Built / Worked On":
      return {
        bg: "bg-blue-500/10 border-blue-500/30 text-blue-300",
        dot: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]",
      };
    case "In Development":
      return {
        bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
        dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
      };
    case "Prototype":
      return {
        bg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
        dot: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]",
      };
    case "Experimental":
      return {
        bg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
        dot: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]",
      };
    case "Concept":
      return {
        bg: "bg-zinc-500/10 border-zinc-500/30 text-zinc-300",
        dot: "bg-zinc-400 shadow-[0_0_8px_rgba(161,161,170,0.8)]",
      };
    case "Client Work":
      return {
        bg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
        dot: "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]",
      };
    case "Learning / Lab Work":
      return {
        bg: "bg-rose-500/10 border-rose-500/30 text-rose-300",
        dot: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
      };
    default:
      return {
        bg: "bg-white/10 border-white/20 text-white/80",
        dot: "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]",
      };
  }
}

export default function ProjectDetail({
  project,
  onBack,
  onSelectProject,
}: ProjectDetailProps) {
  const statusConfig = getStatusConfig(project.status);

  // SEO dynamic title and cleanup
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${project.title} — Abhirup Sarkar Portfolio`;

    // Keyboard navigation: Escape to go back
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Scroll to top of detail view
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      document.title = originalTitle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onBack]);

  // Find related projects
  const relatedProjects = (project.relatedProjectIds || [])
    .map((relId) => projectsData.find((p) => p.id === relId))
    .filter((p): p is ProjectRecord => Boolean(p))
    .slice(0, 3);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/projects/${project.slug}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Project link copied to clipboard!");
      }).catch(() => {
        // Fallback
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#020202] text-white pt-24 md:pt-32 pb-24 px-4 md:px-12 relative z-[160]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] bg-orange-600/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 hover:border-white/20 transition-all text-xs font-black uppercase tracking-[0.2em]"
            aria-label="Back to projects"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Projects</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              title="Share project link"
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 transition-all"
              aria-label="Copy project URL"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/90 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] inline-flex items-center gap-2">
              <CategoryIcon category={project.primaryCategory} className="w-3.5 h-3.5 text-orange-400" />
              {project.primaryCategory}
            </span>

            <span
              className={`px-3.5 py-1.5 rounded-full border text-[10px] md:text-xs font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 backdrop-blur-md ${statusConfig.bg}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`} />
              {project.statusLabel || project.status}
            </span>

            {project.featured && (
              <span className="px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-orange-400" />
                Featured Project
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60">
            {project.title}
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 font-medium leading-relaxed max-w-4xl">
            {project.shortDescription}
          </p>

          {/* Technology Badges */}
          {project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-bold tracking-wider"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Action Links (Only verified links are displayed) */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-wrap gap-4 pt-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all flex items-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95"
                >
                  <span>Visit Live Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl bg-zinc-900 border border-white/15 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95"
                >
                  <Github className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <div className="glass-dark rounded-[2.5rem] p-8 md:p-10 border border-white/5 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">
                Project Overview
              </h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-line font-medium">
                {project.detailedDescription}
              </p>
            </div>

            {/* Implementation Details */}
            {project.technicalImplementation && (
              <div className="glass-dark rounded-[2.5rem] p-8 md:p-10 border border-white/5 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400">
                  Technical Implementation
                </h2>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed font-medium">
                  {project.technicalImplementation}
                </p>

                {project.technicalChallenges && project.technicalChallenges.length > 0 && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                      Technical Challenges Addressed
                    </h3>
                    <ul className="space-y-2">
                      {project.technicalChallenges.map((challenge, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Features (Implemented vs Planned) */}
            <div className="glass-dark rounded-[2.5rem] p-8 md:p-10 border border-white/5 space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">
                Key Features
              </h2>

              {project.implementedFeatures.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/80 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Implemented Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {project.implementedFeatures.map((feat, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3 text-xs md:text-sm text-gray-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.plannedFeatures && project.plannedFeatures.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Planned Roadmap Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {project.plannedFeatures.map((feat, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 flex items-start gap-3 text-xs md:text-sm text-gray-400"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Gallery (Only shown if verified gallery assets exist) */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <div className="glass-dark rounded-[2.5rem] p-8 md:p-10 border border-white/5 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/70">
                  Verified Project Assets
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.galleryImages.map((img, i) => (
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 aspect-video flex items-center justify-center"
                    >
                      <img
                        src={img}
                        alt={`${project.title} asset ${i + 1}`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Metadata Column */}
          <div className="space-y-6">
            <div className="glass-dark rounded-[2.5rem] p-6 md:p-8 border border-white/5 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/50 border-b border-white/10 pb-4">
                Project Information
              </h3>

              <div className="space-y-4 text-xs md:text-sm">
                <div>
                  <span className="text-gray-500 uppercase tracking-wider block text-[10px] font-bold">
                    Development Stage
                  </span>
                  <span className="text-white font-bold mt-1 block">
                    {project.statusLabel || project.status}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 uppercase tracking-wider block text-[10px] font-bold">
                    Primary Category
                  </span>
                  <span className="text-white font-bold mt-1 block">
                    {project.primaryCategory}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 uppercase tracking-wider block text-[10px] font-bold">
                    Category Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {project.categoryTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 uppercase tracking-wider block text-[10px] font-bold">
                    Project Slug
                  </span>
                  <span className="text-white/60 font-mono text-[11px] mt-1 block break-all">
                    /projects/{project.slug}
                  </span>
                </div>
              </div>

              <button
                onClick={onBack}
                className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Grid</span>
              </button>
            </div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="glass-dark rounded-[2.5rem] p-6 md:p-8 border border-white/5 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/50 border-b border-white/10 pb-4">
                  Related Projects
                </h3>
                <div className="space-y-3">
                  {relatedProjects.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectProject(rel)}
                      className="group p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 cursor-pointer transition-all flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 overflow-hidden">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400 block truncate">
                          {rel.primaryCategory}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                          {rel.title}
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
