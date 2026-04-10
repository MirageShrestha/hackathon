import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, CalendarDays, Coffee, Package, Info, Play, Mountain,
  Route, Clock3, Users, ShieldAlert, BookmarkPlus, X, MapPin, Star,
  BadgeCheck, ChevronRight, Car, Map, Ticket, LayoutDashboard, Shield,
  Compass, Phone, Wifi, ChevronDown, ChevronUp, UtensilsCrossed,
  Hotel as HotelIcon, Bus, Footprints, Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { TabKey, TrekRoute, Guide, Porter, WishlistItem, TrekPlan, Hotel, Cafe, ItineraryItem } from "@/components/trekking/types";
import { reels, reelGradients, hotels, cafes, packs, plans, trekRoutes } from "@/components/trekking/data";
import { ReelCard } from "@/components/trekking/ReelCard";
import { ProfileSection } from "@/components/trekking/ProfileSection";
import { RoutesSection } from "@/components/trekking/RoutesSection";
import { SafetySection } from "@/components/trekking/SafetySection";
import { CrewSection } from "@/components/trekking/CrewSection";
import { TicketsSection } from "@/components/trekking/TicketsSection";
import { DashboardSection } from "@/components/trekking/DashboardSection";
import { SectionHeader } from "@/components/trekking/SectionHeader";

type TabGroup = {
  key: string;
  label: string;
  icon: React.ElementType;
  tabs: [TabKey, React.ElementType, string][];
};

const tabGroups: TabGroup[] = [
  { key: "discover", label: "Discover", icon: Play, tabs: [["reels", Play, "Reels"], ["routes", Map, "Routes"], ["safety", Shield, "Safety"]] },
  { key: "plan", label: "Plan", icon: Route, tabs: [["planner", Route, "Planner"], ["itinerary", CalendarDays, "Itinerary"], ["packages", Package, "Packages"]] },
  { key: "services", label: "Services", icon: HotelIcon, tabs: [["hotels", HotelIcon, "Hotels"], ["cafes", Coffee, "Cafes"], ["crew", Users, "Crew"], ["tickets", Ticket, "Tickets"]] },
  { key: "me", label: "My Trek", icon: LayoutDashboard, tabs: [["dashboard", LayoutDashboard, "Dashboard"], ["wishlist", Heart, "Saved"], ["info", Info, "Tips"]] },
];

const allTabs = tabGroups.flatMap(g => g.tabs);

