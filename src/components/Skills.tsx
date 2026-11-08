import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Video, Camera, Layout, Code2, ShieldAlert, Cpu, ExternalLink } from "lucide-react";
import React, { useState } from "react";

const skills = [
  {
    title: "Video Editing",
    category: "Video editing",
    icon: Video,
    details: [
      "Adobe Premiere Pro",
      "Adobe After Effects",
      "Capcut Pro",
      "DaVinci Resolve",
    ],
    color: "from-blue-500 to-indigo-600",
    desc: "Cinematic storytelling and professional color grading for high-end digital content."
  },
  {
    title: "Photo Editing",
    category: "Photo editing",
    icon: Camera,
    details: [
      "Photoshop",
      "Lightroom",
      "Canva",
    ],
    color: "from-pink-500 to-rose-600",
    desc: "Expert retouching and photo manipulation with focus on lighting and texture."
  },
  {
    title: "UI/UX & Web Dev",
    category: "Dev",
    icon: Layout,
    details: [
      "HTML",
      "React / Next.js",
      "Tailwind CSS",
      "Figma",
    ],
    color: "from-amber-500 to-orange-600",
    desc: "Building immersive, performant web experiences with modern tech stacks."
  },
  {
    title: "API & Application Dev",
    category: "Dev",
    icon: Code2,
    details: [
      "FastAPI / Flask",
      "Python",
      "Dart",
      "C/C++",
    ],
    color: "from-emerald-500 to-teal-600",
    desc: "Robust backend systems and automated workflows for complex data processing."
  },
  {
    title: "Cyber Security",
    category: "Cybersecurity",
    icon: ShieldAlert,
    details: [
      "Penetration Testing",
      "Network Security",
      "Attacks",
      "Information Retreval",
    ],
    color: "from-red-500 to-rose-700",
    desc: "Vulnerability assessment and defensive security architecture implementation."
  },
  {
    title: "AI & Automation",
    category: "AI",
    icon: Cpu,
    details: [
      "LLM Integration",
      "Process Automation",
      "Prompt Typing",
    ],
    color: "from-violet-500 to-purple-700",
    desc: "Integrating cutting-edge AI models to automate and optimize business logic."
  },
];

function SkillCard({ skill, index, onExploreProjects }: { skill: typeof skills[0], index: number, onExploreProjects: (cat: string) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  
  // Magnetic Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { damping: 50, stiffness: 400 });
  const mouseYSpring = useSpring(y, { damping: 50, stiffness: 400 });

  // 3D Tilt & Color Shift
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const colorShift = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["rgba(249, 115, 22, 0.2)", "rgba(168, 85, 247, 0.2)"]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        rotateX: isTouchDevice ? undefined : rotateX,
        rotateY: isTouchDevice ? undefined : rotateY,
        transformStyle: isTouchDevice ? undefined : "preserve-3d",
        perspective: isTouchDevice ? undefined : 1000,
      }}
      className="relative group h-full animate-gpu cursor-pointer"
    >
      <motion.div 
        className="glass-dark rounded-[2.5rem] p-6 md:p-10 border border-white/5 h-full flex flex-col justify-between overflow-hidden transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        style={{
          background: useTransform(
            [mouseXSpring, mouseYSpring],
            ([x, y]) => `radial-gradient(circle at ${(x as number + 0.5) * 100}% ${(y as number + 0.5) * 100}%, ${colorShift.get()}, transparent)`
          ),
          transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
        }}
      >
        {/* Animated Glow Edge */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}>
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0] }}
              className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl glass flex items-center justify-center bg-white/5 border-white/10 shadow-inner"
            >
              <skill.icon size={24} className="md:size-[32px] text-white" />
            </motion.div>
          </div>
          
          <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 tracking-tighter uppercase leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            {skill.title}
          </h3>
          
          <p className="text-xs md:text-sm text-gray-400 font-medium mb-6 md:mb-10 leading-relaxed group-hover:text-gray-200 transition-colors">
            {skill.desc}
          </p>
          
          <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-10">
            {skill.details.map((detail) => (
              <motion.div 
                key={detail}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.3)"
                }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md transition-all cursor-default group/skill"
              >
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover/skill:text-white transition-colors">
                  {detail}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onExploreProjects(skill.category)}
          className="w-full py-5 rounded-2xl glass flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all mt-auto border-white/10 group/btn shadow-xl"
        >
          Explore Projects
          <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
        </motion.button>

        {/* 3D Perspective Glow */}
        <motion.div 
          className="absolute -inset-20 bg-gradient-to-r from-orange-500/10 via-purple-600/10 to-blue-500/10 opacity-0 group-hover:opacity-100 blur-[100px] transition-opacity pointer-events-none -z-10"
          style={{
            x: useTransform(mouseXSpring, [-0.5, 0.5], [50, -50]),
            y: useTransform(mouseYSpring, [-0.5, 0.5], [50, -50]),
          }}
        />
    </motion.div>
    </motion.div>
  );
}export default function Skills({ onExploreProjects }: { onExploreProjects: (cat: string) => void }) {
  return (
    <section id="skills" className="section-glow py-16 md:py-16 px-4 md:px-20 relative overflow-hidden bg-black md:min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">SKILL SET</h2>
            <p className="text-gray-500 text-xs font-black tracking-[0.4em] uppercase">Core expertise & technology stack</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:2000px]">
          {skills.map((skill, index) => (
            <SkillCard key={skill.title} skill={skill} index={index} onExploreProjects={onExploreProjects} />
          ))}
        </div>
      </div>
    </section>
  );
}
