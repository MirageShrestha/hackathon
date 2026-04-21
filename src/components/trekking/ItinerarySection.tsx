import { CalendarDays, MapPin, Wallet } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SectionHeader } from "@/components/trekking/SectionHeader";
import { createSampleTrip, loadStoredTrips } from "@/components/trip-upload/data";
import { calculateBudgetTotals, categoryLabels, formatCurrency } from "@/components/trip-upload/helpers";
import type { BudgetCategory } from "@/components/trip-upload/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MY_TREK_STORAGE_KEY, getDefaultMyTrekStore } from "@/components/my-trek/data";
import type { TrekPost } from "@/components/my-trek/types";

interface ItinerarySectionProps {
  onOpenStories: () => void;
  selectedPlanId?: string;
}

type ItineraryExpense = {
  id: string;
  label: string;
  amount: number;
  category: BudgetCategory;
};

type ItineraryTemplate = {
  tripTitle: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  itinerary: Array<{
    id: string;
    title: string;
    dayLabel: string;
    route: string;
    notes: string;
    expenses: ItineraryExpense[];
  }>;
};

const poonHillPlan: ItineraryTemplate = {
  tripTitle: "Poon Hill Budget Plan",
  destination: "Poon Hill, Nepal",
  startDate: "3 days",
  endDate: "Budget Guide",
  description:
    "The original low-budget Poon Hill itinerary with the previous cost structure, route flow, and budget-focused day planning.",
  itinerary: [
    {
      id: "poonhill-day-1",
      title: "Day 1",
      dayLabel: "Kathmandu to Pokhara",
      route: "Night bus transfer",
      notes: "Take a night bus to Pokhara and keep the first day simple with one meal stop.",
      expenses: [
        { id: "p1-1", label: "Night bus to Pokhara", amount: 1000, category: "transport" },
        { id: "p1-2", label: "Veg dinner on the way", amount: 250, category: "food" },
      ],
    },
    {
      id: "poonhill-day-2",
      title: "Day 2",
      dayLabel: "Pokhara to Birethanti to Ghorepani",
      route: "Jeep + trek day",
      notes: "Start early, transfer to Birethanti, then trek up to Upper Ghorepani with food and lodge costs included.",
      expenses: [
        { id: "p2-1", label: "Black tea (Pokhara)", amount: 60, category: "food" },
        { id: "p2-2", label: "Jeep to Birethanti", amount: 500, category: "transport" },
        { id: "p2-3", label: "Breakfast: egg, bread, potato, tea", amount: 150, category: "food" },
        { id: "p2-4", label: "Half veg chowmein", amount: 125, category: "food" },
        { id: "p2-5", label: "Hotel: bed + dinner + breakfast", amount: 1200, category: "stay" },
      ],
    },
    {
      id: "poonhill-day-3",
      title: "Day 3",
      dayLabel: "Poon Hill to Tikhedhunga to Pokhara to KTM",
      route: "Sunrise trek + return buses",
      notes: "Catch sunrise at Poon Hill, trek down, then take the return bus chain back toward Kathmandu.",
      expenses: [
        { id: "p3-1", label: "Breakfast", amount: 215, category: "food" },
        { id: "p3-2", label: "Bus to Pokhara", amount: 500, category: "transport" },
        { id: "p3-3", label: "Chicken momo (Pokhara)", amount: 200, category: "food" },
        { id: "p3-4", label: "Night bus to Kathmandu", amount: 1000, category: "transport" },
      ],
    },
  ],
};

const getActiveTemplate = (selectedPlanId?: string): ItineraryTemplate => {
  if (selectedPlanId === "r-poonhill") return poonHillPlan;

  const activeTrip = loadStoredTrips()[0] ?? createSampleTrip();
  return {
    tripTitle: activeTrip.tripTitle,
    destination: activeTrip.destination,
    startDate: activeTrip.startDate,
    endDate: activeTrip.endDate,
    description: activeTrip.description,
    itinerary: activeTrip.itinerary,
  };
};

