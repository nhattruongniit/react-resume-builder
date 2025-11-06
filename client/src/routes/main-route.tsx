import { createBrowserRouter } from "react-router";

// pages
import MainLayout from "../components/templates/main-layout";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("../pages/home").then(module => ({ Component: module.default }))
  },
  {
    path: "app",
    Component: MainLayout,
    children: [
      { index: true, lazy: () => import("../pages/dashboard").then(module => ({ Component: module.default })) },
      { path: "builder/:resumeId", lazy: () => import("../pages/resume-builder").then(module => ({ Component: module.default })) },
    ]
  },
  {
    path: "view/:resumeId",
    lazy: () => import("../pages/preview").then(module => ({ Component: module.default }))
  },
  {
    path: "login",
    lazy: () => import("../pages/login").then(module => ({ Component: module.default }))
  },
])