import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, CalendarDays, Hotel, Coffee, Package, Info, Play, Mountain,
  Route, Clock3, Users, ShieldAlert, BookmarkPlus, X, MessageCircle,
  Share2, MapPin, Star, BadgeCheck, Instagram, Youtube, ArrowLeft,
  Send, Compass, ChevronRight, Plane, Bus, Car, Map, Phone, AlertTriangle,
  Thermometer, CloudSnow, UserCheck, Ticket, LayoutDashboard, Shield,
  Navigation, Eye, Footprints, HeartPulse, Radio, Tent, Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ─── Data ─── */
const reelGradients = [
  "from-stone-800 via-amber-900 to-stone-900",
  "from-slate-800 via-stone-700 to-slate-900",
  "from-amber-800 via-stone-800 to-slate-900",
];

const reels = [
  {
    id: "r1", title: "Jeep Journey to Jomsom", subtitle: "Rough roads, mountain views",
    place: "Jomsom", duration: "5 days", budget: "Rs 12,000–18,000", season: "Oct–Nov",
    transport: "Bus + Shared Jeep", type: "Adventure", creator: "Mustang Motion",
    handle: "@mustangmotion", description: "Budget-friendly Mustang road trip covering the best routes through Upper Mustang with local food stops and authentic tea houses.",
    rating: 4.8, trips: 23, followers: "12.4K", bio: "Exploring Nepal's hidden trails since 2018. Budget travel expert & mountain storyteller.",
    reviews: [
      { user: "Aarav S.", text: "Great route suggestions! Followed this exact plan.", rating: 5 },
      { user: "Priya M.", text: "Very helpful for first-time Mustang travelers.", rating: 4 },
    ],
    socials: { instagram: "@mustangmotion", youtube: "MustangMotion" },
  },
  {
    id: "r2", title: "Muktinath Escape", subtitle: "Temple and scenic route",
    place: "Muktinath", duration: "4 days", budget: "Rs 18,000–28,000", season: "Spring",
    transport: "Tourist Bus + Jeep", type: "Spiritual", creator: "Sacred Steps",
    handle: "@sacredsteps", description: "Comfortable family-style plan visiting the sacred Muktinath temple with stops at Kagbeni and local monasteries.",
    rating: 4.9, trips: 45, followers: "28.1K", bio: "Spiritual travel guide. Connecting souls to sacred places across the Himalayas.",
    reviews: [
      { user: "Sita K.", text: "Beautiful spiritual journey. Highly recommend!", rating: 5 },
      { user: "Rajan T.", text: "Perfect for families with elderly members.", rating: 5 },
    ],
    socials: { instagram: "@sacredsteps", youtube: "SacredStepsNepal" },
  },
  {
    id: "r3", title: "Marpha Apple Trail", subtitle: "Cafes and village vibes",
    place: "Marpha", duration: "5 days", budget: "Rs 15,000–24,000", season: "Sept–Nov",
    transport: "Flight + Jeep", type: "Food & Culture", creator: "Apple Trail Nepal",
    handle: "@appletrailnepal", description: "Scenic stays and food stops through Marpha village. Famous for apple brandy, pies, and the warmest hospitality in Mustang.",
    rating: 4.7, trips: 31, followers: "8.9K", bio: "Foodie traveler documenting Nepal's best local cuisines & hidden cafe gems.",
    reviews: [
      { user: "Maya D.", text: "The apple pie recommendations were spot on!", rating: 5 },
      { user: "Bikash R.", text: "Loved the cafe trail. A must for food lovers.", rating: 4 },
    ],
    socials: { instagram: "@appletrailnepal", youtube: "AppleTrailNepal" },
  },
];

const hotels = [
  { id: "h1", name: "Jomsom Eco Lodge", area: "Jomsom", price: "Rs 2,000/night", tag: "Budget" },
  { id: "h2", name: "Marpha Apple Stay", area: "Marpha", price: "Rs 3,500/night", tag: "Scenic" },
  { id: "h3", name: "Muktinath Family Inn", area: "Muktinath", price: "Rs 4,000/night", tag: "Family" },
];

