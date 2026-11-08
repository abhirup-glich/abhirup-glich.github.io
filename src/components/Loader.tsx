import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { useLoading } from "../lib/LoadingContext";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

/**
 * Types for Loader variants and configuration
 */
export type LoaderVariant = "spinner" | "skeleton" | "progress" | "full-page";

export interface LoaderProps {
  variant?: LoaderVariant;
  className?: string;
  size?: string;
  color?: string;
  label?: string;
  progress?: number;
  height?: string;
  width?: string;
  fullscreen?: boolean;
}

/**
 * Spinner Component - Circular loading indicator
 */
const Spinner = ({ size = "w-10 h-10", color = "border-orange-500", label = "Loading..." }: Partial<LoaderProps>) => (
  <div 
    className={cn("relative", size)}
    role="status"
    aria-label={label}
  >
    <div className={cn("absolute inset-0 rounded-full border-2 border-t-transparent animate-spin", color)} />
    <div className={cn("absolute inset-0 rounded-full border-2 border-white/10")} />
    <span className="sr-only">{label}</span>
  </div>
);

/**
 * Skeleton Component - Placeholder for loading content
 */
const Skeleton = ({ width = "w-full", height = "h-4", className }: Partial<LoaderProps>) => (
  <div 
    className={cn(
      "bg-white/5 rounded-md relative overflow-hidden",
      width,
      height,
      className
    )}
    role="status"
    aria-label="Loading content placeholder"
  >
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/2 h-full"
    />
  </div>
);

/**
 * Progress Component - Horizontal progress bar
 */
