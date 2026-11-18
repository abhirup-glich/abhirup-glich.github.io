import { useState, useMemo, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Sparkles,
  ExternalLink,
  Github,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Laptop,
  Cpu,
  Globe,
  Layers,
  ShieldAlert,
  Terminal,
  Palette,
  Code2,
} from "lucide-react";
import type { ProjectRecord } from "../types/project";
import { projectsData } from "../data/projects";

interface ProjectsProps {
  onProjectClick: (project: ProjectRecord) => void;
  initialCategory?: string;
}

// Category filter tabs
const CATEGORIES: { label: string; value: string }[] = [
  { label: "All Projects", value: "All" },
  { label: "Featured", value: "Featured" },
  { label: "Applications & Software", value: "Applications & Software" },
  { label: "AI & Automation", value: "AI & Automation" },
  { label: "Web Development", value: "Web Development" },
  { label: "UI/UX & Product Design", value: "UI/UX & Product Design" },
  { label: "Cybersecurity & Networking", value: "Cybersecurity & Networking" },
  { label: "Startups & Business", value: "Startups & Business" },
  { label: "Experiments & Concepts", value: "Experiments & Concepts" },
  { label: "Creative & Publishing", value: "Creative & Publishing" },
];

// Status filters
const STATUSES: { label: string; value: string }[] = [
  { label: "All Statuses", value: "All" },
  { label: "Launched", value: "Launched" },
  { label: "Built / Worked On", value: "Built / Worked On" },
  { label: "In Development", value: "In Development" },
  { label: "Prototype", value: "Prototype" },
  { label: "Experimental", value: "Experimental" },
  { label: "Concept", value: "Concept" },
  { label: "Client Work", value: "Client Work" },
  { label: "Learning / Lab Work", value: "Learning / Lab Work" },
];

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