const cafes = [
  { id: "c1", name: "Apple Pie Corner", area: "Marpha", price: "Rs 300–700" },
  { id: "c2", name: "Thakali Meal Stop", area: "Jomsom", price: "Rs 400–900" },
  { id: "c3", name: "Temple Tea Point", area: "Muktinath", price: "Rs 150–350" },
];

const packs = [
  { id: "p1", name: "Budget Mustang Escape", days: 5, price: "Rs 12,000–16,000", bestFor: "Students and friends" },
  { id: "p2", name: "Balanced Mustang Route", days: 5, price: "Rs 18,000–25,000", bestFor: "Most travelers" },
  { id: "p3", name: "Comfort Mustang Journey", days: 5, price: "Rs 35,000+", bestFor: "Families" },
];

const plans = [
  {
    id: "budget", title: "Budget Plan", badge: "Cheapest", budgetType: "low", days: 5,
    group: ["solo", "friends"], mode: "cheapest", cost: "Rs 12,000–16,000",
    transport: "Bus + Shared Jeep", stay: "Budget lodges", warning: "Long travel time.",
    itinerary: [
      { day: 1, title: "Kathmandu → Pokhara", details: "Bus and rest" },
      { day: 2, title: "Pokhara → Jomsom", details: "Shared jeep" },
      { day: 3, title: "Muktinath visit", details: "Temple and local meal" },
      { day: 4, title: "Marpha exploration", details: "Cafe and village walk" },
      { day: 5, title: "Return", details: "Jeep + bus" },
    ],
  },
  {
    id: "balanced", title: "Balanced Plan", badge: "Best Value", budgetType: "medium", days: 5,
    group: ["solo", "friends", "family"], mode: "balanced", cost: "Rs 18,000–25,000",
    transport: "Tourist Bus + Jeep", stay: "Mid-range hotels", warning: "Road and weather may affect timing.",
    itinerary: [
      { day: 1, title: "Kathmandu → Pokhara", details: "Tourist bus" },
      { day: 2, title: "Pokhara → Jomsom", details: "Transfer and check-in" },
      { day: 3, title: "Muktinath + Kagbeni", details: "Day visit" },
      { day: 4, title: "Marpha cafe trail", details: "Apple products and coffee" },
      { day: 5, title: "Return to Kathmandu", details: "Comfort route" },
    ],
  },
  {
    id: "comfort", title: "Comfort Plan", badge: "Fast & Easy", budgetType: "high", days: 5,
    group: ["family", "friends"], mode: "fastest", cost: "Rs 35,000+",
    transport: "Flight + Private Jeep", stay: "Comfort hotels", warning: "Flights may be delayed.",
    itinerary: [
      { day: 1, title: "Kathmandu → Pokhara", details: "Short flight" },
      { day: 2, title: "Pokhara → Jomsom", details: "Flight and pickup" },
      { day: 3, title: "Muktinath", details: "Private jeep visit" },
      { day: 4, title: "Marpha leisure day", details: "Relaxed sightseeing" },
      { day: 5, title: "Return", details: "Fast return" },
    ],
  },
];

const infoItems = [
  { icon: Compass, text: "Autumn and spring are best for Mustang travel." },
  { icon: Mountain, text: "Weather and road conditions can change quickly." },
  { icon: ShieldAlert, text: "Carry warm layers, cash, power bank, and ID." },
  { icon: Info, text: "This MVP compares bus, jeep, and flight templates." },
];

type TabKey = "reels" | "wishlist" | "planner" | "itinerary" | "hotels" | "cafes" | "packages" | "info" | "profile";

