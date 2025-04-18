// src/routes/index.jsx

import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";

import { SignIn, SignUp } from "@/pages/auth";
import { Home } from "./pages/dashboard";
import Requests from "./pages/requests/Requests";
import Feedback from "./pages/feedback/Feedback";
import Routes from "./pages/routes/Routes";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    title: "auth pages",
    layout: "authorities/auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
  {
    layout: "authorities/dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "requests",
        path: "/requests",
        element: <Requests/>
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "feedback",
        path: "/feedback",
        element: <Feedback/>
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "routes",
        path: "/routes",
        element: <Routes/>
      },
    ],
  },
];

export default routes;
