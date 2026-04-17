export type BudgetCategory = "transport" | "food" | "stay" | "activities";

export type MediaKind = "photo" | "video";

export interface BudgetItem {
  id: string;
  label: string;
  amount: number;
  category: BudgetCategory;
}

export interface TripDay {
  id: string;
  title: string;
  dayLabel: string;
  route: string;
  notes: string;
  expenses: BudgetItem[];
}

export interface TripMediaItem {
  id: string;
  kind: MediaKind;
  name: string;
  fileType: string;
  url: string;
  caption: string;
}

export interface TripEntry {
  id: string;
  tripTitle: string;
  destination: string;
  tripType: string;
  startDate: string;
  endDate: string;
  description: string;
  itinerary: TripDay[];
  media: TripMediaItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetTotals {
  transport: number;
  food: number;
  stay: number;
  activities: number;
  grandTotal: number;
}

export type TripValidationErrors = Partial<Record<"tripTitle" | "destination" | "tripType" | "startDate" | "endDate" | "description", string>>;
