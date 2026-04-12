import React from "react";
import { Outlet } from "react-router";
import { AppProvider } from "../context/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}
