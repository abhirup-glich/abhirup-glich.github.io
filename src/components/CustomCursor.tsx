import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [magneticTarget, setMagneticTarget] = useState<HTMLElement | null>(null);

  // Mouse position with high-precision motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-end spring physics for snappier 60fps tracking (simulated DPI enhancement)
  const springConfig = { damping: 30, stiffness: 700, mass: 0.3 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    let lastX = -100;
    let lastY = -100;

    const moveCursor = (e: MouseEvent) => {
      // Simulate higher DPI by applying a small predictive factor to movement
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      
      const multiplier = 1.05; // 5% predictive boost for responsiveness
      
      const targetX = lastX + deltaX * multiplier;
      const targetY = lastY + deltaY * multiplier;

      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = targetX - centerX;
        const distanceY = targetY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        if (distance < 120) {
          mouseX.set(centerX + distanceX * 0.2);
          mouseY.set(centerY + distanceY * 0.2);
          lastX = targetX;
          lastY = targetY;
          return;
        }
      }
      mouseX.set(targetX);
      mouseY.set(targetY);
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // All interactive elements should trigger the glow
      const interactive = target.closest("button, a, .interactive, input, textarea, select");
      
      if (interactive) {
        setIsHovering(true);
        if (interactive.classList.contains("magnetic")) {
          setMagneticTarget(interactive as HTMLElement);
        }
      } else {
        setIsHovering(false);
        setMagneticTarget(null);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [magneticTarget, mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block animate-gpu">
      {/* 🌌 ENHANCED TRAILING GLOW */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full blur-[80px] opacity-20"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, #f97316 0%, #a855f7 100%)",
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.4 : 0.2,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 30 }}
      />

      {/* 🖱️ ENHANCED GLASS CURSOR (60px) */}
      <motion.div
        className="absolute w-12 h-12 rounded-full border-2 border-white/30 backdrop-blur-[6px] will-change-transform flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          background: "rgba(255, 255, 255, 0.05)",
        }}
        animate={{
          scale: isClicking ? 0.8 : (isHovering ? 1.5 : 1),
          borderColor: isClicking ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)",
          backgroundColor: isClicking ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Core Dot */}
        <motion.div 
          className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"
          animate={{
            scale: isClicking ? 2 : 1,
            opacity: isClicking ? 1 : 0.8
          }}
        />
      </motion.div>
    </div>
  );
}
