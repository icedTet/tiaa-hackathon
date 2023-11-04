import Image from "next/image";
import TextBox from "../components/Inputs/TextBox";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetcher } from "../utils/Fetcher";
import { apiDomain } from "../constants";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
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

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();
  useEffect(() => {
    setError("");
  }, [firstName, lastName, username, email, password]);
  const [signupStage, setSignupStage] = useState(0);
  const login = async () => {
    setLoggingIn(true);
    const res = await fetcher(`${apiDomain}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, username, email, password }),
    }).catch((e) => {
      setError(e.message);
      return null;
    });
    setLoggingIn(false);
    const data = res ? await res.json() : null;
    if (res?.status !== 200) {
      setError(data?.error || "An unknown error occurred.");
      return;
    }
    setSignupStage(1);
    setEmail(email);
  };
  const verify = async () => {
    setLoggingIn(true);
    const res = await fetcher(`${apiDomain}/signup/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    }).catch((e) => {
      setError(e.message);
      return null;
    });
    setLoggingIn(false);
    const data = res ? await res.json() : null;
    if (res?.status !== 200) {
      setError(data?.error || "An unknown error occurred.");
      return;
    }
    setSignupStage(2);
  };

  return (
    <main className={`flex min-h-screen`}>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
      >
        <motion.div
          className={`w-full relative p-12 bg-gray-900 rounded-2xl ${
            loggingIn && "animate-pulse pointer-events-none"
          }`}
          variants={{
            hidden: {
              opacity: 0,
              y: -100,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 1,
                type: "spring",
                bounce: 0.5,
              },
            },
          }}
          animate={
            globalThis.window
              ? signupStage === 0
                ? `visible`
                : `hidden`
              : "hidden"
          }
        >
          <div className={`flex flex-col gap-8 w-96`}>
            <div className={`flex flex-row items-center gap-4`}>
              <span className={`text-2xl font-bold font-montserrat`}>
                Sign Up
              </span>
            </div>
            <span className={`text-sm font-medium font-wsans text-red-500`}>
              {error}
            </span>
            <div
              className={`flex flex-col items-center justify-center gap-4 w-full`}
            >
              <div className={`flex flex-row w-full gap-4`}>
                <TextBox
                  label={`First Name*`}
                  className={`w-full !rounded-2.25xl !text-sm !bg-gray-900`}
                  classNamesInput="!bg-gray-900"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={!!error}
                />
                <TextBox
                  label={`Last Name*`}
                  className={`w-full !rounded-2.25xl !text-sm !bg-gray-900`}
                  classNamesInput="!bg-gray-900"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={!!error}
                />
              </div>
              <TextBox
                label={`Username*`}
                className={`w-full !rounded-2.25xl !text-sm !bg-gray-900`}
                classNamesInput="!bg-gray-900"
                type=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!error}
              />
              <TextBox
                label={`Email*`}
                className={`w-full !rounded-2.25xl !text-sm !bg-gray-900`}
                classNamesInput="!bg-gray-900"
                type="email"
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
            <button
              className={`w-full rounded-2.5xl bg-gray-100/5 p-3 hover:bg-white hover:text-gray-900 transition-all`}
              onClick={login}
            >
              Register
            </button>
            <span className={`text-sm font-medium font-wsans text-gray-100/40`}>
              Already have an account?{" "}
              <Link href="/login">
                <span className={`text-white`}>Login</span>
              </Link>
            </span>
          </div>
        </motion.div>
      </div>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
      >
        <motion.div
          className={`w-full relative p-12 bg-gray-900 rounded-2xl ${
            loggingIn && "animate-pulse pointer-events-none"
          } ${signupStage === 0 && "hidden"}`}
          variants={{
            hidden: {
              opacity: 0,
              y: -100,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 1,
                type: "spring",
                bounce: 0.5,
              },
            },
          }}
          animate={
            globalThis.window
              ? signupStage === 1
                ? `visible`
                : `hidden`
              : "hidden"
          }
        >
          <div className={`flex flex-col gap-4 w-96`}>
            <div className={`flex flex-row items-center gap-4`}>
              <span className={`text-2xl font-bold font-montserrat`}>
                Verify your email
              </span>
            </div>
            <span className={`text-sm font-medium font-wsans text-red-500`}>
              {error}
            </span>
            <span className={`text-gray-600 dark:text-gray-500`}>
              Please enter the code that was sent to your email address at{" "}
              <b className={`text-indigo-500`}>{email}</b>. Make sure to check
              your spam/junk folder.
            </span>
            <form
              onSubmit={(e) => e.preventDefault()}
              className={`flex flex-col gap-12`}
            >
              <TextBox
                label={"6-Digit Code*"}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder={""}
                className={`w-48 !rounded-2.25xl !text-sm !bg-gray-900`}
                classNamesInput="!bg-gray-900"
                error={!!error}
                disabled={loggingIn}
              />
              <button
                className={`w-full rounded-2.5xl bg-gray-100/5 p-3 hover:bg-white hover:text-gray-900 transition-all`}
                onClick={verify}
              >
                Verify
              </button>
            </form>
          </div>
        </motion.div>
      </div>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
      >
        <motion.div
          className={`w-full relative p-12 bg-gray-900 rounded-2xl ${
            loggingIn && "animate-pulse pointer-events-none"
          } ${signupStage < 2 && "hidden"}`}
          variants={{
            hidden: {
              opacity: 0,
              y: -100,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 1,
                type: "spring",
                bounce: 0.5,
              },
            },
          }}
          animate={
            globalThis.window
              ? signupStage === 2
                ? `visible`
                : `hidden`
              : "hidden"
          }
        >
          <div className={`flex flex-col gap-4 w-96`}>
            <div className={`flex flex-row items-center gap-4`}>
              <span className={`text-2xl font-bold font-montserrat`}>
                Welcome aboard!
              </span>
            </div>
            <span className={`text-sm font-medium font-wsans text-red-500`}>
              {error}
            </span>
            <span className={`text-gray-600 dark:text-gray-500`}>
              You are now logged in as{" "}
              <b className={`text-indigo-500`}>{email}</b>.
            </span>
            <button
              className={`w-full rounded-2.5xl bg-gray-100/5 p-3 hover:bg-white hover:text-gray-900 transition-all`}
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Let&apos;s go!
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
