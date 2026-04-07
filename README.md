# TrueNepal — Smart Trekking Companion for Nepal 🏔️

A mobile-friendly web application that helps trekkers travel safely and efficiently across Nepal with real-time-like static intelligence, smart planning, and collaboration between all stakeholders.

---

## 🧩 Problem Statement

Trekking in Nepal is beautiful but chaotic:

- No centralized info for routes, hotels, and safety
- Hard to manage bookings, guides, and porters
- Emergency situations lack quick access to help
- Tourists rely on scattered, unreliable sources

**TrueNepal** solves this by providing a single smart platform that connects **Tourists**, **Travel Agencies**, **Guides & Porters**, **Hotels**, and **Local Services**.

---

## 🎯 Core Features

### 1. Trek Route Explorer
- Predefined trekking routes: **Everest Base Camp**, **Annapurna Circuit**, **Langtang Valley**
- Each route shows: major stops, difficulty level, altitude, estimated duration, and weather (mock/static)

### 2. Reels / Discovery Feed
- TikTok/Instagram-style vertical reel cards with real trekking photography
- Side action bar (heart, share, comment, plan)
- Creator profiles with ratings, reviews, and social links

### 3. Stay & Nearby Info
- Hotels and lodges at each stop
- Nearby places: viewpoints, cafes, clinics
- Mock booking system

### 4. Safety & Emergency
- Emergency contact numbers: Police, Tourist Police, Helicopter Rescue, Red Cross
- "What to do if…" interactive guides:
  - Lost on the trail?
  - Altitude sickness?
  - Bad weather / storm?
  - Injury on the trail?

### 5. Trek Package System
- Travel agencies offer packages: **Budget / Standard / Premium**
- Includes: Guide, Porter, Stay, Route plan
- Smart planner with day-by-day itinerary

### 6. Crew System
- Assign a guide and porter from verified profiles
- View contact info, experience, ratings, and pricing

### 7. Nearby Ticketing
- Entry permits: TIMS Card, National Park permits
- Special permits: Upper Mustang Restricted Area
- Mock booking with status tracking

### 8. Personal Trek Dashboard
- Saved itinerary overview
- Assigned crew contacts
- Booked permits summary
- Emergency info (offline-style access)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite 5** | Build tool & dev server |
| **Tailwind CSS v3** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **shadcn/ui** | UI component library |
| **Lucide React** | Icon system |
| **React Router** | Client-side routing |

---

## 📁 Project Structure

```
src/
├── assets/
│   └── reels/              # Trek photography for reel backgrounds
├── components/
│   ├── trekking/
│   │   ├── ReelCard.tsx     # TikTok-style reel card component
│   │   ├── ProfileSection.tsx
│   │   ├── RoutesSection.tsx
│   │   ├── SafetySection.tsx
│   │   ├── CrewSection.tsx
│   │   ├── TicketsSection.tsx
│   │   ├── DashboardSection.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── data.ts          # All mock data & constants
│   │   └── types.ts         # TypeScript interfaces
│   └── ui/                  # shadcn/ui components
├── pages/
│   └── Index.tsx            # Main app page & state orchestrator
├── hooks/                   # Custom React hooks
└── lib/                     # Utility functions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

---

## 🤖 AI Usage

This project leverages AI tools for:

- **UI/UX Design**: Layout ideas, component structure, and aesthetic direction
- **Data Generation**: Mock trek routes, hotel listings, emergency guides, crew profiles
- **Image Generation**: Trekking landscape photography for reel backgrounds
- **Code Architecture**: Modular component design and TypeScript interfaces

All AI-generated code and content has been reviewed, understood, and customized for the project requirements.

---

## 📱 Mobile-First Design

- Responsive layout optimized for phone screens
- Bottom navigation bar for mobile users
- Grouped tab navigation (Discover → Plan → Services → My Trek)
- Snap-scroll vertical reels
- Touch-friendly action buttons

---

## 🗺️ Routes Covered

| Route | Region | Difficulty | Duration | Max Altitude |
|---|---|---|---|---|
| Everest Base Camp | Solukhumbu | Hard | 14 days | 5,364m |
| Annapurna Circuit | Annapurna | Moderate | 12–16 days | 5,416m |
| Langtang Valley | Langtang | Moderate | 7–10 days | 3,870m |

---

## 📄 License

This project is built for educational and demonstration purposes.

---

**Built with ❤️ for Nepal's trekking community**
