import { useEffect, useMemo, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Film,
  Hotel as HotelIcon,
  Map,
  Mountain,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { ReelDetail } from "@/components/trekking/ReelDetail";
import { ReelCard } from "@/components/trekking/ReelCard";
import { reels, reelGradients } from "@/components/trekking/data";
import { TripUploadSection } from "@/components/trip-upload/TripUploadSection";
import { ItinerarySection } from "@/components/trekking/ItinerarySection";
import { MyTrekProfileSection } from "@/components/my-trek/MyTrekProfileSection";
import { ServicesMarketplaceSection } from "@/components/services/ServicesMarketplaceSection";
import type { TabKey } from "@/components/trekking/types";

type TopNavItem = {
  label: string;
  page: TabKey;
  icon: ElementType;
};

const topNav: TopNavItem[] = [
  { label: "Reels", page: "reels", icon: Film },
  { label: "Plan", page: "itinerary", icon: Map },
  { label: "Stories", page: "upload", icon: Camera },
  { label: "Services", page: "services", icon: HotelIcon },
  { label: "My Trek", page: "my-trek", icon: Mountain },
];

export default function TrueNepalApp() {
  const [page, setPage] = useState<TabKey>("reels");
  const [search, setSearch] = useState("");
  const [savedReelIds, setSavedReelIds] = useState<string[]>([]);
  const [activeReelId, setActiveReelId] = useState<string>(reels[0]?.id ?? "");
  const [selectedPlanId, setSelectedPlanId] = useState<string>(reels[0]?.id ?? "");
  const [selectedProfileHandle, setSelectedProfileHandle] = useState("@mirage.shrestha");
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const reelContainerRef = useRef<HTMLDivElement>(null);

  const filteredReels = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reels;
    return reels.filter((reel) =>
      [reel.title, reel.place, reel.type, reel.subtitle].some((value) => value.toLowerCase().includes(query)),
    );
  }, [search]);

  const activeTopSection = topNav.find((item) => item.page === page) ?? topNav[0];
  const selectedReel = filteredReels.find((reel) => reel.id === activeReelId) ?? filteredReels[0] ?? reels[0];

  useEffect(() => {
    if (!filteredReels.some((reel) => reel.id === activeReelId) && filteredReels[0]) {
      setActiveReelId(filteredReels[0].id);
    }
  }, [activeReelId, filteredReels]);

  useEffect(() => {
    const container = reelContainerRef.current;
    if (!container || page !== "reels") return;

    const handleScroll = () => {
      const children = Array.from(container.children) as HTMLElement[];
      if (!children.length) return;

      const containerRect = container.getBoundingClientRect();
      let closestIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      children.forEach((child, index) => {
        const childRect = child.getBoundingClientRect();
        const distance = Math.abs(childRect.top - containerRect.top);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      const nextReel = filteredReels[closestIndex];
      if (nextReel && nextReel.id !== activeReelId) {
        setActiveReelId(nextReel.id);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeReelId, filteredReels, page]);

  const toggleSavedReel = (id: string) => {
    setSavedReelIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const openPlanForReel = (reelId: string) => {
    setSelectedPlanId(reelId);
    setPage("itinerary");
  };

  const openProfile = (handle: string) => {
    setSelectedProfileHandle(handle);
    setPage("my-trek");
  };

  const shareReel = async () => {
    if (!selectedReel) return;

    const message = `${selectedReel.title} by ${selectedReel.creator} - ${selectedReel.mapData?.googleMapsUrl ?? ""}`;

    try {
      await navigator.clipboard.writeText(message.trim());
    } catch {
      // Ignore clipboard failures in the sandboxed desktop context.
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
        <motion.header
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col gap-4 rounded-[2rem] border border-border bg-card/95 p-4 sm:p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
                  <Mountain className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-foreground">TrueNepal</h1>
                  <p className="text-xs text-muted-foreground">Reels, trip stories, and creator-style trek journals</p>
                </div>
              </div>
              <div className="hidden sm:flex flex-wrap gap-3 text-xs text-muted-foreground sm:justify-end">
                <span>{reels.length} reels</span>
                <span>5 service groups</span>
                <span>trip-based marketplace</span>
                <span>{savedReelIds.length} saved reels</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
              {topNav.map((item) => {
                const active = item.label === activeTopSection.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.page === "itinerary") {
                        openPlanForReel(selectedReel?.id ?? activeReelId);
                        return;
                      }
                      if (item.page === "my-trek") {
                        openProfile("@mirage.shrestha");
                        return;
                      }
                      setPage(item.page);
                    }}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all ${
                      active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {page === "reels" && (
            <motion.div key="reels" {...pageVariants} className="space-y-5">
              <div className="max-w-xl">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search Pokhara, Begnas, Mustang..."
                  className="h-11 rounded-2xl"
                />
              </div>
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-start">
                <div
                  ref={reelContainerRef}
                  className="h-[min(720px,calc(100vh-18rem))] snap-y snap-mandatory overflow-y-auto rounded-2xl scrollbar-hide w-full"
                  style={{ scrollSnapType: "y mandatory" }}
                >
                  {filteredReels.map((reel, index) => (
                    <div
                      key={reel.id}
                      className="h-full snap-start"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <ReelCard
                          reel={reel}
                          gradient={reelGradients[index % reelGradients.length]}
                          isSaved={savedReelIds.includes(reel.id)}
                          onSave={() => toggleSavedReel(reel.id)}
                          onPlan={() => openPlanForReel(reel.id)}
                          onProfile={() => openProfile(reel.handle)}
                          onShowDetails={() => { setActiveReelId(reel.id); setShowDetailsSheet(true); }}
                          isActive={selectedReel?.id === reel.id}
                          onSelect={() => setActiveReelId(reel.id)}
                      />
                    </div>
                  ))}
                </div>

                {/* Detail panel — desktop only */}
                <div className="hidden xl:block h-[min(720px,calc(100vh-18rem))] w-full">
                  <ReelDetail
                    reel={selectedReel}
                    isSaved={savedReelIds.includes(selectedReel.id)}
                    onPlan={() => openPlanForReel(selectedReel.id)}
                    onSave={() => toggleSavedReel(selectedReel.id)}
                    onShare={shareReel}
                    onProfile={() => openProfile(selectedReel.handle)}
                    className="h-full"
                  />
                </div>

                {/* Mobile/tablet bottom sheet */}
                <AnimatePresence>
                  {showDetailsSheet && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        key="backdrop"
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDetailsSheet(false)}
                      />
                      {/* Sheet */}
                      <motion.div
                        key="sheet"
                        className="fixed bottom-0 left-0 right-0 z-50 xl:hidden"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                      >
                        <div className="rounded-t-3xl bg-background border-t border-border shadow-2xl overflow-hidden max-h-[85dvh] flex flex-col">
                          {/* Handle + Header */}
                          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border shrink-0">
                            <div className="w-10 h-1 rounded-full bg-muted-foreground/30 absolute left-1/2 -translate-x-1/2 top-2.5" />
                            <h3 className="text-sm font-semibold text-foreground">Reel Details</h3>
                            <button
                              onClick={() => setShowDetailsSheet(false)}
                              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                            >
                              <X className="w-4 h-4 text-foreground" />
                            </button>
                          </div>
                          {/* Scrollable content */}
                          <div className="overflow-y-auto flex-1 p-4">
                            <ReelDetail
                              reel={selectedReel}
                              isSaved={savedReelIds.includes(selectedReel.id)}
                              onPlan={() => { openPlanForReel(selectedReel.id); setShowDetailsSheet(false); }}
                              onSave={() => toggleSavedReel(selectedReel.id)}
                              onShare={shareReel}
                              onProfile={() => { openProfile(selectedReel.handle); setShowDetailsSheet(false); }}
                              className="h-auto border-0 shadow-none rounded-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {page === "itinerary" && (
            <motion.div key="itinerary" {...pageVariants}>
              <ItinerarySection onOpenStories={() => setPage("upload")} selectedPlanId={selectedPlanId} />
            </motion.div>
          )}

          {page === "upload" && (
            <motion.div key="upload" {...pageVariants}>
              <TripUploadSection />
            </motion.div>
          )}

          {page === "my-trek" && (
            <motion.div key="my-trek" {...pageVariants}>
              <MyTrekProfileSection
                onOpenStories={() => setPage("upload")}
                onOpenReels={() => setPage("reels")}
                selectedHandle={selectedProfileHandle}
              />
            </motion.div>
          )}

          {page === "services" && (
            <motion.div key="services" {...pageVariants}>
              <ServicesMarketplaceSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
