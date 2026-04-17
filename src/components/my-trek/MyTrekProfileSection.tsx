import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Edit3,
  Film,
  Globe2,
  MapPin,
  NotebookPen,
  Plus,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { creatorProfileStores, getDefaultMyTrekStore, MY_TREK_STORAGE_KEY } from "@/components/my-trek/data";
import type { CreatorProfileView, DraftItem, MyTrekStore, TrekPost } from "@/components/my-trek/types";
import { loadStoredTrips, TRIP_EDITOR_TARGET_KEY, TRIP_STORAGE_KEY } from "@/components/trip-upload/data";
import { calculateBudgetTotals, formatCurrency } from "@/components/trip-upload/helpers";

interface MyTrekProfileSectionProps {
  onOpenStories: () => void;
  onOpenReels: () => void;
  selectedHandle?: string;
}

const loadStore = (): MyTrekStore => {
  if (typeof window === "undefined") return getDefaultMyTrekStore();

  const raw = window.localStorage.getItem(MY_TREK_STORAGE_KEY);
  if (!raw) return getDefaultMyTrekStore();

  try {
    const parsed = JSON.parse(raw) as Partial<MyTrekStore>;
    const defaults = getDefaultMyTrekStore();

    const needsProfileMigration =
      parsed.profile?.name === "Aarav Thapa" ||
      parsed.profile?.handle === "@aarav.trails";

    const baseHandle = defaults.profile.handle;

    return {
      profile: needsProfileMigration ? defaults.profile : { ...defaults.profile, ...parsed.profile },
      treks: (parsed.treks ?? defaults.treks).map((trek) => ({
        ownerHandle: trek.ownerHandle ?? baseHandle,
        ...trek,
      })),
      reels: (parsed.reels ?? defaults.reels).map((reel) => ({
        ownerHandle: reel.ownerHandle ?? baseHandle,
        ...reel,
      })),
      stories: (parsed.stories ?? defaults.stories).map((story) => ({
        ownerHandle: story.ownerHandle ?? baseHandle,
        ...story,
      })),
      drafts: (parsed.drafts ?? defaults.drafts).map((draft) => ({
        ownerHandle: draft.ownerHandle ?? baseHandle,
        ...draft,
      })),
    };
  } catch {
    return getDefaultMyTrekStore();
  }
};

const draftLabels: Record<DraftItem["kind"], string> = {
  trek: "Trek Drafts",
  reel: "Reel Drafts",
  story: "Story Drafts",
};

