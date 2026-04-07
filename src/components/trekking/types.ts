export interface Reel {
  id: string;
  title: string;
  subtitle: string;
  place: string;
  duration: string;
  budget: string;
  season: string;
  transport: string;
  type: string;
  creator: string;
  handle: string;
  description: string;
  rating: number;
  trips: number;
  followers: string;
  bio: string;
  reviews: { user: string; text: string; rating: number }[];
  socials: { instagram: string; youtube: string };
  image?: string;
}

export interface Hotel {
  id: string;
  name: string;
  area: string;
  price: string;
  tag: string;
  phone?: string;
  rating?: number;
  amenities?: string[];
}

export interface Cafe {
  id: string;
  name: string;
  area: string;
  price: string;
  specialty?: string;
  rating?: number;
  openHours?: string;
}

export interface TrekPackage {
  id: string;
  name: string;
  days: number;
  price: string;
  bestFor: string;
}

export interface PlanDay {
  day: number;
  title: string;
  details: string;
}

export interface TrekPlan {
  id: string;
  title: string;
  badge: string;
  budgetType: string;
  days: number;
  group: string[];
  mode: string;
  cost: string;
  transport: string;
  stay: string;
  warning: string;
  itinerary: PlanDay[];
}

export interface TrekStop {
  name: string;
  day: number;
  alt: string;
  type: string;
  facilities: string[];
}

export interface TrekRoute {
  id: string;
  name: string;
  region: string;
  difficulty: string;
  duration: string;
  maxAlt: string;
  bestSeason: string;
  weather: { temp: string; condition: string };
  description: string;
  stops: TrekStop[];
}

export interface EmergencyContact {
  name: string;
  number: string;
  icon: React.ElementType;
  desc: string;
}

export interface EmergencyGuide {
  title: string;
  icon: React.ElementType;
  color: string;
  steps: string[];
}

export interface Guide {
  id: string;
  name: string;
  experience: string;
  region: string;
  languages: string;
  rating: number;
  treks: number;
  badge: string;
  price: string;
  phone: string;
}

export interface Porter {
  id: string;
  name: string;
  experience: string;
  capacity: string;
  region: string;
  rating: number;
  price: string;
  phone: string;
}

export interface PermitTicket {
  id: string;
  name: string;
  type: string;
  price: string;
  desc: string;
  required: boolean;
}

export interface NearbyAttraction {
  id: string;
  name: string;
  area: string;
  type: string;
  price: string;
}

export interface WishlistItem {
  id: string;
  title?: string;
  name?: string;
  category: string;
  place?: string;
  [key: string]: any;
}

export type TabKey = "reels" | "wishlist" | "planner" | "itinerary" | "hotels" | "cafes" | "packages" | "info" | "profile" | "routes" | "safety" | "crew" | "tickets" | "dashboard";
