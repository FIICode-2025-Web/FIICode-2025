import { useLocation, Link } from "react-router-dom";
import { Navbar, Typography, Button, IconButton, Breadcrumbs} from "@material-tailwind/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useUser } from "../context/LoginRequired";


export function DashboardNavbar() {
  const { userId, username, token } = useUser();
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  return (
    <Navbar
      color={"primary"}
      className={"rounded-xl transition-all px-6 py-1"}
      fullWidth
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize text-surface-light">
          <Breadcrumbs
            className={"bg-transparent p-0 transition-all"}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                className="font-normal opacity-90 transition-all text-primary hover:opacity-100 hover:text-primary"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              className="font-normal text-surface-light "
            >
              {page}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="flex items-center">
          <Link to="/dashboard/profile">
            <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 text-primary px-4 xl:flex normal-case"
            >
              <UserCircleIcon className="h-5 w-5 text-primary"/>
              {username}
            </Button>
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500"/>
            </IconButton>
          </Link>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/DashboardNavbar.jsx";

export default DashboardNavbar;