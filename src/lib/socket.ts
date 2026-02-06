import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL_SOCKET, {
      withCredentials: true,
      transports: ["polling", "websocket"],
      autoConnect: true,
    });
  }

  return socket;
};