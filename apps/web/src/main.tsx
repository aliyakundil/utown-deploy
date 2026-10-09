
import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { router } from "./app/router/router";
import { SidebarProvider } from "./components/layout/Sidebar/SidebarContext";
import { RestaurantProvider } from "./features/restaurateur/context/RestaurantContext";
import NotificationToast from "./components/layout/NotificationToast/NotificationToast";
import { connectSocket } from "./lib/socket";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/globals.css";
import "./styles/responsive.css";

connectSocket();

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <SidebarProvider>
      <RestaurantProvider>
        <NotificationToast />
        <RouterProvider router={router} />
      </RestaurantProvider>
    </SidebarProvider>
  </React.StrictMode>
);