import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchStartups, type StartupItem, DEFAULT_STARTUPS } from "../lib/api";
import virtualValleyLogo from "../assets/virtualvalley-logo.png";
import tipflowLogo from "../assets/tipflow-logo.png";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * Animated counter for numeric values with suffixes
 */
function Counter({ value, duration = 1.5 }: { value: string; duration?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  const [displayValue, setDisplayValue] = useState(() => shouldReduceMotion ? numericValue : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (shouldReduceMotion) return;

    if (isInView) {
      let startTime: number | null = null;
      const endValue = numericValue;
      const totalDuration = duration * 1000;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / totalDuration, 1);
        const easedProgress = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(easedProgress * endValue);

        setDisplayValue(current);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, numericValue, duration, shouldReduceMotion]);

  if (numericValue === 0 && !suffix) {
    return <span ref={ref} className="tabular-nums">{value}</span>;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}

/**
 * Skeleton Loader for Startup Cards
 */
const StartupSkeleton = () => (
  <div className="w-full md:w-[45%] glass-dark rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 border border-white/5 relative animate-pulse">
    <div className="flex items-center justify-between mb-8">
      <div className="h-12 w-12 bg-white/10 rounded-2xl" />
      <div className="h-6 w-28 bg-white/10 rounded-full" />
    </div>
    <div className="h-10 w-2/3 bg-white/10 rounded-xl mb-6" />
    <div className="space-y-3 mb-10">
      <div className="h-4 w-full bg-white/5 rounded-full" />
      <div className="h-4 w-5/6 bg-white/5 rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-4 md:gap-8 pt-8 border-t border-white/10">
      <div className="space-y-2">
        <div className="h-3 w-1/2 bg-white/5 rounded-full" />
        <div className="h-8 w-3/4 bg-white/10 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-1/2 bg-white/5 rounded-full" />
        <div className="h-8 w-3/4 bg-white/10 rounded-lg" />
      </div>
    </div>
    <div className="h-14 md:h-16 w-full bg-white/10 rounded-[1.5rem] md:rounded-[2rem] mt-10" />
  </div>
);

export default function StartupsSection() {
  const [startups, setStartups] = useState<StartupItem[]>(DEFAULT_STARTUPS);
  const [loading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchStartups();
        if (isMounted && data && data.length > 0) {
          setStartups(data);
        }
      } catch (err) {
        console.error("Startups fetch error:", err);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Get brand logo for startup
  const getStartupLogo = (id: string, name: string) => {
    const key = (id || name || '').toLowerCase();
    if (key.includes('virtual') || key.includes('valley')) {
      return virtualValleyLogo;
    }
    return tipflowLogo;
  };

  // Color gradient styling
  const getColorScheme = (startup: StartupItem) => {
    const isMonochrome = 
      startup.accent_color?.toLowerCase() === 'monochrome' || 
      startup.id === 'virtual-valley' || 
      startup.name.toLowerCase().includes('virtual');

    if (isMonochrome) {
      return {
        glow: "from-slate-400 via-zinc-200 to-white",
        glowOpacity: "opacity-10 group-hover:opacity-20",
        btnGradient: "bg-gradient-to-r from-zinc-200 via-white to-zinc-300 text-black shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]",
        badge: "bg-white/[0.08] border-white/20 text-white/90 shadow-[0_0_15px_rgba(255,255,255,0.08)]",
        badgeDot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
        timelineDot: "from-zinc-200 to-white shadow-[0_0_15px_rgba(255,255,255,0.4)]",
      };
    }

    // Default to TipFlow's coordinated orange accent
    return {
      glow: "from-orange-500 via-amber-500 to-red-600",
      glowOpacity: "opacity-10 group-hover:opacity-20",
      btnGradient: "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40",
      badge: "bg-orange-500/10 border-orange-500/30 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.15)]",
      badgeDot: "bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]",
      timelineDot: "from-orange-500 to-red-600 shadow-[0_0_15px_rgba(249,115,22,0.4)]",
    };
  };

  return (
    <section 
      id="startups" 
      className="section-glow py-16 md:py-32 px-4 md:px-20 relative overflow-hidden bg-black md:min-h-screen scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-24 text-center md:text-left"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            Startups
          </h2>
          <p className="text-gray-500 text-xs font-black tracking-[0.4em] uppercase">
            Ventures & Growth Statistics
          </p>
        </motion.div>

        {/* Timeline Line (Desktop) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[300px] bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent hidden md:block pointer-events-none" />

        <div className="space-y-12 md:space-y-24 relative z-10">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2].map((i) => (
                <div 
                  key={`skeleton-${i}`} 
                  className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <StartupSkeleton />
                  <div className="hidden md:block w-[10%]" />
                  <div className="hidden md:block w-[45%]" />
                </div>
              ))
            ) : (
              startups.map((startup, index) => {
                const colorScheme = getColorScheme(startup);
                const isLeft = index % 2 === 0;
                const logoSrc = getStartupLogo(startup.id, startup.name);

                return (
                  <motion.div
                    key={startup.id || startup.name}
                    initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex flex-col md:flex-row items-center gap-12 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content Card */}
                    <div className="w-full md:w-[45%] glass-dark rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 border border-white/5 relative group hover:border-white/10 transition-all duration-700 overflow-hidden shadow-2xl">
                      {/* Background Ambient Glow */}
                      <div 
                        className={`absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br ${colorScheme.glow} ${colorScheme.glowOpacity} blur-[120px] transition-opacity duration-700 pointer-events-none`} 
                      />

                      <div className="relative z-10 space-y-6 md:space-y-8">
                        {/* Top Bar: Brand Logo & Status Microhighlight */}
                        <div className="flex items-center justify-between gap-4">
                          <motion.div 
                            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/[0.04] border border-white/10 p-2.5 flex items-center justify-center shrink-0 shadow-lg backdrop-blur-md"
                            animate={shouldReduceMotion ? {} : {
                              y: [0, -3, 0],
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <img 
                              src={logoSrc} 
                              alt={`${startup.name} Logo`} 
                              className="w-full h-full object-contain"
                              width={56}
                              height={56}
                              loading="lazy"
                            />
                          </motion.div>

                          {/* Status Microhighlight */}
                          <div className={`px-4 py-1.5 rounded-full border text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 backdrop-blur-md ${colorScheme.badge}`}>
                            <span className={`w-2 h-2 rounded-full ${colorScheme.badgeDot} animate-pulse`} />
                            <span>{startup.status}</span>
                          </div>
                        </div>

                        {/* Startup Name */}
                        <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                          {startup.name}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-400 text-base md:text-lg leading-relaxed font-medium">
                          {startup.description}
                        </p>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4 md:gap-8 pt-8 border-t border-white/10">
                          {/* View 1 */}
                          <div className="flex flex-col gap-2">
                            <div className="text-[8px] md:text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">
                              {startup.view1_name}
                            </div>
                            <div className="text-2xl md:text-4xl font-black text-white tracking-tighter">
                              <Counter value={startup.view1_value} />
                            </div>
                          </div>

                          {/* View 2 */}
                          <div className="flex flex-col gap-2">
                            <div className="text-[8px] md:text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">
                              {startup.view2_name}
                            </div>
                            <div className="text-2xl md:text-4xl font-black text-white tracking-tighter">
                              <Counter value={startup.view2_value} />
                            </div>
                          </div>
                        </div>

                        {/* CTA Link Button */}
                        <a
                          href={startup.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] ${colorScheme.btnGradient} font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group/btn mt-4`}
                        >
                          <span>{startup.button_text || `Visit ${startup.name}`}</span>
                          <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    </div>

                    {/* Timeline Dot (Desktop only) */}
                    <div className="hidden md:flex w-[10%] justify-center relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="w-12 h-12 rounded-full glass border-white/20 flex items-center justify-center relative z-20 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                      >
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${colorScheme.timelineDot} animate-pulse`} />
                      </motion.div>
                    </div>

                    {/* Empty space for alternating layout (Desktop only) */}
                    <div className="hidden md:block w-[45%]" />
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