export default function TrueNepalMustangMVP() {
  const [page, setPage] = useState<TabKey>("reels");
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<TrekPlan | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ budget: "medium", days: "5", group: "friends", mode: "balanced" });
  const [activeReel, setActiveReel] = useState(reels[0].id);
  const [profileReel, setProfileReel] = useState<typeof reels[0] | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<TrekRoute | null>(null);
  const [assignedGuide, setAssignedGuide] = useState<Guide | null>(null);
  const [assignedPorter, setAssignedPorter] = useState<Porter | null>(null);
  const [bookedTickets, setBookedTickets] = useState<string[]>([]);
  const [dayHotels, setDayHotels] = useState<Record<number, Hotel>>({});
  const [dayCafes, setDayCafes] = useState<Record<number, Cafe>>({});
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [addingType, setAddingType] = useState<{ day: number; type: "hotel" | "cafe" } | null>(null);
  const reelContainerRef = useRef<HTMLDivElement>(null);

  const toggleTicket = (id: string) => setBookedTickets(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleWishlist = (item: WishlistItem) =>
    setWishlist((p) => p.some((x) => x.id === item.id) ? p.filter((x) => x.id !== item.id) : [...p, item]);
  const isSaved = (id: string) => wishlist.some((x) => x.id === id);

  const filteredReels = useMemo(() => {
    const q = search.toLowerCase().trim();
    return q ? reels.filter((r) => [r.title, r.place, r.type].some((v) => v.toLowerCase().includes(q))) : reels;
  }, [search]);

  const selectedReel = reels.find((r) => r.id === activeReel) || reels[0];

  const generatedPlans = useMemo(
    () => plans.filter((p) => {
      const budgetOk = form.budget === "medium" || p.budgetType === form.budget;
      const daysOk = Number(form.days) >= p.days;
      const groupOk = p.group.includes(form.group);
      const modeOk = form.mode === "balanced" || p.mode === form.mode;
      return budgetOk && daysOk && groupOk && modeOk;
    }),
    [form]
  );

  useEffect(() => {
    const container = reelContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const children = Array.from(container.children) as HTMLElement[];
      const containerRect = container.getBoundingClientRect();
      let closest = children[0];
      let minDist = Infinity;
      children.forEach((child) => {
        const dist = Math.abs(child.getBoundingClientRect().top - containerRect.top);
        if (dist < minDist) { minDist = dist; closest = child; }
      });
      const idx = children.indexOf(closest);
      if (filteredReels[idx]) setActiveReel(filteredReels[idx].id);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [filteredReels]);

  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
        {/* Header */}
        <motion.header
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                <Mountain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">TrueNepal</h1>
                <p className="text-[11px] text-muted-foreground">Smart Trekking Companion</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-4">
              {[
                { icon: Map, text: `${trekRoutes.length} routes` },
                { icon: Heart, text: `${wishlist.length} saved` },
                { icon: Users, text: assignedGuide ? "Guide ✓" : "No crew" },
                { icon: Ticket, text: `${bookedTickets.length} permits` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="w-3.5 h-3.5" /> <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.header>

        {/* Desktop Tab Navigation - Grouped */}
        <div className="mb-6 hidden lg:block">
          <div className="flex gap-6 border-b border-border pb-3 mb-3">
            {tabGroups.map((group) => {
              const isActive = group.tabs.some(([key]) => key === page);
              return (
                <button
                  key={group.key}
                  onClick={() => setPage(group.tabs[0][0])}
                  className={`flex items-center gap-2 px-1 pb-1 text-sm font-semibold transition-all border-b-2 ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <group.icon className="w-4 h-4" />
                  {group.label}
                </button>
              );
            })}
          </div>
          {tabGroups.map((group) => {
            const isActive = group.tabs.some(([key]) => key === page);
            if (!isActive) return null;
            return (
              <div key={group.key} className="flex gap-1">
                {group.tabs.map(([key, Icon, label]) => (
                  <button
                    key={key}
                    onClick={() => setPage(key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      page === key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Mobile Tab Navigation - Grouped */}
        <div className="mb-5 lg:hidden">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4 mb-2">
            {tabGroups.map((group) => {
              const isActive = group.tabs.some(([key]) => key === page);
              return (
                <button
                  key={group.key}
                  onClick={() => setPage(group.tabs[0][0])}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <group.icon className="w-3.5 h-3.5" />
                  {group.label}
                </button>
              );
            })}
          </div>
          {tabGroups.map((group) => {
            const isActive = group.tabs.some(([key]) => key === page);
            if (!isActive) return null;
            return (
              <div key={group.key} className="flex gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4">
                {group.tabs.map(([key, Icon, label]) => (
                  <button
                    key={key}
                    onClick={() => setPage(key)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                      page === key
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          {/* REELS */}
          {page === "reels" && (
            <motion.div key="reels" {...pageVariants}>
              <div className="mb-4">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by place, type..."
                  className="h-11 rounded-xl bg-card border-border"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                {/* Column 1: Reel Player - 9:16 */}
                <div className="w-full">
                  <div
                    ref={reelContainerRef}
                    className="h-[570px] overflow-y-auto snap-y snap-mandatory scrollbar-hide rounded-2xl"
                    style={{ scrollSnapType: "y mandatory" }}
                  >
                    {filteredReels.map((reel, i) => (
                      <div key={reel.id} className="snap-start h-[570px]" style={{ scrollSnapAlign: "start" }}>
                        <ReelCard
                          reel={reel}
                          gradient={reelGradients[i % reelGradients.length]}
                          isSaved={isSaved(reel.id)}
                          onSave={() => toggleWishlist({ ...reel, category: "Reel" })}
                          onPlan={() => setPage("planner")}
                          onProfile={() => { setProfileReel(reel); setPage("profile"); }}
                          isActive={activeReel === reel.id}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Trek Route Map */}
                <div className="w-full">
                  <div className="rounded-2xl overflow-hidden border border-border bg-card h-[570px] flex flex-col">
                    <div className="p-3 border-b border-border flex items-center gap-2 shrink-0">
                      <Map className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{selectedReel.place} Route Map</span>
                    </div>
                    {selectedReel.map ? (
                      <div className="flex-1 min-h-0 flex items-center justify-center bg-secondary/20 p-2">
                        <img
                          src={selectedReel.map}
                          alt={`${selectedReel.place} trek map`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-secondary/20">
                        <Compass className="w-10 h-10 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">Map coming soon</p>
                        <p className="text-xs text-muted-foreground/60">{selectedReel.place}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 3: Trek Details */}
                <div className="w-full">
                  <Card className="border-border shadow-none h-[570px] overflow-y-auto">
                    <CardContent className="pt-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-foreground">{selectedReel.title}</h3>
                        <Badge variant="secondary" className="text-[10px] rounded-full">{selectedReel.type}</Badge>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { icon: MapPin, text: selectedReel.place },
                          { icon: Clock3, text: selectedReel.duration },
                          { icon: Car, text: selectedReel.transport },
                          { icon: Star, text: String(selectedReel.rating), color: "text-amber-500" },
                        ].map(({ icon: Icon, text, color }) => (
                          <Badge key={text} variant="outline" className="gap-1 text-[10px] py-0.5">
                            <Icon className={`w-3 h-3 ${color || ""}`} />{text}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">{selectedReel.description}</p>

                      <button onClick={() => { setProfileReel(selectedReel); setPage("profile"); }} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50 w-full hover:bg-secondary/80 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-sm text-primary">{selectedReel.creator[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-xs text-foreground">{selectedReel.creator}</span>
                            <BadgeCheck className="w-3 h-3 text-blue-500" />
                          </div>
                          <span className="text-[10px] text-muted-foreground">{selectedReel.handle}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Budget", value: selectedReel.budget },
                          { label: "Best Season", value: selectedReel.season },
                        ].map(({ label, value }) => (
                          <div key={label} className="p-2.5 rounded-xl bg-secondary/50">
                            <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
                            <p className="text-sm font-semibold text-foreground">{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 rounded-xl h-10 text-sm" onClick={() => setPage("planner")}>
                          <Route className="w-4 h-4 mr-2" /> Plan This Trip
                        </Button>
                        <Button variant="outline" className="rounded-xl h-10" onClick={() => toggleWishlist({ ...selectedReel, category: "Reel" })}>
                          <Heart className={`w-4 h-4 ${isSaved(selectedReel.id) ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {/* PROFILE */}
          {page === "profile" && profileReel && (
            <ProfileSection profileReel={profileReel} setPage={setPage} setActiveReel={setActiveReel} pageVariants={pageVariants} />
          )}

          {/* ROUTES */}
          {page === "routes" && (
            <RoutesSection selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} pageVariants={pageVariants} />
          )}

          {/* SAFETY */}
          {page === "safety" && <SafetySection pageVariants={pageVariants} />}

          {/* CREW */}
          {page === "crew" && (
            <CrewSection
              assignedGuide={assignedGuide}
              assignedPorter={assignedPorter}
              setAssignedGuide={setAssignedGuide}
              setAssignedPorter={setAssignedPorter}
              pageVariants={pageVariants}
            />
          )}

          {/* TICKETS */}
          {page === "tickets" && (
            <TicketsSection bookedTickets={bookedTickets} toggleTicket={toggleTicket} pageVariants={pageVariants} />
          )}

          {/* DASHBOARD */}
          {page === "dashboard" && (
            <DashboardSection
              selectedPlan={selectedPlan}
              assignedGuide={assignedGuide}
              assignedPorter={assignedPorter}
              bookedTickets={bookedTickets}
              wishlist={wishlist}
              setPage={setPage}
              pageVariants={pageVariants}
            />
          )}

          {/* WISHLIST */}
          {page === "wishlist" && (
            <motion.div key="wishlist" {...pageVariants}>
              <SectionHeader icon={Heart} title="Saved Items" subtitle="Your saved reels, stays, cafes, and packages" />
              <Card className="border-border shadow-none">
                <CardContent className="p-6">
                  {wishlist.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-muted-foreground/40" />
                      </div>
                      <p className="text-muted-foreground text-sm">No saved items yet</p>
                      <p className="text-muted-foreground/60 text-xs mt-1">Save reels, hotels, or cafes to see them here</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {wishlist.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-secondary/30 transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                            <Heart className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.title || item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category}{item.place && ` · ${item.place}`}</p>
                          </div>
                          <button onClick={() => toggleWishlist(item)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* PLANNER */}
          {page === "planner" && (
            <motion.div key="planner" {...pageVariants}>
              <SectionHeader icon={Route} title="Trip Planner" subtitle="Auto-generates Mustang plans for you" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                  <Card className="border-border shadow-none">
                    <CardContent className="p-5 space-y-4">
                      {[
                        { label: "Budget", value: form.budget, key: "budget", options: [["low", "Low"], ["medium", "Medium"], ["high", "High"]] },
                        { label: "Days", value: form.days, key: "days", options: [["3", "3 days"], ["5", "5 days"], ["7", "7 days"]] },
                        { label: "Group", value: form.group, key: "group", options: [["solo", "Solo"], ["friends", "Friends"], ["family", "Family"]] },
                        { label: "Priority", value: form.mode, key: "mode", options: [["cheapest", "Cheapest"], ["balanced", "Balanced"], ["fastest", "Fastest"]] },
                      ].map(({ label, value, key, options }) => (
                        <div key={key}>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
                          <Select value={value} onValueChange={(v) => setForm({ ...form, [key]: v })}>
                            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {options.map(([val, text]) => (
                                <SelectItem key={val} value={val}>{text}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-8 space-y-4">
                  {generatedPlans.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                        <Route className="w-8 h-8 text-muted-foreground/40" />
                      </div>
                      <p className="text-muted-foreground text-sm">No matching plans found</p>
                    </div>
                  ) : (
                    generatedPlans.map((plan) => (
                      <Card key={plan.id} className="border-border shadow-none hover:border-primary/20 hover:shadow-sm transition-all">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{plan.title}</h3>
                                <Badge variant="secondary" className="text-[10px] rounded-full">{plan.badge}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{plan.transport} · {plan.stay}</p>
                            </div>
                            <p className="text-sm font-bold text-foreground">{plan.cost}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline" className="text-[10px] gap-1"><Clock3 className="w-3 h-3" />{plan.days} days</Badge>
                            <Badge variant="outline" className="text-[10px] gap-1"><Users className="w-3 h-3" />{plan.group.join(", ")}</Badge>
                            <Badge variant="outline" className="text-[10px] gap-1 text-amber-600 border-amber-200 bg-amber-50"><ShieldAlert className="w-3 h-3" />{plan.warning}</Badge>
                          </div>
                          <div className="space-y-1.5 mb-4">
                            {plan.itinerary.map((day) => (
                              <div key={day.day} className="flex items-center gap-3 text-xs">
                                <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">{day.day}</span>
                                <span className="font-medium text-foreground">{day.title}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1 rounded-xl" onClick={() => { setSelectedPlan(plan); setPage("itinerary"); }}>Use This Plan</Button>
                            <Button variant="outline" className="rounded-xl" onClick={() => toggleWishlist({ id: `wish-${plan.id}`, title: plan.title, category: "Trip Plan" })}>
                              <BookmarkPlus className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ITINERARY */}
          {page === "itinerary" && (
            <motion.div key="itinerary" {...pageVariants}>
              <SectionHeader icon={CalendarDays} title={selectedPlan?.title || "Itinerary"} subtitle={selectedPlan ? `${selectedPlan.transport} · ${selectedPlan.cost}` : "Choose a plan from Trip Planner"} />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <Card className="border-border shadow-none">
                    <CardContent className="p-6">
                      {selectedPlan ? (
                        <div className="space-y-2">
                          {selectedPlan.itinerary.map((day) => {
                            const hotel = dayHotels[day.day];
                            const cafe = dayCafes[day.day];
                            const isExpanded = expandedDay === day.day;
                            const isAddingHotel = addingType?.day === day.day && addingType.type === "hotel";
                            const isAddingCafe = addingType?.day === day.day && addingType.type === "cafe";

                            // Extract destination from day title (e.g. "Kathmandu → Pokhara" → "Pokhara", "Muktinath visit" → "Muktinath")
                            const titleLower = day.title.toLowerCase();
                            const destination = day.title.includes("→")
                              ? day.title.split("→").pop()!.trim()
                              : day.title.split(" ")[0];
                            const destLower = destination.toLowerCase();

                            const filteredHotels = hotels.filter(h => h.area.toLowerCase() === destLower);
                            const filteredCafes = cafes.filter(c => c.area.toLowerCase() === destLower);

                            return (
                              <div key={day.day} className="rounded-2xl border border-border bg-card overflow-hidden transition-all">
                                {/* Day header */}
                                <button
                                  onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                                  className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                                    D{day.day}
                                  </div>
                                  <div className="flex-1 text-left min-w-0">
                                    <h4 className="font-semibold text-sm text-foreground">{day.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">{day.details}</p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {hotel && (
                                      <Badge variant="secondary" className="text-[10px] gap-1 rounded-full">
                                        <HotelIcon className="w-3 h-3" /> {hotel.name.split(" ")[0]}
                                      </Badge>
                                    )}
                                    {cafe && (
                                      <Badge variant="secondary" className="text-[10px] gap-1 rounded-full">
                                        <Coffee className="w-3 h-3" /> {cafe.name.split(" ")[0]}
                                      </Badge>
                                    )}
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                  </div>
                                </button>

                                {/* Expanded content */}
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-border"
                                  >
                                    <div className="p-4 space-y-4">
                                      {/* Structured Breakdown */}
                                      {day.breakdown && day.breakdown.length > 0 && (
                                        <div>
                                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Day Breakdown</span>
                                          <div className="space-y-1.5">
                                            {day.breakdown.map((item, idx) => {
                                              const iconMap: Record<string, React.ElementType> = {
                                                bus: Bus, food: UtensilsCrossed, hotel: HotelIcon, trek: Footprints,
                                                jeep: Car, tea: Coffee, sight: Eye,
                                              };
                                              const colorMap: Record<string, string> = {
                                                bus: "text-blue-500 bg-blue-500/10", food: "text-orange-500 bg-orange-500/10",
                                                hotel: "text-purple-500 bg-purple-500/10", trek: "text-green-500 bg-green-500/10",
                                                jeep: "text-amber-600 bg-amber-500/10", tea: "text-emerald-500 bg-emerald-500/10",
                                                sight: "text-pink-500 bg-pink-500/10",
                                              };
                                              const IconComp = iconMap[item.icon] || MapPin;
                                              const colors = colorMap[item.icon] || "text-muted-foreground bg-secondary";
                                              return (
                                                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.split(" ").slice(1).join(" ")}`}>
                                                    <IconComp className={`w-4 h-4 ${colors.split(" ")[0]}`} />
                                                  </div>
                                                  <span className="text-sm text-foreground flex-1">{item.label}</span>
                                                  {item.cost && (
                                                    <span className="text-xs font-semibold text-foreground whitespace-nowrap">{item.cost}</span>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      {/* Assigned Hotel */}
                                      <div>
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stay</span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs rounded-lg"
                                            onClick={() => setAddingType(isAddingHotel ? null : { day: day.day, type: "hotel" })}
                                          >
                                            {hotel ? "Change" : "+ Add Hotel"}
                                          </Button>
                                        </div>
                                        {hotel && !isAddingHotel && (
                                          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                              <HotelIcon className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-foreground">{hotel.name}</p>
                                              <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{hotel.area} · {hotel.price}</p>
                                              {hotel.amenities && (
                                                <div className="flex gap-1 mt-1.5 flex-wrap">
                                                  {hotel.amenities.map(a => (
                                                    <Badge key={a} variant="outline" className="text-[9px] rounded-full px-1.5 py-0">{a}</Badge>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                              <div className="flex items-center gap-0.5 text-xs">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                <span className="font-medium">{hotel.rating}</span>
                                              </div>
                                              <Badge variant="secondary" className="text-[9px] mt-1 rounded-full">{hotel.tag}</Badge>
                                            </div>
                                          </div>
                                        )}
                                        {isAddingHotel && (
                                          <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {filteredHotels.length > 0 ? filteredHotels.map((h) => (
                                              <button
                                                key={h.id}
                                                onClick={() => {
                                                  setDayHotels(prev => ({ ...prev, [day.day]: h }));
                                                  setAddingType(null);
                                                }}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                                  hotel?.id === h.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-secondary/30"
                                                }`}
                                              >
                                                <HotelIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-medium text-foreground">{h.name}</p>
                                                  <p className="text-xs text-muted-foreground">{h.area} · {h.price}</p>
                                                </div>
                                                <div className="flex items-center gap-0.5 text-xs flex-shrink-0">
                                                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                  <span>{h.rating}</span>
                                                </div>
                                              </button>
                                            )) : (
                                              <p className="text-xs text-muted-foreground/60 italic py-2">No hotels available in {destination}</p>
                                            )}
                                          </div>
                                        )}
                                        {!hotel && !isAddingHotel && (
                                          <p className="text-xs text-muted-foreground/60 italic">No hotel assigned yet</p>
                                        )}
                                      </div>

                                      {/* Assigned Cafe */}
                                      <div>
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Food Stop</span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs rounded-lg"
                                            onClick={() => setAddingType(isAddingCafe ? null : { day: day.day, type: "cafe" })}
                                          >
                                            {cafe ? "Change" : "+ Add Cafe"}
                                          </Button>
                                        </div>
                                        {cafe && !isAddingCafe && (
                                          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                                            <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center">
                                              <Coffee className="w-4 h-4 text-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-foreground">{cafe.name}</p>
                                              <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{cafe.area} · {cafe.price}</p>
                                              {cafe.specialty && (
                                                <p className="text-[11px] text-primary mt-1">★ {cafe.specialty}</p>
                                              )}
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                              <div className="flex items-center gap-0.5 text-xs">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                <span className="font-medium">{cafe.rating}</span>
                                              </div>
                                              {cafe.openHours && <p className="text-[9px] text-muted-foreground mt-1">{cafe.openHours}</p>}
                                            </div>
                                          </div>
                                        )}
                                        {isAddingCafe && (
                                          <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {filteredCafes.length > 0 ? filteredCafes.map((c) => (
                                              <button
                                                key={c.id}
                                                onClick={() => {
                                                  setDayCafes(prev => ({ ...prev, [day.day]: c }));
                                                  setAddingType(null);
                                                }}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                                  cafe?.id === c.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-secondary/30"
                                                }`}
                                              >
                                                <Coffee className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                                                  <p className="text-xs text-muted-foreground">{c.area} · {c.price}</p>
                                                  {c.specialty && <p className="text-[10px] text-primary">★ {c.specialty}</p>}
                                                </div>
                                                <div className="flex items-center gap-0.5 text-xs flex-shrink-0">
                                                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                  <span>{c.rating}</span>
                                                </div>
                                              </button>
                                            )) : (
                                              <p className="text-xs text-muted-foreground/60 italic py-2">No cafes available in {destination}</p>
                                            )}
                                          </div>
                                        )}
                                        {!cafe && !isAddingCafe && (
                                          <p className="text-xs text-muted-foreground/60 italic">No cafe assigned yet</p>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                            <CalendarDays className="w-8 h-8 text-muted-foreground/40" />
                          </div>
                          <p className="text-sm text-muted-foreground">Open Trip Planner and click "Use this plan"</p>
                          <Button variant="outline" className="mt-4 rounded-xl" onClick={() => setPage("planner")}>
                            <Route className="w-4 h-4 mr-2" /> Go to Planner
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-4 space-y-4">
                  <Card className="border-border shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Budget Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[["Transport", selectedPlan?.transport], ["Stay", selectedPlan?.stay], ["Total", selectedPlan?.cost]].map(([label, val]) => (
                        <div key={label as string} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium text-foreground">{val || "—"}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Assigned services summary */}
                  {selectedPlan && (
                    <Card className="border-border shadow-none">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Booked Services</CardTitle>
                        <CardDescription className="text-xs">Hotels & cafes assigned to your itinerary</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.keys(dayHotels).length === 0 && Object.keys(dayCafes).length === 0 ? (
                          <p className="text-xs text-muted-foreground/60 italic">Expand a day to add hotels & cafes</p>
                        ) : (
                          <>
                            {Object.entries(dayHotels).map(([d, h]) => (
                              <div key={d} className="flex items-center gap-2 text-xs">
                                <Badge variant="outline" className="text-[9px] rounded-full">D{d}</Badge>
                                <HotelIcon className="w-3 h-3 text-muted-foreground" />
                                <span className="text-foreground font-medium">{h.name}</span>
                                <span className="text-muted-foreground ml-auto">{h.price}</span>
                              </div>
                            ))}
                            {Object.entries(dayCafes).map(([d, c]) => (
                              <div key={d} className="flex items-center gap-2 text-xs">
                                <Badge variant="outline" className="text-[9px] rounded-full">D{d}</Badge>
                                <Coffee className="w-3 h-3 text-muted-foreground" />
                                <span className="text-foreground font-medium">{c.name}</span>
                                <span className="text-muted-foreground ml-auto">{c.price}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* HOTELS */}
          {page === "hotels" && (
            <motion.div key="hotels" {...pageVariants}>
              <SectionHeader icon={HotelIcon} title="Hotels & Lodges" subtitle="Find stays along your trekking route" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hotels.map((hotel) => (
                  <Card key={hotel.id} className="border-border shadow-none hover:border-primary/20 hover:shadow-sm transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">{hotel.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{hotel.area}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="text-[10px] rounded-full">{hotel.tag}</Badge>
                          {hotel.rating && (
                            <div className="flex items-center gap-0.5 text-xs mt-1 justify-end">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span className="font-medium">{hotel.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {hotel.amenities && (
                        <div className="flex gap-1 flex-wrap mb-2">
                          {hotel.amenities.map(a => (
                            <Badge key={a} variant="outline" className="text-[9px] rounded-full px-1.5 py-0">{a}</Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-sm font-bold text-foreground mb-1">{hotel.price}</p>
                      {hotel.phone && <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-3"><Phone className="w-3 h-3" />{hotel.phone}</p>}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs" onClick={() => toggleWishlist({ ...hotel, category: "Hotel" })}>
                          <Heart className={`w-3 h-3 mr-1 ${isSaved(hotel.id) ? "fill-red-500 text-red-500" : ""}`} /> Save
                        </Button>
                        <Button size="sm" className="flex-1 rounded-xl text-xs" onClick={() => setPage("itinerary")}>
                          <CalendarDays className="w-3 h-3 mr-1" /> Add to Trip
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* CAFES */}
          {page === "cafes" && (
            <motion.div key="cafes" {...pageVariants}>
              <SectionHeader icon={Coffee} title="Cafes & Restaurants" subtitle="Local food stops along the route" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cafes.map((cafe) => (
                  <Card key={cafe.id} className="border-border shadow-none hover:border-primary/20 hover:shadow-sm transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">{cafe.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{cafe.area}</p>
                        </div>
                        {cafe.rating && (
                          <div className="flex items-center gap-0.5 text-xs">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="font-medium">{cafe.rating}</span>
                          </div>
                        )}
                      </div>
                      {cafe.specialty && (
                        <p className="text-xs text-primary font-medium mt-1.5">★ {cafe.specialty}</p>
                      )}
                      <div className="flex items-center justify-between mt-2 mb-3">
                        <p className="text-sm font-bold text-foreground">{cafe.price}</p>
                        {cafe.openHours && <p className="text-[10px] text-muted-foreground">{cafe.openHours}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs" onClick={() => toggleWishlist({ ...cafe, category: "Cafe" })}>
                          <Heart className={`w-3 h-3 mr-1 ${isSaved(cafe.id) ? "fill-red-500 text-red-500" : ""}`} /> Save
                        </Button>
                        <Button size="sm" className="flex-1 rounded-xl text-xs" onClick={() => setPage("itinerary")}>
                          <CalendarDays className="w-3 h-3 mr-1" /> Add to Trip
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* PACKAGES */}
          {page === "packages" && (
            <motion.div key="packages" {...pageVariants}>
              <SectionHeader icon={Package} title="Trek Packages" subtitle="Pre-built packages for different budgets" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {packs.map((pkg) => (
                  <Card key={pkg.id} className="border-border shadow-none hover:border-primary/20 hover:shadow-sm transition-all">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{pkg.days} days · {pkg.price}</p>
                      <p className="text-xs text-muted-foreground mt-2">Best for: <span className="text-foreground font-medium">{pkg.bestFor}</span></p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1 rounded-xl text-xs" onClick={() => { setSelectedPlan(plans[1]); setPage("itinerary"); }}>Use</Button>
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs" onClick={() => toggleWishlist({ ...pkg, category: "Package" })}>
                          <Heart className={`w-3 h-3 mr-1 ${isSaved(pkg.id) ? "fill-red-500 text-red-500" : ""}`} /> Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* INFO */}
          {page === "info" && (
            <motion.div key="info" {...pageVariants}>
              <SectionHeader icon={Info} title="Travel Tips" subtitle="Important info for your trek" />
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Compass, text: "Autumn and spring are best for Mustang travel." },
                  { icon: Mountain, text: "Weather and road conditions can change quickly." },
                  { icon: ShieldAlert, text: "Carry warm layers, cash, power bank, and ID." },
                  { icon: Info, text: "This MVP compares bus, jeep, and flight templates." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navigation - matches groups */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border lg:hidden z-50">
        <div className="flex justify-around items-center py-2 px-1 max-w-md mx-auto">
          {tabGroups.map((group) => {
            const isActive = group.tabs.some(([key]) => key === page);
            return (
              <button
                key={group.key}
                onClick={() => setPage(group.tabs[0][0])}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <group.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                <span className="text-[10px] font-medium">{group.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
