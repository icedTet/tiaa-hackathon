import exp from "constants";
import { SidebarLayout } from "../components/SidebarLayout";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const DashboardPage = () => {
  const router = useRouter();
  useEffect(()=>{
    router.push("/advisor");
  },[])
  return (
    <SidebarLayout title={"r"}>
      <div className={`flex flex-col gap-8 p-8`}>
        <span className={`text-2xl font-bold font-montserrat`}>Dashboard</span>
      </div>
    </SidebarLayout>
  );
};
export default DashboardPage;
