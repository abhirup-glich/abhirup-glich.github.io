import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ExternalLink, Terminal, Code2, Globe, Cpu } from "lucide-react";
import { fetchPublishedProjects, type ProjectItem } from "../lib/api";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * Continuous looping Under Construction animated graphic
 * Lightweight SVG & CSS transform motion with zero heavy video/GIF
 */
function UnderConstructionGraphic() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-36 h-36 md:w-48 md:h-48 mx-auto flex items-center justify-center">
      {/* Ambient Pulsing Background Glow */}
      <motion.div
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500 to-purple-600 blur-2xl pointer-events-none"
      />

      {/* Rotating Outer Radar / Blueprint Ring */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full text-white/20"
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="rgba(249, 115, 22, 0.3)"
          strokeWidth="1.5"
          strokeDasharray="12 12"
        />
        {/* Orbiting Tech Node */}
        <circle cx="100" cy="10" r="4" fill="#f97316" />
        <circle cx="190" cy="100" r="3" fill="#a855f7" />
      </motion.svg>

      {/* Counter-rotating Inner Ring */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] text-white/10"
        animate={shouldReduceMotion ? {} : { rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="100"
          cy="100"
          r="55"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <circle cx="100" cy="45" r="3" fill="#ffffff" opacity="0.6" />
      </motion.svg>

      {/* Center Themed Isometric Construction Symbol */}
      <motion.div
        animate={shouldReduceMotion ? {} : {
          y: [-4, 4, -4],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/20 flex items-center justify-center shadow-2xl shadow-orange-500/20"
      >
        {/* Core animated icon */}
        <Code2 className="w-8 h-8 md:w-10 md:h-10 text-orange-400" />

        {/* Pulse Beacon */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
        </span>
      </motion.div>
    </div>
  );
}

/**
 * Animated Logo / Themed Vector Graphic for Project Tiles
 */
function ProjectTileLogo({ logoUrl, category }: { logoUrl?: string; category: string }) {
  const shouldReduceMotion = useReducedMotion();

  if (logoUrl) {
    return (
      <motion.div
        animate={shouldReduceMotion ? {} : {
          y: [-2, 2, -2],
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/[0.04] border border-white/10 p-3 flex items-center justify-center shadow-xl backdrop-blur-md"
      >
        <img
          src={logoUrl}
          alt="Project Logo"
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </motion.div>
    );
  }

  // Themed Vector Graphic fallback based on category
  const cat = (category || '').toLowerCase();
  let iconNode = <Code2 className="w-10 h-10 text-white group-hover:text-orange-400 transition-colors relative z-10" />;
  if (cat.includes('cyber') || cat.includes('sec')) {
    iconNode = <Terminal className="w-10 h-10 text-white group-hover:text-orange-400 transition-colors relative z-10" />;
  } else if (cat.includes('ai')) {
    iconNode = <Cpu className="w-10 h-10 text-white group-hover:text-orange-400 transition-colors relative z-10" />;
  } else if (cat.includes('dev') || cat.includes('web')) {
    iconNode = <Globe className="w-10 h-10 text-white group-hover:text-orange-400 transition-colors relative z-10" />;
  }

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : {
        y: [-3, 3, -3],
        rotate: [0, 1, -1, 0],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/15 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:border-orange-500/40 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-purple-600/20 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition-opacity" />
      {iconNode}
    </motion.div>
  );
}

/**
 * Preserved Project Card Component
 */
function ProjectCard({ project, index, onClick }: { project: ProjectItem; index: number; onClick?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="group relative rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 col-span-1 aspect-[4/3] md:aspect-auto cursor-pointer transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] flex flex-col justify-between"
    >
      {/* Background Animated Logo / Themed Vector Graphic Area (Replaced sliding image carousel) */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-black">
        <ProjectTileLogo logoUrl={project.logo_url} category={project.category} />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 z-10 p-6 md:p-10 flex flex-col justify-end">
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 backdrop-blur-md">
              {project.category}
            </span>
          </div>

          <h3 className="font-black tracking-tighter text-white leading-tight text-xl md:text-3xl">
            {project.title}
          </h3>

          <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed line-clamp-2">
            {project.description}
          </p>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white hover:text-orange-400 transition-colors pt-2"
            >
              <span>Explore Project</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Interactive Borders & Glows */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-orange-500/30 transition-colors duration-500 rounded-[2.5rem] pointer-events-none" />
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity pointer-events-none" />
    </motion.div>
  );
}

export default function Projects({ onProjectClick }: { onProjectClick?: (category?: string) => void } = {}) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      try {
        const data = await fetchPublishedProjects();
        if (isMounted) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to load published projects:", err);
      }
    };

    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const hasPublishedProjects = projects.length > 0;

  return (
    <section 
      id="projects" 
      className="py-12 md:py-24 px-4 md:px-20 relative overflow-hidden bg-black scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-20 text-center md:text-left"
        >
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            PROJECTS
          </h2>
          <p className="text-gray-500 text-xs font-black tracking-[0.4em] uppercase">
            Interactive case studies & labs
          </p>
        </motion.div>

        {/* Dynamic Project Display: Looping Under Construction vs Published Tiles */}
        <AnimatePresence mode="wait">
          {!hasPublishedProjects ? (
            /* Polished Looping Under Construction State */
            <motion.div
              key="under-construction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-dark rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 border border-white/5 relative overflow-hidden text-center shadow-2xl">
                {/* Ambient Radial Gradient Glow */}
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-orange-500/10 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  {/* Looping Construction Animation Graphic */}
                  <UnderConstructionGraphic />

                  {/* Status Highlight Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                    <span>In Active Development</span>
                  </div>

                  {/* Headline */}
                  <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                    Projects Are Taking Shape
                  </h3>

                  {/* Brief Supporting Text */}
                  <p className="text-gray-400 text-sm md:text-base font-medium max-w-md mx-auto leading-relaxed">
                    Projects are taking shape. Check back soon for interactive case studies, open-source utilities, and digital solutions.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Published Projects Grid using Preserved Tile Layout */
            <motion.div
              key="published-projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 md:auto-rows-[400px]"
            >
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onClick={() => onProjectClick?.(project.category)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
