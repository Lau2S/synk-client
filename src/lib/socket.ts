import { io, type Socket } from "socket.io-client";

const CHAT_URL = (import.meta.env.VITE_CHAT_URL as string) || "http://localhost:4001";
const MEET_URL = (import.meta.env.VITE_MEET_URL as string) || "http://localhost:4000";

// ...existing code...
export const chatSocket: Socket = io(CHAT_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"], // <- usar solo websocket para evitar polling CORS XHR
  upgrade: true,
  // reconnection helpful flags
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const meetSocket: Socket = io(MEET_URL, {
  autoConnect: false,
  transports: [ "polling"], // <- usar solo websocket
  upgrade: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Default export kept for files that import default (Meeting.tsx uses default)
export default meetSocket;