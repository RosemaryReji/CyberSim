"use client";

import { io, Socket } from "socket.io-client";

// Singleton socket instance
let socket: Socket | undefined;

export const getSocket = () => {
  if (!socket) {
    socket = io({
      path: "/socket.io/",
      addTrailingSlash: false,
    });
  }
  return socket;
};
