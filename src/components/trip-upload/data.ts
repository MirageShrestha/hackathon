import type { TripEntry } from "@/components/trip-upload/types";

export const TRIP_STORAGE_KEY = "true-nepal-trip-uploads";
export const TRIP_EDITOR_TARGET_KEY = "true-nepal-trip-editor-target";

export const createSampleTrip = (): TripEntry => ({
  id: "pokhara-new-year-2083",
  tripTitle: "Pokhara New Year 2083",
  destination: "Pokhara, Nepal",
  tripType: "New Year Trip",
  startDate: "2026-04-13",
  endDate: "2026-04-16",
  description:
    "A trip from Kathmandu to Pokhara for New Year 2083 with travel, food, local transport, lake visit, cafes, kayaking, and return travel.",
  itinerary: [
    {
      id: "day-1",
      title: "Day 1",
      dayLabel: "Sunday",
      route: "KTM to Pokhara",
      notes: "Reached Pokhara at 2 PM and settled in before dinner.",
      expenses: [
        { id: "d1-bus", label: "Bus", amount: 1600, category: "transport" },
        { id: "d1-local-transfer", label: "Local transfer to bus park", amount: 350, category: "transport" },
        { id: "d1-food-1", label: "Mugling chicken khana", amount: 350, category: "food" },
        { id: "d1-food-2", label: "Breakfast (Aloo Chat)", amount: 250, category: "food" },
        { id: "d1-food-3", label: "Dinner", amount: 250, category: "food" },
      ],
    },
    {
      id: "day-2",
      title: "Day 2",
      dayLabel: "Monday",
      route: "Lakeside to Begnas Lake",
      notes: "New Year Eve around Lakeside and Begnas Lake.",
      expenses: [
        { id: "d2-transport-1", label: "Lakeside to Begnas Lake (InDrive)", amount: 350, category: "transport" },
        { id: "d2-food-1", label: "Tropicana Cafe", amount: 375, category: "food" },
        { id: "d2-food-2", label: "Fish", amount: 450, category: "food" },
        { id: "d2-transport-2", label: "Begnas to Lakeside (InDrive)", amount: 350, category: "transport" },
        { id: "d2-food-3", label: "Tipsy Tuna Cafe (New Year Eve)", amount: 1250, category: "food" },
      ],
    },
    {
      id: "day-3",
      title: "Day 3",
      dayLabel: "Tuesday",
      route: "Lakeside day out",
      notes: "Cafe breakfast, kayaking, and Lakeside food stops.",
      expenses: [
        { id: "d3-food-1", label: "Breakfast at Cindermint Cafe", amount: 500, category: "food" },
        { id: "d3-activity-1", label: "Kayaking", amount: 300, category: "activities" },
        { id: "d3-food-2", label: "Roam around Lakeside (Wings Momo)", amount: 450, category: "food" },
        { id: "d3-food-3", label: "Mantra Thakali", amount: 690, category: "food" },
      ],
    },
    {
      id: "day-4",
      title: "Day 4",
      dayLabel: "Wednesday",
      route: "Pokhara to KTM",
      notes: "Return bus ride with a Kurintar lunch stop.",
      expenses: [
        { id: "d4-bus", label: "Bus", amount: 1600, category: "transport" },
        { id: "d4-food-1", label: "Lunch at Kurintar Retreat", amount: 500, category: "food" },
      ],
    },
    {
      id: "stay-1",
      title: "Stay",
      dayLabel: "Room Cost",
      route: "Hotel Mountain Top - per person for 3 nights",
      notes: "Accommodation split per person for the full trip at Hotel Mountain Top.",
      expenses: [
        { id: "stay-night-1", label: "Night 1 - Hotel Mountain Top", amount: 1000, category: "stay" },
        { id: "stay-night-2", label: "Night 2 - Hotel Mountain Top", amount: 1250, category: "stay" },
        { id: "stay-night-3", label: "Night 3 - Hotel Mountain Top", amount: 1000, category: "stay" },
      ],
    },
  ],
  media: [],
  createdAt: new Date("2026-04-13T09:00:00.000Z").toISOString(),
  updatedAt: new Date("2026-04-13T09:00:00.000Z").toISOString(),
});

export const loadStoredTrips = (): TripEntry[] => {
  if (typeof window === "undefined") return [createSampleTrip()];

  const raw = window.localStorage.getItem(TRIP_STORAGE_KEY);
  if (!raw) return [createSampleTrip()];

  try {
    const parsed = JSON.parse(raw) as TripEntry[];
    const withHotelStayLabels = parsed.map((trip) => ({
      ...trip,
      itinerary: trip.itinerary.map((day) => {
        if (day.id !== "stay-1") return day;

        return {
          ...day,
          expenses: day.expenses.map((expense) => {
            if (expense.id === "stay-night-1") {
              return { ...expense, label: "Night 1 - Hotel Mountain Top" };
            }
            if (expense.id === "stay-night-2") {
              return { ...expense, label: "Night 2 - Hotel Mountain Top" };
            }
            if (expense.id === "stay-night-3") {
              return { ...expense, label: "Night 3 - Hotel Mountain Top" };
            }
            return expense;
          }),
        };
      }),
    }));

    return withHotelStayLabels.length ? withHotelStayLabels : [createSampleTrip()];
  } catch {
    return [createSampleTrip()];
  }
};
