export interface TravelProfile {
  name: string;
  handle: string;
  bio: string;
  location: string;
  avatarUrl?: string;
}

export interface TrekPost {
  id: string;
  ownerHandle: string;
  title: string;
  destination: string;
  date: string;
  budgetLabel: string;
  budgetValue: number;
  description: string;
  status: "Published" | "Draft";
  coverImage: string;
}

export interface ReelPost {
  id: string;
  ownerHandle: string;
  title: string;
  duration: string;
  engagement: string;
  status: "Published" | "Draft";
  thumbnail: string;
}

export interface StoryPost {
  id: string;
  ownerHandle: string;
  title: string;
  date: string;
  preview: string;
  status: "Published" | "Draft";
  coverImage: string;
}

export interface DraftItem {
  id: string;
  ownerHandle: string;
  title: string;
  kind: "trek" | "reel" | "story";
  updatedAt: string;
  description: string;
  coverImage: string;
}

export interface MyTrekStore {
  profile: TravelProfile;
  treks: TrekPost[];
  reels: ReelPost[];
  stories: StoryPost[];
  drafts: DraftItem[];
}

export interface CreatorProfileView {
  profile: TravelProfile;
  treks: TrekPost[];
  reels: ReelPost[];
  stories: StoryPost[];
  drafts: DraftItem[];
  isOwnProfile: boolean;
}
