import { ReactNode } from "react";
import { Sidebar } from "./Sidebar/Sidebar";

export const SidebarLayout = (props: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <div className={`min-h-screen bg-gray-1000 flex flex-row gap-8 relative`}>
      <Sidebar />
      {props.children}
    </div>
  );
};
