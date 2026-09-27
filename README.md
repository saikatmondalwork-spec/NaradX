# NaradX - AI-Powered Civic Intelligence Platform

NaradX is an intelligent civic issue reporting and urban anomaly detection platform. It empowers citizens to report civic grievances (potholes, garbage dumps, waterlogging, street lighting, etc.) with automatic geolocation, image uploads, and multi-language support, while providing municipal authorities with real-time hotspot detection, severity scoring, and AI-driven intelligence dashboards.

## Features

- **Citizen Issue Reporting**:
  - Browser Geolocation with high-accuracy reverse geocoding
  - Drag-and-drop photo upload with instant image preview & removal
  - Auto-draft saving via `localStorage` so reports are never lost
  - Multi-language input support
  - Immediate submission feedback with animated confirmation screen & reference tracking code

- **Municipal Intelligence Dashboard**:
  - Interactive Hotspots Map powered by Leaflet
  - Dynamic KPI cards and real-time civic statistics backed by Zustand state management
  - Area Intelligence Explorer with anomaly detection & sentiment analysis
  - Citizen Reports Explorer with search, filtering, and CSV export
  - AI Root Cause Analysis and proactive civic intervention recommendations

## Tech Stack

- **Frontend Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS + Custom Design System
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/saikatmondalwork-spec/NaradX.git
cd NaradX

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Deploying to Vercel

1. Push this repository to GitHub (`saikatmondalwork-spec/NaradX`).
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
3. Import the `NaradX` repository.
4. Keep the default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `vite build` or `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. SPA rewrites are already configured in `vercel.json`!