const tabs: [TabKey, React.ElementType, string][] = [
  ["reels", Play, "Reels"],
  ["wishlist", Heart, "Saved"],
  ["planner", Route, "Planner"],
  ["itinerary", CalendarDays, "Itinerary"],
  ["hotels", Hotel, "Hotels"],
  ["cafes", Coffee, "Cafes"],
  ["packages", Package, "Packages"],
  ["info", Info, "Info"],
];

/* ─── Reel Card (TikTok Style) ─── */
const ReelCard = ({
  reel,
  gradient,
  isSaved,
  onSave,
  onPlan,
  onProfile,
  isActive,
}: {
  reel: typeof reels[0];
  gradient: string;
  isSaved: boolean;
  onSave: () => void;
  onPlan: () => void;
  onProfile: () => void;
  isActive: boolean;
}) => (
  <motion.div
    className={`relative flex-shrink-0 w-full h-[520px] rounded-3xl overflow-hidden bg-gradient-to-br ${gradient} cursor-pointer`}
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
  >
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-12 right-8">
        <Mountain className="w-32 h-32 text-white/20" />
      </div>
      <div className="absolute bottom-32 left-6">
        <Mountain className="w-20 h-20 text-white/15 rotate-12" />
      </div>
    </div>

    {/* Top overlay — "For You" + Search hint */}
    <div className="absolute top-0 left-0 right-0 p-5 z-10">
      <div className="flex items-center justify-between">
        <span className="text-white/70 text-xs font-medium tracking-wider uppercase">For You</span>
        <Badge className="bg-white/15 text-white border-0 backdrop-blur-md text-[10px] px-2.5 py-0.5">
          {reel.type}
        </Badge>
      </div>
    </div>

    {/* Side action bar */}
    <div className="absolute right-4 bottom-36 z-10 flex flex-col items-center gap-5">
      <button onClick={onSave} className="flex flex-col items-center gap-1 group">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isSaved ? "bg-red-500/90" : "bg-white/15 group-hover:bg-white/25"}`}>
          <Heart className={`w-5 h-5 ${isSaved ? "text-white fill-white" : "text-white"}`} />
        </div>
        <span className="text-white/70 text-[10px]">{isSaved ? "Saved" : "Save"}</span>
      </button>
      <button className="flex flex-col items-center gap-1 group">
        <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:bg-white/25 transition-all">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <span className="text-white/70 text-[10px]">Chat</span>
      </button>
      <button className="flex flex-col items-center gap-1 group">
        <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:bg-white/25 transition-all">
          <Share2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-white/70 text-[10px]">Share</span>
      </button>
      <button onClick={onPlan} className="flex flex-col items-center gap-1 group">
        <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:bg-white/25 transition-all">
          <Route className="w-5 h-5 text-white" />
        </div>
        <span className="text-white/70 text-[10px]">Plan</span>
      </button>
    </div>

    {/* Bottom content overlay */}
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-20">
      {/* Creator info */}
      <button onClick={onProfile} className="flex items-center gap-3 mb-3 group">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40 group-hover:border-white/70 transition-all">
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

      {/* Title */}
      <h3 className="text-white font-bold text-lg leading-tight mb-1">{reel.title}</h3>
      <p className="text-white/70 text-sm mb-3">{reel.subtitle}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        <Badge className="bg-white/15 text-white border-0 backdrop-blur-md text-[10px] px-2 py-0.5 gap-1">
          <MapPin className="w-3 h-3" /> {reel.place}
        </Badge>
        <Badge className="bg-white/15 text-white border-0 backdrop-blur-md text-[10px] px-2 py-0.5 gap-1">
          <Clock3 className="w-3 h-3" /> {reel.duration}
        </Badge>
        <Badge className="bg-white/15 text-white border-0 backdrop-blur-md text-[10px] px-2 py-0.5 gap-1">
          <Car className="w-3 h-3" /> {reel.transport}
        </Badge>
      </div>
    </div>
  </motion.div>
);

/* ─── Main Component ─── */
export default function TrueNepalMustangMVP() {
  const [page, setPage] = useState<TabKey>("reels");
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ budget: "medium", days: "5", group: "friends", mode: "balanced" });
  const [activeReel, setActiveReel] = useState(reels[0].id);
  const [profileReel, setProfileReel] = useState<typeof reels[0] | null>(null);
  const reelContainerRef = useRef<HTMLDivElement>(null);

  const toggleWishlist = (item: any) =>
    setWishlist((p) => p.some((x) => x.id === item.id) ? p.filter((x) => x.id !== item.id) : [...p, item]);
  const isSaved = (id: string) => wishlist.some((x) => x.id === id);

  const filteredReels = useMemo(() => {
    const q = search.toLowerCase().trim();
    return q ? reels.filter((r) => [r.title, r.place, r.type].some((v) => v.toLowerCase().includes(q))) : reels;
  }, [search]);

  const selectedReel = reels.find((r) => r.id === activeReel) || reels[0];

  const generatedPlans = useMemo(
    () =>
      plans.filter((p) => {
        const budgetOk = form.budget === "medium" || p.budgetType === form.budget;
        const daysOk = Number(form.days) >= p.days;
        const groupOk = p.group.includes(form.group);
        const modeOk = form.mode === "balanced" || p.mode === form.mode;
        return budgetOk && daysOk && groupOk && modeOk;
      }),
    [form]
  );

  // Scroll-snap reel tracking
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
        if (dist < minDist) {
          minDist = dist;
          closest = child;
        }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Mountain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">TrueNepal</h1>
              <p className="text-xs text-muted-foreground">Kathmandu → Mustang</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Route className="w-3.5 h-3.5" /> <span>3 plans</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Heart className="w-3.5 h-3.5" /> <span>{wishlist.length} saved</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Play className="w-3.5 h-3.5" /> <span>{reels.length} reels</span>
            </div>
          </div>
        </motion.header>

        {/* Tab Navigation */}
        <div className="mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-1 min-w-max">
            {tabs.map(([key, Icon, label]) => (
              <button
                key={key}
                onClick={() => setPage(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
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
        </div>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          {/* ═══ REELS ═══ */}
          {page === "reels" && (
            <motion.div key="reels" {...pageVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Reel feed (TikTok style) */}
              <div className="lg:col-span-5 xl:col-span-4">
                {/* Search */}
                <div className="mb-4">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by place, type..."
                    className="h-11 rounded-xl bg-card border-border"
                  />
                </div>
                {/* Vertical scroll reel container */}
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

              {/* Reel detail panel */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                <Card className="border-border shadow-none">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Reel Details</CardTitle>
                      <Badge variant="secondary" className="text-xs">{selectedReel.type}</Badge>
                    </div>
                    <CardDescription>Travel context & creator info</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Location & stats */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1 text-xs"><MapPin className="w-3 h-3" />{selectedReel.place}</Badge>
                      <Badge variant="outline" className="gap-1 text-xs"><Clock3 className="w-3 h-3" />{selectedReel.duration}</Badge>
                      <Badge variant="outline" className="gap-1 text-xs"><Car className="w-3 h-3" />{selectedReel.transport}</Badge>
                      <Badge variant="outline" className="gap-1 text-xs"><Star className="w-3 h-3 text-amber-500" />{selectedReel.rating}</Badge>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">{selectedReel.creator[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-foreground">{selectedReel.creator}</span>
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <span className="text-xs text-muted-foreground">{selectedReel.handle}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => { setProfileReel(selectedReel); setPage("profile"); }}
                      >
                        View Profile <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedReel.description}</p>

                    {/* Budget & Season */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-secondary/50">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Budget</p>
                        <p className="text-sm font-semibold text-foreground">{selectedReel.budget}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-secondary/50">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Best Season</p>
                        <p className="text-sm font-semibold text-foreground">{selectedReel.season}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button className="flex-1 rounded-xl" onClick={() => setPage("planner")}>
                        <Route className="w-4 h-4 mr-2" /> Plan This Trip
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => toggleWishlist({ ...selectedReel, category: "Reel" })}
                      >
                        <Heart className={`w-4 h-4 ${isSaved(selectedReel.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick facts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Budget ranges attached to inspiration", icon: "💰" },
                    { label: "Planner gives multiple route options", icon: "🗺️" },
                    { label: "Selected plan auto-builds itinerary", icon: "📋" },
                  ].map((fact, i) => (
                    <div key={i} className="p-3 rounded-xl bg-card border border-border text-center">
                      <span className="text-lg mb-1 block">{fact.icon}</span>
                      <p className="text-xs text-muted-foreground leading-snug">{fact.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ PROFILE ═══ */}
          {page === "profile" && profileReel && (
            <motion.div key="profile" {...pageVariants} className="max-w-2xl mx-auto space-y-6">
              {/* Banner */}
              <div className="relative h-40 rounded-3xl bg-gradient-to-br from-stone-700 via-amber-800 to-stone-900 overflow-hidden">
                <Mountain className="absolute right-6 bottom-4 w-24 h-24 text-white/10" />
                <button
                  onClick={() => setPage("reels")}
                  className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Avatar & Info */}
              <div className="px-4 -mt-12 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-card border-4 border-background flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-primary">{profileReel.creator[0]}</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">{profileReel.creator}</h2>
                    <BadgeCheck className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">{profileReel.handle}</p>
                  <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{profileReel.bio}</p>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{profileReel.followers}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{profileReel.trips}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Trips</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />{profileReel.rating}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Rating</p>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary" className="gap-1.5 text-xs rounded-lg px-3 py-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-500" /> Verified Traveler
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5 text-xs rounded-lg px-3 py-1">
                    <Mountain className="w-3.5 h-3.5" /> Mustang Expert
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5 text-xs rounded-lg px-3 py-1">
                    <Star className="w-3.5 h-3.5 text-amber-500" /> Top Creator
                  </Badge>
                </div>

                {/* Social links & actions */}
                <div className="flex gap-2 mt-5">
                  <Button variant="outline" size="sm" className="rounded-xl gap-2 flex-1">
                    <Instagram className="w-4 h-4" /> Instagram
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl gap-2 flex-1">
                    <Youtube className="w-4 h-4" /> YouTube
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl gap-2">
                    <Send className="w-4 h-4" /> Message
                  </Button>
                </div>
                <Button className="w-full mt-3 rounded-xl">Follow</Button>
              </div>

              {/* Reviews */}
              <div className="px-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Reviews</h3>
                {profileReel.reviews.map((review, i) => (
                  <div key={i} className="p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{review.user}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: review.rating }).map((_, j) => (
                          <Star key={j} className="w-3 h-3 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </div>

              {/* Creator's reels */}
              <div className="px-4 space-y-3 pb-8">
                <h3 className="text-sm font-semibold text-foreground">Reels by {profileReel.creator}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {reels
                    .filter((r) => r.handle === profileReel.handle)
                    .map((r, i) => (
                      <button
                        key={r.id}
                        onClick={() => { setActiveReel(r.id); setPage("reels"); }}
                        className={`relative h-44 rounded-2xl bg-gradient-to-br ${reelGradients[i % reelGradients.length]} overflow-hidden group`}
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
          )}

          {/* ═══ WISHLIST ═══ */}
          {page === "wishlist" && (
            <motion.div key="wishlist" {...pageVariants}>
              <Card className="border-border shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Saved Items</CardTitle>
                  <CardDescription>Your saved reels, stays, cafes, and packages</CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-16">
                      <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
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
                            <p className="text-xs text-muted-foreground">{item.category} {item.place && `· ${item.place}`}</p>
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

          {/* ═══ PLANNER ═══ */}
          {page === "planner" && (
            <motion.div key="planner" {...pageVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <Card className="border-border shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg">Trip Planner</CardTitle>
                    <CardDescription>Auto-generates Mustang plans for you</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Budget</label>
                      <Select value={form.budget} onValueChange={(v) => setForm({ ...form, budget: v })}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Days</label>
                      <Select value={form.days} onValueChange={(v) => setForm({ ...form, days: v })}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="5">5 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Group</label>
                      <Select value={form.group} onValueChange={(v) => setForm({ ...form, group: v })}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solo">Solo</SelectItem>
                          <SelectItem value="friends">Friends</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Priority</label>
                      <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v })}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cheapest">Cheapest</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="fastest">Fastest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-8 space-y-4">
                {generatedPlans.length === 0 ? (
                  <div className="text-center py-16">
                    <Route className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No matching plans found</p>
                  </div>
                ) : (
                  generatedPlans.map((plan) => (
                    <Card key={plan.id} className="border-border shadow-none hover:border-primary/20 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{plan.title}</h3>
                              <Badge variant="secondary" className="text-[10px]">{plan.badge}</Badge>
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
                        {/* Mini itinerary */}
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
                          <Button
                            className="flex-1 rounded-xl"
                            onClick={() => { setSelectedPlan(plan); setPage("itinerary"); }}
                          >
                            Use This Plan
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => toggleWishlist({ id: `wish-${plan.id}`, title: plan.title, category: "Trip Plan", budget: plan.cost })}
                          >
                            <BookmarkPlus className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ═══ ITINERARY ═══ */}
          {page === "itinerary" && (
            <motion.div key="itinerary" {...pageVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <Card className="border-border shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedPlan?.title || "No plan selected"}</CardTitle>
                    <CardDescription>
                      {selectedPlan ? `${selectedPlan.transport} · ${selectedPlan.cost} · ${selectedPlan.stay}` : "Choose a plan from Trip Planner."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
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
                    {[
                      ["Transport", selectedPlan?.transport],
                      ["Stay", selectedPlan?.stay],
                      ["Total", selectedPlan?.cost],
                    ].map(([label, val]) => (
                      <div key={label as string} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-foreground">{val || "—"}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* ═══ HOTELS ═══ */}
          {page === "hotels" && (
            <motion.div key="hotels" {...pageVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel) => (
                <Card key={hotel.id} className="border-border shadow-none hover:border-primary/20 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">{hotel.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{hotel.area}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{hotel.tag}</Badge>
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
            </motion.div>
          )}

          {/* ═══ CAFES ═══ */}
          {page === "cafes" && (
            <motion.div key="cafes" {...pageVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cafes.map((cafe) => (
                <Card key={cafe.id} className="border-border shadow-none hover:border-primary/20 transition-colors">
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
            </motion.div>
          )}

          {/* ═══ PACKAGES ═══ */}
          {page === "packages" && (
            <motion.div key="packages" {...pageVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packs.map((pkg) => (
                <Card key={pkg.id} className="border-border shadow-none hover:border-primary/20 transition-colors">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{pkg.days} days · {pkg.price}</p>
                    <p className="text-xs text-muted-foreground mt-2">Best for: <span className="text-foreground">{pkg.bestFor}</span></p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1 rounded-xl text-xs" onClick={() => { setSelectedPlan(plans[1]); setPage("itinerary"); }}>Use</Button>
                      <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs" onClick={() => toggleWishlist({ ...pkg, category: "Package" })}>
                        <Heart className={`w-3 h-3 mr-1 ${isSaved(pkg.id) ? "fill-red-500 text-red-500" : ""}`} /> Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {/* ═══ INFO ═══ */}
          {page === "info" && (
            <motion.div key="info" {...pageVariants} className="grid gap-3 sm:grid-cols-2">
              {infoItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
