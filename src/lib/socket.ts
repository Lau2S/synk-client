import { io, Socket } from "socket.io-client";

const CHAT_URL = (import.meta.env.VITE_CHAT_URL as string) || "http://localhost:4001";

const socket: Socket = io(CHAT_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

/**
 * Join a chat room with user identification
 * @param roomId - The room to join
 * @param username - The current user's name/identifier
 */
export const joinRoom = (roomId: string, username: string) => {
  socket.emit("joinRoom", { 
    roomId: roomId, 
    userId: username 
  });
};

/**
 * Send a message to a room
 * @param roomId - Target room
 * @param sender - Username of the sender
 * @param message - Message content
 */
export const sendMessage = (roomId: string, sender: string, message: string) => {
  socket.emit("sendMessage", {
    roomId,
    sender,
    message
  });
};

/**
 * Leave a chat room
 * @param roomId - The room to leave
 */
export const leaveRoom = (roomId: string) => {
  socket.emit("leaveRoom", roomId);
};

// Event listeners
socket.on("joinedRoom", (data) => {
  console.log(`✅ Joined room ${data.roomId} as ${data.userId}`);
  console.log(`👥 ${data.activeUsers} users active`);
});

socket.on("userJoined", (data) => {
  console.log(`👤 ${data.userId} joined the room`);
});

socket.on("userLeft", (data) => {
  console.log(`👋 ${data.userId} left the room`);
});

socket.on("receiveMessage", (message) => {
  console.log(`💬 ${message.sender}: ${message.message}`);
});

socket.on("roomError", (error) => {
  console.error("❌ Room error:", error.error);
});

socket.on("messageError", (error) => {
  console.error("❌ Message error:", error.error);
});

export default socket;
