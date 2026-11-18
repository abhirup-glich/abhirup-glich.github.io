import { motion, useScroll, useTransform } from "framer-motion";
import profileImg from "../assets/aboutme.png";
import { useRef } from "react";

export default function AboutMe() {
  const containerRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], isMobile ? [30, -30] : [100, -100]);

  const titleWords = "About Me".split(" ");

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="section-glow py-16 md:py-32 px-4 md:px-20 relative overflow-hidden bg-black"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-20">
        {/* Left Side: Image Container */}
        <motion.div
          style={{ y }}
          className="relative w-full md:w-1/2 aspect-square max-w-full md:max-w-[450px] group px-4 md:px-0"
        >
          {/* Animated Decorative Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-8 bg-gradient-to-br from-orange-600/20 via-purple-600/20 to-blue-600/20 blur-3xl rounded-[60px] -z-10" 
          />
          
          <div className="w-full h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative transition-all duration-300 group-hover:border-orange-500/30 motion-safe:group-hover:scale-[1.02]">
            <img 
              src={profileImg} 
              alt="Abhirup Sarkar" 
              width={450}
              height={450}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-110"
            />
            {/* Animated Overlay with Descriptive Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 pb-[52px]">
              <p className="text-white font-black text-sm uppercase tracking-[0.3em] mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                Abhirup Sarkar
              </p>
            </div>
            <div className="absolute inset-0 bg-orange-600/5 mix-blend-overlay pointer-events-none transition-colors duration-300 group-hover:bg-orange-600/10" />
          </div>

          {/* Floating badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="absolute -bottom-6 -right-2 md:-right-6 glass px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-white/10 shadow-xl z-20 max-w-[200px] md:max-w-none"
          >
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Living in Kolkata, West Bengal, India</p>
            <p className="text-white font-bold text-xs md:text-base">Software Developer & Cybersecurity Analyst</p>
          </motion.div>
        </motion.div>

        {/* Right Side: Text Content */}
        <div className="w-full md:w-1/2 text-left">
          <div className="overflow-hidden mb-8">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 flex flex-wrap gap-x-4">
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </div>

          <div className="space-y-8 text-gray-400 text-lg md:text-xl leading-relaxed font-medium">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Hi, I'm <span className="text-white font-bold">Abhirup Sarkar</span>, a dedicated cybersecurity enthusiast and digital creator. My journey began with a curiosity for how things work under the hood, which led me to the world of <span className="text-orange-500/80">ethical hacking</span> and secure systems.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Beyond security, I've spent years mastering <span className="text-purple-500/80">software engineering</span>, AI automation, and UI/UX architecture. I believe every digital solution should be both <span className="text-white">secure</span> and <span className="text-white">intelligently engineered</span>.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              My goal is to build innovative solutions that solve real-world problems while maintaining the highest standards of <span className="text-blue-500/80">performance</span>. Precision and creativity are the core of every project I undertake.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 p-[1px] rounded-2xl bg-gradient-to-r from-orange-500/50 to-purple-600/50 group"
          >
            <div className="px-8 py-6 rounded-2xl bg-black/90 glass backdrop-blur-xl flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500/80">Current Status</span>
              <p className="text-white font-bold text-lg leading-tight">
                Engineering intelligent software solutions & securing digital frontiers.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
