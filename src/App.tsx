import { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "./lib/LoadingContext";
import { cn } from "./lib/utils";
import { IS_GITHUB_PAGES } from "./lib/api";
import { projectsData } from "./data/projects";
import type { ProjectRecord } from "./types/project";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutMe from "./components/AboutMe";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import StartupsSection from "./components/StartupsSection";
import ContactMe from "./components/ContactMe";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import TerminalPopup from "./components/TerminalPopup";
import Loader from "./components/Loader";

import useSmoothScroll from "./lib/useSmoothScroll";

// Lazy load detail and admin routes to keep initial bundle lightweight
const ProjectDetail = lazy(() => import("./components/ProjectDetail"));
const AdminPage = lazy(() => import("./components/admin/AdminPage"));

function App() {
  const { state } = useLoading();

  // Determine if current route is the private /admin portal
  const isAdminRoute = typeof window !== "undefined" && 
    (window.location.pathname.toLowerCase() === "/admin" || window.location.pathname.toLowerCase().startsWith("/admin/"));

  // Helper to extract initial project from URL (/projects/:slug or ?project=:slug)
  const getInitialProject = (): ProjectRecord | null => {
    if (typeof window === "undefined" || isAdminRoute) return null;
    const path = window.location.pathname;
    if (path.startsWith("/projects/")) {
      const slug = path.replace(/^\/projects\/?/, "").split("/")[0].trim().toLowerCase();
      if (slug) {
        return projectsData.find((p) => p.slug.toLowerCase() === slug || p.id.toLowerCase() === slug) || null;
      }
    }
    const querySlug = new URLSearchParams(window.location.search).get("project");
    if (querySlug) {
      const clean = querySlug.trim().toLowerCase();
      return projectsData.find((p) => p.slug.toLowerCase() === clean || p.id.toLowerCase() === clean) || null;
    }
    return null;
  };

  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(getInitialProject);

  // Sync browser back/forward buttons with project details
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith("/projects/")) {
        const slug = path.replace(/^\/projects\/?/, "").split("/")[0].trim().toLowerCase();
        if (slug) {
          const match = projectsData.find((p) => p.slug.toLowerCase() === slug || p.id.toLowerCase() === slug);
          if (match) {
            setSelectedProject(match);
            return;
          }
        }
      }
      const querySlug = new URLSearchParams(window.location.search).get("project");
      if (querySlug) {
        const clean = querySlug.trim().toLowerCase();
        const match = projectsData.find((p) => p.slug.toLowerCase() === clean || p.id.toLowerCase() === clean);
        if (match) {
          setSelectedProject(match);
          return;
        }
      }
      setSelectedProject(null);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectProject = (project: ProjectRecord) => {
    setSelectedProject(project);
    const targetUrl = `/projects/${project.slug}`;
    window.history.pushState({ slug: project.slug }, "", targetUrl);
  };

  const handleCloseProjectDetail = () => {
    setSelectedProject(null);
    window.history.pushState({}, "", "/#projects");
  };

  useSmoothScroll();

  // If on /admin route, display the isolated Admin portal without public portfolio layout
  if (isAdminRoute) {
    if (IS_GITHUB_PAGES) {
      return (
        <main className="admin-mode min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 p-8 text-center">
          <h1 className="text-3xl font-bold">Portfolio administration</h1>
          <p>Content updates for this site are managed through the GitHub repository.</p>
          <a className="underline" href="https://github.com/abhirup-glich/abhirup-glich.github.io/edit/main/data/portfolio-store.json">Edit portfolio content on GitHub</a>
          <a className="underline" href="/">Back to portfolio</a>
        </main>
      );
    }
    return (
      <div className="admin-mode min-h-screen">
        <Suspense fallback={
          <div className="min-h-screen bg-black flex items-center justify-center text-white/50 font-mono text-xs uppercase tracking-widest">
            Loading Admin Portal...
          </div>
        }>
          <AdminPage />
        </Suspense>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {state !== "complete" && (
          <Loader key="loader" />
        )}
      </AnimatePresence>

      <main className={cn(
        "min-h-screen bg-black text-white selection:bg-white/30 overflow-x-hidden font-sans relative",
        state === "loading" && "h-screen overflow-hidden"
      )}>
        <CustomCursor />
        <TerminalPopup />

        {/* Persistent Navbar */}
        <AnimatePresence>
          {!selectedProject && (
            <Navbar />
          )}
        </AnimatePresence>

        {/* Main Landing Content */}
        <motion.div
          animate={{ 
            opacity: selectedProject ? 0 : 1,
            scale: selectedProject ? 0.98 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "w-full origin-center",
            selectedProject && "pointer-events-none select-none h-screen overflow-hidden"
          )}
        >
          <Hero />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={state === "complete" ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AboutMe />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={state === "complete" ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Skills />
          </motion.div>

          <Projects onProjectClick={handleSelectProject} />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={state === "complete" ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <StartupsSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={state === "complete" ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ContactMe />
          </motion.div>

          <Footer />
        </motion.div>

        {/* Project Detail View Overlay */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              key="project-detail"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[150] bg-black overflow-y-auto no-scrollbar"
            >
              <Suspense fallback={
                <div className="min-h-screen bg-black flex items-center justify-center text-white/50 font-mono text-xs uppercase tracking-widest">
                  Loading Project Details...
                </div>
              }>
                <ProjectDetail 
                  project={selectedProject}
                  onBack={handleCloseProjectDetail} 
                  onSelectProject={handleSelectProject}
                />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
