import {
  Shield, UserCheck, Navigation, HeartPulse, Map, Thermometer, CloudSnow,
} from "lucide-react";
import type {
  Reel, Hotel, Cafe, TrekPackage, TrekPlan, TrekRoute,
  EmergencyContact, EmergencyGuide, Guide, Porter, PermitTicket, NearbyAttraction,
} from "./types";

import everestImg from "@/assets/reels/everest.jpg";
import annapurnaImg from "@/assets/reels/annapurna.jpg";
import langtangImg from "@/assets/reels/langtang.jpg";
import poonhillImg from "@/assets/reels/poonhill.jpg";
import manasluImg from "@/assets/reels/manaslu.jpg";
import mustangImg from "@/assets/reels/mustang.jpg";

export const reelGradients = [
  "from-stone-800 via-amber-900 to-stone-900",
  "from-slate-800 via-stone-700 to-slate-900",
  "from-amber-800 via-stone-800 to-slate-900",
];

export const reels: Reel[] = [
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
    image: mustangImg,
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
    image: poonhillImg,
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
    image: annapurnaImg,
  },
];

export const hotels: Hotel[] = [
  // Kathmandu
  { id: "h1k", name: "Thamel Backpacker Inn", area: "Kathmandu", price: "Rs 1,200/night", tag: "Budget", phone: "+977-1-4700111", rating: 4.1, amenities: ["WiFi", "Hot Water", "Laundry"] },
  { id: "h2k", name: "Hotel Manang", area: "Kathmandu", price: "Rs 3,500/night", tag: "Comfort", phone: "+977-1-4700222", rating: 4.5, amenities: ["WiFi", "AC", "Restaurant", "Rooftop"] },
  { id: "h3k", name: "Kathmandu Guest House", area: "Kathmandu", price: "Rs 4,500/night", tag: "Heritage", phone: "+977-1-4700333", rating: 4.7, amenities: ["Garden", "WiFi", "Pool", "Spa"] },
  // Pokhara
  { id: "h1p", name: "Pokhara Lakeside Inn", area: "Pokhara", price: "Rs 3,000/night", tag: "Comfort", phone: "+977-61-462555", rating: 4.7, amenities: ["Lake View", "WiFi", "AC", "Restaurant"] },
  { id: "h2p", name: "Hotel Middle Path", area: "Pokhara", price: "Rs 1,800/night", tag: "Budget", phone: "+977-61-462666", rating: 4.3, amenities: ["WiFi", "Hot Water", "Garden"] },
  { id: "h3p", name: "Fish Tail Lodge", area: "Pokhara", price: "Rs 8,000/night", tag: "Premium", phone: "+977-61-462777", rating: 4.9, amenities: ["Lake View", "Spa", "Restaurant", "Bar"] },
  // Jomsom
  { id: "h1j", name: "Jomsom Eco Lodge", area: "Jomsom", price: "Rs 2,000/night", tag: "Budget", phone: "+977-69-440123", rating: 4.3, amenities: ["WiFi", "Hot Water", "Restaurant"] },
  { id: "h2j", name: "Om's Home", area: "Jomsom", price: "Rs 2,800/night", tag: "Cozy", phone: "+977-69-440124", rating: 4.5, amenities: ["Hot Water", "Garden", "Mountain View"] },
  { id: "h3j", name: "Jomsom Mountain Resort", area: "Jomsom", price: "Rs 5,500/night", tag: "Premium", phone: "+977-69-440125", rating: 4.8, amenities: ["Heater", "Restaurant", "Bar", "WiFi"] },
  // Muktinath
  { id: "h1m", name: "Muktinath Family Inn", area: "Muktinath", price: "Rs 4,000/night", tag: "Family", phone: "+977-69-440789", rating: 4.5, amenities: ["Heater", "Restaurant", "Parking"] },
  { id: "h2m", name: "Hotel North Pole", area: "Muktinath", price: "Rs 2,200/night", tag: "Budget", phone: "+977-69-440790", rating: 4.2, amenities: ["Hot Water", "Restaurant"] },
  { id: "h3m", name: "Bob Marley Guest House", area: "Muktinath", price: "Rs 1,500/night", tag: "Backpacker", phone: "+977-69-440791", rating: 4.0, amenities: ["Hot Water", "Common Room"] },
  // Marpha
  { id: "h1a", name: "Marpha Apple Stay", area: "Marpha", price: "Rs 3,500/night", tag: "Scenic", phone: "+977-69-440456", rating: 4.6, amenities: ["Garden", "Hot Water", "Mountain View"] },
  { id: "h2a", name: "Paradise Guest House", area: "Marpha", price: "Rs 2,000/night", tag: "Budget", phone: "+977-69-440457", rating: 4.3, amenities: ["Hot Water", "Restaurant"] },
  { id: "h3a", name: "Marpha Lodge", area: "Marpha", price: "Rs 1,800/night", tag: "Basic", phone: "+977-69-440458", rating: 4.1, amenities: ["Hot Water", "Dining Hall"] },
  // Kagbeni
  { id: "h1g", name: "Kagbeni Heritage House", area: "Kagbeni", price: "Rs 2,500/night", tag: "Heritage", phone: "+977-69-440321", rating: 4.4, amenities: ["Rooftop", "Hot Water", "WiFi"] },
  { id: "h2g", name: "Red House Lodge", area: "Kagbeni", price: "Rs 1,600/night", tag: "Budget", phone: "+977-69-440322", rating: 4.2, amenities: ["Hot Water", "Restaurant"] },
];

