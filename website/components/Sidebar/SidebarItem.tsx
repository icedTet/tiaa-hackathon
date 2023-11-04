import Link from "next/link";
import { useRouter } from "next/router";

export const SidebarItem = (props: {
  icon: JSX.Element;
  text: string;
  href: string;
  open?: boolean;
}) => {
  const router = useRouter();
  const { icon, text, href, open } = props;
  const selected = router.pathname === href;
  return (
    <Link href={href} className={`no-underline  ${open ? `w-full` : `w-fit`}`}>
      <div
        className={`flex flex-row items-center cursor-pointer ${
          selected && `text-indigo-500`
        } text-gray-600 hover:text-indigo-500 hover:bg-gray-750 rounded-2xl transition-colors duration-150 font-medium stroke-2
        ${open ? `px-6 py-4` : `p-2`}
        `}
      >
        {icon}
        {
          <span
            className={` whitespace-nowrap ${
              open ? `opacity-100 pl-4` : `opacity-0 w-0`
            } transition-opacity duration-75 delay-75`}
          >
            {text}
          </span>
        }
      </div>
    </Link>
  );
};
