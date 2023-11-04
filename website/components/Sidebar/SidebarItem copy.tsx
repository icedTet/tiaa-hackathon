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
        className={`flex flex-row items-center gap-4  cursor-pointer ${
          selected && `text-rose-900`
        } text-gray-600 hover:text-rose-600 hover:bg-gray-150 rounded-2xl transition-colors duration-150 font-medium stroke-2
        ${open ? `px-6 py-4` : `p-2`}
        `}
      >
        {icon}
        {open && <span className={``}>{text}</span>}
      </div>
    </Link>
  );
};
