<div align="center">
  <img src="./src/app/icon.png" alt="CyberSim Logo" width="120" height="120" style="border-radius: 20%; margin-bottom: 20px;" />
  
  # CYBERSIM
  
  **Interactive Cybersecurity Training Platform**

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://trpc.io/"><img src="https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white" alt="tRPC" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" /></a>
  </p>
</div>

<br/>

**CyberSim** is an immersive, gamified cybersecurity training platform built with modern web technologies. Designed with a sleek, interactive terminal aesthetic, it provides hands-on modules where users can learn about real-world vulnerabilities, execute simulated attacks, and implement structural defenses.

---

## ⚡ Features

- **Immersive Cyber Aesthetic**: Built from the ground up with custom neon glows, terminal styling, and fluid Framer Motion animations.
- **Dynamic Simulation Grid**: Complete modules sequentially to earn XP, level up your Security Clearance, and unlock badges.
- **Real-time WebSockets**: Experience live attack sequences (like the Hydra dictionary attack) streaming directly from a custom Node.js/Socket.io backend.
- **Authentication**: Secure, encrypted credential management and session persistence powered by NextAuth.js (Auth.js v5 beta).
- **Classified Personnel Dossiers**: Track your operative statistics, full name, DOB, and service status securely over the tRPC network.
- **Interactive Modules**:
  - 🎣 **Phishing**: Analyze headers and identify social engineering vectors.
  - 🔑 **Brute Force (Auth Bypass)**: Execute dictionary attacks and learn about rate limiting.
  - 💻 **XSS Injection**: Exploit vulnerable DOM architectures and patch them with `DOMPurify`.
  - 🗣️ **Social Engineering**: Manipulate simulated threat actors in a dialogue tree.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **API & State**: [tRPC](https://trpc.io/) + [React Query](https://tanstack.com/query/latest)
- **Database**: [PostgreSQL (Neon)](https://neon.tech/) managed by [Prisma ORM](https://www.prisma.io/)
- **Real-time Engine**: [Socket.io](https://socket.io/) via Custom Server
- **Authentication**: [Auth.js v5 (NextAuth)](https://authjs.dev/)

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and npm installed. You will also need a PostgreSQL connection URL (we recommend [Neon](https://neon.tech/)).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RosemaryReji/CyberSim.git
   cd CyberSim
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   # PostgreSQL connection string
   DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
   
   # Generate a secure secret using: openssl rand -base64 32
   AUTH_SECRET="your-random-secret"
   ```

4. **Initialize the Database**
   Push the Prisma schema to your remote database to generate the tables:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   > Note: CyberSim uses a custom server configuration (`server.ts`) to attach Socket.io to the Next.js process. The `npm run dev` script uses `tsx` to boot this hybrid server.

6. **Initialize Link**
   Open [http://localhost:3000](http://localhost:3000) with your browser to access the mainframe.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/RosemaryReji/CyberSim/issues).

## 📝 License

This project is open-source and available under the MIT License.
