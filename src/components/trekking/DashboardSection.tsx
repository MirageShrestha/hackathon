import { motion } from "framer-motion";
import { CalendarDays, Users, Ticket, ShieldAlert, Heart, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./SectionHeader";
import { emergencyContacts, tickets } from "./data";
import type { TrekPlan, Guide, Porter, WishlistItem, TabKey } from "./types";

interface Props {
  selectedPlan: TrekPlan | null;
  assignedGuide: Guide | null;
  assignedPorter: Porter | null;
  bookedTickets: string[];
  wishlist: WishlistItem[];
  setPage: (p: TabKey) => void;
  pageVariants: any;
}

export const DashboardSection = ({ selectedPlan, assignedGuide, assignedPorter, bookedTickets, wishlist, setPage, pageVariants }: Props) => (
  <motion.div key="dashboard" {...pageVariants} className="space-y-6">
    <SectionHeader icon={LayoutDashboard} title="My Trek Dashboard" subtitle="Your personal trek companion — all info in one place" />

    {/* Quick stats */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Itinerary", value: selectedPlan ? "Active" : "None", icon: CalendarDays, color: selectedPlan ? "text-green-600 bg-green-50" : "text-muted-foreground bg-secondary" },
        { label: "Crew", value: assignedGuide ? "Assigned" : "None", icon: Users, color: assignedGuide ? "text-blue-600 bg-blue-50" : "text-muted-foreground bg-secondary" },
        { label: "Permits", value: `${bookedTickets.length} booked`, icon: Ticket, color: bookedTickets.length ? "text-amber-600 bg-amber-50" : "text-muted-foreground bg-secondary" },
        { label: "Saved", value: `${wishlist.length} items`, icon: Heart, color: wishlist.length ? "text-red-600 bg-red-50" : "text-muted-foreground bg-secondary" },
      ].map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="p-4 rounded-2xl bg-card border border-border text-center">
          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-foreground">{value}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Active itinerary */}
      <Card className="border-border shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Active Itinerary</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPlan ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">{selectedPlan.title}</p>
              <p className="text-xs text-muted-foreground">{selectedPlan.transport} · {selectedPlan.cost}</p>
              <div className="space-y-1.5 mt-3">
                {selectedPlan.itinerary.map((day) => (
                  <div key={day.day} className="flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px] font-bold flex-shrink-0">{day.day}</span>
                    <span className="text-foreground font-medium">{day.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground mb-2">No itinerary selected yet</p>
              <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => setPage("planner")}>Plan Trip →</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Crew */}
      <Card className="border-border shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4" /> My Crew</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {assignedGuide ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary text-xs">{assignedGuide.name[0]}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{assignedGuide.name}</p>
                <p className="text-[10px] text-muted-foreground">Guide · {assignedGuide.phone}</p>
              </div>
            </div>
          ) : <p className="text-xs text-muted-foreground">No guide assigned</p>}
          {assignedPorter ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <span className="font-bold text-foreground text-xs">{assignedPorter.name[0]}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{assignedPorter.name}</p>
                <p className="text-[10px] text-muted-foreground">Porter · {assignedPorter.phone}</p>
              </div>
            </div>
          ) : <p className="text-xs text-muted-foreground">No porter assigned</p>}
          {!assignedGuide && !assignedPorter && (
            <Button variant="outline" size="sm" className="w-full rounded-xl text-xs" onClick={() => setPage("crew")}>Assign Crew →</Button>
          )}
        </CardContent>
      </Card>

      {/* Permits */}
      <Card className="border-border shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Ticket className="w-4 h-4" /> Booked Permits</CardTitle>
        </CardHeader>
        <CardContent>
          {bookedTickets.length > 0 ? (
            <div className="space-y-2">
              {tickets.filter(t => bookedTickets.includes(t.id)).map(t => (
                <div key={t.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-secondary/50">
                  <span className="text-foreground font-medium">{t.name}</span>
                  <span className="text-muted-foreground font-mono">{t.price}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground mb-2">No permits booked</p>
              <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => setPage("tickets")}>Book Permits →</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency */}
      <Card className="border-border shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-destructive" /> Emergency Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {emergencyContacts.slice(0, 3).map((c, i) => (
            <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-secondary/50">
              <span className="text-foreground font-medium">{c.name}</span>
              <span className="font-bold text-foreground font-mono">{c.number}</span>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full rounded-xl text-xs mt-1" onClick={() => setPage("safety")}>Full Safety Guide →</Button>
        </CardContent>
      </Card>

      {/* Saved */}
      <Card className="border-border shadow-none lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Heart className="w-4 h-4" /> Saved Items ({wishlist.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {wishlist.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {wishlist.map(item => (
                <Badge key={item.id} variant="secondary" className="text-xs gap-1 px-3 py-1.5 rounded-full">{item.title || item.name}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">Save reels, hotels, and plans to see them here</p>
          )}
        </CardContent>
      </Card>
    </div>
  </motion.div>
);
