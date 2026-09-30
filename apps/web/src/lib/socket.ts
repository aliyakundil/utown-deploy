import { io, Socket } from "socket.io-client";

export interface OrderStatusEvent {
  orderId: number;
  status: string;
}

let socket: Socket | null = null;

export function connectSocket() {
  const token = localStorage.getItem("accessToken");

  if (!token) return null;

  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
    auth: { token },
  });

  socket.on("order:status", (data: OrderStatusEvent) => {
    window.dispatchEvent(
      new CustomEvent<OrderStatusEvent>("order:status", { detail: data })
    );
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}
