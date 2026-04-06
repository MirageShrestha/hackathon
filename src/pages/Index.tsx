import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, CalendarDays, Hotel, Coffee, Package, Info, Play, Mountain,
  Route, Clock3, Users, ShieldAlert, BookmarkPlus, X, MapPin, Star,
  BadgeCheck, ChevronRight, Car, Map, Ticket, LayoutDashboard, Shield,
  Compass,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { TabKey, TrekRoute, Guide, Porter, WishlistItem, TrekPlan } from "@/components/trekking/types";
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
  { key: "services", label: "Services", icon: Hotel, tabs: [["hotels", Hotel, "Hotels"], ["cafes", Coffee, "Cafes"], ["crew", Users, "Crew"], ["tickets", Ticket, "Tickets"]] },
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
            <motion.div key="reels" {...pageVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="mb-4">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by place, type..."
                    className="h-11 rounded-xl bg-card border-border"
                  />
                </div>
                <div
                  ref={reelContainerRef}
                  className="h-[540px] overflow-y-auto snap-y snap-mandatory scrollbar-hide rounded-3xl"
                  style={{ scrollSnapType: "y mandatory" }}
                >
                  {filteredReels.map((reel, i) => (
                    <div key={reel.id} className="snap-start h-[520px] mb-4" style={{ scrollSnapAlign: "start" }}>
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

              {/* Detail panel */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                <Card className="border-border shadow-none">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Reel Details</CardTitle>
                      <Badge variant="secondary" className="text-xs rounded-full">{selectedReel.type}</Badge>
                    </div>
                    <CardDescription>Travel context & creator info</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: MapPin, text: selectedReel.place },
                        { icon: Clock3, text: selectedReel.duration },
                        { icon: Car, text: selectedReel.transport },
                        { icon: Star, text: String(selectedReel.rating), color: "text-amber-500" },
                      ].map(({ icon: Icon, text, color }) => (
                        <Badge key={text} variant="outline" className="gap-1 text-xs">
                          <Icon className={`w-3 h-3 ${color || ""}`} />{text}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">{selectedReel.creator[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-foreground">{selectedReel.creator}</span>
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <span className="text-xs text-muted-foreground">{selectedReel.handle}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setProfileReel(selectedReel); setPage("profile"); }}>
                        View <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedReel.description}</p>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Budget", value: selectedReel.budget },
                        { label: "Best Season", value: selectedReel.season },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-3 rounded-xl bg-secondary/50">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                          <p className="text-sm font-semibold text-foreground">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 rounded-xl h-11" onClick={() => setPage("planner")}>
                        <Route className="w-4 h-4 mr-2" /> Plan This Trip
                      </Button>
                      <Button variant="outline" className="rounded-xl h-11" onClick={() => toggleWishlist({ ...selectedReel, category: "Reel" })}>
                        <Heart className={`w-4 h-4 ${isSaved(selectedReel.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
                          <div className="space-y-2 mb-4">
                            {plan.itinerary.slice(0, 3).map((day) => (
                              <div key={day.day} className="flex items-center gap-3 text-xs">
                                <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">{day.day}</span>
                                <span className="font-medium text-foreground">{day.title}</span>
                                <span className="text-muted-foreground">— {day.details}</span>
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
                        <div className="space-y-4">
                          {selectedPlan.itinerary.map((day) => (
                            <div key={day.day} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{day.day}</div>
                                {day.day < selectedPlan.itinerary.length && <div className="w-px flex-1 bg-border mt-2" />}
                              </div>
                              <div className="flex-1 pb-6">
                                <h4 className="font-semibold text-sm text-foreground">{day.title}</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">{day.details}</p>
                                <div className="flex gap-2 mt-2">
                                  <Button variant="outline" size="sm" className="text-[10px] h-7 rounded-lg px-2" onClick={() => setPage("hotels")}>+ Hotel</Button>
                                  <Button variant="outline" size="sm" className="text-[10px] h-7 rounded-lg px-2" onClick={() => setPage("cafes")}>+ Cafe</Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                            <CalendarDays className="w-8 h-8 text-muted-foreground/40" />
                          </div>
                          <p className="text-sm text-muted-foreground">Open Trip Planner and click "Use this plan"</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-4">
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
                </div>
              </div>
            </motion.div>
          )}

          {/* HOTELS */}
          {page === "hotels" && (
            <motion.div key="hotels" {...pageVariants}>
              <SectionHeader icon={Hotel} title="Hotels & Lodges" subtitle="Find stays along your trekking route" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hotels.map((hotel) => (
                  <Card key={hotel.id} className="border-border shadow-none hover:border-primary/20 hover:shadow-sm transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">{hotel.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{hotel.area}</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] rounded-full">{hotel.tag}</Badge>
                      </div>
                      <p className="text-sm font-bold text-foreground mb-3">{hotel.price}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs" onClick={() => toggleWishlist({ ...hotel, category: "Hotel" })}>
                          <Heart className={`w-3 h-3 mr-1 ${isSaved(hotel.id) ? "fill-red-500 text-red-500" : ""}`} /> Save
                        </Button>
                        <Button size="sm" className="flex-1 rounded-xl text-xs" onClick={() => setPage("itinerary")}>Add</Button>
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
                      <h3 className="font-semibold text-sm text-foreground">{cafe.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{cafe.area}</p>
                      <p className="text-sm font-bold text-foreground mt-2 mb-3">{cafe.price}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs" onClick={() => toggleWishlist({ ...cafe, category: "Cafe" })}>
                          <Heart className={`w-3 h-3 mr-1 ${isSaved(cafe.id) ? "fill-red-500 text-red-500" : ""}`} /> Save
                        </Button>
                        <Button size="sm" className="flex-1 rounded-xl text-xs" onClick={() => setPage("itinerary")}>Add</Button>
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

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border lg:hidden z-50">
        <div className="flex justify-around items-center py-2 px-1 max-w-md mx-auto">
          {(
            [
              ["reels", Play, "Reels"],
              ["routes", Map, "Routes"],
              ["dashboard", LayoutDashboard, "Home"],
              ["safety", Shield, "Safety"],
              ["info", Info, "More"],
            ] as [TabKey, React.ElementType, string][]
          ).map(([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                page === key ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${page === key ? "text-primary" : ""}`} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
