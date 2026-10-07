# ⚡ README Studio

> A modern, developer-focused web application for building, customizing, and publishing clean, professional GitHub `README.md` files through an interactive real-time workspace.

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 🌟 Overview

**README Studio** provides developers with a full-featured workspace to compose, format, customize, and publish production-ready GitHub README documents effortlessly. Designed with modern UI patterns, dark/light visual themes, interactive reordering, and direct GitHub OAuth integration.

---

## ✨ Features

- ⚛️ **Interactive Workspace & Live Preview**: Split-screen editor with real-time rendered GitHub-Flavored Markdown & raw source view.
- 🎨 **Light / Dark / System Themes**: Fully responsive UI supporting warm light mode, dark mode, and system preference detection.
- ↕️ **Section Reordering & Item Controls**: Reorder major README sections (Tech Stack, Features, Installation, Usage, etc.) and individual list items with accessible controls.
- 💾 **Draft Auto-Persistence**: Automatic local storage persistence with draft recovery and reset actions.
- 📋 **Pre-built README Templates**: Apply specialized templates with flexible merge or full-replacement modes.
- 🏷️ **Badge Builder**: Custom Shields.io badge creation, tech stack tags, and auto-mapped license badges.
- 🐙 **GitHub Integration**:
  - **Public Repository Import**: Auto-detect repository metadata, tech stack, and license from any public GitHub URL without logging in.
  - **Secure GitHub OAuth**: Authenticate via a lightweight, secure Node.js backend server (`/api/auth`).
  - **Repository Picker**: Browse, search, filter, and select public or private repositories.
  - **Save & Update on GitHub**: Directly commit generated `README.md` to GitHub with conflict/overwrite confirmation.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Lucide Icons
- **Backend API**: Node.js, Express, Cookie-Session (OAuth & GitHub API Proxy)
- **Deployment**: Compatible with Render, Vercel, Netlify, Node.js hosts

---

## 💻 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+) installed on your machine.

### Installation

```bash
# Clone the repository
git clone https://github.com/gemachistesfaye/readme-studio.git

# Navigate into the project folder
cd readme-studio

# Install dependencies
npm install
```

### Development Server

Start the local development frontend server:

```bash
npm run dev
```

### GitHub OAuth Server (Optional for Authenticated Save)

To enable GitHub account login and direct saving to repositories:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Create a [GitHub OAuth Application](https://github.com/settings/developers) with callback URL:
   `http://127.0.0.1:8787/api/auth/github/callback`
3. Fill in your `.env` variables:
   ```env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   SESSION_SECRET=your_random_session_secret
   ```
4. Start the GitHub API proxy server alongside Vite:
   ```bash
   # Terminal 1: Vite Frontend
   npm run dev

   # Terminal 2: GitHub API Proxy
   npm run github-api
   ```

*Note: Public URL import, templates, section reordering, draft saving, and Markdown copy/download work 100% offline without GitHub OAuth configuration.*

### Production Build & Quality Checks

```bash
# Run ESLint linter
npm run lint

# Run TypeScript type check
node node_modules/typescript/bin/tsc --noEmit

# Build production bundle
npm run build

# Run automated tests
npm test
```

---

## 📂 Project Structure

```text
readme-studio/
├── server/               # Node.js GitHub OAuth & API Proxy server
│   ├── githubServer.mjs
│   └── githubServer.test.mjs
├── src/
│   ├── components/       # UI Components
│   │   ├── common/       # Form fields, inputs
│   │   ├── github/       # Repository picker, import/save modals
│   │   ├── layout/       # Header, Footer, Layout, Theme switcher
│   │   └── workspace/    # Editor sections, preview, section order modal
│   ├── constants/        # Templates, badges, tech stack, section meta
│   ├── hooks/            # Custom hooks (useReadmeData, useTheme, useGitHubAuth)
│   ├── pages/            # View pages (Home)
│   ├── services/         # GitHub API client services
│   ├── types/            # TypeScript interfaces & types
│   ├── utils/            # Markdown generator, draft storage, section order helpers
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── package.json
└── vite.config.ts
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
