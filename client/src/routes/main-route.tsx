import { createBrowserRouter } from "react-router";

// pages
import MainLayout from "../components/templates/main-layout";
import { PATH } from "../configs/path";

export const router = createBrowserRouter([
  {
    path: PATH.HOME,
    lazy: () => import("../pages/home").then(module => ({ Component: module.default }))
  },
  {
    path: PATH.APP,
    Component: MainLayout,
    children: [
      { index: true, lazy: () => import("../pages/dashboard").then(module => ({ Component: module.default })) },
      { path: PATH.BUILDER_DETAIL, lazy: () => import("../pages/resume-builder").then(module => ({ Component: module.default })) },
    ]
  },
  {
    path: PATH.VIEW_DETAIL,
    lazy: () => import("../pages/preview").then(module => ({ Component: module.default }))
  },
  {
    path: PATH.LOGIN,
    lazy: () => import("../pages/login").then(module => ({ Component: module.default }))
  },
])