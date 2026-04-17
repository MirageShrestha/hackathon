export type MarketplaceFilter = "all" | "hotels" | "food" | "transport" | "activities";

export interface ServiceMarketplaceCard {
  id: string;
  category: "Hotels" | "Cafes & Restaurants" | "Bus Tickets" | "Local Transport" | "Activities";
  filterGroup: Exclude<MarketplaceFilter, "all">;
  title: string;
  subtitle: string;
  location: string;
  price: string;
  numericPrice: number;
  description: string;
  rating: number;
  tags: string[];
  ctaPrimary: string;
  ctaSecondary?: string;
  image: string;
  meta?: string[];
}

export interface ServiceMarketplaceSectionData {
  id: string;
  title: string;
  description: string;
  cards: ServiceMarketplaceCard[];
}
