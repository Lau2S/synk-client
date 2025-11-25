import { io, Socket } from "socket.io-client";

const CHAT_URL = (import.meta.env.VITE_CHAT_URL as string) || "http://localhost:4001";

const socket: Socket = io(CHAT_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export default socket;