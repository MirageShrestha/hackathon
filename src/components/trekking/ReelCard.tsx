import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Route, MapPin, Clock3, Car, BadgeCheck, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Reel } from "./types";

interface ReelCardProps {
  reel: Reel;
  gradient: string;
  isSaved: boolean;
  onSave: () => void;
  onPlan: () => void;
  onProfile: () => void;
  isActive: boolean;
}

export const ReelCard = ({ reel, gradient, isSaved, onSave, onPlan, onProfile, isActive }: ReelCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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
      className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
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
          onClick={togglePlay}
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
          onClick={togglePlay}
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
            <button onClick={toggleMute} className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
              {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>
          )}
          <Badge className="bg-white/15 text-white border-0 backdrop-blur-md text-[10px] px-2.5 py-0.5">{reel.type}</Badge>
        </div>
      </div>

      {/* Side action bar */}
      <div className="absolute right-4 bottom-36 z-10 flex flex-col items-center gap-5">
        {[
          { icon: Heart, label: isSaved ? "Saved" : "Save", onClick: onSave, active: isSaved, activeClass: "bg-red-500/90" },
          { icon: MessageCircle, label: "Chat", onClick: () => {} },
          { icon: Share2, label: "Share", onClick: () => {} },
          { icon: Route, label: "Plan", onClick: onPlan },
        ].map(({ icon: Icon, label, onClick, active, activeClass }) => (
          <button key={label} onClick={onClick} className="flex flex-col items-center gap-1 group/btn">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${active ? activeClass : "bg-white/15 group-hover/btn:bg-white/25"}`}>
              <Icon className={`w-5 h-5 ${active ? "text-white fill-white" : "text-white"}`} />
            </div>
            <span className="text-white/70 text-[10px]">{label}</span>
          </button>
        ))}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pt-20 z-10">
        <button onClick={onProfile} className="flex items-center gap-3 mb-3 group/avatar">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40 group-hover/avatar:border-white/70 transition-all">
            <span className="text-white font-bold text-sm">{reel.creator[0]}</span>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-semibold text-sm">{reel.creator}</span>
              <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-white/60 text-xs">{reel.handle}</span>
          </div>
        </button>
        <h3 className="text-white font-bold text-lg leading-tight mb-1">{reel.title}</h3>
        <p className="text-white/70 text-sm mb-3">{reel.subtitle}</p>
        <div className="flex flex-wrap gap-1.5">
          {[
            { icon: MapPin, text: reel.place },
            { icon: Clock3, text: reel.duration },
            { icon: Car, text: reel.transport },
          ].map(({ icon: Icon, text }) => (
            <Badge key={text} className="bg-white/15 text-white border-0 backdrop-blur-md text-[10px] px-2 py-0.5 gap-1">
              <Icon className="w-3 h-3" /> {text}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
