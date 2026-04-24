# CyberSim - Project Implementation To-Do List

This document breaks down the development of the CyberSim project into atomic, sequentially ordered tasks with no overlapping dependencies. Each task must be completed before moving to the next to ensure a smooth progression.

## Phase 1: Foundation & Project Setup
- [+] **Task 1.1:** Initialize Next.js project (App Router) with Tailwind CSS, TypeScript, and ESLint.
- [+] **Task 1.2:** Configure basic project structure (folders for components, lib, hooks, server, styles).
- [+] **Task 1.3:** Setup Prisma ORM and initialize connection to PostgreSQL (Neon).
- [+] **Task 1.4:** Define base Prisma schema (User, Session, Module, Progress, Badge models) and run initial migration.
- [+] **Task 1.5:** Configure NextAuth.js (Auth.js) with standard Credentials provider and hook it up to the Prisma adapter.
- [+] **Task 1.6:** Setup tRPC for type-safe API communication between Next.js client and server.
- [+] **Task 1.7:** Setup Zustand for global state management (to handle current simulation states).
- [+] **Task 1.8:** Initialize Socket.io (or native WebSockets) on a custom Node.js backend server route for real-time features.

## Phase 2: Design System & Core Components
*Based on the CyberSim Design System (Dark, futuristic, neon accents).*
- [+] **Task 2.1:** Configure Tailwind theme in `tailwind.config.ts` (Colors: #050505 bg, #00F0FF & #7A5FFF accents).
- [+] **Task 2.2:** Setup global fonts in `layout.tsx` (Orbitron/Space Grotesk for headings, Monospace for code).
- [+] **Task 2.3:** Create base layout wrapper with a persistent immersive navigation bar.
- [+] **Task 2.4:** Build generic `Card` component (dark background, soft shadow).
- [+] **Task 2.5:** Build generic glowing `Button` component (transparent, neon border, hover effects using Framer Motion).
- [+] **Task 2.6:** Build `TerminalInput` component (monospace, command-line feel).
- [+] **Task 2.7:** Build `LivePanel` component (grid lines, scrolling text for terminal-style logs).

## Phase 3: Core Application Pages
- [+] **Task 3.1:** Build Landing Page - Hero Section (fullscreen, immersive title, call to action).
- [+] **Task 3.2:** Build Landing Page - Features Section (scroll-triggered animations with Framer Motion).
- [+] **Task 3.3:** Build User Registration/Sign-up Page UI.
- [+] **Task 3.4:** Build User Login Page UI.
- [+] **Task 3.5:** Connect Registration/Login UI to NextAuth.js endpoints.
- [+] **Task 3.6:** Build Dashboard Layout (Sidebar navigation, main content area).
- [+] **Task 3.7:** Implement Dashboard Overview (XP, Current Level, Recent Activity UI).
- [+] **Task 3.8:** Implement Module Selection Grid on the Dashboard (Cards for Phishing, XSS, etc.).

## Phase 4: Module 1 - Phishing Simulation
- [+] **Task 4.1:** Build Phishing Simulation UI (mock email client layout).
- [+] **Task 4.2:** Create mock email payload data (mix of legitimate and malicious emails).
- [+] **Task 4.3:** Implement interaction logic (user inspects links, headers, and flags email as safe/phishing).
- [+] **Task 4.4:** Implement real-time feedback popup for correct/incorrect classification.
- [+] **Task 4.5:** Wire up completion state to Zustand and tRPC to update user progress in DB.

## Phase 5: Module 2 - Brute Force Simulation
- [+] **Task 5.1:** Build Brute Force UI (mock target login form and attacker terminal side-by-side).
- [+] **Task 5.2:** Implement attack configuration logic (user selects wordlist size, threads).
- [+] **Task 5.3:** Connect UI to WebSocket server to stream real-time password cracking logs.
- [+] **Task 5.4:** Implement success state and defense tutorial (explaining rate limiting & strong passwords).
- [+] **Task 5.5:** Save module completion progress to DB via tRPC.

## Phase 6: Module 3 - XSS Simulation
- [+] **Task 6.1:** Build XSS UI (split screen: code editor on left, vulnerable comment board on right).
- [+] **Task 6.2:** Implement vulnerable DOM rendering logic (intentionally bypassing DOMPurify initially).
- [+] **Task 6.3:** Write logic to detect successful script execution (e.g., catching `alert(1)`).
- [+] **Task 6.4:** Implement defense patching step (user modifies code to apply DOMPurify).
- [+] **Task 6.5:** Save module completion progress to DB via tRPC.

## Phase 7: Module 4 - Social Engineering Simulation
- [+] **Task 7.1:** Build Chat Interface UI for Social Engineering.
- [+] **Task 7.2:** Implement dialogue tree logic (bot messages vs user choices).
- [+] **Task 7.3:** Add logic to calculate "suspicion level" based on user responses.
- [+] **Task 7.4:** Implement feedback screen breaking down manipulative tactics used in the chat.
- [+] **Task 7.5:** Save module completion progress to DB via tRPC.

## Phase 8: Gamification & Progression Mechanics
- [+] **Task 8.1:** Create XP calculation utility function based on module performance.
- [+] **Task 8.2:** Implement Badge Unlocking logic on the backend (e.g., "First Hack", "Eagle Eye").
- [+] **Task 8.3:** Update Dashboard UI to dynamically fetch and display unlocked badges.
- [+] **Task 8.4:** Add level-up celebration animations using Framer Motion. (Skipped)

## Phase 9: Polish & Final Integrations
- [+] **Task 9.1:** Audit all pages for responsive design (Mobile, Tablet, Desktop).
- [+] **Task 9.2:** Implement global error handling and loading skeletons for tRPC queries.
- [ ] **Task 9.3:** Test end-to-end user flow (Signup -> Dashboard -> Module -> Level Up).
- [+] **Task 9.4:** Prepare deployment configuration (environment variables, build scripts).
- [ ] **Task 9.5:** Deploy database to Neon and application to Vercel.
