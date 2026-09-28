# ⚡ README Studio

> A modern, developer-focused web application for building clean, professional GitHub `README.md` files through an interactive interface.

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 🌟 Overview

**README Studio** helps developers compose, format and export production-ready GitHub README documents effortlessly. Designed with modern UI patterns, dark-mode visual aesthetics and strict TypeScript architecture.

---

## 🚀 Phase 1 Foundation Features

- ⚛️ **React 19 & TypeScript 5.7**: Fast, modern frontend architecture with strict typing.
- ⚡ **Vite 6**: Ultra-fast hot module reloading (HMR) and production bundling.
- 🎨 **Tailwind CSS v4**: Minimalist developer-focused visual design and responsive layouts.
- 🧱 **Clean Architecture**: Scalable modular folder structure (`components`, `pages`, `hooks`, `utils`, `types`, `constants`).
- 🔍 **Strict Code Quality**: Zero ESLint warnings and zero TypeScript build errors.

---

## 🛠️ Tech Stack

- **Framework**: React 19
- **Language**: TypeScript 5.7
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Linter**: ESLint 9

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

Start the local development server with hot module reloading:

```bash
npm run dev
```

### GitHub Integration

Phase 15 includes an optional server-side GitHub OAuth integration. The browser never receives the OAuth client secret or GitHub access token. The API keeps the token in server memory and uses an HttpOnly session cookie.

Copy `.env.example` to `.env` and register a GitHub OAuth App with this callback URL during local development:

```text
http://127.0.0.1:8787/api/auth/github/callback
```

Set the placeholder values for `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, then run the frontend and API in separate terminals:

```bash
npm run dev
npm run github-api
```

The OAuth flow requests `read:user repo` because this phase supports reading authorized private repositories and creating or updating `README.md`. GitHub's authorization-code flow validates `state` and PKCE, and the Contents API requires the current file SHA before an update. Configure HTTPS in deployment so the session cookie is Secure, set `APP_ORIGIN` and `GITHUB_CALLBACK_URL` to the deployed origins, and keep `.env` out of version control.

Without OAuth configuration, public URL import continues to work and authenticated actions show an actionable connection/configuration error.

### Production Build & Quality Checks

```bash
# Run ESLint linter
npm run lint

# Run TypeScript type check
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 📂 Project Structure

```text
src/
├── components/       # Layout and reusable UI components
│   ├── layout/       # Header, Footer, Layout wrapper
│   └── workspace/    # Workspace placeholder panels
├── pages/            # View pages (Home)
├── hooks/            # Custom React hooks (useWorkspace)
├── utils/            # Helper functions (cn tailwind merge)
├── types/            # TypeScript interfaces & types
├── constants/        # Application constants & configuration
├── App.tsx           # Main application root
├── index.css         # Tailwind base styles
└── main.tsx          # React entry point
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
