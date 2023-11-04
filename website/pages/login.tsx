import Image from "next/image";
import TextBox from "../components/Inputs/TextBox";
import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { apiDomain } from "../constants";
import { useRouter } from "next/router";
import { useSelf } from "../utils/hooks/useSelf";
import { UserProfile } from "../components/UserProfile";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
const dailyTip = [
  `The largest bill printed by the Bureau of Engraving and Printing was the $100,000 bill featuring the portrait of President Woodrow Wilson. It was only used to transfer money between Federal Reserve banks and was never publicly circulated.`,
  `The average American has $90,460 in debt, including mortgages, credit cards, auto loans, and student loans.`,
  `Over 200 million credit cards are in use in the United States today. The average American has 3.4 cards.`,
  `The probability of winning the Powerball lottery jackpot is 1 in 292,201,338. You are about 300 times more likely to get struck by lightning.`,
  `Only about 5% of Americans correctly answered questions about concepts like mortgages, interest rates, inflation, and risk in a financial literacy quiz. Be a part of the 5%!`,
  `The Rule of 72 is a quick way to estimate how long it will take for an investment to double its value with compound interest. You divide 72 by the annual rate of return to get the approximate number of years.`,
  `Compounding frequency makes a big difference. If you earn 6% interest annually, $10,000 will grow to $17,908 in 10 years. But with monthly compounding, it becomes $18,377 in the same time period.`,
  `Credit cards charge high interest rates but usually don't compound it. If they did, the interest costs would grow exponentially and become astronomical very quickly.`,
  `Compounding can also work against you. With a credit card charging 19% interest, a $1,000 balance will become over $10,000 owed in 10 years if only minimum payments are made.`,
  `The earlier you start investing, the more compound interest can benefit you. Starting at age 20 instead of 30 can make your retirement savings nearly twice as big.`,
];

