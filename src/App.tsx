import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "./lib/LoadingContext";
import { cn } from "./lib/utils";
import { IS_GITHUB_PAGES } from "./lib/api";

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

// Lazy load below-the-fold or conditional routes to keep initial bundle lightweight
const ProjectPage = lazy(() => import("./components/ProjectPage"));
const AdminPage = lazy(() => import("./components/admin/AdminPage"));

function App() {
  const { state } = useLoading();

  // Determine if current route is the private /admin portal
  const isAdminRoute = typeof window !== "undefined" && 
    (window.location.pathname.toLowerCase() === "/admin" || window.location.pathname.toLowerCase().startsWith("/admin/"));

  const [showProjectPage, setShowProjectPage] = useState<boolean>(() => {
    if (typeof window === "undefined" || isAdminRoute) return false;
    return Boolean(new URLSearchParams(window.location.search).get("category"));
  });
  const [initialCategory, setInitialCategory] = useState<string>(() => {
    if (typeof window === "undefined" || isAdminRoute) return "All";
    return new URLSearchParams(window.location.search).get("category") || "All";
  });

  const handleOpenProjectPage = (category = "All") => {
    setInitialCategory(category);
    setShowProjectPage(true);
  };

  const handleCloseProjectPage = () => {
    setShowProjectPage(false);
    // Clear category from URL when closing
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    window.history.pushState({}, "", url.toString());
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
          {!showProjectPage && (
            <Navbar />
          )}
        </AnimatePresence>

        {/* Main Landing Content */}
        <motion.div
          animate={{ 
            opacity: showProjectPage ? 0 : 1,
            scale: showProjectPage ? 0.98 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "w-full origin-center",
            showProjectPage && "pointer-events-none select-none h-screen overflow-hidden"
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
            <Skills onExploreProjects={handleOpenProjectPage} />
          </motion.div>

          <Projects onProjectClick={() => handleOpenProjectPage("All")} />

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

        {/* Project Page Overlay */}
        <AnimatePresence>
          {showProjectPage && (
            <motion.div
              key="project-page"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-3xl overflow-y-auto no-scrollbar"
            >
              <Suspense fallback={
                <div className="min-h-screen bg-black flex items-center justify-center text-white/50 font-mono text-xs uppercase tracking-widest">
                  Loading Projects...
                </div>
              }>
                <ProjectPage 
                  onBack={handleCloseProjectPage} 
                  initialCategory={initialCategory}
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
