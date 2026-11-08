import { motion, useInView } from "framer-motion";
import { Users, Download, Eye, Heart, Package, ShoppingCart, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Counter({ value, duration = 2 }: { value: string, duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      const endValue = numericValue;
      const totalDuration = duration * 1000; // to ms

      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / totalDuration, 1);
        
        // Ease out quad
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
  }, [isInView, numericValue, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}

const startups = [
  {
    title: "Buggy But Brilliant",
    description: "A Brilliant agency to built and create websites, videos and digital designs. We built and deliver.",
    stats: [
      { label: "Total Customers", value: "2500+", icon: Users },
      { label: "Total Products Delivered", value: "850+", icon: Package },
    ],
    buttonText: "Visit Website",
    color: "from-orange-500 to-red-600",
    link: "https://buggybutbrilliant.netlify.app/",
  },
  {
    title: "AbSa Studio",
    description: "A creative digital agency specializing in video production, motion graphics, high-end visual storytelling & more.",
    stats: [
      { label: "Total Views", value: "0", icon: Eye },
      { label: "Subscribers", value: "0", icon: Heart },
    ],
    buttonText: "Launching this May",
    color: "from-blue-500 to-indigo-600",
    link: "https://loading-screen-three.vercel.app", // Placeholder
  },
  {
    title: "AbSa Digitals",
    description: "Premium digital assets including Apps, Mods for OS, UI kits for modern designers & more.",
    stats: [
      { label: "Products Listed", value: "0", icon: Package },
      { label: "Total Downloads", value: "0", icon: Download },
    ],
    buttonText: "Coming Soon",
    color: "from-purple-500 to-pink-600",
    link: "https://loading-screen-three.vercel.app", // Placeholder
  },
  {
    title: "AbSa Wearables",
    description: "Cool merchandise and wearables crafted for the modern and tech-savvy world.",
    stats: [
      { label: "Products Listed", value: "0", icon: Package },
      { label: "Total Sales", value: "0", icon: ShoppingCart },
    ],
    buttonText: "Coming Soon",
    color: "from-emerald-500 to-teal-600",
    link: "https://loading-screen-three.vercel.app", // Placeholder
  },
];

export default function Startups() {
  return (
    <section id="startups" className="section-glow py-32 px-6 md:px-20 relative overflow-hidden bg-black">
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center md:text-left"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Startups</h2>
          <p className="text-gray-500 text-lg font-medium tracking-widest uppercase">Ventures & Statistics</p>
        </motion.div>

        {/* Timeline Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[300px] bottom-0 w-[1px] bg-gradient-to-b from-primary/50 via-secondary/50 to-accent/50 opacity-20 hidden md:block" />

        <div className="space-y-24 relative z-10">
          {startups.map((startup, index) => (
            <motion.div
              key={startup.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Content Card */}
              <div className="w-full md:w-[45%] glass-dark rounded-[3.5rem] p-10 md:p-14 border border-white/5 relative group hover:border-white/10 transition-all duration-700 overflow-hidden shadow-2xl">
                {/* Background Glow */}
                <div className={`absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br ${startup.color} opacity-5 blur-[120px] group-hover:opacity-10 transition-opacity duration-700`} />
                
                <div className="relative z-10 space-y-8">
                  <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-tight">
                    {startup.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-medium">
                    {startup.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                    {startup.stats.map((stat) => (
                      <div key={stat.label} className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
                          <stat.icon size={16} />
                          {stat.label}
                        </div>
                        <div className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                          <Counter value={stat.value} />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <a 
                    href={startup.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`w-full py-5 rounded-[2rem] bg-gradient-to-r ${startup.color} text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group/btn mt-4`}
                  >
                    {startup.buttonText}
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
                  className="w-12 h-12 rounded-full glass border-white/20 flex items-center justify-center relative z-20 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-tr from-primary to-secondary animate-pulse`} />
                </motion.div>
              </div>

              {/* Empty space for alternating layout (Desktop only) */}
              <div className="hidden md:block w-[45%]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}