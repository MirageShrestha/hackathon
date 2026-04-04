import { motion } from "framer-motion";
import { Clock3, Mountain, MapPin, Compass, Footprints, CloudSnow, Map } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./SectionHeader";
import type { TrekRoute } from "./types";
import { trekRoutes } from "./data";

interface Props {
  selectedRoute: TrekRoute | null;
  setSelectedRoute: (r: TrekRoute) => void;
  pageVariants: any;
}

export const RoutesSection = ({ selectedRoute, setSelectedRoute, pageVariants }: Props) => (
  <motion.div key="routes" {...pageVariants}>
    <SectionHeader icon={Map} title="Trek Routes" subtitle="Explore popular trekking routes with detailed stop info" />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 space-y-3">
        {trekRoutes.map((route) => (
          <button
            key={route.id}
            onClick={() => setSelectedRoute(route)}
            className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedRoute?.id === route.id ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/20 hover:shadow-sm"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm text-foreground">{route.name}</h3>
              <Badge variant={route.difficulty === "Hard" ? "destructive" : "secondary"} className="text-[10px]">{route.difficulty}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{route.description}</p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-[10px] gap-1"><Clock3 className="w-3 h-3" />{route.duration}</Badge>
              <Badge variant="outline" className="text-[10px] gap-1"><Mountain className="w-3 h-3" />{route.maxAlt}</Badge>
            </div>
          </button>
        ))}
      </div>
      <div className="lg:col-span-8">
        {selectedRoute ? (
          <Card className="border-border shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedRoute.name}</CardTitle>
                <Badge variant="outline" className="gap-1 text-xs"><MapPin className="w-3 h-3" />{selectedRoute.region}</Badge>
              </div>
              <CardDescription>{selectedRoute.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Duration", value: selectedRoute.duration, icon: Clock3 },
                  { label: "Max Altitude", value: selectedRoute.maxAlt, icon: Mountain },
                  { label: "Best Season", value: selectedRoute.bestSeason, icon: Compass },
                  { label: "Difficulty", value: selectedRoute.difficulty, icon: Footprints },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-xl bg-secondary/50 text-center">
                    <stat.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-secondary/50 flex items-center gap-3">
                <CloudSnow className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">Weather: {selectedRoute.weather.temp}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedRoute.weather.condition}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Route Stops</h4>
                <div className="space-y-3">
                  {selectedRoute.stops.map((stop, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">D{stop.day}</div>
                        {i < selectedRoute.stops.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                      </div>
                      <div className="flex-1 pb-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-semibold text-foreground">{stop.name}</h5>
                          <span className="text-[10px] text-muted-foreground font-mono">{stop.alt}</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px] mt-1">{stop.type}</Badge>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {stop.facilities.map((f) => (
                            <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{f}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Map className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground">Select a route to view details</p>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);
