import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bus,
  CarTaxiFront,
  Heart,
  Hotel,
  Search,
  Sparkles,
  UtensilsCrossed,
  Waves,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/trekking/SectionHeader";
import { buildRecentlyUsedServices, buildServiceSections } from "@/components/services/data";
import type { MarketplaceFilter, ServiceMarketplaceCard } from "@/components/services/types";

const FAVORITES_STORAGE_KEY = "true-nepal-service-favorites";

const filterOptions: Array<{ value: MarketplaceFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "hotels", label: "Hotels" },
  { value: "food", label: "Food" },
  { value: "transport", label: "Transport" },
  { value: "activities", label: "Activities" },
];

const sectionIcons = {
  Hotels: Hotel,
  "Cafes & Restaurants": UtensilsCrossed,
  "Bus Tickets": Bus,
  "Local Transport": CarTaxiFront,
  Activities: Waves,
} as const;

export const ServicesMarketplaceSection = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MarketplaceFilter>("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return;
    try {
      setFavoriteIds(JSON.parse(raw) as string[]);
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const sections = useMemo(() => buildServiceSections(), []);
  const recentlyUsed = useMemo(() => buildRecentlyUsedServices(), []);

  const visibleSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sections
      .map((section) => ({
        ...section,
        cards: section.cards.filter((card) => {
          const matchesFilter = filter === "all" || card.filterGroup === filter;
          const matchesQuery =
            !normalizedQuery ||
            [card.title, card.subtitle, card.location, card.description, ...card.tags]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery);

          return matchesFilter && matchesQuery;
        }),
      }))
      .filter((section) => section.cards.length > 0);
  }, [filter, query, sections]);

  const hasResults = visibleSections.length > 0;

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Sparkles}
        title="Trip Services Marketplace"
        subtitle="Recommended services generated from your Pokhara New Year 2083 itinerary, stay, rides, tickets, and activity history."
      />

      <Card className="overflow-hidden border-border shadow-none">
        <CardContent className="space-y-5 p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search hotels, cafe names, buses, rides, or activities..."
                className="h-12 rounded-2xl pl-11"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`rounded-full px-4 py-2 text-sm transition-all ${
                    filter === option.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(135deg,rgba(255,255,255,1),rgba(245,242,236,1))] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recently Used Services</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {recentlyUsed.map((card) => (
                <MiniServiceCard
                  key={card.id}
                  card={card}
                  favorite={favoriteIds.includes(card.id)}
                  onToggleFavorite={() => toggleFavorite(card.id)}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {!hasResults ? (
        <Card className="border-dashed border-border shadow-none">
          <CardContent className="py-16 text-center">
            <p className="text-lg font-semibold text-foreground">No matching services found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different search term or reset the category filter to see more recommendations.
            </p>
          </CardContent>
        </Card>
      ) : (
        visibleSections.map((section) => {
          const SectionIcon = sectionIcons[section.title as keyof typeof sectionIcons];

          return (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <SectionIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {section.cards.map((card) => (
                  <ServiceCard
                    key={card.id}
                    card={card}
                    favorite={favoriteIds.includes(card.id)}
                    onToggleFavorite={() => toggleFavorite(card.id)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

const ServiceCard = ({
  card,
  favorite,
  onToggleFavorite,
}: {
  card: ServiceMarketplaceCard;
  favorite: boolean;
  onToggleFavorite: () => void;
}) => (
  <Card className="overflow-hidden border-border shadow-none transition-all hover:-translate-y-1 hover:shadow-xl">
    <div className="relative">
      <img src={card.image} alt={card.title} className="h-52 w-full object-cover" />
      <button
        onClick={onToggleFavorite}
        className="absolute right-4 top-4 rounded-full bg-background/90 p-2 shadow-sm transition-transform hover:scale-105"
      >
        <Heart className={`h-4 w-4 ${favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
      </button>
      <Badge className="absolute left-4 top-4 rounded-full bg-black/70 text-white">{card.category}</Badge>
    </div>
    <CardContent className="space-y-4 p-5">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">{card.price}</p>
            <p className="text-xs text-muted-foreground">{card.rating} rating</p>
          </div>
        </div>
        <p className="text-sm text-foreground/75">{card.location}</p>
      </div>

      <p className="text-sm leading-relaxed text-foreground/75">{card.description}</p>

      {card.meta && (
        <div className="rounded-2xl bg-secondary/50 p-3 text-sm text-muted-foreground">
          {card.meta.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {card.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="rounded-full">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Button className="flex-1 rounded-2xl">{card.ctaPrimary}</Button>
        <Button variant="outline" className="rounded-2xl">
          {card.ctaSecondary ?? "Open Map"}
        </Button>
      </div>
    </CardContent>
  </Card>
);

const MiniServiceCard = ({
  card,
  favorite,
  onToggleFavorite,
}: {
  card: ServiceMarketplaceCard;
  favorite: boolean;
  onToggleFavorite: () => void;
}) => (
  <div className="rounded-[1.5rem] border border-border bg-card p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-foreground">{card.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{card.price}</p>
      </div>
      <button onClick={onToggleFavorite}>
        <Heart className={`h-4 w-4 ${favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
      </button>
    </div>
    <p className="mt-3 text-sm text-foreground/75">{card.location}</p>
    <div className="mt-4 flex items-center justify-between">
      <Badge variant="secondary" className="rounded-full">{card.category}</Badge>
      <button className="inline-flex items-center gap-1 text-sm font-medium text-primary">
        Open
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </div>
);
