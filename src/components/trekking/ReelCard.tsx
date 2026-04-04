import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Route, Mountain, MapPin, Clock3, Car, BadgeCheck } from "lucide-react";
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

export const ReelCard = ({ reel, gradient, isSaved, onSave, onPlan, onProfile }: ReelCardProps) => (
  <motion.div
    className={`relative flex-shrink-0 w-full h-[520px] rounded-3xl overflow-hidden bg-gradient-to-br ${gradient} cursor-pointer group`}
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
  >
    {/* Decorative mountains */}
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <Mountain className="absolute top-12 right-8 w-32 h-32 text-white/20" />
      <Mountain className="absolute bottom-32 left-6 w-20 h-20 text-white/15 rotate-12" />
    </div>

    {/* Top bar */}
    <div className="absolute top-0 left-0 right-0 p-5 z-10 flex items-center justify-between">
      <span className="text-white/70 text-xs font-medium tracking-wider uppercase">For You</span>
      <Badge className="bg-white/15 text-white border-0 backdrop-blur-md text-[10px] px-2.5 py-0.5">{reel.type}</Badge>
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
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-20">
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
