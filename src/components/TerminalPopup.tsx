import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X } from 'lucide-react';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'link';
  content: string;
  href?: string;
}

export default function TerminalPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to Abhirup Sarkar OS v1.0.0' },
    { type: 'output', content: 'Type "help" to see available commands.' },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsGlitching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDownShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDownShortcut);
    return () => window.removeEventListener('keydown', handleKeyDownShortcut);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [logs, isOpen]);

  const commands: Record<string, string | (() => string) | { name: string; href: string }[]> = {
    help: "Available commands: about, skills, projects, socials, studio, contact, clear, history, exit",
    about: "ABHIRUP SARKAR - Cybersecurity Architect, Digital Creator & Developer. Specializing in ethical hacking, high-end video editing, and crafting stunning UI/UX experiences.",
    skills: "CORE STACK: Python, React, GSAP, Tailwind, Node.js, Capcut Pro, Adobe Premiere Pro, Kali Linux, Metasploit, Wireshark.",
    projects: "RECENT WORK: [1] AI-Driven Threat Detector, [2] Cinematic Portfolio, [3] Network Vulnerability Scanner. (Type 'visit projects' to view)",
    socials: [
      { name: "Instagram", href: "https://www.instagram.com/itz_abhirupsarkar" },
      { name: "LinkedIn", href: "https://www.linkedin.com/in/abhirup-sarkar-2b746939b" },
      { name: "Facebook", href: "https://www.facebook.com/abhirup.sarkar.581187" },
      { name: "WhatsApp", href: "https://wa.me/918017007352" }
    ],
    studio: "Visit Buggy But Brilliant: https://buggybutbrilliant.netlify.app/",
    contact: "Email: abhirupsarkar2jp@gmail.com | Phone: +91 8017007352",
    history: () => "COMMAND LOG: " + history.join(", "),
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const fullCmd = input.toLowerCase().trim();
    const parts = fullCmd.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    setHistory(prev => [...prev, fullCmd]);
    setHistoryIndex(-1);
    
    setLogs(prev => [...prev, { type: 'input', content: input }]);
    setInput("");
    setIsGlitching(true);

    await new Promise(resolve => setTimeout(resolve, 400));

    if (cmd === 'clear') {
      setLogs([]);
    } else if (cmd === 'exit') {
      setIsOpen(false);
    } else if (cmd === 'socials') {
      const socialsList = commands.socials as { name: string; href: string }[];
      const linkLines: TerminalLine[] = socialsList.map((s) => ({
        type: 'link' as const,
        content: `> ${s.name}`,
        href: s.href,
      }));
      setLogs(prev => [
        ...prev, 
        { type: 'output', content: 'My Social Connections:' },
        ...linkLines
      ]);
    } else if (cmd === 'visit') {
      if (args[0] === 'studio') {
        window.open("https://buggybutbrilliant.netlify.app/", "_blank");
        setLogs(prev => [...prev, { type: 'output', content: 'Opening Buggy But Brilliant...' }]);
      } else if (args[0] === 'projects') {
        window.location.hash = "projects";
        setLogs(prev => [...prev, { type: 'output', content: 'Scrolling to Projects...' }]);
      } else {
        setLogs(prev => [...prev, { type: 'error', content: "Usage: visit [studio|projects]" }]);
      }
    } else if (commands[cmd]) {
      const cmdVal = commands[cmd];
      const output = typeof cmdVal === 'function' ? cmdVal() : typeof cmdVal === 'string' ? cmdVal : '';
      setLogs(prev => [...prev, { type: 'output', content: output }]);
    } else {
      setLogs(prev => [...prev, { type: 'error', content: `Command not found: ${cmd}. Type 'help' for available commands.` }]);
    }
    
    setIsGlitching(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <>
      {/* 🚀 FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[150] w-12 h-12 md:w-14 md:h-14 rounded-full glass border-orange-500/30 flex items-center justify-center text-orange-500 shadow-2xl shadow-orange-500/20 interactive group touch-manipulation"
          title="Open Terminal (Ctrl+`)"
        >
          <Terminal size={20} className="md:size-[24px] group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: 'min(500px, 80vh)',
              width: 'min(600px, 90vw)'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[200] glass-dark bg-black/95 rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-gpu"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-white/40">
                  <Terminal size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">PORTFOLIO—root@abhirup</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="p-1 hover:bg-red-500/20 rounded-md transition-colors group"
                >
                  <X size={18} className="text-white/40 group-hover:text-red-500" />
                </button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-sm no-scrollbar selection:bg-orange-500/30 lg:cursor-none"
            >
              {logs.map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="flex flex-col gap-1"
                >
                  {log.type === 'input' && (
                    <div className="flex items-center gap-3 text-orange-500 font-bold">
                      <span className="text-[10px] bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">ROOT</span>
                      <span>❯</span>
                      <span className="text-white">{log.content}</span>
                    </div>
                  )}
                  {log.type === 'output' && (
                    <div className="pl-4 border-l-2 border-orange-500/20 py-1 text-xs leading-relaxed text-gray-300">
                      {log.content}
                    </div>
                  )}
                  {log.type === 'link' && (
                    <a 
                      href={log.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="pl-4 border-l-2 border-orange-500/50 py-1 text-xs text-orange-500 hover:text-orange-400 underline transition-colors cursor-none"
                    >
                      {log.content}
                    </a>
                  )}
                  {log.type === 'error' && (
                    <div className="pl-4 border-l-2 border-red-500/20 py-1 text-xs text-red-400/80">
                      {log.content}
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-orange-500 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Processing...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleCommand} className="p-6 bg-white/[0.02] border-t border-white/5 cursor-none">
              <div className="flex items-center gap-3">
                <span className="text-orange-500 font-bold">❯</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type 'help'..."
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/10 cursor-none"
                  autoFocus
                />
                <div className="w-2 h-5 bg-orange-500/80 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