export const cafes: Cafe[] = [
  // Kathmandu
  { id: "c1k", name: "Himalayan Java", area: "Kathmandu", price: "Rs 300–800", specialty: "Espresso & Sandwiches", rating: 4.6, openHours: "7 AM – 9 PM" },
  { id: "c2k", name: "OR2K Restaurant", area: "Kathmandu", price: "Rs 400–1,000", specialty: "Mediterranean & Hookah", rating: 4.5, openHours: "11 AM – 10 PM" },
  { id: "c3k", name: "Garden of Dreams Cafe", area: "Kathmandu", price: "Rs 350–900", specialty: "Pastries & Tea", rating: 4.7, openHours: "8 AM – 8 PM" },
  // Pokhara
  { id: "c1p", name: "Lakeside Brew", area: "Pokhara", price: "Rs 250–600", specialty: "Craft Coffee & Pastries", rating: 4.7, openHours: "6:30 AM – 9 PM" },
  { id: "c2p", name: "Busy Bee Cafe", area: "Pokhara", price: "Rs 200–500", specialty: "Pancakes & Smoothies", rating: 4.4, openHours: "7 AM – 8 PM" },
  { id: "c3p", name: "French Creperie", area: "Pokhara", price: "Rs 350–800", specialty: "Crepes & Coffee", rating: 4.6, openHours: "8 AM – 9 PM" },
  // Jomsom
  { id: "c1j", name: "Thakali Meal Stop", area: "Jomsom", price: "Rs 400–900", specialty: "Thakali Dal Bhat Set", rating: 4.5, openHours: "6 AM – 9 PM" },
  { id: "c2j", name: "Jomsom Bakery", area: "Jomsom", price: "Rs 150–400", specialty: "Fresh Bread & Tea", rating: 4.3, openHours: "6 AM – 7 PM" },
  // Muktinath
  { id: "c1m", name: "Temple Tea Point", area: "Muktinath", price: "Rs 150–350", specialty: "Butter Tea & Momos", rating: 4.3, openHours: "6 AM – 7 PM" },
  { id: "c2m", name: "Pilgrim's Rest Cafe", area: "Muktinath", price: "Rs 200–500", specialty: "Dal Bhat & Thukpa", rating: 4.1, openHours: "6 AM – 8 PM" },
  // Marpha
  { id: "c1a", name: "Apple Pie Corner", area: "Marpha", price: "Rs 300–700", specialty: "Apple Pie & Cider", rating: 4.8, openHours: "7 AM – 8 PM" },
  { id: "c2a", name: "Marpha Distillery Cafe", area: "Marpha", price: "Rs 200–600", specialty: "Apple Brandy & Snacks", rating: 4.5, openHours: "9 AM – 7 PM" },
  { id: "c3a", name: "Village Garden Cafe", area: "Marpha", price: "Rs 150–400", specialty: "Local Tea & Bread", rating: 4.2, openHours: "6 AM – 6 PM" },
  // Kagbeni
  { id: "c1g", name: "Kagbeni Coffee House", area: "Kagbeni", price: "Rs 200–500", specialty: "Espresso & Pancakes", rating: 4.6, openHours: "7 AM – 8 PM" },
  { id: "c2g", name: "Yak Herder's Cafe", area: "Kagbeni", price: "Rs 150–350", specialty: "Yak Cheese & Tea", rating: 4.3, openHours: "6 AM – 7 PM" },
];

export const packs: TrekPackage[] = [
  { id: "p1", name: "Budget Mustang Escape", days: 5, price: "Rs 12,000–16,000", bestFor: "Students and friends" },
  { id: "p2", name: "Balanced Mustang Route", days: 5, price: "Rs 18,000–25,000", bestFor: "Most travelers" },
  { id: "p3", name: "Comfort Mustang Journey", days: 5, price: "Rs 35,000+", bestFor: "Families" },
];

