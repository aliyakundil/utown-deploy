import { io, Socket } from "socket.io-client";

export interface OrderStatusEvent {
  orderId: number;
  status: string;
}

export interface OrderNewEvent {
  orderId: number;
  restaurantId: number;
}

let socket: Socket | null = null;

export function connectSocket() {
  const token = localStorage.getItem("accessToken");

  if (!token) return null;

  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
    auth: (cb) => cb({ token: localStorage.getItem("accessToken") }),
  });

  socket.on("order:status", (data: OrderStatusEvent) => {
    window.dispatchEvent(
      new CustomEvent<OrderStatusEvent>("order:status", { detail: data })
    );
  });

  socket.on("order:new", (data: OrderNewEvent) => {
    window.dispatchEvent(
      new CustomEvent<OrderNewEvent>("order:new", { detail: data })
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
