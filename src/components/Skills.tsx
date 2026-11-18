import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Code2, Layout, Cpu, ShieldCheck, Database, Palette } from "lucide-react";
import React, { useState } from "react";

const technicalSkillGroups = [
  {
    title: "Languages & Systems",
    icon: Code2,
    desc: "Low-level system programming, automation scripting, and strongly-typed application development.",
    skills: ["Python", "C/C++", "TypeScript", "JavaScript", "Kotlin", "Dart", "Bash", "SQL"],
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Frontend & UI Engineering",
    icon: Layout,
    desc: "High-performance reactive interfaces, motion physics, and accessible responsive design systems.",
    skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Vite", "PySide6", "HTML5 / CSS3"],
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "AI & Computer Vision",
    icon: Cpu,
    desc: "Real-time edge landmark tracking, deep facial embeddings, and offline speech recognition.",
    skills: ["MediaPipe", "OpenCV", "FaceNet", "Vosk Offline", "Local AI Models", "PyInstaller"],
    color: "from-violet-500 to-purple-700",
  },
  {
    title: "Cybersecurity & Networking",
    icon: ShieldCheck,
    desc: "Hands-on web application security auditing, protocol exploration, and network traffic analysis.",
    skills: ["Burp Suite", "Wireshark", "Kali Linux", "Metasploit", "Nmap", "TR-069 / GenieACS"],
    color: "from-red-500 to-rose-700",
  },
  {
    title: "Backend & Cloud Architecture",
    icon: Database,
    desc: "Scalable API pipelines, relational data persistence, containerized services, and edge delivery.",
    skills: ["PostgreSQL", "Supabase", "FastAPI", "Node.js", "Docker", "MongoDB", "Vercel"],
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "UI/UX & Product Design",
    icon: Palette,
    desc: "User experience architecture, interactive prototyping, design systems, and digital publishing.",
    skills: ["Figma", "Design Systems", "Wireframing", "UI Prototyping", "Vector Design", "InDesign"],
    color: "from-pink-500 to-rose-600",
  },
];

function SkillGroupCard({
  group,
  index,
}: {
  group: (typeof technicalSkillGroups)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  // Magnetic & 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { damping: 50, stiffness: 400 });
  const mouseYSpring = useSpring(y, { damping: 50, stiffness: 400 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const colorShift = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["rgba(249, 115, 22, 0.15)", "rgba(168, 85, 247, 0.15)"]
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
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        rotateX: isTouchDevice ? undefined : rotateX,
        rotateY: isTouchDevice ? undefined : rotateY,
        transformStyle: isTouchDevice ? undefined : "preserve-3d",
        perspective: isTouchDevice ? undefined : 1000,
      }}
      className="relative group h-full animate-gpu"
    >
      <motion.div
        className="glass-dark rounded-[2.5rem] p-6 md:p-8 border border-white/5 h-full flex flex-col justify-between overflow-hidden transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
        style={{
          background: useTransform(
            [mouseXSpring, mouseYSpring],
            ([currX, currY]) =>
              `radial-gradient(circle at ${(currX as number + 0.5) * 100}% ${(currY as number + 0.5) * 100}%, ${colorShift.get()}, transparent)`
          ),
          transform: isHovered ? "translateZ(15px)" : "translateZ(0px)",
        }}
      >
        {/* Animated Glow Edge */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
          {/* Header with Icon */}
          <div className="flex items-center justify-between mb-6">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0] }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl glass flex items-center justify-center bg-white/5 border-white/10 shadow-inner text-white group-hover:text-orange-400 transition-colors"
            >
              <group.icon size={26} />
            </motion.div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 border border-white/10 px-3 py-1 rounded-full">
              {group.skills.length} Tools
            </span>
          </div>

          {/* Group Title */}
          <h3 className="text-xl md:text-2xl font-black mb-3 tracking-tighter uppercase leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            {group.title}
          </h3>

          {/* Description */}
          <p className="text-xs md:text-sm text-gray-400 font-medium mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
            {group.desc}
          </p>

          {/* Technologies Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {group.skills.map((skill) => (
              <motion.div
                key={skill}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  borderColor: "rgba(255, 255, 255, 0.25)",
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md transition-all cursor-default"
              >
                <span className="text-[10px] md:text-[11px] font-bold text-gray-300 tracking-wider group-hover:text-white transition-colors">
                  {skill}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Subtle Ambient Hover Glow */}
        <div className="absolute -inset-10 bg-gradient-to-r from-orange-500/10 via-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity pointer-events-none -z-10" />
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="section-glow py-16 md:py-24 px-4 md:px-20 relative overflow-hidden bg-black flex flex-col justify-center scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 md:mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              SKILL SET
            </h2>
            <p className="text-gray-500 text-xs font-black tracking-[0.4em] uppercase">
              Core expertise & technology stack
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 [perspective:2000px]">
          {technicalSkillGroups.map((group, index) => (
            <SkillGroupCard key={group.title} group={group} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
