# ⚡ README Studio

> An interactive, developer-centric studio for crafting, analyzing, customizing, and publishing professional GitHub `README.md` files in real-time.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://readme-studio-2026.vercel.app)
[![API Server](https://img.shields.io/badge/API%20Server-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://readme-studio-uztc.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

**README Studio** provides developers with a full-fledged environment to create polished README documentation effortlessly. Featuring live GitHub-flavored Markdown previews, 6 pre-built project templates, live GitHub stats & streak widgets, automatic Table of Contents generation, a 0–100% README Quality Audit score, `.json` project state backups, and direct GitHub OAuth integration to commit straight to repositories.

---

## ✨ Key Features

- ⚛️ **Split-Screen Editor & Live Preview**: Real-time side-by-side editing with GitHub-Flavored Markdown rendering and raw Markdown source toggles.
- 📊 **Live GitHub Stats & Cards**: Embed live GitHub contribution stats, top languages breakdown, and streak counters (`github-readme-stats` and `streak-stats`) with 11 themes (`radical`, `tokyonight`, `github_dark`, `dracula`, etc.) and live preview cards.
- 📋 **Automated Table of Contents (TOC)**: Toggle automatic generation of Markdown anchor links for all active sections.
- 🎯 **README Quality Audit Score**: Real-time 0–100% completeness rating with actionable per-field tips to achieve the highest quality documentation.
- 💾 **Project Backup Export & Import**: Download your entire README state as a `.json` backup and restore anytime with safe preview confirmation.
- ↕️ **Customizable Section Ordering**: Freely reorder all 8 major sections (Tech Stack, Features, Installation, Usage, Contributing, License, Contact, GitHub Stats) with accessible up/down controls and order reset.
- 🏷️ **Dynamic Badge Builder**: Shields.io custom status badges, technology badges, and auto-synchronized license badges.
- 🎨 **Light / Dark / System Themes**: Warm, high-contrast light mode (default) and dark mode with fluid transitions.
- 🐙 **GitHub OAuth & Repository Integration**:
  - **Public Repository Ingestion**: Analyze any public GitHub repo URL to auto-detect metadata, languages, dependencies, and license without logging in.
  - **Authenticated Repository Picker**: Browse and search public and private repositories.
  - **Save & Update on GitHub**: Directly commit your generated `README.md` to GitHub branches with SHA conflict protection.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Lucide React
- **Backend API**: Node.js, Native HTTP Server, PKCE GitHub OAuth, REST APIs
- **Hosting**:
  - **Frontend**: [Vercel](https://readme-studio-2026.vercel.app)
  - **Backend API**: [Render](https://readme-studio-uztc.onrender.com)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/gemachistesfaye/readme-studio.git

# 2. Navigate into directory
cd readme-studio

# 3. Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔐 GitHub OAuth Setup (Optional)

To enable GitHub login, authenticated repo browsing, and direct saving:

1. Create a **[GitHub OAuth Application](https://github.com/settings/applications/new)**:
   - **Homepage URL**: `http://127.0.0.1:5173` (or your Vercel URL in production)
   - **Authorization callback URL**: `http://127.0.0.1:8787/api/auth/github/callback` (or your Render URL in production)
2. Copy `.env.example` to `.env` and fill in your credentials:
   ```env
   VITE_GITHUB_API_BASE_URL=http://127.0.0.1:8787
   APP_ORIGIN=http://127.0.0.1:5173
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   GITHUB_CALLBACK_URL=http://127.0.0.1:8787/api/auth/github/callback
   PORT=8787
   HOST=0.0.0.0
   ```
3. Run both servers:
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: GitHub API Proxy
   npm run github-api
   ```

---

## 🧪 Quality & Test Scripts

```bash
# Type-check TypeScript without emitting
node node_modules/typescript/bin/tsc --noEmit

# Run ESLint
npm run lint

# Build production bundle
npm run build

# Run automated backend API tests
npm test
```

---

## 📂 Project Architecture

```text
readme-studio/
├── server/
│   ├── githubServer.mjs       # Zero-dependency secure GitHub OAuth & proxy API
│   └── githubServer.test.mjs  # Node.js native test suite
├── src/
│   ├── components/
│   │   ├── common/            # Shared UI elements
│   │   ├── github/            # OAuth modals, repo pickers, save modals
│   │   ├── layout/            # Navigation header, footer, theme toggle
│   │   └── workspace/         # Section forms, GitHub stats, audit & backup panels
│   ├── constants/             # Section metadata, templates, tech categories
│   ├── hooks/                 # Custom React hooks (useReadmeData, useGitHubAuth, useTheme)
│   ├── pages/                 # Root views
│   ├── services/              # Client API integrations
│   ├── types/                 # TypeScript interfaces & types
│   └── utils/                 # Markdown engine, draft storage, validation
├── vercel.json                # SPA rewrite routing for Vercel
├── package.json
└── vite.config.ts
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
