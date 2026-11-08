import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft, X, Youtube, ExternalLink, Calendar, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft } from "lucide-react";
import { cn } from "../lib/utils";

// --- Global Types for YouTube API ---
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

// --- Types ---

export interface Project {
  title: string;
  description: string;
  image: string;
  video: string;
  category: string;
  date?: string;
  link?: string;
  tags?: string;
  type: 'Video' | 'Photo';
}

interface ProjectPageProps {
  onBack: () => void;
  initialCategory?: string;
}

// --- Components ---

const SkeletonCard = () => (
  <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-zinc-800/20 border border-white/10 p-8 flex flex-col justify-end gap-4 animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.05)]">
    <div className="h-8 w-1/3 bg-purple-500/20 rounded-full" />
    <div className="h-6 w-1/2 bg-white/10 rounded-full" />
    <div className="space-y-2">
      <div className="h-4 w-full bg-white/10 rounded-full" />
      <div className="h-4 w-2/3 bg-white/10 rounded-full" />
    </div>
  </div>
);

/**
 * Custom YouTube Player using IFrame API
 */
const CustomYoutubePlayer = ({ videoId, title }: { videoId: string; title: string }) => {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let player: YT.Player | null = null;
    let interval: ReturnType<typeof setInterval>;
    let isMounted = true;

    const onPlayerReady = (event: YT.PlayerEvent) => {
      if (!isMounted) return;
      console.log("YouTube Player Ready for ID:", videoId);
      setIsReady(true);
      setHasError(false);
      
      // Explicitly try to play
      try {
        event.target.playVideo();
      } catch (e) {
        console.warn("Autoplay block detected:", e);
      }
    };

    const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
      if (!isMounted) return;
      setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    };

    const initPlayer = () => {
      if (!isMounted) return;
      
      const elementId = `youtube-player-${videoId}`;
      const element = document.getElementById(elementId);
      
      if (!element) {
        setTimeout(initPlayer, 100);
        return;
      }

      if (!window.YT || !window.YT.Player) {
        // If script is there but Player is not, the callback will eventually trigger
        return;
      }

      console.log("Initializing YouTube Player for ID:", videoId);
      try {
        // Strict cleanup
        element.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.id = `${elementId}-internal`;
        element.appendChild(placeholder);

        player = new window.YT.Player(placeholder.id, {
          videoId: videoId,
          height: '100%',
          width: '100%',
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            origin: window.location.origin,
            enablejsapi: 1,
          } as Record<string, unknown>,
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: (e: { data: number }) => {
              console.error("YouTube Player Error code:", e.data);
              if (isMounted) setHasError(true);
            },
          },
        });
        playerRef.current = player;

        interval = setInterval(() => {
          if (isMounted && player && typeof player.getCurrentTime === 'function') {
            try {
              const state = player.getPlayerState?.();
              if (state === 1) { // PLAYING
                const currentTime = player.getCurrentTime();
                const totalTime = player.getDuration();
                if (totalTime > 0) {
                  setProgress((currentTime / totalTime) * 100);
                }
              }
            } catch {
              /* ignore polling error */
            }
          }
        }, 1000);
      } catch (err) {
        console.error("Critical failure during YT.Player creation:", err);
        if (isMounted) setHasError(true);
      }
    };

    // Global Registry for initialization to handle multiple components
    if (!window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady = () => {
        // Trigger all pending initializations if needed
        // But for our case, just calling the direct init is enough
      };
    }

    // Add script if not exists
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Polling check for API readiness instead of relying solely on callback
    const checkApi = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkApi);
        initPlayer();
      }
    }, 100);

    return () => {
      isMounted = false;
      clearInterval(checkApi);
      if (interval) clearInterval(interval);
      if (player) {
        try {
          player.destroy();
        } catch {
          /* ignore destruction error */
        }
      }
      playerRef.current = null;
    };
  }, [videoId]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (playerRef.current) {
      playerRef.current.setVolume(val);
      if (val === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume || 50);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    if (playerRef.current) {
      const seekTo = (val / 100) * playerRef.current.getDuration();
      playerRef.current.seekTo(seekTo, true);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  return (
    <div ref={containerRef} className="group relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      <div id={`youtube-player-${videoId}`} className="w-full h-full pointer-events-none" />
      
      {/* Custom Controls Overlay */}
      {isReady && !hasError && (
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 gap-4">
          {/* Muted Autoplay Fallback UI */}
          {isMuted && isPlaying && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform"
            >
              <VolumeX size={16} /> Tap to Unmute
            </motion.button>
          )}

          {/* Progress Slider */}
          <div className="w-full flex items-center gap-4">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progress} 
              onChange={handleSeek}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={togglePlay} className="text-white hover:text-purple-400 transition-colors">
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              </button>

              <div className="flex items-center gap-3 group/vol">
                <button onClick={toggleMute} className="text-white hover:text-purple-400 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={isMuted ? 0 : volume} 
                  onChange={handleVolumeChange}
                  className="w-0 group-hover/vol:w-20 transition-all duration-300 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm font-medium">
                {videoId ? title : 'Loading...'}
              </span>
              <button onClick={toggleFullscreen} className="text-white hover:text-purple-400 transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!isReady && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Loading Player...</p>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 p-8 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <Youtube className="w-8 h-8 text-red-500 opacity-50" />
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-black uppercase tracking-tighter text-lg">Playback Error</h4>
            <p className="text-white/40 text-xs max-w-[250px] leading-relaxed">
              This video couldn't be loaded. It might be restricted or the link might be invalid.
            </p>
          </div>
          <a 
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Watch on YouTube
          </a>
        </div>
      )}
    </div>
  );
};

