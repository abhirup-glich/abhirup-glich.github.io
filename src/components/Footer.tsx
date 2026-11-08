export default function Footer() {
  return (
    <footer className="py-12 px-6 md:px-20 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary" />
            <span className="font-bold text-xl tracking-tight">Abhirup Sarkar.</span>
          </div>
          <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">
            Cyber Security & Digital Creator
          </p>
        </div>
        
        <div className="text-gray-500 text-sm font-medium tracking-widest uppercase">
          © 2026 ABHIRUP SARKAR. ALL RIGHTS RESERVED.
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <a href="#" className="text-[10px] md:text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em] py-2">
            Visit my Editing Website
          </a>
          <a href="#" className="text-[10px] md:text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em] py-2">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
