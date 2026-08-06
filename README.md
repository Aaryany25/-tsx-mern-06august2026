# TechStax - Star Wars Galaxy Explorer

A modern, high-performance Star Wars character exploration application built with React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, and Axios.

---

## Features

- **Live SWAPI API Integration**: Fetches Star Wars characters (`/api/people`) and species data (`/api/species`) using Axios.
- **Custom Interactive Pagination**:
  - Flexible cards-per-page selection (`6`, `10`, `12`, `20`).
  - Page navigation controls (`First`, `Prev`, active page numbers with smart ellipsis `...`, `Next`, `Last`).
  - Page item range indicator and total count summary.
  - Smooth page scroll to top on pagination changes.
- **Species-Based Card Palette & Neo-Grotesque Design**:
  - Cards dynamically colored based on species (`Human`, `Droid`, `Wookiee`, `Rodian`, `Zabrak`, etc.).
  - Picsum character avatar integration with high-contrast neo-brutalist borders.
  - 60fps hover micro-animations and interactive arrow indicators.
- **Real-time Search & Filter**: Instant filtering by character name, species, gender, or birth year.
- **Character Details Modal**:
  - **Header**: Character Name.
  - **Height**: Converted and displayed in meters (e.g. `1.72 m`).
  - **Mass**: Displayed in kg (e.g. `77 kg`).
  - **Date Added**: Formatted as `dd-MM-yyyy` using `date-fns`.
  - **Films Count**: Total Star Wars film appearances.
  - **Birth Year**: Galactic birth era.
  - **Homeworld Information**: Live Axios fetch from planet API displaying Terrain, Climate, and Amount of Residents.
- **Framer Motion Shared Layout & Page Transitions**:
  - Liquid-smooth shared element layout morphing (`layoutId`) when expanding cards into modals.
  - Keyed page exit and entry animations between pagination pages.
- **Mock JWT Authentication & Silent Refresh**:
  - Interactive Login & Logout modal with pre-filled demo credentials (`JediMaster` / `force123`).
  - Automatic background silent token refresh before expiry without logging out the user.
  - Live JWT expiration countdown pill & silent refresh notification banner.
- **Error Handling & Loading States**: Animated loader spinners during data fetching and dedicated fallback screen with a Retry Request button.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Date Utility**: date-fns
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project root:
   ```bash
   cd texhStax
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## Production Build & Verification

To test and build the production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Demo Authentication Credentials

Click Log In (Demo JWT) in the top navigation bar or use:

- **Username**: `JediMaster`
- **Password**: `force123`

When logged in, the app automatically triggers a silent refresh 8 seconds prior to JWT access token expiration.
