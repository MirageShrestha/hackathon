export interface ReelRouteStop {
  id: string;
  name: string;
  type?: "start" | "stop" | "finish";
  note?: string;
}

export interface ReelMapData {
  title: string;
  summary: string;
  destination: string;
  stops: ReelRouteStop[];
  googleMapsUrl: string;
  embedQuery?: string;
  fallbackImage?: string;
  itineraryPreview?: string[];
}

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
  video?: string;
  map?: string;
  mapData?: ReelMapData;
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

export type TabKey = "reels" | "itinerary" | "upload" | "services" | "my-trek";
