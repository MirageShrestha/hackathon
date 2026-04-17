import type {
  BudgetItem,
  BudgetTotals,
  MediaKind,
  TripEntry,
  TripMediaItem,
  TripValidationErrors,
} from "@/components/trip-upload/types";

export const categoryLabels: Record<BudgetItem["category"], string> = {
  transport: "Transport",
  food: "Food",
  stay: "Stay",
  activities: "Activities",
};

export const categoryColors: Record<BudgetItem["category"], string> = {
  transport: "#2563eb",
  food: "#f97316",
  stay: "#0f766e",
  activities: "#dc2626",
};

export const formatCurrency = (value: number) => `Rs ${value.toLocaleString("en-IN")}`;

export const calculateBudgetTotals = (trip: Pick<TripEntry, "itinerary">): BudgetTotals => {
  const totals = trip.itinerary.reduce<BudgetTotals>(
    (acc, day) => {
      day.expenses.forEach((expense) => {
        acc[expense.category] += Number(expense.amount) || 0;
        acc.grandTotal += Number(expense.amount) || 0;
      });
      return acc;
    },
    { transport: 0, food: 0, stay: 0, activities: 0, grandTotal: 0 },
  );

  return totals;
};

export const getChartData = (totals: BudgetTotals) =>
  (Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((key) => ({
    name: categoryLabels[key],
    value: totals[key],
    fill: categoryColors[key],
  }));

export const buildTripHighlights = (trip: TripEntry, totals: BudgetTotals) => {
  const dayCount = trip.itinerary.filter((day) => day.title.toLowerCase().startsWith("day")).length;
  const mediaCount = trip.media.length;
  const categoriesCovered = Array.from(
    new Set(
      trip.itinerary.flatMap((day) => day.expenses.map((expense) => categoryLabels[expense.category])),
    ),
  );

  return [
    `${dayCount || trip.itinerary.length} itinerary stops ready for editing`,
    `${categoriesCovered.join(", ")} budget tracked`,
    `${mediaCount} media item${mediaCount === 1 ? "" : "s"} in the gallery`,
    `${formatCurrency(totals.grandTotal)} total planned spend`,
  ];
};

export const validateTrip = (trip: TripEntry): TripValidationErrors => {
  const errors: TripValidationErrors = {};

  if (!trip.tripTitle.trim()) errors.tripTitle = "Trip title is required.";
  if (!trip.destination.trim()) errors.destination = "Destination is required.";
  if (!trip.tripType.trim()) errors.tripType = "Trip type is required.";
  if (!trip.startDate) errors.startDate = "Start date is required.";
  if (!trip.endDate) errors.endDate = "End date is required.";
  if (!trip.description.trim()) errors.description = "Trip notes are required.";

  if (trip.startDate && trip.endDate && trip.endDate < trip.startDate) {
    errors.endDate = "End date cannot be earlier than start date.";
  }

  return errors;
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const filesToMediaItems = async (files: File[], kind: MediaKind): Promise<TripMediaItem[]> => {
  const items = await Promise.all(
    files.map(async (file, index) => ({
      id: `${kind}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
      kind,
      name: file.name,
      fileType: file.type,
      url: await readFileAsDataUrl(file),
      caption: "",
    })),
  );

  return items;
};
