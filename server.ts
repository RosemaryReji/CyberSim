import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Listen for simulation events
    socket.on("join-simulation", (moduleId) => {
      socket.join(`module-${moduleId}`);
      console.log(`Socket ${socket.id} joined simulation for module ${moduleId}`);
    });

    socket.on("start-bruteforce", (config: { wordlist: string, threads: number, targetUsername: string }) => {
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