function getStatusBadgeStyle(status: string) {
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

function ProjectCard({
  project,
  onClick,
}: {
  project: ProjectRecord;
  onClick: () => void;
}) {
  const statusBadge = getStatusBadgeStyle(project.status);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative rounded-[2rem] bg-zinc-950/80 border border-white/10 hover:border-orange-500/30 p-6 md:p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 hover:shadow-[0_20px_50px_rgba(249,115,22,0.12)] hover:-translate-y-1 overflow-hidden"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-orange-500/10 via-purple-600/10 to-transparent rounded-full blur-2xl opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Top Header: Category Icon & Status Badge */}
      <div className="relative z-10 flex items-start justify-between gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/80 group-hover:text-orange-400 group-hover:border-orange-500/30 group-hover:scale-105 transition-all shadow-inner">
          <CategoryIcon category={project.primaryCategory} className="w-6 h-6" />
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-1.5 backdrop-blur-md ${statusBadge.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
            {project.status}
          </span>
          {project.featured && (
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-400/90 inline-flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Featured
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-start">
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40 block">
          {project.primaryCategory}
        </span>

        <h3 className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-orange-400 transition-colors leading-snug">
          {project.title}
        </h3>

        <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed line-clamp-3">
          {project.shortDescription}
        </p>

        {/* Technology Tags (up to 4 tags) */}
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 mt-auto">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/5 text-[10px] font-bold text-gray-400 tracking-wider"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-0.5 rounded-lg bg-white/[0.02] text-[10px] font-bold text-gray-500">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="relative z-10 pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-orange-400 transition-colors">
          <span>View Project</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>

        {/* Verified Link Action */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Visit live website"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all"
              aria-label={`Visit ${project.title} website`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View source repository"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all"
              aria-label={`View ${project.title} source code`}
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Hover Edge Glow */}
      <div className="absolute inset-0 border border-transparent group-hover:border-orange-500/20 rounded-[2rem] pointer-events-none transition-colors" />
    </motion.div>
  );
}

export default function Projects({
  onProjectClick,
  initialCategory = "Featured",
}: ProjectsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedTech, setSelectedTech] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "name" | "category" | "status">("featured");

  const statusFilterId = useId();
  const techFilterId = useId();
  const sortFilterId = useId();

  // Extract all unique technologies
  const allTechnologies = useMemo(() => {
    const set = new Set<string>();
    projectsData.forEach((p) => {
      p.technologies.forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, []);

  // Filter & Sort Projects
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = projectsData.filter((project) => {
      // Search match
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.shortDescription.toLowerCase().includes(q) ||
        project.detailedDescription.toLowerCase().includes(q) ||
        project.primaryCategory.toLowerCase().includes(q) ||
        project.categoryTags.some((tag) => tag.toLowerCase().includes(q)) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(q));

      // Category match
      let matchesCategory = true;
      if (selectedCategory === "Featured") {
        matchesCategory = project.featured;
      } else if (selectedCategory !== "All") {
        matchesCategory =
          project.primaryCategory === selectedCategory ||
          project.categoryTags.includes(selectedCategory);
      }

      // Status match
      const matchesStatus =
        selectedStatus === "All" || project.status === selectedStatus;

      // Tech match
      const matchesTech =
        selectedTech === "All" || project.technologies.includes(selectedTech);

      return matchesSearch && matchesCategory && matchesStatus && matchesTech;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === "featured") {
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "category") {
        return a.primaryCategory.localeCompare(b.primaryCategory);
      }
      if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedStatus, selectedTech, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedStatus !== "All" ||
    selectedTech !== "All" ||
    sortBy !== "featured";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSelectedTech("All");
    setSortBy("featured");
  };

  return (
    <section
      id="projects"
      className="py-16 md:py-28 px-4 md:px-20 relative overflow-hidden bg-black scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Heading & Live Count */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-left max-w-3xl space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>Comprehensive Project Archive</span>
            </div>

            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              SELECTED WORK & EXPERIMENTS
            </h2>

            <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed">
              From intelligent desktop applications and computer vision to full-stack platforms, cybersecurity research and experimental interfaces — a collection of what I've built, explored and designed.
            </p>
          </motion.div>

          {/* Dynamic Live Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-dark px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-4 self-start md:self-auto shrink-0 shadow-xl"
          >
            <div className="text-left">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 block">
                Live Catalog
              </span>
              <div className="text-xl md:text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                <span className="text-orange-400">{filteredProjects.length}</span>
                <span className="text-white/30 text-base">/</span>
                <span className="text-white/70 text-base">{projectsData.length}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                  Projects
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="glass-dark rounded-[2.5rem] p-6 md:p-8 border border-white/10 space-y-6 shadow-2xl">
          {/* Top Row: Search Input & Sort Dropdown */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by project name, technology, or topic (e.g. MediaPipe, Python, Supabase, TR-069)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-11 pr-10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status, Tech, and Sort Selectors */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-2.5">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <label htmlFor={statusFilterId} className="sr-only">Filter by development status</label>
                <select
                  id={statusFilterId}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-xs font-bold text-gray-300 focus:outline-none cursor-pointer"
                >
                  {STATUSES.map((st) => (
                    <option key={st.value} value={st.value} className="bg-zinc-950 text-white">
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Technology Filter */}
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-2.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                <label htmlFor={techFilterId} className="sr-only">Filter by technology</label>
                <select
                  id={techFilterId}
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="bg-transparent text-xs font-bold text-gray-300 focus:outline-none cursor-pointer max-w-[140px] truncate"
                >
                  <option value="All" className="bg-zinc-950 text-white">All Tech</option>
                  {allTechnologies.map((tech) => (
                    <option key={tech} value={tech} className="bg-zinc-950 text-white">
                      {tech}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-2.5">
                <label htmlFor={sortFilterId} className="text-[10px] font-black uppercase tracking-wider text-gray-500">Sort:</label>
                <select
                  id={sortFilterId}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "featured" | "name" | "category" | "status")}
                  className="bg-transparent text-xs font-bold text-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-zinc-950 text-white">Featured First</option>
                  <option value="name" className="bg-zinc-950 text-white">Name (A-Z)</option>
                  <option value="category" className="bg-zinc-950 text-white">Category</option>
                  <option value="status" className="bg-zinc-950 text-white">Status</option>
                </select>
              </div>

              {/* Reset Action */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                  title="Clear all active search and filter constraints"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs Scrollbar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1 border-t border-white/5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 shrink-0 ${
                    isSelected
                      ? "bg-white text-black shadow-lg shadow-white/10"
                      : "bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/10 border border-transparent"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Cards Grid */}
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr"
            >
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onProjectClick(project)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-dark rounded-[2.5rem] p-12 md:p-20 border border-white/10 text-center space-y-6 max-w-2xl mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
                  No Matching Projects Found
                </h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  No projects match your current search and filter combination. Try clearing your filters to explore the entire 50-project archive.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all shadow-xl"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
