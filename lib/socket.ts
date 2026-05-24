import { io, type Socket } from "socket.io-client";

import { getToken } from "@/lib/api";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:8000";

export function connectSocket(): Socket {
  return io(SOCKET_URL, {
    path: "/ws/socket.io",
    transports: ["websocket", "polling"],
    auth: { token: getToken() }
  });
}