const Progress = ({ progress = 0, color = "bg-orange-500", label = "Loading progress" }: Partial<LoaderProps>) => (
  <div 
    className="w-full space-y-2"
    role="progressbar"
    aria-valuenow={progress}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={label}
  >
    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className={cn("h-full", color)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  </div>
);

/**
 * Premium Cinematic Full Page Loader
 */
const FullPageLoader = () => {
  const { setState } = useLoading();
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const nameTopRef = useRef<HTMLDivElement>(null);
  const nameBottomRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Fallback timer to prevent getting stuck on black screen if GSAP fails
    const fallbackTimer = setTimeout(() => {
      console.warn("Loader: GSAP animation took too long, forcing completion.");
      setState("complete");
    }, 10000);

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(fallbackTimer);
        setState("complete");
      }
    });

    // Reset initial states
    try {
      gsap.set(bgRef.current, { opacity: 0 });
      gsap.set(barRef.current, { scaleX: 0, height: "5px", opacity: 1, backgroundColor: "white" });
      gsap.set(marqueeRef.current, { opacity: 0, height: 0 });
      gsap.set(nameTopRef.current, { y: -50, opacity: 0, filter: "blur(10px)" });
      gsap.set(nameBottomRef.current, { y: 50, opacity: 0, filter: "blur(10px)" });

      // 1. BLACK → GRADIENT REVEAL (0.8s)
      tl.to(bgRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "expo.out"
      });

      // 2. WHITE BAR ENTRY (0.5s)
      tl.to(barRef.current, {
        scaleX: 1,
        duration: 0.5,
        ease: "power3.inOut"
      }, "-=0.2");

      // 3. BAR EXPANDS INTO TEXT CONTAINER (1.2s)
      tl.to(barRef.current, {
        height: "80px",
        duration: 1.2,
        ease: "power3.inOut"
      });
      tl.to(marqueeRef.current, {
        opacity: 1,
        height: "auto",
        duration: 0.8,
        ease: "power3.out"
      }, "-=1.0");

      // 4. NAME REVEAL (0.8s)
      tl.to([nameTopRef.current, nameBottomRef.current], {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out"
      }, "-=0.5");

      // 5. FADE COLLAPSE (0.6s)
      tl.to([nameTopRef.current, nameBottomRef.current, bgRef.current], {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut"
      }, "+=1.0");
      tl.to(barRef.current, {
        height: "5px",
        duration: 0.6,
        ease: "power3.inOut"
      }, "-=0.6");
      tl.to(marqueeRef.current, {
        opacity: 0,
        duration: 0.3
      }, "-=0.6");

      // 6. HERO TRANSITION (0.9s)
      // Vertical Expansion Wipe
      tl.to(barRef.current, {
        height: "100vh",
        duration: 0.9,
        ease: "expo.inOut",
        onStart: () => {
          setState("hero-entering");
        }
      });
      
      // Final fade of the white reveal bar
      tl.to(barRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    } catch (error) {
      console.error("Loader: Animation error:", error);
      setState("complete");
    }

    return () => {
      clearTimeout(fallbackTimer);
      tl.kill();
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden">
      {/* Cinematic Gradient Background */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 opacity-0 overflow-hidden"
      >
        <div className="absolute inset-0 animate-gradient-slow opacity-60">
          <div className="absolute top-[-20%] right-[-20%] w-[100%] h-[100%] bg-[#6A00FF] rounded-full blur-[150px] opacity-40" />
          <div className="absolute bottom-[-20%] left-[-20%] w-[100%] h-[100%] bg-[#FF5A00] rounded-full blur-[150px] opacity-40" />
        </div>
      </div>

      {/* Grain/Noise Overlay (Inline data-URI to avoid external network lag) */}
      <div className="absolute inset-0 z-[1] opacity-[0.08] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] mix-blend-overlay" />

      {/* Names Reveal Wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {/* ABHIRUP (Outline Text) */}
        <div 
          ref={nameTopRef}
          className="text-[12vw] font-black tracking-tighter text-transparent select-none pointer-events-none mb-[-4vw]"
          style={{ 
            WebkitTextStroke: "2px rgba(255, 255, 255, 1)",  
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.05))"
          }}
        >
          ABHIRUP
        </div>

        {/* White Bar / Marquee Container */}
        <div 
          ref={barRef}
          className="relative w-screen bg-white shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center overflow-hidden z-20"
        >
          <div ref={marqueeRef} className="w-full py-4 opacity-0 flex items-center">
            <div className="flex whitespace-nowrap animate-marquee text-black font-black text-[5vw] tracking-tighter uppercase leading-none">
              <span className="px-8 flex items-center">DESIGN • CODE • SECURE • DESIGN • CODE • SECURE • DESIGN • CODE • SECURE • DESIGN • CODE • SECURE • </span>
              <span className="px-8 flex items-center">DESIGN • CODE • SECURE • DESIGN • CODE • SECURE • DESIGN • CODE • SECURE • DESIGN • CODE • SECURE • </span>
            </div>
          </div>
        </div>

        {/* SARKAR (Outline Text) */}
        <div 
          ref={nameBottomRef}
          className="text-[12vw] font-black tracking-tighter text-transparent select-none pointer-events-none mt-[-4.8vw]"
          style={{ 
            WebkitTextStroke: "2px rgba(255, 255, 255, 1)",
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.05))"
          }}
        >
          SARKAR
        </div>
      </div>

      {/* CSS for marquee and gradient animations */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes gradient-slow {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-2%, 2%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-gradient-slow {
          animation: gradient-slow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

/**
 * Main Loader Component
 */
const Loader = ({ 
  variant = "full-page", 
  className,
  size,
  color,
  label,
  progress,
  height,
  width,
  fullscreen = false
}: LoaderProps) => {
  const containerClasses = cn(
    "flex items-center justify-center",
    fullscreen && "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
    className
  );

  switch (variant) {
    case "spinner":
      return (
        <div className={containerClasses}>
          <Spinner size={size} color={color} label={label} />
        </div>
      );
    case "skeleton":
      return <Skeleton width={width} height={height} className={className} />;
    case "progress":
      return (
        <div className={cn("w-full", className)}>
          <Progress progress={progress} color={color} label={label} />
        </div>
      );
    case "full-page":
      return <FullPageLoader key="full-page-loader" />;
    default:
      return null;
  }
};

Loader.Spinner = Spinner;
Loader.Skeleton = Skeleton;
Loader.Progress = Progress;

export default Loader;
