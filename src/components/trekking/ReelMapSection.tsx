import { ExternalLink, MapPinned, Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReelMapData } from "./types";

interface ReelMapSectionProps {
  mapData?: ReelMapData;
}

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const getMapEmbedUrl = (mapData: ReelMapData) => {
  if (googleMapsApiKey && mapData.embedQuery) {
    return `https://www.google.com/maps/embed/v1/directions?key=${googleMapsApiKey}&origin=${encodeURIComponent(mapData.stops[0]?.name ?? mapData.destination)}&destination=${encodeURIComponent(mapData.destination)}&waypoints=${encodeURIComponent(mapData.stops.slice(1, -1).map((stop) => stop.name).join("|"))}`;
  }

  const query = mapData.embedQuery ?? mapData.destination;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=9&output=embed`;
};

export const ReelMapSection = ({ mapData }: ReelMapSectionProps) => {
  if (!mapData) return null;

  const embedUrl = getMapEmbedUrl(mapData);

  return (
    <section className="space-y-4 rounded-[1.75rem] border border-border bg-secondary/25 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">{mapData.title}</h4>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mapData.summary}</p>
        </div>
        <Button asChild variant="outline" className="rounded-2xl">
          <a href={mapData.googleMapsUrl} target="_blank" rel="noreferrer">
            Open in Google Maps
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm">
        <div className="aspect-[16/10] w-full bg-muted">
          <iframe
            title={`${mapData.destination} Google Map`}
            src={embedUrl}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {mapData.stops.map((stop, index) => (
          <Badge key={stop.id} variant="outline" className="rounded-full px-3 py-1 text-xs">
            {index + 1}. {stop.name}
          </Badge>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[1.25rem] bg-background p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Route Stops</p>
          </div>
          <div className="mt-3 space-y-3">
            {mapData.stops.map((stop, index) => (
              <div key={stop.id} className="rounded-[1rem] border border-border bg-card p-3">
                <p className="text-sm font-semibold text-foreground">
                  {index + 1}. {stop.name}
                </p>
                {stop.note ? <p className="mt-1 text-xs text-muted-foreground">{stop.note}</p> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.25rem] bg-background p-4 shadow-sm">
          <p className="text-sm font-semibold text-foreground">Itinerary Preview</p>
          <div className="mt-3 space-y-3">
            {(mapData.itineraryPreview ?? []).map((item, index) => (
              <div key={`${item}-${index}`} className="rounded-[1rem] border border-border bg-card p-3 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {!googleMapsApiKey ? (
        <p className="text-xs text-muted-foreground">
          Using a Google Maps iframe fallback right now. Add `VITE_GOOGLE_MAPS_API_KEY` later to switch this section to the Maps Embed API directions mode.
        </p>
      ) : null}
    </section>
  );
};