const ProjectModal = ({ 
  project, 
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}: { 
  project: Project; 
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}) => {
  // Extract YouTube ID
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    console.log("Parsing YouTube URL:", url);
    
    const cleanUrl = url.trim();
    
    // Pattern 1: YouTube Shorts
    if (cleanUrl.includes('/shorts/')) {
      const parts = cleanUrl.split('/shorts/');
      const id = parts[1]?.split(/[?&]/)[0];
      return id?.substring(0, 11) || null;
    }

    // Pattern 2: YouTube Live
    if (cleanUrl.includes('/live/')) {
      const parts = cleanUrl.split('/live/');
      const id = parts[1]?.split(/[?&]/)[0];
      return id?.substring(0, 11) || null;
    }
    
    // Pattern 3: Standard Watch URL or Embed URL or Short Link (youtu.be)
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = cleanUrl.match(regExp);
    
    if (match && match[2] && match[2].length >= 11) {
      const id = match[2].substring(0, 11);
      console.log("Successfully extracted ID:", id);
      return id;
    }
    
    // Pattern 4: If it's just the ID itself (sometimes users paste only the ID)
    if (cleanUrl.length === 11 && !cleanUrl.includes('/') && !cleanUrl.includes('.')) {
      return cleanUrl;
    }

    // Pattern 5: Catch-all for any 11-char string that looks like an ID
    const lastSlashIndex = cleanUrl.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      const potentialId = cleanUrl.substring(lastSlashIndex + 1).split(/[?&]/)[0];
      if (potentialId.length === 11) {
        return potentialId;
      }
    }

    // Pattern 6: Look for v=ID or ID in the URL anywhere
    const urlParams = new URLSearchParams(cleanUrl.includes('?') ? cleanUrl.split('?')[1] : '');
    const vParam = urlParams.get('v');
    if (vParam && vParam.length === 11) return vParam;

    console.warn("Could not parse YouTube ID from URL:", cleanUrl);
    return null;
  };

  const videoId = getYoutubeId(project.video);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 backdrop-blur-2xl bg-black/80"
      onClick={onClose}
    >
      <div className="relative w-full max-w-6xl flex items-center gap-4">
        {/* Prev Arrow */}
        {hasPrev && (
          <button 
            onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
            className="hidden md:flex p-4 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-md shrink-0"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        <motion.div
          key={project.title}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-h-[90vh] overflow-y-auto rounded-[2.5rem] bg-zinc-950 border border-white/10 shadow-2xl no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>

          <div className={cn(
            "grid grid-cols-1 lg:grid-cols-2 h-full",
            project.type === "Photo" && "lg:grid-cols-1 max-w-2xl mx-auto"
          )}>
            {/* Media Section */}
            <div className={cn(
              "relative bg-zinc-900 overflow-hidden",
              project.type === "Video" ? "aspect-video lg:aspect-auto" : "aspect-square md:aspect-[4/5]"
            )}>
              {project.type === "Video" ? (
                videoId ? (
                  <CustomYoutubePlayer key={videoId} videoId={videoId} title={project.title} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-8 text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                      <Youtube className="w-8 h-8 text-orange-500 opacity-50" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-white font-black uppercase tracking-tighter text-lg">Invalid Video Link</h4>
                      <p className="text-white/40 text-xs max-w-[250px] leading-relaxed">
                        The video link provided in the database appears to be invalid or incomplete. Make sure it's a full YouTube URL.
                      </p>
                    </div>
                    {project.video && (
                      <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60 font-mono break-all max-w-[300px] text-center">
                        <span className="block text-[8px] uppercase tracking-widest text-white/20 mb-1">Source URL from Sheet:</span>
                        {project.video}
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-zinc-500">
                      <X className="w-12 h-12 opacity-20" />
                      <p className="text-sm font-medium">No media available</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12 flex flex-col gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium uppercase tracking-wider">
                    {project.category}
                  </span>
                  {project.date && (
                    <span className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      {project.date}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                  {project.title}
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-zinc-400 text-lg leading-relaxed">
                  {project.description}
                </p>

                {project.tags && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.split(',').map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-zinc-900 border border-white/5 text-zinc-500 text-sm">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
                <div className="flex flex-wrap gap-3">
                  {project.link && (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 rounded-2xl bg-white text-black font-bold flex items-center gap-2 hover:scale-105 transition-transform duration-300"
                    >
                      Visit Project <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  {project.type === "Video" && videoId && (
                    <a 
                      href={project.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 rounded-2xl bg-zinc-900 border border-white/10 text-white font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all duration-300"
                    >
                      Watch on YouTube <Youtube className="w-5 h-5 text-red-500" />
                    </a>
                  )}
                </div>

                {/* Mobile navigation buttons */}
                <div className="flex md:hidden gap-3 w-full">
                  {hasPrev && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                      className="flex-1 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all touch-manipulation"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                  )}
                  {hasNext && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                      className="flex-1 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all touch-manipulation"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Arrow */}
        {hasNext && (
          <button 
            onClick={(e) => { e.stopPropagation(); onNext?.(); }}
            className="hidden md:flex p-4 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-md shrink-0"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const ProjectCard = ({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, localX: 0, localY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    const x = localX - rect.width / 2;
    const y = localY - rect.height / 2;
    setMousePosition({ x, y, localX, localY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0, localX: 0, localY: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${mousePosition.y * -0.05}deg) rotateY(${mousePosition.x * 0.05}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered ? 'none' : 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
      }}
      className="group relative aspect-[16/10] rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      </div>

      {/* Glow Effect */}
      <div 
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.localX}px ${mousePosition.localY}px, rgba(168, 85, 247, 0.15), transparent 80%)`
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 z-20 p-4 md:p-8 flex flex-col justify-end gap-2 md:gap-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        <div className="flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <span className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-purple-600/30 border border-purple-500/50 text-purple-100 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            {project.category}
          </span>
        </div>
        <h3 className="text-xl md:text-3xl font-black text-white translate-y-1 group-hover:translate-y-0 transition-transform duration-500 delay-75 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          {project.title}
        </h3>
        <p className="text-zinc-300 text-xs md:text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 leading-relaxed max-w-[90%]">
          {project.description}
        </p>
        
        <div className="flex items-center gap-2 mt-2 md:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
          <span className="text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 bg-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/20 backdrop-blur-md hover:bg-white hover:text-black transition-all">
            View Details <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Border Gradient */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/30 rounded-2xl md:rounded-[2.5rem] transition-colors duration-500" />
    </motion.div>
  );
};

export default function ProjectPage({ onBack, initialCategory = "All" }: ProjectPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTimedOverlay, setShowTimedOverlay] = useState(true);
  const [showSkeletonLoading, setShowSkeletonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Loading sequence logic
  useEffect(() => {
    // 1500ms for the initial bar loading
    const barTimer = setTimeout(() => {
      setShowTimedOverlay(false);
      setShowSkeletonLoading(true);
      
      // 2000ms for the skeleton loading after the bar
      const skeletonTimer = setTimeout(() => {
        setShowSkeletonLoading(false);
      }, 2000);
      
      return () => clearTimeout(skeletonTimer);
    }, 1500);
    
    return () => clearTimeout(barTimer);
  }, []);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    
    // Update URL query parameter when category changes
    const url = new URL(window.location.href);
    if (initialCategory && initialCategory !== "All") {
      url.searchParams.set("category", initialCategory);
    } else {
      url.searchParams.delete("category");
    }
    window.history.pushState({}, "", url.toString());
  }, [initialCategory]);

  // Handle internal category changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedCategory && selectedCategory !== "All") {
      url.searchParams.set("category", selectedCategory);
    } else {
      url.searchParams.delete("category");
    }
    window.history.pushState({}, "", url.toString());
  }, [selectedCategory]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("https://opensheet.elk.sh/1NzKAnR00xkrexqb-F5Aae8cZJGGZO_QfrmB8mEmRsJ0/Sheet1", {
          signal: controller.signal
        });
        
        if (!response.ok) throw new Error(`Failed to fetch projects (${response.status})`);
        
        const data = await response.json();
        
        if (isMounted) {
          if (!Array.isArray(data)) {
            throw new Error("Invalid data format received from API");
          }

          // Robust mapping to handle "Video DB" structure with case-insensitive key matching
          const mappedData = data.map((item: Record<string, unknown>) => {
            const keys = Object.keys(item);
            
            // Helper to get value by flexible key matching
            const getVal = (target: string): string => {
              const normalizedTarget = target.toLowerCase().replace(/\s/g, '');
              
              // 1. Try exact normalized match (e.g. "videolink" === "videolink")
              let key = keys.find(k => k.trim().toLowerCase().replace(/\s/g, '') === normalizedTarget);
              
              // 2. Try if target is contained in key (e.g. "video" is in "videolink")
              if (!key) {
                key = keys.find(k => k.trim().toLowerCase().replace(/\s/g, '').includes(normalizedTarget));
              }
              
              const val = key ? item[key] : undefined;
              return val != null ? String(val) : '';
            };

            const title = getVal("title") || getVal("name") || "Untitled Project";
            const description = getVal("description") || getVal("desc") || "";
            const image = getVal("thumbnail") || getVal("image") || getVal("img") || "";
            
            // Explicitly look for video link with multiple common headers
            const video = getVal("videolink") || getVal("video") || getVal("youtube") || getVal("link") || "";
            
            const category = getVal("category") || getVal("type") || "Other";
            const date = getVal("date") || getVal("year") || "";
            const link = getVal("link") || getVal("url") || "";
            const tags = getVal("tags") || getVal("keywords") || "";
            const typeValue = (getVal("type") || "Video").toString().trim().toLowerCase();
            const type: "Video" | "Photo" = typeValue === "photo" ? "Photo" : "Video";
            
            console.log("Mapped Project:", { title, video, type, originalKeys: keys });

            return { title, description, image, video, category, date, link, tags, type };
          });

          setProjects(mappedData);
        }
      } catch (err) {
        if (isMounted && err instanceof Error && err.name !== 'AbortError') {
          console.error("Project fetch error:", err);
          setError(err.message || "Failed to load projects. Please check your connection.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    // Live Sync: Poll every 30 seconds for updates
    const pollInterval = setInterval(fetchProjects, 30000);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(pollInterval);
    };
  }, []);

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(projects.map(p => p.category))];
    return cats;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || 
                             p.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  const selectedProjectIndex = useMemo(() => {
    if (!selectedProject) return -1;
    return filteredProjects.findIndex(p => p.title === selectedProject.title);
  }, [selectedProject, filteredProjects]);

  const handleNextProject = () => {
    if (selectedProjectIndex < filteredProjects.length - 1) {
      setSelectedProject(filteredProjects[selectedProjectIndex + 1]);
    }
  };

  const handlePrevProject = () => {
    if (selectedProjectIndex > 0) {
      setSelectedProject(filteredProjects[selectedProjectIndex - 1]);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020202] text-white pt-20 md:pt-32 pb-20 px-3 md:px-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-900/10 blur-[100px] rounded-full" />
      </div>

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Custom Navbar for Project Mode */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-8 left-0 right-0 z-[110] flex justify-center px-4 pointer-events-none"
      >
        <div className="flex items-center gap-4 w-full max-w-7xl px-6 py-3 rounded-full bg-zinc-950/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(168,85,247,0.1)] pointer-events-auto transition-all hover:border-purple-500/30">
          <button 
            onClick={onBack}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />

          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-full py-2.5 pl-11 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 transition-all"
            />
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  selectedCategory === cat 
                    ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]" 
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="lg:hidden flex items-center">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-zinc-900 border border-white/5 text-white rounded-full px-4 py-2 text-sm focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            PROJECTS<span className="text-purple-500">.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-xl max-w-2xl"
          >
            A showcase of my work in editing, coding, and cybersecurity. Each project is crafted with passion and precision.
          </motion.p>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 relative z-10">
            <p className="text-red-400 text-lg">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {loading || showSkeletonLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={`skeleton-${i}`}>
                  <SkeletonCard />
                </div>
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <ProjectCard 
                      key={project.title} 
                      project={project} 
                      index={index}
                      onClick={() => setSelectedProject(project)}
                    />
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-40 text-center"
                  >
                    <p className="text-zinc-500 text-2xl font-medium">No projects found matching your search.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>

      {/* Accessible Timed Loader Overlay */}
      <AnimatePresence>
        {showTimedOverlay && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[200] bg-[#020202] flex flex-col items-center justify-center gap-12"
            role="alert"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="w-full max-w-[300px] h-1 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 via-orange-500 to-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-white/60 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">
                INITIALIZING WORKSPACE
              </p>
              <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest">
                Please wait while we prepare your creative environment
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
            onNext={handleNextProject}
            onPrev={handlePrevProject}
            hasNext={selectedProjectIndex < filteredProjects.length - 1}
            hasPrev={selectedProjectIndex > 0}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
