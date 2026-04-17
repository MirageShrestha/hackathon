import { BadgeCheck, Bookmark, ChevronRight, Clock3, Car, ExternalLink, MapPin, MapPinned, Route, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Reel } from "./types";

interface ReelDetailProps {
  reel: Reel;
  isSaved: boolean;
  onPlan: () => void;
  onSave: () => void;
  onShare?: () => void;
  onProfile: () => void;
  className?: string;
}

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const getMapEmbedUrl = (reel: Reel) => {
  const mapData = reel.mapData;
  if (!mapData) return null;
  if (googleMapsApiKey && mapData.embedQuery) {
    return `https://www.google.com/maps/embed/v1/directions?key=${googleMapsApiKey}&origin=${encodeURIComponent(mapData.stops[0]?.name ?? mapData.destination)}&destination=${encodeURIComponent(mapData.destination)}&waypoints=${encodeURIComponent(mapData.stops.slice(1, -1).map((s) => s.name).join("|"))}`;
  }
  const query = mapData.embedQuery ?? mapData.destination;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=9&output=embed`;
};

export const ReelDetail = ({ reel, isSaved, onPlan, onSave, onProfile, className }: ReelDetailProps) => {
  const embedUrl = getMapEmbedUrl(reel);

  return (
    <Card className={`w-full overflow-hidden border-border shadow-sm rounded-2xl flex flex-col ${className ?? "h-[min(720px,calc(100vh-16rem))]"}`}>
      <CardContent className="flex flex-col gap-3.5 p-5 h-full overflow-y-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-foreground">Reel Details</h2>
          <Badge className="rounded-full bg-foreground text-background text-[11px] px-3 py-0.5 font-medium">
            {reel.type}
          </Badge>
        </div>

        {/* ── Pill tags ── */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { icon: MapPin,  text: reel.place },
            { icon: Clock3, text: reel.duration },
            { icon: Car,    text: reel.transport },
          ].map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-foreground"
            >
              <Icon className="h-3 w-3 text-muted-foreground" />
              {text}
            </span>
          ))}
          {/* Star rating pill on same row */}
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {reel.rating}
          </span>
        </div>

        {/* ── Creator row ── */}
        <button
          onClick={onProfile}
          className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-left transition-colors hover:bg-secondary/60 w-full"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-bold text-primary">{reel.creator[0]}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground truncate">{reel.creator}</span>
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-blue-500" />
            </div>
            <span className="text-xs text-muted-foreground">{reel.handle}</span>
          </div>
          <div className="flex items-center gap-0.5 text-xs font-semibold text-primary shrink-0">
            View <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </button>

        {/* ── Budget & Best Season ── */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-border bg-secondary/30 p-3">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Budget</p>
            <p className="text-sm font-bold text-foreground">{reel.budget}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-3">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Best Season</p>
            <p className="text-sm font-bold text-foreground">{reel.season}</p>
          </div>
        </div>

        {/* ── Map ── */}
        {embedUrl && reel.mapData && (
          <div className="rounded-xl border border-border overflow-hidden flex-1 min-h-0 relative">
            <iframe
              title={`${reel.mapData.destination} Map`}
              src={embedUrl}
              className="w-full h-full border-0 min-h-[120px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {/* Overlay link */}
            <a
              href={reel.mapData.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold text-foreground shadow hover:bg-white transition-colors"
            >
              <MapPinned className="h-3 w-3" />
              Open in Maps
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <div className="flex gap-2 shrink-0">
          <Button
            className="flex-1 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2 h-11"
            onClick={onPlan}
          >
            <Route className="h-4 w-4" />
            Plan This Trip
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl h-11 w-11 shrink-0"
            onClick={onSave}
            aria-label={isSaved ? "Unsave reel" : "Save reel"}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-foreground" : ""}`} />
          </Button>
        </div>

      </CardContent>
    </Card>
  );
};
