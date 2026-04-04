import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./SectionHeader";
import { guides, porters } from "./data";
import type { Guide, Porter } from "./types";

interface Props {
  assignedGuide: Guide | null;
  assignedPorter: Porter | null;
  setAssignedGuide: (g: Guide | null) => void;
  setAssignedPorter: (p: Porter | null) => void;
  pageVariants: any;
}

export const CrewSection = ({ assignedGuide, assignedPorter, setAssignedGuide, setAssignedPorter, pageVariants }: Props) => (
  <motion.div key="crew" {...pageVariants} className="space-y-8">
    <div>
      <SectionHeader icon={Users} title="Guides" subtitle="Assign an experienced guide for your trek" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => {
          const active = assignedGuide?.id === guide.id;
          return (
            <Card key={guide.id} className={`border shadow-none transition-all ${active ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/20 hover:shadow-sm"}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary text-lg">{guide.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{guide.name}</h3>
                      <Badge variant="secondary" className="text-[10px] mt-0.5 rounded-full">{guide.badge}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-700">{guide.rating}</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                  {[
                    ["Experience", guide.experience],
                    ["Region", guide.region],
                    ["Languages", guide.languages],
                    ["Treks led", String(guide.treks)],
                  ].map(([k, v]) => (
                    <p key={k}><span className="text-foreground font-medium">{k}:</span> {v}</p>
                  ))}
                </div>
                <p className="text-sm font-bold text-foreground mb-3">{guide.price}</p>
                <Button className="w-full rounded-xl text-xs h-10" variant={active ? "outline" : "default"} onClick={() => setAssignedGuide(active ? null : guide)}>
                  {active ? "✓ Assigned" : "Assign Guide"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>

    <div>
      <SectionHeader title="Porters" subtitle="Hire a porter for luggage support" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {porters.map((porter) => {
          const active = assignedPorter?.id === porter.id;
          return (
            <Card key={porter.id} className={`border shadow-none transition-all ${active ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/20 hover:shadow-sm"}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <span className="font-bold text-foreground text-lg">{porter.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{porter.name}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{porter.experience} exp</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-700">{porter.rating}</span>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground mb-4">
                  <p><span className="text-foreground font-medium">Capacity:</span> {porter.capacity}</p>
                  <p><span className="text-foreground font-medium">Region:</span> {porter.region}</p>
                </div>
                <p className="text-sm font-bold text-foreground mb-3">{porter.price}</p>
                <Button className="w-full rounded-xl text-xs h-10" variant={active ? "outline" : "default"} onClick={() => setAssignedPorter(active ? null : porter)}>
                  {active ? "✓ Assigned" : "Assign Porter"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  </motion.div>
);