export default function Home() {
  const router = useRouter();
  const [bgGlow, setBgGlow] = useState(false);
  const [bg, setBg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const self = useSelf();
  useLayoutEffect(() => {
    setBg("/logographic.png");
  }, []);
  const login = async () => {
    // {
    //   "email":"tet@tet.moe",
    //   "password":"123"
    // }
    setLoggingIn(true);
    const res = await fetch(`${apiDomain}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    setLoggingIn(false);
    console.log(json);
    if (!json.success) {
      setError(json.error);
      return;
    }
    setError("");
    localStorage.setItem("token", json.token);
    setLoggingIn(false);
    router.push("/pingy");
  };
  useEffect(() => {
    setError("");
  }, [email, password]);

  return (
    <main className={`grid min-h-screen grid-cols-9 bg-gray-900`}>
      <div className={`col-span-4 min-h-full flex flex-col`}>
        <div
          className={`flex flex-col items-center justify-between gap-4 py-24 px-24 xl:px-16 rounded h-full border-gray-100/10 grow max-w-3xl xl:max-w-prose 3xl:max-w-prose mx-auto`}
        >
          <div
            className={`flex flex-col gap-2 items-center justify-center  2xl:w-[20rem] xl:w-[16rem]`}
          >
            <img src="/logo.png" className={`w-24 h-24`} />
            <span
              className={`text-4xl 2xl:text-3xl xl:text-xl font-black font-montserrat uppercase`}
            >
              Welcome Back!
            </span>
            <span className={`text-lg font-medium font-wsans text-gray-100/40`}>
              Access your account by logging in!
            </span>
          </div>
          <div
            className={`flex flex-col items-center justify-center w-full grow`}
          >
            <div className={`flex flex-col gap-4 w-full`}>
              {self && (
                <div className={`flex flex-col gap-4 w-full `}>
                  {/* <span
                  className={`text-sm font-medium font-montserrat text-gray-100/20`}
                >
                  You&apos;re already logged into
                </span> */}
                  <div
                    className={`flex flex-row gap-4 p-4 border rounded-2xl items-center border-gray-100/20 drop-shadow-md shadow-xl bg-gray-850 w-full cursor-pointer hover:bg-gray-800 transition-all`}
                  >
                    <UserProfile user={self} className="w-10 h-10 text-xs" />
                    <div className={`flex flex-col gap-0`}>
                      <span className={`text-gray-100/20 text-sm font-medium`}>
                        Continue as
                      </span>
                      <span
                        className={`text-white text-lg font-bold font-montserrat`}
                      >
                        {self?.firstName} {self?.lastName}
                      </span>

                      {/* <span className={`text-gray-400 text-sm font-wsans`}>
                  {user?.email}
                </span> */}
                    </div>
                    <div className={`flex-grow`}></div>
                    <ChevronRightIcon className={`w-6 h-6 text-gray-100/20`} />
                  </div>
                </div>
              )}
              <div className={`flex flex-row items-center gap-4`}>
                <div
                  className={`flex-grow border border-gray-100/20 rounded`}
                ></div>
                <span
                  className={`text-sm font-medium font-wsans text-gray-100/40`}
                >
                  or
                </span>
                <div
                  className={`flex-grow border border-gray-100/20 rounded`}
                ></div>
              </div>
            </div>
            <div
              className={`flex flex-col ${self ? `gap-20` : `gap-32`} w-full`}
            >
              <div className={`flex flex-col gap-8 w-full`}>
                <div className={`flex flex-row items-center gap-4`}>
                  <span
                    className={`text-sm font-medium font-wsans text-red-500`}
                  >
                    {error}
                  </span>
                </div>
                <div
                  className={`flex flex-col items-center justify-center gap-8 w-full`}
                >
                  <TextBox
                    label={`Email*`}
                    className={`w-full !rounded-2.25xl !text-sm !bg-gray-900`}
                    classNamesInput="!bg-gray-900"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!error}
                  />
                  <TextBox
                    label={`Password*`}
                    className={`w-full !rounded-2.25xl !text-sm !bg-gray-900`}
                    classNamesInput="!bg-gray-900"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!error}
                  />
                </div>
              </div>
              <div className={`flex flex-col gap-4 w-full`}>
                <button
                  className={`w-full rounded-2.5xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3 hover:brightness-125 transition-all`}
                  onClick={login}
                >
                  Login
                </button>
                <Link href="/register">
                  <button
                    className={`w-full rounded-2.5xl bg-gray-100/5 p-3 hover:bg-white hover:text-gray-900 transition-all`}
                  >
                    Register
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex flex-row items-center justify-start gap-4 col-span-5 py-[10%] pr-[5%]`}
      >
        <div className={`w-full h-full rounded-3xl relative`}>
          <img
            src={bg}
            className={`w-full h-full object-cover rounded-3xl z-10 relative pointer-events-none`}
            onLoad={() => setBgGlow(true)}
            onLoadedData={() => setBgGlow(true)}
          />
          <img
            src="/logographic.png"
            className={`w-full h-full object-cover rounded-3xl absolute top-0 left-0 blur-md scale-[1.02] pointer-events-none`}
          />
          <div
            className={`absolute bottom-12 left-8 right-8 p-8 rounded-3xl bg-gray-900/50 border border-gray-100/20 backdrop-blur-2xl z-30 flex flex-col gap-1`}
          >
            <span className={`text-white text-xl font-bold font-montserrat`}>
              🧠 Daily Fun Fact!
            </span>
            <span
              className={`text-gray-100/80 text-base font-medium font-wsans`}
            >
              {dailyTip[(new Date().getDate() % dailyTip.length) - 1]}
            </span>
          </div>
          <div
            className={`absolute top-0 left-0 w-full h-full rounded-3xl blur-xl ${
              bgGlow ? `opacity-30` : `opacity-0`
            } transition-all delay-500 duration-500`}
            style={{
              backgroundColor: `hsla(0,100%,50%,1)`,
              backgroundImage: `radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%),
              radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
              radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%),
              radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
              radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%),
              radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%),
              radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)`,
            }}
          />
        </div>
      </div>
    </main>
  );
}
