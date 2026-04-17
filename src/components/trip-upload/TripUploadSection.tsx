import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Camera,
  MapPin,
  Pencil,
  PiggyBank,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Pie, PieChart } from "recharts";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeader } from "@/components/trekking/SectionHeader";
import { createSampleTrip, loadStoredTrips, TRIP_EDITOR_TARGET_KEY, TRIP_STORAGE_KEY } from "@/components/trip-upload/data";
import {
  buildTripHighlights,
  calculateBudgetTotals,
  categoryColors,
  categoryLabels,
  filesToMediaItems,
  formatCurrency,
  getChartData,
  validateTrip,
} from "@/components/trip-upload/helpers";
import { MediaDropzone } from "@/components/trip-upload/MediaDropzone";
import type {
  BudgetCategory,
  TripDay,
  TripEntry,
  TripMediaItem,
  TripValidationErrors,
} from "@/components/trip-upload/types";
import type { ReactNode } from "react";

const budgetCategories = Object.keys(categoryLabels) as BudgetCategory[];

const newExpense = (category: BudgetCategory = "food") => ({
  id: `expense-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  label: "",
  amount: 0,
  category,
});

const newDay = (index: number): TripDay => ({
  id: `day-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: `Day ${index}`,
  dayLabel: "",
  route: "",
  notes: "",
  expenses: [newExpense("transport")],
});