export const ItinerarySection = ({ onOpenStories, selectedPlanId }: ItinerarySectionProps) => {
  const activeTrip = getActiveTemplate(selectedPlanId);
  const totals = calculateBudgetTotals(activeTrip);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { toast } = useToast();

  const handleCheckout = () => {
    // Load current trek store
    const raw = localStorage.getItem(MY_TREK_STORAGE_KEY);
    let store = getDefaultMyTrekStore();
    
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<typeof store>;
        store = { ...store, ...parsed };
      } catch (error) {
        console.error('Failed to parse trek store:', error);
      }
    }

    // Create new trek post
    const newTrek: TrekPost = {
      id: `saved-${Date.now()}`,
      ownerHandle: store.profile.handle,
      title: activeTrip.tripTitle,
      destination: activeTrip.destination,
      date: `${activeTrip.startDate} - ${activeTrip.endDate}`,
      budgetLabel: formatCurrency(totals.grandTotal),
      budgetValue: totals.grandTotal,
      description: activeTrip.description,
      status: "Draft", // Save as draft initially
      coverImage: "", // Could be enhanced to include an image
    };

    // Add to treks array
    store.treks = [newTrek, ...store.treks];

    // Save back to localStorage
    localStorage.setItem(MY_TREK_STORAGE_KEY, JSON.stringify(store));

    toast({
      title: "Plan Saved!",
      description: `Your ${activeTrip.tripTitle} has been saved to your trek profile.`,
    });
    setIsCheckoutOpen(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={CalendarDays}
        title="Trip Itinerary"
        subtitle="Plan opens directly into your itinerary with budget totals, day breakdowns, and editable trip flow."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-xl">{activeTrip.tripTitle}</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{activeTrip.destination}</span>
              <span>{activeTrip.startDate} to {activeTrip.endDate}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground/80">{activeTrip.description}</p>

            <Accordion type="multiple" className="w-full">
              {activeTrip.itinerary.map((day) => {
                const dayTotal = day.expenses.reduce((sum, expense) => sum + expense.amount, 0);

                return (
                  <AccordionItem key={day.id} value={day.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex w-full flex-col gap-2 pr-3 text-left sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{day.title}</span>
                            <Badge variant="secondary" className="rounded-full">{day.dayLabel}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{day.route}</p>
                        </div>
                        <span className="font-semibold text-foreground">{formatCurrency(dayTotal)}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{day.notes}</p>
                      <div className="space-y-2">
                        {day.expenses.map((expense) => (
                          <div key={expense.id} className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3 text-sm">
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">{expense.label}</p>
                              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                                {categoryLabels[expense.category]}
                              </p>
                            </div>
                            <span className="font-semibold text-foreground">{formatCurrency(expense.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Budget Snapshot</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["transport", "food", "stay", "activities"] as const).map((category) => (
                <div key={category} className="flex items-center justify-between rounded-2xl bg-secondary/50 px-4 py-3 text-sm">
                  <span className="font-medium text-foreground">{categoryLabels[category]}</span>
                  <span className="font-semibold text-foreground">{formatCurrency(totals[category])}</span>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
                <span className="font-semibold">Grand total</span>
                <span className="text-base font-bold">{formatCurrency(totals.grandTotal)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Save to My Trek</CardTitle>
              <CardDescription>Save this plan to your trek profile for future reference and planning.</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full rounded-2xl" variant="default">
                    Save Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Save Plan to My Trek</DialogTitle>
                    <DialogDescription>
                      Review your trip details and save this plan to your trek profile for future reference.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="col-span-2 font-medium">Trip:</span>
                      <span className="col-span-2">{activeTrip.tripTitle}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="col-span-2 font-medium">Destination:</span>
                      <span className="col-span-2">{activeTrip.destination}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="col-span-2 font-medium">Duration:</span>
                      <span className="col-span-2">{activeTrip.startDate} to {activeTrip.endDate}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="col-span-2 font-medium">Total Cost:</span>
                      <span className="col-span-2 font-bold">{formatCurrency(totals.grandTotal)}</span>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleCheckout}>
                      Save to My Trek
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Keep planning</CardTitle>
              <CardDescription>Jump into Stories to edit the saved trip, attach more photos, or update the budget.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full rounded-2xl" onClick={onOpenStories}>Open Story Editor</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
