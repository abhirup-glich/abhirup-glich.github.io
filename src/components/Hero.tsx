import { useReducedMotion } from "../lib/useReducedMotion";
import { motion, useScroll, useTransform, useSpring, useMotionValue, type Variants, type MotionValue } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import WordMorph from "./WordMorph";
import { useRef, useEffect } from "react";
import { useLoading } from "../lib/LoadingContext";
import { cn } from "../lib/utils";

import pythonLogo from "../assets/bg_logo/Python-logo-notext.svg.webp";
import reactLogo from "../assets/bg_logo/React-icon.svg.webp";
import kaliLogo from "../assets/bg_logo/Kali-dragon-icon.svg.png";
import dockerLogo from "../assets/bg_logo/docker.svg";
import typescriptLogo from "../assets/bg_logo/typescript.svg";
import vscodeLogo from "../assets/bg_logo/Visual_Studio_Code_1.35_icon.svg.webp";
import wiresharkLogo from "../assets/bg_logo/Wireshark_icon_new.png";
import supabaseLogo from "../assets/bg_logo/supabase.svg";

const bgLogos = [
  { src: pythonLogo, color: "rgba(55, 118, 171, 0.2)", size: 80, blur: 0 },
  { src: reactLogo, color: "rgba(97, 218, 251, 0.2)", size: 120, blur: 2 },
  { src: kaliLogo, color: "rgba(49, 120, 198, 0.2)", size: 60, blur: 1 },
  { src: dockerLogo, color: "rgba(36, 150, 237, 0.2)", size: 95, blur: 2 },
  { src: typescriptLogo, color: "rgba(49, 120, 198, 0.2)", size: 85, blur: 1 },
  { src: vscodeLogo, color: "rgba(0, 120, 215, 0.2)", size: 110, blur: 4 },
  { src: wiresharkLogo, color: "rgba(20, 92, 160, 0.2)", size: 70, blur: 1 },
  { src: supabaseLogo, color: "rgba(62, 207, 142, 0.2)", size: 90, blur: 2 },
];

const popInAnimation: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

interface FloatingLogoProps {
  logo: (typeof bgLogos)[number];
  index: number;
  smoothMouseX: MotionValue<number>;
  smoothMouseY: MotionValue<number>;
}