export const plans: TrekPlan[] = [
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

export const trekRoutes: TrekRoute[] = [
  {
    id: "everest", name: "Everest Base Camp", region: "Solukhumbu", difficulty: "Hard",
    duration: "14 days", maxAlt: "5,364m", bestSeason: "Mar–May, Sep–Nov",
    weather: { temp: "-6°C to 10°C", condition: "Clear skies, cold nights" },
    description: "The iconic trek to the foot of the world's highest peak through Sherpa villages and stunning Himalayan panorama.",
    stops: [
      { name: "Lukla", day: 1, alt: "2,860m", type: "Gateway", facilities: ["Airport", "Lodge", "Clinic"] },
      { name: "Namche Bazaar", day: 3, alt: "3,440m", type: "Market Town", facilities: ["ATM", "Hospital", "Shops", "WiFi"] },
      { name: "Tengboche", day: 5, alt: "3,860m", type: "Monastery", facilities: ["Lodge", "Bakery"] },
      { name: "Dingboche", day: 7, alt: "4,410m", type: "Acclimatization", facilities: ["Lodge", "Clinic"] },
      { name: "Gorak Shep", day: 10, alt: "5,164m", type: "Base Camp", facilities: ["Basic Lodge"] },
      { name: "EBC", day: 11, alt: "5,364m", type: "Destination", facilities: ["None — day visit"] },
    ],
  },
  {
    id: "annapurna", name: "Annapurna Circuit", region: "Annapurna", difficulty: "Moderate",
    duration: "12–16 days", maxAlt: "5,416m", bestSeason: "Oct–Nov, Mar–Apr",
    weather: { temp: "-10°C to 20°C", condition: "Variable, possible snow at Thorong La" },
    description: "A diverse circuit passing through rice paddies, deep gorges, arid plateaus, and over the Thorong La pass.",
    stops: [
      { name: "Besisahar", day: 1, alt: "760m", type: "Gateway", facilities: ["Bus Park", "Lodge", "Market"] },
      { name: "Manang", day: 6, alt: "3,540m", type: "Acclimatization", facilities: ["Lodge", "Clinic", "Bakery"] },
      { name: "Thorong La", day: 9, alt: "5,416m", type: "Pass", facilities: ["Tea house only"] },
      { name: "Muktinath", day: 10, alt: "3,710m", type: "Temple", facilities: ["Lodge", "Temple", "Clinic"] },
      { name: "Jomsom", day: 12, alt: "2,720m", type: "Town", facilities: ["Airport", "Hospital", "ATM"] },
    ],
  },
  {
    id: "langtang", name: "Langtang Valley", region: "Langtang", difficulty: "Moderate",
    duration: "7–10 days", maxAlt: "3,870m", bestSeason: "Oct–Nov, Mar–May",
    weather: { temp: "-5°C to 15°C", condition: "Generally clear, afternoon clouds" },
    description: "A less crowded trek through beautiful valley with Tamang culture, cheese factories, and close mountain views.",
    stops: [
      { name: "Syabrubesi", day: 1, alt: "1,550m", type: "Gateway", facilities: ["Bus Park", "Lodge"] },
      { name: "Lama Hotel", day: 2, alt: "2,380m", type: "Rest Stop", facilities: ["Lodge"] },
      { name: "Langtang Village", day: 3, alt: "3,430m", type: "Village", facilities: ["Lodge", "Cheese Factory"] },
      { name: "Kyanjin Gompa", day: 4, alt: "3,870m", type: "Monastery", facilities: ["Lodge", "Cheese Factory", "Clinic"] },
    ],
  },
];

export const emergencyContacts: EmergencyContact[] = [
  { name: "Nepal Police", number: "100", icon: Shield, desc: "General emergency" },
  { name: "Tourist Police", number: "1144", icon: UserCheck, desc: "Tourist-specific help" },
  { name: "Helicopter Rescue", number: "+977-1-4261370", icon: Navigation, desc: "Air rescue services" },
  { name: "CIWEC Clinic (KTM)", number: "+977-1-4424111", icon: HeartPulse, desc: "Traveler health clinic" },
  { name: "Nepal Red Cross", number: "+977-1-4270650", icon: HeartPulse, desc: "Disaster & medical" },
];

export const emergencyGuides: EmergencyGuide[] = [
  {
    title: "Lost on the trail?", icon: Map, color: "text-blue-600 bg-blue-50",
    steps: ["Stay calm and don't wander further.", "Retrace your steps to the last known point.", "Use landmarks — rivers flow downhill to villages.", "Blow a whistle 3 times (international distress).", "If you have signal, call your guide or 1144."],
  },
  {
    title: "Altitude sickness?", icon: Thermometer, color: "text-red-600 bg-red-50",
    steps: ["Stop ascending immediately.", "Headache + nausea = warning signs.", "Descend 300–500m if symptoms worsen.", "Take Diamox if available (consult doctor).", "Drink plenty of water. Avoid alcohol.", "Seek medical help at nearest clinic."],
  },
  {
    title: "Bad weather / storm?", icon: CloudSnow, color: "text-purple-600 bg-purple-50",
    steps: ["Seek shelter immediately — lodge or cave.", "Do NOT cross high passes in storms.", "Stay away from ridges, lone trees, metal objects.", "Keep warm layers and emergency food.", "Wait it out — weather changes fast in mountains."],
  },
  {
    title: "Injury on the trail?", icon: HeartPulse, color: "text-orange-600 bg-orange-50",
    steps: ["Apply basic first aid from your kit.", "Immobilize sprains with bandage/splint.", "For bleeding, apply pressure with clean cloth.", "Call for help — guide, nearby trekkers, or 1144.", "If unable to walk, stay put and signal for rescue."],
  },
];

export const guides: Guide[] = [
  { id: "g1", name: "Pemba Sherpa", experience: "12 years", region: "Everest, Annapurna", languages: "Nepali, English, Hindi", rating: 4.9, treks: 340, badge: "Senior Guide", price: "Rs 3,000/day", phone: "+977-98XXXXXXXX" },
  { id: "g2", name: "Lakpa Tamang", experience: "8 years", region: "Langtang, Manaslu", languages: "Nepali, English", rating: 4.7, treks: 180, badge: "Certified Guide", price: "Rs 2,500/day", phone: "+977-98XXXXXXXX" },
  { id: "g3", name: "Dawa Dorje", experience: "15 years", region: "All major routes", languages: "Nepali, English, Japanese", rating: 5.0, treks: 500, badge: "Master Guide", price: "Rs 4,000/day", phone: "+977-98XXXXXXXX" },
];

export const porters: Porter[] = [
  { id: "pt1", name: "Mingma Rai", experience: "6 years", capacity: "25 kg", region: "Everest", rating: 4.8, price: "Rs 1,500/day", phone: "+977-98XXXXXXXX" },
  { id: "pt2", name: "Nima Lama", experience: "4 years", capacity: "20 kg", region: "Annapurna", rating: 4.6, price: "Rs 1,200/day", phone: "+977-98XXXXXXXX" },
  { id: "pt3", name: "Karma Bhote", experience: "10 years", capacity: "30 kg", region: "All routes", rating: 4.9, price: "Rs 1,800/day", phone: "+977-98XXXXXXXX" },
];

export const tickets: PermitTicket[] = [
  { id: "t1", name: "TIMS Card", type: "Permit", price: "Rs 2,000", desc: "Trekkers' Information Management System — required for all treks", required: true },
  { id: "t2", name: "Sagarmatha National Park", type: "Entry Permit", price: "Rs 3,000", desc: "Required for Everest region treks", required: true },
  { id: "t3", name: "Annapurna Conservation Area", type: "Entry Permit", price: "Rs 3,000", desc: "Required for Annapurna region treks", required: true },
  { id: "t4", name: "Langtang National Park", type: "Entry Permit", price: "Rs 3,000", desc: "Required for Langtang treks", required: true },
  { id: "t5", name: "Upper Mustang Restricted Permit", type: "Special Permit", price: "USD 500 (10 days)", desc: "Restricted area permit for Upper Mustang", required: false },
];

export const nearbyAttractions: NearbyAttraction[] = [
  { id: "a1", name: "Tengboche Monastery", area: "Everest", type: "Cultural", price: "Free" },
  { id: "a2", name: "Ghorepani Poon Hill", area: "Annapurna", type: "Viewpoint", price: "Rs 100" },
  { id: "a3", name: "Kyanjin Cheese Factory", area: "Langtang", type: "Cultural", price: "Free" },
  { id: "a4", name: "Muktinath Temple", area: "Annapurna", type: "Spiritual", price: "Free" },
  { id: "a5", name: "Kagbeni Old Town", area: "Mustang", type: "Heritage", price: "Free" },
];

export const infoItems = [
  { icon: "Compass" as const, text: "Autumn and spring are best for Mustang travel." },
  { icon: "Mountain" as const, text: "Weather and road conditions can change quickly." },
  { icon: "ShieldAlert" as const, text: "Carry warm layers, cash, power bank, and ID." },
  { icon: "Info" as const, text: "This MVP compares bus, jeep, and flight templates." },
];
