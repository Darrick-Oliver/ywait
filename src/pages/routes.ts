import { createBrowserRouter } from "react-router";
import { Home } from "./home";
import { RootLayout } from "@/components/root-layout";
import { Settings } from "./settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "settings", Component: Settings },
    ],
  },
]);
