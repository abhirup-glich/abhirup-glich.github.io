import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { useLoading } from "../lib/LoadingContext";
import { Menu, X } from "lucide-react";
import favicon from "../assets/favicon.png";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About Me", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Startups", href: "#startups" },
  { name: "Contact Me", href: "#contact" },
];

const rotatingButtons = [
  { name: "Virtual Valley →", href: "https://virtual-valley.vercel.app" },
  { name: "TipFlow →", href: "https://tipflowapp.vercel.app" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [buttonIndex, setButtonIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useLoading();
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      setButtonIndex((prev) => (prev + 1) % rotatingButtons.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) return;

      rafId.current = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);

        // Active section detection
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        const sections = navLinks.map((link) => ({
          id: link.href.substring(1),
          element: document.getElementById(link.href.substring(1)),
        }));

        // Special case for bottom of the page
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
          setActiveSection("contact");
          rafId.current = null;
          return;
        }

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section.element) {
            const rect = section.element.getBoundingClientRect();
            const offsetTop = rect.top + window.scrollY;
            if (scrollPosition >= offsetTop) {
              setActiveSection(section.id);
              break;
            }
          }
        }

        rafId.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (state !== "complete") return null;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center transition-all duration-500"
      style={{ paddingTop: isScrolled ? "1.5rem" : "3rem" }}
    >
      <div
        className={cn(
          "flex items-center justify-between transition-all duration-700 border border-white/10 shadow-2xl overflow-hidden",
          isScrolled
            ? "w-[95%] lg:w-[90%] max-w-6xl px-6 lg:px-10 py-3 rounded-full bg-black/80 backdrop-blur-xl ring-1 ring-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            : "w-full max-w-[95rem] px-8 lg:px-20 py-8 rounded-none bg-black/40 backdrop-blur-md border-transparent"
        )}
      >
        {/* Logo / Portfolio Owner Name */}
        <a href="#home" className="flex items-center gap-3 group cursor-pointer">
          <img
            src={favicon}
            alt="Abhirup Sarkar Logo"
            className="w-6 h-6 hover:scale-110 transition-transform duration-300"
            width={24}
            height={24}
          />
          <span className="text-white font-black tracking-tighter text-lg md:text-xl uppercase">
            ABHIRUP SARKAR<span className="text-white">.</span>
          </span>
        </a>

        {/* Nav Links - Desktop */}
        <div className="hidden lg:flex items-center gap-6 relative">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <a
                href={link.href}
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative px-4 py-2 rounded-full whitespace-nowrap",
                  activeSection === link.href.substring(1)
                    ? "text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {link.name}
                {activeSection === link.href.substring(1) && (
                  <motion.div
                    layoutId="glow"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-600/20 blur-md rounded-full -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </a>
            </div>
          ))}
        </div>

        {/* Rotating Button - Desktop */}
        <a
          href={rotatingButtons[buttonIndex].href}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex px-8 py-3.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all shadow-xl min-w-[176px] h-[35px] items-center justify-center overflow-hidden relative whitespace-nowrap"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={rotatingButtons[buttonIndex].name}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute whitespace-nowrap"
            >
              {rotatingButtons[buttonIndex].name}
            </motion.span>
          </AnimatePresence>
        </a>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white z-[110] touch-manipulation"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay — Glassmorphism */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[105] lg:hidden"
          >
            {/* Glass backdrop */}
            <motion.div
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(24px)" }}
              exit={{ backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Glass menu panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[380px] bg-white/[0.06] backdrop-blur-[40px] border-l border-white/[0.12] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <img src={favicon} alt="Logo" className="w-6 h-6" width={24} height={24} />
                  <span className="text-white font-black tracking-tighter text-lg uppercase">
                    ABHIRUP SARKAR<span className="text-orange-500">.</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white touch-manipulation"
                  aria-label="Close Menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 px-3 mb-4">
                  Navigation
                </p>
                <div className="flex flex-col gap-1.5">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 touch-manipulation group",
                        activeSection === link.href.substring(1)
                          ? "bg-gradient-to-r from-orange-500/20 to-purple-600/15 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                          : "bg-white/[0.03] border border-transparent hover:bg-white/[0.08] hover:border-white/10 active:scale-[0.98]"
                      )}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i + 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300 shrink-0",
                          activeSection === link.href.substring(1)
                            ? "bg-gradient-to-r from-orange-500 to-purple-600 shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                            : "bg-white/15 group-hover:bg-white/30"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-bold uppercase tracking-[0.15em] transition-colors duration-300",
                          activeSection === link.href.substring(1)
                            ? "text-white"
                            : "text-gray-400 group-hover:text-white"
                        )}
                      >
                        {link.name}
                      </span>
                      {activeSection === link.href.substring(1) && (
                        <motion.div
                          layoutId="mobile-active"
                          className="ml-auto px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/30"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        />
                      )}
                    </motion.a>
                  ))}
                </div>
              </nav>

              {/* CTA Section at bottom */}
              <motion.div
                className="px-4 pb-8 pt-4 border-t border-white/[0.08] space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 px-3 mb-2">
                  Startups
                </p>
                {rotatingButtons.map((btn) => (
                  <a
                    key={btn.name}
                    href={btn.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-4 rounded-2xl bg-white/[0.08] backdrop-blur-sm border border-white/10 text-white text-xs font-black uppercase tracking-[0.15em] hover:bg-white/15 active:scale-[0.98] transition-all touch-manipulation shadow-lg"
                  >
                    {btn.name}
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