export const MyTrekProfileSection = ({
  onOpenStories,
  onOpenReels,
  selectedHandle,
}: MyTrekProfileSectionProps) => {
  const initialStore = useMemo(() => loadStore(), []);
  const [store, setStore] = useState<MyTrekStore>(initialStore);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(initialStore.profile);
  const [uploadedTrips, setUploadedTrips] = useState(() => loadStoredTrips());
  const [featuredTrek, setFeaturedTrek] = useState<TrekPost | null>(null);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    window.localStorage.setItem(MY_TREK_STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    setUploadedTrips(loadStoredTrips());
  }, []);

  useEffect(() => {
    if ((selectedHandle ?? store.profile.handle) !== store.profile.handle) {
      setIsEditingProfile(false);
      setProfileForm(store.profile);
    }
  }, [selectedHandle, store.profile]);

  const uploadedTrekPosts = useMemo<TrekPost[]>(
    () =>
      uploadedTrips.map((trip) => {
        const totals = calculateBudgetTotals(trip);
        const coverImage =
          trip.media.find((item) => item.kind === "photo")?.url ?? store.treks[0]?.coverImage ?? "";

        return {
          id: trip.id,
          ownerHandle: store.profile.handle,
          title: trip.tripTitle,
          destination: trip.destination,
          date: `${trip.startDate || "Start"} - ${trip.endDate || "End"}`,
          budgetLabel: formatCurrency(totals.grandTotal),
          budgetValue: totals.grandTotal,
          description: trip.description,
          status: "Published",
          coverImage,
        };
      }),
    [store.profile.handle, store.treks, uploadedTrips],
  );

  const localTreks = useMemo(
    () => store.treks.filter((trip) => !uploadedTrips.some((uploaded) => uploaded.id === trip.id)),
    [store.treks, uploadedTrips],
  );
  const ownProfileTreks = useMemo(() => [...uploadedTrekPosts, ...localTreks], [localTreks, uploadedTrekPosts]);

  const activeHandle = selectedHandle ?? store.profile.handle;
  const isOwnProfile = activeHandle === store.profile.handle;

  const profileView = useMemo<CreatorProfileView>(() => {
    if (isOwnProfile) {
      return {
        profile: store.profile,
        treks: ownProfileTreks.filter((trek) => trek.ownerHandle === activeHandle),
        reels: store.reels.filter((reel) => reel.ownerHandle === activeHandle),
        stories: store.stories.filter((story) => story.ownerHandle === activeHandle),
        drafts: store.drafts.filter((draft) => draft.ownerHandle === activeHandle),
        isOwnProfile: true,
      };
    }

    const creatorStore = creatorProfileStores[activeHandle];
    if (creatorStore) {
      return {
        profile: creatorStore.profile,
        treks: creatorStore.treks.filter((trek) => trek.ownerHandle === activeHandle),
        reels: creatorStore.reels.filter((reel) => reel.ownerHandle === activeHandle),
        stories: creatorStore.stories.filter((story) => story.ownerHandle === activeHandle),
        drafts: creatorStore.drafts.filter((draft) => draft.ownerHandle === activeHandle),
        isOwnProfile: false,
      };
    }

    return {
      profile: store.profile,
      treks: ownProfileTreks.filter((trek) => trek.ownerHandle === store.profile.handle),
      reels: store.reels.filter((reel) => reel.ownerHandle === store.profile.handle),
      stories: store.stories.filter((story) => story.ownerHandle === store.profile.handle),
      drafts: store.drafts.filter((draft) => draft.ownerHandle === store.profile.handle),
      isOwnProfile: true,
    };
  }, [activeHandle, isOwnProfile, ownProfileTreks, store]);

  useEffect(() => {
    if (featuredTrek && !profileView.treks.some((trek) => trek.id === featuredTrek.id)) {
      setFeaturedTrek(null);
    }
  }, [featuredTrek, profileView.treks]);

  const stats = {
    trips: profileView.treks.length,
    reels: profileView.reels.length,
    stories: profileView.stories.length,
    drafts: profileView.drafts.length,
  };

  const totalBudgetTracked = profileView.treks.reduce((sum, trek) => sum + trek.budgetValue, 0);
  const totalPlacesVisited = new Set(profileView.treks.map((trek) => trek.destination)).size;
  const favoriteDestination = profileView.treks[0]?.destination ?? "Pokhara, Nepal";
  const upcomingTrek =
    profileView.treks.find((trek) => trek.status === "Draft")?.title ??
    profileView.drafts.find((draft) => draft.kind === "trek")?.title ??
    "No trek draft";

  const highlightItems = [
    { label: "Favorite Destination", value: favoriteDestination },
    { label: "Total Budget Tracked", value: formatCurrency(totalBudgetTracked) },
    { label: "Total Places Visited", value: `${totalPlacesVisited} places` },
    { label: "Upcoming Trek", value: upcomingTrek },
    { label: "Draft Stories", value: `${profileView.drafts.filter((draft) => draft.kind === "story").length} open` },
    { label: "Saved Memories", value: `${profileView.stories.length + profileView.reels.length} posts` },
  ];

  const saveProfile = () => {
    setStore((current) => ({ ...current, profile: profileForm }));
    setIsEditingProfile(false);
  };

  const deleteLocalTrek = (id: string) => {
    setStore((current) => ({ ...current, treks: current.treks.filter((trek) => trek.id !== id) }));
    if (featuredTrek?.id === id) setFeaturedTrek(null);
  };

  const deleteUploadedTrek = (id: string) => {
    const nextTrips = uploadedTrips.filter((trip) => trip.id !== id);
    setUploadedTrips(nextTrips);
    window.localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(nextTrips));
    if (featuredTrek?.id === id) setFeaturedTrek(null);
  };

  const continueEditingTrip = (id: string) => {
    window.localStorage.setItem(TRIP_EDITOR_TARGET_KEY, id);
    onOpenStories();
  };

  const handleShare = async () => {
    const message = `${profileView.profile.name} ${profileView.profile.handle} | Travel journal`;
    try {
      await navigator.clipboard.writeText(message);
      setShareMessage("Profile copied");
    } catch {
      setShareMessage(message);
    }
  };

  const deleteDraft = (id: string) => {
    setStore((current) => ({ ...current, drafts: current.drafts.filter((draft) => draft.id !== id) }));
  };

  const continueEditingDraft = (draft: DraftItem) => {
    if (draft.kind === "reel") {
      onOpenReels();
      return;
    }

    onOpenStories();
  };

  const draftGroups = useMemo(
    () =>
      (["trek", "reel", "story"] as const).map((kind) => ({
        kind,
        label: draftLabels[kind],
        items: profileView.drafts.filter((draft) => draft.kind === kind),
      })),
    [profileView.drafts],
  );

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border shadow-none">
        <div className="h-44 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.32),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.20),_transparent_24%),linear-gradient(135deg,rgba(17,24,39,1),rgba(92,46,24,0.92),rgba(16,84,77,0.88))]" />
        <CardContent className="relative -mt-14 space-y-6 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar className="h-28 w-28 rounded-[2rem] border-4 border-background shadow-xl">
                <AvatarImage src={profileView.profile.avatarUrl} alt={profileView.profile.name} />
                <AvatarFallback className="bg-primary text-3xl font-bold text-primary-foreground">
                  {profileView.profile.name
                    .split(" ")
                    .map((item) => item[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{profileView.profile.name}</h2>
                  <Badge className="rounded-full bg-white/80 text-foreground backdrop-blur">
                    {profileView.isOwnProfile ? "Your Travel Profile" : "Travel Creator"}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{profileView.profile.handle}</p>
                <p className="max-w-2xl text-sm leading-relaxed text-foreground/80">{profileView.profile.bio}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profileView.profile.location}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileView.isOwnProfile ? (
                <Button variant="outline" className="rounded-2xl" onClick={() => setIsEditingProfile((value) => !value)}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : null}
              <Button variant="outline" className="rounded-2xl" onClick={handleShare}>
                <Copy className="mr-2 h-4 w-4" />
                Share Profile
              </Button>
              {profileView.isOwnProfile ? (
                <Button className="rounded-2xl" onClick={onOpenStories}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Story
                </Button>
              ) : null}
            </div>
          </div>

          {isEditingProfile && profileView.isOwnProfile ? (
            <div className="grid gap-4 rounded-[2rem] border border-border bg-secondary/40 p-5 md:grid-cols-2">
              <Input
                value={profileForm.name}
                onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Name"
                className="rounded-2xl"
              />
              <Input
                value={profileForm.handle}
                onChange={(event) => setProfileForm((current) => ({ ...current, handle: event.target.value }))}
                placeholder="@handle"
                className="rounded-2xl"
              />
              <Input
                value={profileForm.location}
                onChange={(event) => setProfileForm((current) => ({ ...current, location: event.target.value }))}
                placeholder="Location"
                className="rounded-2xl md:col-span-2"
              />
              <Textarea
                value={profileForm.bio}
                onChange={(event) => setProfileForm((current) => ({ ...current, bio: event.target.value }))}
                placeholder="Short bio"
                className="min-h-24 rounded-[1.5rem] md:col-span-2"
              />
              <div className="flex gap-2 md:col-span-2">
                <Button className="rounded-2xl" onClick={saveProfile}>Save Profile</Button>
                <Button
                  variant="ghost"
                  className="rounded-2xl"
                  onClick={() => {
                    setProfileForm(store.profile);
                    setIsEditingProfile(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Trips", value: stats.trips },
              { label: "Reels", value: stats.reels },
              { label: "Stories", value: stats.stories },
              { label: "Drafts", value: stats.drafts },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] border border-border bg-background/90 px-4 py-4 text-center shadow-sm">
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {shareMessage ? (
            <div className="rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground">{shareMessage}</div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {highlightItems.map((item) => (
          <div key={item.label} className="rounded-[1.75rem] border border-border bg-card px-5 py-4 shadow-sm transition-transform hover:-translate-y-0.5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="treks" className="space-y-6">
        <TabsList className="grid h-auto grid-cols-4 rounded-[1.5rem] bg-card p-1.5 shadow-sm">
          <TabsTrigger value="treks" className="rounded-[1rem] py-3"><Globe2 className="mr-2 h-4 w-4" />Treks</TabsTrigger>
          <TabsTrigger value="reels" className="rounded-[1rem] py-3"><Film className="mr-2 h-4 w-4" />Reels</TabsTrigger>
          <TabsTrigger value="stories" className="rounded-[1rem] py-3"><NotebookPen className="mr-2 h-4 w-4" />Stories</TabsTrigger>
          <TabsTrigger value="drafts" className="rounded-[1rem] py-3"><Sparkles className="mr-2 h-4 w-4" />Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="treks" className="space-y-6">
          {featuredTrek ? (
            <Card className="overflow-hidden border-border shadow-none">
              <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
                <img src={featuredTrek.coverImage} alt={featuredTrek.title} className="h-full min-h-64 w-full object-cover" />
                <CardContent className="space-y-4 p-6">
                  <Badge className="w-fit rounded-full">{featuredTrek.status}</Badge>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{featuredTrek.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{featuredTrek.destination}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">{featuredTrek.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <DetailPill label="Date" value={featuredTrek.date} />
                    <DetailPill label="Budget" value={featuredTrek.budgetLabel} />
                  </div>
                </CardContent>
              </div>
            </Card>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profileView.treks.map((trek) => {
              const isUploadedTrip = uploadedTrekPosts.some((item) => item.id === trek.id);

              return (
                <Card key={trek.id} className="overflow-hidden border-border shadow-none transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative">
                    <img src={trek.coverImage} alt={trek.title} className="h-52 w-full object-cover" />
                    <Badge className="absolute right-4 top-4 rounded-full bg-background/90 text-foreground">
                      {trek.status}
                    </Badge>
                  </div>
                  <CardContent className="space-y-3 p-5">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{trek.title}</h3>
                      <p className="text-sm text-muted-foreground">{trek.destination}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{trek.date}</span>
                      <span className="font-semibold text-foreground">{trek.budgetLabel}</span>
                    </div>
                    <p className="line-clamp-3 text-sm leading-relaxed text-foreground/75">{trek.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="rounded-2xl" onClick={() => setFeaturedTrek(trek)}>View</Button>
                      {profileView.isOwnProfile ? (
                        <>
                          <Button className="rounded-2xl" onClick={() => isUploadedTrip ? continueEditingTrip(trek.id) : onOpenStories()}>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            className="rounded-2xl text-muted-foreground hover:text-destructive"
                            onClick={() => (isUploadedTrip ? deleteUploadedTrek(trek.id) : deleteLocalTrek(trek.id))}
                          >
                            Delete
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="reels">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profileView.reels.map((reel) => (
              <Card key={reel.id} className="overflow-hidden border-border shadow-none transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="relative">
                  <img src={reel.thumbnail} alt={reel.title} className="h-64 w-full object-cover" />
                  <Badge className="absolute right-4 top-4 rounded-full bg-black/70 text-white">{reel.status}</Badge>
                </div>
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-foreground">{reel.title}</h3>
                    <Badge variant="secondary" className="rounded-full">{reel.duration}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{reel.engagement}</p>
                  {profileView.isOwnProfile ? (
                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-2xl" onClick={onOpenReels}>Edit</Button>
                      <Button
                        variant="ghost"
                        className="rounded-2xl text-muted-foreground hover:text-destructive"
                        onClick={() => setStore((current) => ({ ...current, reels: current.reels.filter((item) => item.id !== reel.id) }))}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stories">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profileView.stories.map((story) => (
              <Card key={story.id} className="overflow-hidden border-border shadow-none transition-all hover:-translate-y-1 hover:shadow-lg">
                <img src={story.coverImage} alt={story.title} className="h-56 w-full object-cover" />
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-foreground">{story.title}</h3>
                    <Badge className="rounded-full">{story.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{story.date}</p>
                  <p className="line-clamp-3 text-sm leading-relaxed text-foreground/75">{story.preview}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-6">
          {profileView.drafts.length === 0 ? (
            <Card className="border-dashed border-border shadow-none">
              <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <UserRound className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No drafts waiting right now</h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  {profileView.isOwnProfile
                    ? "Start a new trek story or save a reel idea and it will appear here for quick continuation."
                    : "This creator does not have any visible drafts right now."}
                </p>
              </CardContent>
            </Card>
          ) : (
            draftGroups.map((group) =>
              group.items.length > 0 ? (
                <div key={group.kind} className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{group.label}</h3>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((draft) => (
                      <Card key={draft.id} className="overflow-hidden border-border shadow-none">
                        <img src={draft.coverImage} alt={draft.title} className="h-48 w-full object-cover" />
                        <CardContent className="space-y-3 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-base font-semibold text-foreground">{draft.title}</h4>
                            <Badge variant="secondary" className="rounded-full">Draft</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{draft.updatedAt}</p>
                          <p className="text-sm leading-relaxed text-foreground/75">{draft.description}</p>
                          {profileView.isOwnProfile ? (
                            <div className="flex flex-wrap gap-2">
                              <Button className="rounded-2xl" onClick={() => continueEditingDraft(draft)}>
                                Continue Editing
                              </Button>
                              <Button
                                variant="ghost"
                                className="rounded-2xl text-muted-foreground hover:text-destructive"
                                onClick={() => deleteDraft(draft.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Draft
                              </Button>
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : null,
            )
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DetailPill = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-[1.25rem] bg-secondary/70 px-4 py-3">
    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
  </div>
);
