import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CogIcon,
  GlobeAltIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { SidebarItem } from "./SidebarItem";
import { useLocalStorage } from "tet-hooklib";
import Link from "next/link";
import { SelfUser } from "../../utils/types";
import { useSelf } from "../../utils/hooks/useSelf";
import { UserProfile } from "../UserProfile";

export const Sidebar = () => {
  const user = useSelf();
  const router = useRouter();
  const [open, setOpen] = useLocalStorage("sidebarOpen", true);
  return (
    <div
      className={`${
        open ? "w-96" : "w-40"
      }  h-screen bg-gray-1000 p-8 shrink-0 transition-all duration-300`}
    >
      <div
        className={`bg-gray-900 border border-gray-100/5 flex flex-col gap-8 h-full ${
          open ? "rounded-3xl p-8" : "rounded-xl p-2 py-6 items-center"
        } shadow-md transition-all duration-300`}
      >
        <div
          className={`flex ${
            open ? `flex-row gap-4` : `flex-col gap-2`
          } justify-between items-center`}
        >
          <div className={`flex flex-row gap-4 items-center`}>
            <Link href="/dashboard">
              <Image
                src={"/logo.png"}
                width={48}
                height={48}
                className={` rounded-2xl bg-gray-900 p-1 border border-gray-900/10 hover:brightness-110 transition-all duration-300`}
                alt={"Logo"}
              />
            </Link>
            <span
              className={`font-poppins text-xl font-bold text-gray-200 ${
                !open ? "hidden" : ""
              }`}
            >
              Finapp
            </span>
          </div>

          <div
            className={`p-2 rounded-xl hover:bg-gray-900/10 transition-all duration-300 `}
            onClick={() => setOpen(!open)}
          >
            <ChevronLeftIcon
              className={`h-4 w-4 cursor-pointer ${!open && `rotate-180`}`}
            />
          </div>
        </div>
        <div className={`flex flex-col gap-0`}>
          <span
            className={`font-poppins text-sm font-bold uppercase text-gray-100/30 pb-2
               ${!open && "hidden"}`}
          >
            Quick Access
          </span>

          <SidebarItem
            icon={<HomeIcon className={`h-6 w-6`} />}
            text="Home"
            href="/dashboard"
            open={open}
          />
          <SidebarItem
            icon={<UserGroupIcon className={`h-6 w-6`} />}
            text="Friends"
            href="/friends"
            open={open}
          />
          <SidebarItem
            icon={<GlobeAltIcon className={`h-6 w-6`} />}
            text="Networking"
            href="/settings"
            open={open}
          />
          {/* <SidebarItem
            icon={<CogIcon className={`h-6 w-6`} />}
            text="Settings"
            href="/settings"
          /> */}
        </div>

        {/* <div className={`flex flex-col gap-0`}>
          <span
            className={`font-poppins text-sm font-bold uppercase text-gray-900/30 pb-2`}
          >
            Class
          </span>
  
          <SidebarItem
            icon={<HomeIcon className={`h-6 w-6`} />}
            text="Home"
            href="/dashboard"
          />
          <SidebarItem
            icon={<UserGroupIcon className={`h-6 w-6`} />}
            text="Class Directory"
            href="/settings"
          />
        </div> */}

        <div className="flex-grow" />
        <div
          className={`flex flex-row ${
            open ? `p-4 rounded-3xl bg-gray-850` : `p-1 rounded-xl`
          }  border border-gray-100/10 drop-shadow-lg`}
        >
          <UserProfile
            user={user!}
            className={`${
              open ? `w-12 h-12` : `w-8 h-8 text-sm`
            } rounded-2xl transition-all duration-300`}
          />
          <div className={`flex flex-col justify-evenly ${!open ? `w-0 h-0 opacity-0`: ` pl-4 opacity-100 ` } whitespace-nowrap transition-all`}>
            <span className={` text-base font-bold text-gray-100`}>
              {user?.firstName} {user?.lastName}
            </span>
            <span className={` text-sm font-medium text-gray-100/30`}>
              @{user?.username}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
