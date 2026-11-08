import { useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../lib/useReducedMotion";
import { cn } from "../lib/utils";
import { useLoading } from "../lib/LoadingContext";

const words = [
  "Photo Editing",
  "Video Editing",
  "Cyber Security",
  "API & Application Dev",
  "UI/UX & Web Dev"
];

const fonts = [
  "font-sans font-bold",
  "font-serif font-normal italic",
  "font-mono font-black",
  "font-sans font-extrabold uppercase tracking-tighter",
  "font-serif font-black italic tracking-widest uppercase",
  "font-mono font-medium tracking-[0.3em]",
  "font-sans font-light italic tracking-normal"
];

interface WordMorphProps {
  className?: string;
  intensity?: number;
  frequency?: number;
}

const WordMorph = ({
  className,
  intensity = 0.5,
  frequency = 10
}: WordMorphProps) => {
  const { state } = useLoading();
  const shouldReduceMotion = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [currentFont, setCurrentFont] = useState(fonts[0]);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const layer1Ref = useRef<HTMLHeadingElement>(null);
  const layer2Ref = useRef<HTMLHeadingElement>(null);

  // Optimized glitch parameters
  const glitchParams = useMemo(() => ({
    displacement: 20 * intensity,
    rgbSplit: 8 * intensity,
    skew: 15 * intensity,
    duration: 0.5 // fixed clean glitch duration
  }), [intensity]);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (shouldReduceMotion || state !== "complete") return;

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "none" }
    });
    
    timelineRef.current = tl;

    words.forEach(() => {
      // Stabilization Phase (2 seconds)
      const staticDuration = isHovered ? 1.2 : 2;
      tl.to({}, { duration: staticDuration });

      // Transition Phase (400-600ms)
      const flashDuration = glitchParams.duration / frequency;

      // Start Glitch Sequence
      tl.call(() => setIsGlitching(true), [], "+=0");

      // Rapid multi-step glitch loop
      for (let j = 0; j < frequency; j++) {
        tl.call(() => {
          // Randomized font during glitch
          setCurrentFont(fonts[Math.floor(Math.random() * fonts.length)]);
          
          const xOffset = (Math.random() - 0.5) * glitchParams.displacement;
          const skewX = (Math.random() - 0.5) * glitchParams.skew;
          const opacity = Math.random() > 0.3 ? 1 : 0.6;
          
          // Primary text glitch
          gsap.set(textRef.current, {
            x: xOffset,
            skewX: skewX,
            opacity: opacity,
            textShadow: `${(Math.random()-0.5) * glitchParams.rgbSplit}px 0 rgba(255,0,0,0.7), ${(Math.random()-0.5) * glitchParams.rgbSplit}px 0 rgba(0,0,255,0.7)`,
          });

          // Layered scan-line tearing effect
          if (layer1Ref.current && layer2Ref.current) {
            const top1 = Math.random() * 80;
            const bottom1 = top1 + Math.random() * 20;
            const top2 = Math.random() * 80;
            const bottom2 = top2 + Math.random() * 20;

            gsap.set(layer1Ref.current, {
              display: "block",
              clipPath: `inset(${top1}% 0 ${100 - bottom1}% 0)`,
              x: xOffset * 1.5,
              opacity: 0.5,
            });
            gsap.set(layer2Ref.current, {
              display: "block",
              clipPath: `inset(${top2}% 0 ${100 - bottom2}% 0)`,
              x: -xOffset * 1.5,
              opacity: 0.5,
            });
          }
        }, [], `+=${flashDuration}`);
      }

      // Stabilization & Word Change
      tl.call(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsGlitching(false);
        setCurrentFont(fonts[0]);
        
        // Reset all layers
        gsap.set([textRef.current, layer1Ref.current, layer2Ref.current], {
          clearProps: "all"
        });
        
        // Final entry stabilization
        gsap.fromTo(textRef.current, 
          { 
            y: 5, 
            opacity: 0,
            scale: 0.98
          },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.3,
            ease: "back.out(2)"
          }
        );
      }, [], `+=${flashDuration}`);
    });
  }, { scope: containerRef, dependencies: [shouldReduceMotion, isHovered, glitchParams, frequency, state] });

  // Accessibility fallback
  if (shouldReduceMotion) {
    return (
      <div 
        className={cn(
          "relative flex items-center justify-center min-h-[60px] transition-opacity duration-500",
          state !== "complete" ? "opacity-0" : "opacity-100",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <h1 className="text-2xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-600 text-center">
          {words[0]}
        </h1>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center min-h-[60px] cursor-none transition-opacity duration-500",
        state !== "complete" ? "opacity-0" : "opacity-100",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="status"
      aria-live="polite"
    >
      {/* Main Text */}
      <h1
        ref={textRef}
        className={cn(
          "text-2xl md:text-4xl transition-opacity duration-100",
          "bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-600",
          "text-center tracking-tighter uppercase select-none",
          !isGlitching && "drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]",
          isHovered && !isGlitching && "drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]",
          currentFont,
          className
        )}
      >
        {words[index]}
      </h1>

      {/* Glitch Layers */}
      {isGlitching && (
        <>
          <h1
            ref={layer1Ref}
            className={cn(
              "absolute inset-0 text-2xl md:text-4xl text-red-500/50 pointer-events-none select-none",
              currentFont
            )}
          >
            {words[index]}
          </h1>

          <h1
            ref={layer2Ref}
            className={cn(
              "absolute inset-0 text-2xl md:text-4xl text-blue-500/50 pointer-events-none select-none",
              currentFont
            )}
          >
            {words[index]}
          </h1>
        </>
      )}

      {/* Background Glow */}
      {!isGlitching && (
        <div className={cn(
          "absolute inset-0 -z-10 blur-3xl opacity-20 bg-gradient-to-r from-orange-500 to-purple-600 scale-125 transition-all duration-1000",
          isHovered ? "opacity-40 scale-150" : "opacity-20 scale-125"
        )} />
      )}
    </div>
  );
};

export default WordMorph;