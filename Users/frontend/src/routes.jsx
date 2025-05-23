import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { SignIn, SignUp } from "@/pages/auth";
import { Dashboard } from "@mui/icons-material";
import LoginRequired from "./context/LoginRequired";
import { Home } from "./pages/dashboard/index";
import ProfilePage from "./pages/profile/ProfilePage";
import PollutionSection from "./pages/pollution/PollutionSection";
import AssistantPage from "./pages/assistant/AssistantPage";
import LeaderboardPage from "./pages/leaderboard/LeaderboardPage";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    title: "auth pages",
    layout: "auth",
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
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "pollution",
        path: "/pollution",
        element: <PollutionSection />
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <ProfilePage />
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "assistant",
        path: "/assistant",
        element: <AssistantPage />
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "leaderboard",
        path: "/leaderboard",
        element: <LeaderboardPage />
      },
    ],
  },
];

export default routes;
