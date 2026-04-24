# CyberSim -- Recommended Tech Stack (2026)

------------------------------------------------------------------------

## 1. Frontend

-   Next.js (App Router + Server Components)
-   Tailwind CSS
-   Framer Motion
-   Three.js (optional)

**Justification:** Hybrid rendering, strong ecosystem, perfect for
interactive simulations and modern UI.

------------------------------------------------------------------------

## 2. Backend

-   Node.js
-   tRPC (or REST API)

**Justification:** Type-safe APIs, same language as frontend, ideal for
real-time simulation logic.

------------------------------------------------------------------------

## 3. Authentication

-   Auth.js (NextAuth)

**Justification:** Secure, easy integration with Next.js, supports OAuth
and session management.

------------------------------------------------------------------------

## 4. Database

-   PostgreSQL
-   Prisma ORM

**Justification:** Structured relational data, scalable, type-safe
queries with Prisma.

------------------------------------------------------------------------

## 5. Real-Time Communication

-   WebSockets (Socket.io or native)

**Justification:** Required for live attack simulations and real-time
feedback.

------------------------------------------------------------------------

## 6. Deployment

-   Vercel (Frontend + Backend)
-   Neon (Serverless PostgreSQL)

**Justification:** Optimized for Next.js, scalable, easy deployment.

------------------------------------------------------------------------

## 7. Security

-   DOMPurify (XSS protection)
-   Zod (validation)

**Justification:** Essential for safe simulation and input handling.

------------------------------------------------------------------------

## 8. State Management

-   Zustand

**Justification:** Lightweight and efficient for simulation state
handling.

------------------------------------------------------------------------

## 9. Analytics (Optional)

-   PostHog or Plausible

**Justification:** Track engagement and improve learning experience.

------------------------------------------------------------------------

## Final Stack Summary

  Layer        Technology
  ------------ ------------------------------------
  Frontend     Next.js + Tailwind + Framer Motion
  Backend      Node.js + tRPC
  Auth         Auth.js
  Database     PostgreSQL + Prisma
  Real-time    WebSockets
  Deployment   Vercel + Neon
  State        Zustand

------------------------------------------------------------------------

## Conclusion

This stack is optimized for building an interactive, real-time
cybersecurity simulation platform with scalability, performance, and
developer efficiency in mind.
