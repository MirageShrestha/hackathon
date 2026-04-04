import { motion } from "framer-motion";
import { Mountain, ArrowLeft, BadgeCheck, Star, Instagram, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Reel, TabKey } from "./types";
import { reels, reelGradients } from "./data";

interface Props {
  profileReel: Reel;
  setPage: (p: TabKey) => void;
  setActiveReel: (id: string) => void;
  pageVariants: any;
}

export const ProfileSection = ({ profileReel, setPage, setActiveReel, pageVariants }: Props) => (
  <motion.div key="profile" {...pageVariants} className="max-w-2xl mx-auto space-y-6">
    {/* Banner */}
    <div className="relative h-44 rounded-3xl bg-gradient-to-br from-stone-700 via-amber-800 to-stone-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),transparent_70%)]" />
      <Mountain className="absolute right-6 bottom-4 w-24 h-24 text-white/10" />
      <button
        onClick={() => setPage("reels")}
        className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
    </div>

    {/* Avatar & Info */}
    <div className="px-4 -mt-14 relative z-10">
      <div className="w-22 h-22 w-[88px] h-[88px] rounded-2xl bg-card border-4 border-background flex items-center justify-center shadow-xl">
        <span className="text-3xl font-bold text-primary">{profileReel.creator[0]}</span>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-foreground">{profileReel.creator}</h2>
          <BadgeCheck className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{profileReel.handle}</p>
        <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{profileReel.bio}</p>
      </div>

      {/* Stats row */}
      <div className="flex gap-8 mt-5 py-4 border-y border-border">
        {[
          { value: profileReel.followers, label: "Followers" },
          { value: profileReel.trips, label: "Trips" },
          { value: <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" />{profileReel.rating}</span>, label: "Rating" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-lg font-bold text-foreground">{value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {[
          { icon: BadgeCheck, text: "Verified Traveler", color: "text-blue-500" },
          { icon: Mountain, text: "Mustang Expert" },
          { icon: Star, text: "Top Creator", color: "text-amber-500" },
        ].map(({ icon: Icon, text, color }) => (
          <Badge key={text} variant="secondary" className="gap-1.5 text-xs rounded-full px-3 py-1.5">
            <Icon className={`w-3.5 h-3.5 ${color || ""}`} /> {text}
          </Badge>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-5">
        <Button variant="outline" size="sm" className="rounded-xl gap-2 flex-1">
          <Instagram className="w-4 h-4" /> Instagram
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl gap-2 flex-1">
          <Youtube className="w-4 h-4" /> YouTube
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl gap-2">
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <Button className="w-full mt-3 rounded-xl h-11">Follow</Button>
    </div>

    {/* Reviews */}
    <div className="px-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Reviews</h3>
      {profileReel.reviews.map((review, i) => (
        <div key={i} className="p-4 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">{review.user}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} className="w-3 h-3 text-amber-500 fill-amber-500" />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
        </div>
      ))}
    </div>

    {/* Creator's reels */}
    <div className="px-4 space-y-3 pb-8">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Reels</h3>
      <div className="grid grid-cols-2 gap-3">
        {reels
          .filter((r) => r.handle === profileReel.handle)
          .map((r, i) => (
            <button
              key={r.id}
              onClick={() => { setActiveReel(r.id); setPage("reels"); }}
              className={`relative h-48 rounded-2xl bg-gradient-to-br ${reelGradients[i % reelGradients.length]} overflow-hidden group`}
            >
              <Mountain className="absolute right-3 bottom-3 w-12 h-12 text-white/10" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-medium text-xs text-left">{r.title}</p>
                <p className="text-white/60 text-[10px] text-left">{r.place} · {r.type}</p>
              </div>
            </button>
          ))}
      </div>
    </div>
  </motion.div>
);