const createBlankTrip = (): TripEntry => ({
  id: `trip-${Date.now()}`,
  tripTitle: "",
  destination: "",
  tripType: "",
  startDate: "",
  endDate: "",
  description: "",
  itinerary: [newDay(1)],
  media: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const chartConfig = {
  Transport: { label: "Transport", color: categoryColors.transport },
  Food: { label: "Food", color: categoryColors.food },
  Stay: { label: "Stay", color: categoryColors.stay },
  Activities: { label: "Activities", color: categoryColors.activities },
};

export const TripUploadSection = () => {
  const initialTrips = useMemo(() => loadStoredTrips(), []);
  const [savedTrips, setSavedTrips] = useState<TripEntry[]>(initialTrips);
  const [draft, setDraft] = useState<TripEntry>(initialTrips[0]);
  const [editingTripId, setEditingTripId] = useState<string | null>(initialTrips[0]?.id ?? null);
  const [errors, setErrors] = useState<TripValidationErrors>({});
  const [statusMessage, setStatusMessage] = useState("Sample Pokhara trip loaded from local storage.");

  useEffect(() => {
    window.localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(savedTrips));
  }, [savedTrips]);

  useEffect(() => {
    const targetId = window.localStorage.getItem(TRIP_EDITOR_TARGET_KEY);
    if (!targetId) return;

    const targetTrip = loadStoredTrips().find((trip) => trip.id === targetId);
    if (targetTrip) {
      setDraft(targetTrip);
      setEditingTripId(targetTrip.id);
      setErrors({});
      setStatusMessage(`Loaded "${targetTrip.tripTitle}" for editing.`);
    }

    window.localStorage.removeItem(TRIP_EDITOR_TARGET_KEY);
  }, []);

  const totals = useMemo(() => calculateBudgetTotals(draft), [draft]);
  const chartData = useMemo(() => getChartData(totals), [totals]);
  const highlights = useMemo(() => buildTripHighlights(draft, totals), [draft, totals]);

  const updateDraft = (updater: (current: TripEntry) => TripEntry) => {
    setDraft((current) => updater(current));
  };

  const handleSave = () => {
    const nextErrors = validateTrip(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage("Please complete the required trip details before saving.");
      return;
    }

    const now = new Date().toISOString();
    const entryToSave = {
      ...draft,
      createdAt: editingTripId ? draft.createdAt : now,
      updatedAt: now,
    };

    setSavedTrips((current) => {
      const existingIndex = current.findIndex((trip) => trip.id === editingTripId);
      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = entryToSave;
        return next;
      }

      return [entryToSave, ...current];
    });

    setDraft(entryToSave);
    setEditingTripId(entryToSave.id);
    setStatusMessage("Trip entry saved locally. Refresh-safe with localStorage.");
  };

  const handleEditTrip = (trip: TripEntry) => {
    setDraft(trip);
    setEditingTripId(trip.id);
    setErrors({});
    setStatusMessage(`Editing "${trip.tripTitle}" from local storage.`);
  };

  const handleDeleteTrip = (tripId: string) => {
    const nextTrips = savedTrips.filter((trip) => trip.id !== tripId);
    setSavedTrips(nextTrips);

    if (editingTripId === tripId) {
      const nextDraft = nextTrips[0] ?? createBlankTrip();
      setDraft(nextDraft);
      setEditingTripId(nextTrips[0]?.id ?? null);
    }

    setStatusMessage("Trip entry deleted from local storage.");
  };

  const handleNewDraft = () => {
    const blank = createBlankTrip();
    setDraft(blank);
    setEditingTripId(null);
    setErrors({});
    setStatusMessage("New trip draft ready. Nothing is saved until you press Save Trip.");
  };

  const handleMediaUpload = async (files: File[], kind: "photo" | "video") => {
    const mediaItems = await filesToMediaItems(files, kind);
    updateDraft((current) => ({
      ...current,
      media: [...current.media, ...mediaItems],
    }));
    setStatusMessage(`${mediaItems.length} ${kind === "photo" ? "photo" : "reel"} file(s) added to the gallery preview.`);
  };

  const updateMediaItem = (mediaId: string, updater: (item: TripMediaItem) => TripMediaItem) => {
    updateDraft((current) => ({
      ...current,
      media: current.media.map((item) => (item.id === mediaId ? updater(item) : item)),
    }));
  };

  const removeMediaItem = (mediaId: string) => {
    updateDraft((current) => ({
      ...current,
      media: current.media.filter((item) => item.id !== mediaId),
    }));
  };

  const updateDay = (dayId: string, updater: (day: TripDay) => TripDay) => {
    updateDraft((current) => ({
      ...current,
      itinerary: current.itinerary.map((day) => (day.id === dayId ? updater(day) : day)),
    }));
  };

  const removeDay = (dayId: string) => {
    updateDraft((current) => ({
      ...current,
      itinerary: current.itinerary.filter((day) => day.id !== dayId),
    }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Camera}
        title="Upload Travel Story"
        subtitle="Frontend-only trip uploads with local media previews, itinerary editing, and smart budget summaries."
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden border-border shadow-none">
            <div className="bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.14),_transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(245,240,233,0.98))]">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <CardTitle className="text-xl">Trip Upload</CardTitle>
                    <CardDescription className="mt-1 max-w-2xl text-sm">
                      Add trip details, upload photos and reels, track every rupee, and save everything in the browser.
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" className="rounded-2xl" onClick={handleNewDraft}>
                      <Plus className="mr-2 h-4 w-4" />
                      New draft
                    </Button>
                    <Button type="button" className="rounded-2xl" onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save trip
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-2xl border border-border/80 bg-background/80 p-4 text-sm text-muted-foreground">
                  {statusMessage}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Trip title" error={errors.tripTitle}>
                    <Input
                      value={draft.tripTitle}
                      onChange={(event) => updateDraft((current) => ({ ...current, tripTitle: event.target.value }))}
                      placeholder="Pokhara New Year 2083"
                      className="rounded-2xl"
                    />
                  </Field>
                  <Field label="Destination" error={errors.destination}>
                    <Input
                      value={draft.destination}
                      onChange={(event) => updateDraft((current) => ({ ...current, destination: event.target.value }))}
                      placeholder="Pokhara, Nepal"
                      className="rounded-2xl"
                    />
                  </Field>
                  <Field label="Trip type" error={errors.tripType}>
                    <Input
                      value={draft.tripType}
                      onChange={(event) => updateDraft((current) => ({ ...current, tripType: event.target.value }))}
                      placeholder="New Year Trip"
                      className="rounded-2xl"
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Start date" error={errors.startDate}>
                      <Input
                        type="date"
                        value={draft.startDate}
                        onChange={(event) => updateDraft((current) => ({ ...current, startDate: event.target.value }))}
                        className="rounded-2xl"
                      />
                    </Field>
                    <Field label="End date" error={errors.endDate}>
                      <Input
                        type="date"
                        value={draft.endDate}
                        onChange={(event) => updateDraft((current) => ({ ...current, endDate: event.target.value }))}
                        className="rounded-2xl"
                      />
                    </Field>
                  </div>
                </div>

                <Field label="Trip description / notes" error={errors.description}>
                  <Textarea
                    value={draft.description}
                    onChange={(event) => updateDraft((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Write the story behind this trip..."
                    className="min-h-28 rounded-3xl"
                  />
                </Field>

                <div className="grid gap-4 lg:grid-cols-2">
                  <MediaDropzone
                    kind="photo"
                    accept="image/*"
                    description="Multiple images supported. Great for scenic stops, cafes, and memories."
                    onFilesSelected={(files) => handleMediaUpload(files, "photo")}
                  />
                  <MediaDropzone
                    kind="video"
                    accept="video/*"
                    description="Upload short reels or clips. Local preview URLs are stored in localStorage."
                    onFilesSelected={(files) => handleMediaUpload(files, "video")}
                  />
                </div>

                <Card className="border-border shadow-none">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">Itinerary and budget editor</CardTitle>
                        <CardDescription>Per-day expandable itinerary with structured budget rows.</CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() =>
                          updateDraft((current) => ({
                            ...current,
                            itinerary: [...current.itinerary, newDay(current.itinerary.length + 1)],
                          }))
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add day
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full">
                      {draft.itinerary.map((day, index) => {
                        const dayTotal = day.expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);

                        return (
                          <AccordionItem key={day.id} value={day.id}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex w-full flex-col gap-2 pr-3 text-left sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">{day.title || `Day ${index + 1}`}</span>
                                    {day.dayLabel && <Badge variant="secondary" className="rounded-full">{day.dayLabel}</Badge>}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{day.route || "Add route or area details"}</p>
                                </div>
                                <span className="text-sm font-semibold text-foreground">{formatCurrency(dayTotal)}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Section title">
                                  <Input
                                    value={day.title}
                                    onChange={(event) =>
                                      updateDay(day.id, (current) => ({ ...current, title: event.target.value }))
                                    }
                                    className="rounded-2xl"
                                  />
                                </Field>
                                <Field label="Label">
                                  <Input
                                    value={day.dayLabel}
                                    onChange={(event) =>
                                      updateDay(day.id, (current) => ({ ...current, dayLabel: event.target.value }))
                                    }
                                    placeholder="Sunday / Wednesday / Stay"
                                    className="rounded-2xl"
                                  />
                                </Field>
                              </div>

                              <Field label="Route / area">
                                <Input
                                  value={day.route}
                                  onChange={(event) =>
                                    updateDay(day.id, (current) => ({ ...current, route: event.target.value }))
                                  }
                                  placeholder="KTM to Pokhara"
                                  className="rounded-2xl"
                                />
                              </Field>

                              <Field label="Notes">
                                <Textarea
                                  value={day.notes}
                                  onChange={(event) =>
                                    updateDay(day.id, (current) => ({ ...current, notes: event.target.value }))
                                  }
                                  placeholder="Highlights, timings, or quick notes"
                                  className="min-h-20 rounded-3xl"
                                />
                              </Field>

                              <div className="space-y-3">
                                {day.expenses.map((expense) => (
                                  <div key={expense.id} className="grid gap-3 rounded-3xl border border-border p-4 md:grid-cols-[1.2fr_0.7fr_0.5fr_auto]">
                                    <Field label="Expense name">
                                      <Input
                                        value={expense.label}
                                        onChange={(event) =>
                                          updateDay(day.id, (current) => ({
                                            ...current,
                                            expenses: current.expenses.map((item) =>
                                              item.id === expense.id ? { ...item, label: event.target.value } : item,
                                            ),
                                          }))
                                        }
                                        placeholder="Bus / Dinner / Kayaking"
                                        className="rounded-2xl"
                                      />
                                    </Field>
                                    <Field label="Category">
                                      <Select
                                        value={expense.category}
                                        onValueChange={(value: BudgetCategory) =>
                                          updateDay(day.id, (current) => ({
                                            ...current,
                                            expenses: current.expenses.map((item) =>
                                              item.id === expense.id ? { ...item, category: value } : item,
                                            ),
                                          }))
                                        }
                                      >
                                        <SelectTrigger className="rounded-2xl">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {budgetCategories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                              {categoryLabels[category]}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </Field>
                                    <Field label="Amount">
                                      <Input
                                        type="number"
                                        min="0"
                                        value={expense.amount}
                                        onChange={(event) =>
                                          updateDay(day.id, (current) => ({
                                            ...current,
                                            expenses: current.expenses.map((item) =>
                                              item.id === expense.id
                                                ? { ...item, amount: Number(event.target.value) || 0 }
                                                : item,
                                            ),
                                          }))
                                        }
                                        className="rounded-2xl"
                                      />
                                    </Field>
                                    <div className="flex items-end">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-2xl text-muted-foreground hover:text-destructive"
                                        onClick={() =>
                                          updateDay(day.id, (current) => ({
                                            ...current,
                                            expenses: current.expenses.filter((item) => item.id !== expense.id),
                                          }))
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="rounded-2xl"
                                  onClick={() =>
                                    updateDay(day.id, (current) => ({
                                      ...current,
                                      expenses: [...current.expenses, newExpense()],
                                    }))
                                  }
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add expense
                                </Button>
                                {draft.itinerary.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="rounded-2xl text-muted-foreground hover:text-destructive"
                                    onClick={() => removeDay(day.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove section
                                  </Button>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Media gallery</CardTitle>
                    <CardDescription>Photos upload area, reels upload area, preview grid, and per-item captions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {draft.media.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-border px-6 py-12 text-center">
                        <p className="text-sm font-medium text-foreground">No photos or reels uploaded yet</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Use the upload areas above to add travel memories with captions.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {draft.media.map((media) => (
                          <div key={media.id} className="overflow-hidden rounded-3xl border border-border bg-card">
                            <div className="aspect-[4/3] bg-secondary/40">
                              {media.kind === "photo" ? (
                                <img src={media.url} alt={media.name} className="h-full w-full object-cover" />
                              ) : (
                                <video src={media.url} controls className="h-full w-full object-cover" />
                              )}
                            </div>
                            <div className="space-y-3 p-4">
                              <div className="flex items-center justify-between gap-2">
                                <Badge variant="outline" className="rounded-full">
                                  {media.kind === "photo" ? "Photo" : "Reel"}
                                </Badge>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-2xl text-muted-foreground hover:text-destructive"
                                  onClick={() => removeMediaItem(media.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="truncate text-sm font-medium text-foreground">{media.name}</p>
                              <Textarea
                                value={media.caption}
                                onChange={(event) =>
                                  updateMediaItem(media.id, (item) => ({ ...item, caption: event.target.value }))
                                }
                                placeholder="Add an optional caption"
                                className="min-h-20 rounded-3xl"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Budget summary</CardTitle>
              </div>
              <CardDescription>Auto-calculated totals from your structured expense rows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetCategories.map((category) => (
                <div key={category} className="flex items-center justify-between rounded-2xl bg-secondary/50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: categoryColors[category] }} />
                    <span className="text-sm font-medium text-foreground">{categoryLabels[category]}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(totals[category])}</span>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
                <span className="text-sm font-semibold">Grand total</span>
                <span className="text-base font-bold">{formatCurrency(totals.grandTotal)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Expense breakdown chart</CardTitle>
              <CardDescription>Travel spend by category.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[260px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={3} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Itinerary timeline</CardTitle>
              </div>
              <CardDescription>Quick overview of each trip day and stay section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {draft.itinerary.map((day) => (
                <div key={day.id} className="rounded-3xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{day.title}</p>
                      <p className="text-sm text-muted-foreground">{day.dayLabel}</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      {day.expenses.length} items
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{day.route || "Route not added yet"}</span>
                  </div>
                  {day.notes && <p className="mt-3 text-sm text-muted-foreground">{day.notes}</p>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Trip highlights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {highlights.map((highlight) => (
                <div key={highlight} className="rounded-2xl bg-secondary/50 px-4 py-3 text-sm text-foreground">
                  {highlight}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Saved trips</CardTitle>
              <CardDescription>Save, edit, and delete trip entries without any backend.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {savedTrips.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border px-5 py-10 text-center">
                  <p className="text-sm font-medium text-foreground">No saved trips yet</p>
                  <p className="mt-2 text-sm text-muted-foreground">Create a new draft and save it to localStorage.</p>
                </div>
              ) : (
                savedTrips.map((trip) => {
                  const tripTotals = calculateBudgetTotals(trip);
                  const isActive = trip.id === editingTripId;

                  return (
                    <div
                      key={trip.id}
                      className={`rounded-3xl border p-4 transition-all ${
                        isActive ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{trip.tripTitle || "Untitled trip"}</p>
                          <p className="text-sm text-muted-foreground">{trip.destination || "No destination"}</p>
                        </div>
                        <Badge variant="secondary" className="rounded-full">
                          {formatCurrency(tripTotals.grandTotal)}
                        </Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button type="button" variant="outline" className="rounded-2xl" onClick={() => handleEditTrip(trip)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="rounded-2xl text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteTrip(trip.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  children: ReactNode;
  error?: string;
}

const Field = ({ label, children, error }: FieldProps) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-foreground">{label}</Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);
