# 🧬 Matthew's Protein Lab

An interactive 3D protein visualization tool built with Next.js, React, and TypeScript. Explore molecular structures from the RCSB Protein Data Bank, compare proteins side-by-side, and chat with an AI biochemistry assistant.

## Features

- **Explore** — Search any protein by PDB ID and visualize it in interactive 3D with multiple rendering modes (cartoon, stick, sphere, surface, line)
- **Compare** — Load two proteins side-by-side with a structural comparison table
- **AI Chat** — Ask questions about proteins and biochemistry, powered by Claude
- **Featured Proteins** — Curated collection including Insulin, Hemoglobin, CRISPR-Cas9, COVID Spike Protein, GFP, and more

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [3Dmol.js](https://3dmol.csb.pitt.edu/)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [RCSB PDB API](https://data.rcsb.org/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm / bun)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd protein-explorer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. **(Optional)** Add your Anthropic API key to `.env.local` to enable the AI chat feature:

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

   Get an API key at [console.anthropic.com](https://console.anthropic.com/).

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Create production build  |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/chat/           # AI chat API route
│   ├── chat/               # Chat page
│   ├── compare/            # Compare page
│   ├── explore/            # Explore page
│   └── page.tsx            # Landing page
├── components/
│   ├── chat/               # Chat UI components
│   ├── compare/            # Comparison UI components
│   ├── explore/            # Explorer UI components
│   ├── landing/            # Landing page components
│   ├── shared/             # Navigation, Footer, PageTransition
│   └── ui/                 # shadcn/ui primitives
├── hooks/                  # Custom React hooks
├── lib/
│   ├── api/                # RCSB PDB API client
│   └── constants/          # Featured proteins, comparison presets
└── types/                  # TypeScript type definitions
```

## Notes

- The AI chat feature requires an Anthropic API key. The rest of the app works without it.
- Protein data is fetched directly from the RCSB PDB public API — no backend database needed.
- Built with 🧬 for Matthew by William.