function FloatingLogo({ logo, index, smoothMouseX, smoothMouseY }: FloatingLogoProps) {
  const x = useTransform(smoothMouseX, [-0.5, 0.5], [-(index + 1) * 20, (index + 1) * 20]);
  const y = useTransform(smoothMouseY, [-0.5, 0.5], [-(index + 1) * 20, (index + 1) * 20]);

  return (
    <motion.div
      className={cn("absolute", index >= 4 && "hidden md:block")}
      style={{
        top: `${(index * 15 + 10) % 90}%`,
        left: `${(index * 25 + 5) % 95}%`,
        x,
        y,
        filter: `blur(${logo.blur}px)`,
      }}
    >
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 360],
        }}
        transition={{
          y: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 30 + index * 5, repeat: Infinity, ease: "linear" },
        }}
        className="relative opacity-[0.12] hover:opacity-[0.3] transition-opacity duration-500 will-change-transform"
      >
        <img
          src={logo.src}
          alt="tech"
          loading="lazy"
          className="brightness-110 contrast-110 w-[var(--logo-size-mobile)] h-[var(--logo-size-mobile)] md:w-[var(--logo-size)] md:h-[var(--logo-size)]"
          style={{ 
            '--logo-size': `${logo.size}px`,
            '--logo-size-mobile': `${Math.round(logo.size * 0.55)}px`,
          } as React.CSSProperties}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const { state } = useLoading();
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  
  // Parallax & Fade
  const yParallax = useTransform(scrollY, [0, 1050], shouldReduceMotion ? [0, 0] : [0, 420]);
  const opacityFade = useTransform(scrollY, [0, 500], shouldReduceMotion ? [1, 1] : [1, 0]);
  const scaleEffect = useTransform(scrollY, [0, 500], shouldReduceMotion ? [1, 1] : [1, 0.8]);

  // Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 50, stiffness: 200 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  const blobX = useTransform(smoothMouseX, [-0.5, 0.5], [-60, 60]);
  const blobY = useTransform(smoothMouseY, [-0.5, 0.5], [-60, 60]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shouldReduceMotion, mouseX, mouseY]);

  return (
    <section 
      id="home"
      ref={containerRef}
      className={cn(
        "relative min-h-[100vh] flex flex-col items-center justify-center pt-20 overflow-hidden bg-[#020202] animate-gpu transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        state === "loading" || state === "exiting" ? "opacity-0 scale-95" : "opacity-100 scale-100"
      )}
      style={{
        clipPath: state === "loading" || state === "exiting" 
          ? "inset(50% 0 50% 0)" 
          : "inset(0% 0 0% 0)"
      }}
    >
      {/* LAYER 1: Base Gradient & Grid */}
      <div className="absolute -inset-[5%] bg-gradient-to-b from-black via-[#0a0212] to-black z-0 pointer-events-none" />
      <div 
        className="absolute -inset-[5%] opacity-[0.15] pointer-events-none z-[1]"
        style={{
          backgroundImage: `linear-gradient(#4a0080 1px, transparent 1px), linear-gradient(90deg, #4a0080 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />

      {/* LAYER 2: Moving Blobs */}
      {!shouldReduceMotion && (
        <motion.div 
          className="absolute -inset-[10%] z-[2] overflow-hidden pointer-events-none"
          style={{ x: blobX, y: blobY }}
        >
          <motion.div 
            animate={{ x: [0, isMobile ? 40 : 100, 0], y: [0, isMobile ? 20 : 50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={cn("absolute top-1/4 left-1/4 bg-orange-500/10 rounded-full will-change-transform", isMobile ? "w-[300px] h-[300px] blur-[80px]" : "w-[600px] h-[600px] blur-[120px]")} 
          />
          <motion.div 
            animate={{ x: [0, isMobile ? -40 : -100, 0], y: [0, isMobile ? -30 : -80, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className={cn("absolute bottom-1/4 right-1/4 bg-purple-600/10 rounded-full will-change-transform", isMobile ? "w-[350px] h-[350px] blur-[100px]" : "w-[700px] h-[700px] blur-[150px]")} 
          />
        </motion.div>
      )}

      {/* LAYER 3: Floating Logos */}
      {!shouldReduceMotion && (
        <div className="absolute -inset-[5%] z-[3] pointer-events-none overflow-hidden">
          {bgLogos.map((logo, index) => (
            <FloatingLogo
              key={index}
              logo={logo}
              index={index}
              smoothMouseX={smoothMouseX}
              smoothMouseY={smoothMouseY}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <motion.div
        style={{ y: yParallax, opacity: opacityFade, scale: scaleEffect }}
        className="text-center z-10 px-4 w-full"
        initial="hidden"
        animate={state === "complete" ? "visible" : "hidden"}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } }
        }}
      >
        <motion.div
          variants={popInAnimation}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 text-xs font-black uppercase tracking-[0.4em] text-orange-500/80"
        >
          <Sparkles size={14} />
          DESIGN • CODE • SECURE
        </motion.div>

        <motion.h1 
          className="text-[12vw] md:text-[10vw] lg:text-[8.5rem] font-black tracking-tighter leading-none mb-6 text-center"
          variants={popInAnimation}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20">Abhirup Sarkar</span>
        </motion.h1>
        
        <motion.div variants={popInAnimation} className="mb-12 min-h-[3rem] flex items-center justify-center">
          <WordMorph />
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10 w-full px-4"
          variants={popInAnimation}
        >
          <a href="#projects" className="magnetic group relative w-full sm:w-auto px-8 sm:px-12 py-5 rounded-[50px] bg-white text-black font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 flex items-center justify-center text-center">
            <span className="relative z-10">View Projects</span>
            <div className="absolute inset-0 bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a href="#contact" className="magnetic group relative w-full sm:w-auto px-8 sm:px-12 py-5 rounded-[50px] glass border-white/10 text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 flex items-center justify-center text-center">
            <span className="relative z-10">Contact Me</span>
            <div className="absolute inset-0 bg-purple-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </motion.div>
      </motion.div>

      {/* Mouse Glow Lighting (Global Context via Cursor) */}
      <motion.div 
        className="absolute -inset-[5%] pointer-events-none z-[4] mix-blend-overlay opacity-30"
        style={{ 
          background: useTransform(
            [smoothMouseX, smoothMouseY],
            ([x, y]) => `radial-gradient(circle at ${(x as number + 0.5) * 100}% ${(y as number + 0.5) * 100}%, rgba(249,115,22,0.3) 0%, rgba(168,85,247,0.3) 50%, transparent 100%)`
          )
        }} 
      />

      {/* 🏹 ANIMATED BOUNCE ARROW */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div 
            className="w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/10 animate-bounce-custom"
          >
            <ChevronDown size={24} strokeWidth={3} />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
