import { getLSToken } from "@/lib/localStorage";
import { io, Socket } from "socket.io-client";

let socket: Socket;
const SOCKET_URL = "http://localhost:3080";

export const connectSocket = () => {
  const token = getLSToken();

  if (token) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      extraHeaders: {
        token,
      },
    });
  }
};

export { socket };
