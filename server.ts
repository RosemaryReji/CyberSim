import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// In-memory rate limiting stores
const loginRateLimit = new Map<string, { count: number, resetTime: number }>();
const socketRateLimit = new Map<string, number>();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    // Basic rate limit for login API to prevent brute force
    if (req.url?.includes('/api/auth/callback/credentials') && req.method === 'POST') {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const ipStr = Array.isArray(ip) ? ip[0] : ip;
      const now = Date.now();
      const limitWindow = 60 * 1000; // 1 minute
      const maxAttempts = 5;

      const record = loginRateLimit.get(ipStr);
      if (record && now < record.resetTime) {
        if (record.count >= maxAttempts) {
          res.statusCode = 429;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Too many login attempts. Please try again later.' }));
          return;
        }
        record.count++;
      } else {
        loginRateLimit.set(ipStr, { count: 1, resetTime: now + limitWindow });
      }
    }

    return handler(req, res);
  });

  // Initialize Socket.io with restricted CORS
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || `http://${hostname}:${port}`,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Connection validation middleware
  io.use((socket, next) => {
    // Basic validation: Check if origin is present and matches
    const origin = socket.handshake.headers.origin;
    const expectedOrigin = process.env.NEXTAUTH_URL || `http://${hostname}:${port}`;
    if (origin && !origin.startsWith(expectedOrigin)) {
      return next(new Error("Unauthorized: Invalid Origin"));
    }
    next();
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Rate limit helper for socket events
    const checkRateLimit = (socketId: string) => {
      const now = Date.now();
      const lastAttempt = socketRateLimit.get(socketId) || 0;
      if (now - lastAttempt < 1000) { // Max 1 event per second
        socket.emit("bruteforce-log", `[SYSTEM] Rate limit exceeded. Please wait.`);
        return false;
      }
      socketRateLimit.set(socketId, now);
      return true;
    };

    // Listen for simulation events
    socket.on("join-simulation", (moduleId) => {
      if (!checkRateLimit(socket.id)) return;
      socket.join(`module-${moduleId}`);
      console.log(`Socket ${socket.id} joined simulation for module ${moduleId}`);
    });

    socket.on("start-bruteforce", (config: { wordlist: string, threads: number, targetUsername: string }) => {
      if (!checkRateLimit(socket.id)) return;
      console.log(`Starting bruteforce for ${socket.id} with config:`, config);
      
      let attemptCount = 0;
      const targetAttempt = config.wordlist === "common" ? 35 : 80; 
      const maxAttempts = targetAttempt + 5;
      
      // Speed scales with threads: 1 thread = 200ms, 64 threads = ~20ms
      const intervalMs = Math.max(20, 200 - (config.threads * 2.8)); 
      
      const passwords = ["123456", "password", "admin123", "qwerty", "iloveyou", "princess", "rockyou", "letmein", "P@ssw0rd", "nexus2026"];
      const correctPassword = "nexus2026"; 

      const interval = setInterval(() => {
        attemptCount++;
        
        if (attemptCount === targetAttempt) {
          clearInterval(interval);
          socket.emit("bruteforce-log", `[SUCCESS] password found: ${correctPassword}`);
          socket.emit("bruteforce-end", { success: true, password: correctPassword });
        } else if (attemptCount >= maxAttempts) {
          clearInterval(interval);
          socket.emit("bruteforce-log", `[ERROR] Maximum attempts reached. Attack failed.`);
          socket.emit("bruteforce-end", { success: false });
        } else {
          // Fake log
          const randomPass = passwords[Math.floor(Math.random() * passwords.length)] + Math.floor(Math.random() * 999);
          socket.emit("bruteforce-log", `[ATTEMPT] ${config.targetUsername}:${randomPass} -> DENIED`);
        }
      }, intervalMs);

      // Clean up interval on disconnect
      socket.on("disconnect", () => {
        clearInterval(interval);
      });
    });

    socket.on("leave-simulation", (moduleId) => {
      socket.leave(`module-${moduleId}`);
      console.log(`Socket ${socket.id} left simulation for module ${moduleId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      socketRateLimit.delete(socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
