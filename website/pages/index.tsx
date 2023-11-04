import Image from "next/image";
import TextBox from "../components/Inputs/TextBox";
// import { HiMail } from "react-icons/hi";

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 gap-8`}
    >
      <div
        className={`flex flex-col items-start justify-center gap-8  p-8 bg-gray-850 rounded-3xl border border-gray-100/10 w-96`}
      >
        <span className={`text-2xl font-bold font-montserrat`}>Login</span>
        <div className={`flex flex-col items-center justify-center gap-4 w-full`}>
          <TextBox label={`Email*`} className={`w-full rounded-2xl`} />
          <TextBox label={`Password*`} className={`w-full rounded-2xl`} />
        </div>
      </div>
    </main>
  );
}
