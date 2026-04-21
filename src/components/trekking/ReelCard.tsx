import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Route, MapPin, Clock3, Car, BadgeCheck, Play, Pause, Volume2, VolumeX, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Reel } from "./types";

interface ReelCardProps {
  reel: Reel;
  gradient: string;
  isSaved: boolean;
  onSave: () => void;
  onPlan: () => void;
  onProfile: () => void;
  onShowDetails?: () => void;
  isActive: boolean;
  onSelect?: () => void;
}

export const ReelCard = ({ reel, gradient, isSaved, onSave, onPlan, onProfile, onShowDetails, isActive, onSelect }: ReelCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-play when active, pause when inactive
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked, user will click to play
      });
      setIsPlaying(true);
    } else if (!videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <motion.div
      className={`relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group transition-all ${
        isActive ? "ring-2 ring-primary/70 shadow-xl" : "ring-1 ring-white/10"
      }`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      onClick={onSelect}
    >
      {/* Background: video or image or gradient */}
      {reel.video ? (
        <video
          ref={videoRef}
          src={reel.video}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          poster={reel.image}
          onClick={(event) => {
            event.stopPropagation();
            togglePlay();
          }}
        />
      ) : reel.image ? (
        <img
          src={reel.image}
          alt={reel.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

      {/* Play/Pause center button */}
      {reel.video ? (
        <div
          className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 ${isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"}`}
          onClick={(event) => {
            event.stopPropagation();
            togglePlay();
          }}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            {isPlaying ? (
              <Pause className="w-7 h-7 text-white fill-white" />
            ) : (
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            )}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-5 z-10 flex items-center justify-between">
        <span className="text-white/70 text-xs font-medium tracking-wider uppercase">For You</span>
        <div className="flex items-center gap-2">
          {reel.video && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                toggleMute();
              }}
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>
          )}
          <Badge className="bg-white/15 text-white border-0 backdrop-blur-md text-[10px] px-2.5 py-0.5">{reel.type}</Badge>
        </div>
      </div>

      {/* Side action bar */}
      <div className="absolute right-4 bottom-36 z-10 flex flex-col items-center gap-5">
        {[
          { icon: Heart, label: isSaved ? "Saved" : "Save", onClick: onSave, active: isSaved, activeClass: "bg-red-500/90", mobileOnly: false },
          { icon: MessageCircle, label: "Chat", onClick: () => {}, active: false, activeClass: "", mobileOnly: false },
          { icon: Share2, label: "Share", onClick: () => {}, active: false, activeClass: "", mobileOnly: false },
          { icon: Route, label: "Plan", onClick: onPlan, active: false, activeClass: "", mobileOnly: false },
          { icon: Info, label: "Details", onClick: onShowDetails ?? (() => {}), active: false, activeClass: "", mobileOnly: true },
        ].map(({ icon: Icon, label, onClick, active, activeClass, mobileOnly }) => (
          <button
            key={label}
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
            className={`flex flex-col items-center gap-1 group/btn ${mobileOnly ? "xl:hidden" : ""}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${active ? activeClass : "bg-white/15 group-hover/btn:bg-white/25"}`}>
              <Icon className={`w-5 h-5 ${active ? "text-white fill-white" : "text-white"}`} />
            </div>
            <span className="text-white/70 text-[10px]">{label}</span>
          </button>
        ))}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 pt-16 sm:pt-20 z-10 flex flex-col gap-2">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onProfile();
          }}
          className="flex items-center gap-2 sm:gap-3 group/avatar"
        >
          <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40 group-hover/avatar:border-white/70 transition-all shrink-0">
            <span className="text-white font-bold text-xs sm:text-sm">{reel.creator[0]}</span>
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-semibold text-xs sm:text-sm truncate">{reel.creator}</span>
              <BadgeCheck className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-400 shrink-0" />
            </div>
            <span className="text-white/60 text-xs">{reel.handle}</span>
          </div>
        </button>
        <div>
          <h3 className="text-white font-bold text-sm sm:text-lg leading-tight">{reel.title}</h3>
          <p className="text-white/70 text-xs sm:text-sm">{reel.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {[
            { icon: MapPin, text: reel.place },
            { icon: Clock3, text: reel.duration },
            { icon: Car, text: reel.transport },
          ].map(({ icon: Icon, text }) => (
            <Badge key={text} className="bg-white/15 text-white border-0 backdrop-blur-md text-[9px] sm:text-[10px] px-2 py-0.5 gap-1">
              <Icon className="w-3 h-3" /> {text}
            </Badge>
          ))}
        </div>
        {onShowDetails && (
          <div className="xl:hidden pt-1">
            <Button
              onClick={(event) => {
                event.stopPropagation();
                onShowDetails();
              }}
              className="w-full rounded-2xl bg-white/20 text-white border border-white/20 hover:bg-white/25 h-9 text-sm"
            >
              <Info className="mr-2 h-3.5 w-3.5" />
              Details
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
