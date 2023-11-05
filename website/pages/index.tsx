"use client"; // This is a client component

import { apiDomain } from "@/constants";
//hooks imports
import { useState } from "react";
import { useRef } from "react";

//react icons imports
import { AiOutlineSend } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";

const Home: React.FC = () => {
  // ref variables initialization
  const chatInputRef = useRef(null);

  const [showChat, setShowChat] = useState(false);
  const toggleChatBot = () => {
    setShowChat(!showChat);
  };

  //Code for inputting and outputting using ai chatbot from backend
  const [chatRes, setChatRes] = useState(" ");
  // const sendQuery = () => {
  //   let chatInputVal = chatInputRef.current?.value;
  //   // console.log("YOOOOOOOO:");
  //   // console.log(chatInputVal);
  //   getRes(chatInputVal);
  // };
  // const getRes = async (inputQ: any) => {
  //   //fetch the response from the chatbot
  //   const res = await fetch(`${apiDomain}/login`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(),
  //   });
  //   //output the response
  //   setChatRes(inputQ);
  // };

  return (
    <>
      <div
        id="AI_Chat_Wrapper"
        className="fixed bottom-[9px] right-[17px] mt-1  h-fit"
      >
        <img
          id="AI_chat_logo"
          src="AI_Chat.png"
          className={`${showChat ? "hidden" : "block"} h-[9rem] m3`}
          alt="AI chat"
          onClick={toggleChatBot}
        ></img>
        <div
          id="chat_window_wrapper"
          className={`${showChat ? "block" : "hidden"} w-[30rem] h-[35rem]`}
        >
          <div
            id="chat_window"
            className="overflow-auto grid grid-rows-[5%_85%_10%] bg-white bg-gray-600 p-[15px] border-solid border-[4px] border-black rounded-[1.25rem] h-full"
          >
            <div id="chat_head_wrapper" className="flex items-center">
              <div
                id="chat_header"
                className="text-center w-full text-blue-700"
              >
                Chat with our AI
              </div>
              <BsChevronDown onClick={toggleChatBot} />
            </div>
            <div>
              <div className="bg-gray-400 h-[1px]"></div>
              <div id="chat_body">
                <div id="chat_response" className="py-[10px]">
                  {chatRes}
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gray-400 h-[1px]"></div>
              <div id="chat_footer" className="flex items-center">
                <input
                  type="text"
                  id="chat_input"
                  placeholder="Write a Message"
                  className="w-full pr-[10px] py-[10px] outline-0 border-0"
                  ref={chatInputRef}
                />
                {/* <AiOutlineSend onClick={sendQuery} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="header">
        <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="#" className="flex items-center">
              <img src="logo.png" className="h-[4rem] mr-3" alt="Barrel Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Bottom of the Barrel
              </span>
            </a>
            <div id="login_wraper">
              <ul>
                <li>
                  <a
                    href="https://tiaa.tet.moe/login"
                    target="_self"
                    className="bg-white border-2 border-solid border-[white] block px-3 text-gray-900 rounded-full hover:bg-transparent hover:text-blue-700 hover:border-transparent font-medium"
                  >
                    Log In / Sign Up
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* this is the financial tip code */}
        {/* <div className='bg-gray-400 h-[1px]'></div>
        <div>
            <h1 className='h-[24px] text-white text-center dark:bg-gray-900'>Financial Tip: DONT LISTEN TO VEER</h1>
        </div>
        <div className='bg-gray-400 h-[1px]'></div> */}
      </div>

      <div id="main" className="container mx-auto p-6">
        <div
          id="article_wrapper"
          className="grid bg-lightgray p-4 rounded-lg mb-1"
        >
          <article className="gap-[20px] grid grid-cols-2 h-auto bg-grey p-5 rounded-lg flex items-center leading-[2rem]">
            {" "}
            {/* Add mb-6 for margin between articles and flex container */}
            <div className="pr-5">
              {" "}
              {/* Increase the right padding to create more space for text */}
              <h2 className="text-green-500 text-[25px] font-bold mb-4 mr-[10rem] leading-[2rem] underline ">
                Spending & Saving
              </h2>
              <h2 className="text-[35px] font-bold mb-2">
                Do More With Your Money
              </h2>
              <p className="text-base text-[25px] leading-[2.1rem] ">
                Fidelity cash management products help you spend <br /> and save
                smarter so you can reach your goals.
              </p>
            </div>
            <img
              src="saving-money.png" // Replace with your image URL
              className="w-full h-full rounded-2xl mr-8" // Adjust the margin value as needed // Adjust the width, rounding, and left margin as needed
              alt="Image Description" // Replace with a suitable alt text
            />
          </article>

          <article className="gap-[20px] grid grid-cols-2 h-auto bg-grey p-5 rounded-lg flex items-center">
            <img
              src="stocks.webp" // Replace with your image URL
              className="w-full h-full rounded-xl mr-[3rem]" // Adjust the width and rounding as needed, and add right margin
              alt="Image Description" // Replace with a suitable alt text
            />
            <div className="">
              {" "}
              {/* No padding needed */}
              <h2 className="text-green-500 text-.5xl font-bold mb-2 text-[25px] leading-[2rem] underline ">
                Trading & investing
              </h2>
              <h2 className="text-xl font-bold mb-2 text-[35px] leading-[2rem]">
                Invest the way you want to
              </h2>
              <p className="text-base text-[25px] leading-[2.1rem]">
                Whether you are an active trader or investing in the future, we
                can help you reach your goals..
              </p>
            </div>
          </article>

          <article className="gap-[20px] grid grid-cols-2 h-auto bg-grey p-5 rounded-lg flex items-center">
            {" "}
            {/* Add mb-6 for margin between articles and flex container */}
            <div className="pr-5">
              {" "}
              {/* Increase the right padding to create more space for text */}
              <h2 className="text-green-500 text-.5xl font-bold mb-4 mr-[10rem] text-[25px] leading-[2rem] underline ">
                Retirement
              </h2>
              <h2 className="text-xl font-bold mb-2 text-[35px] leading-[2rem] ">
                Your future starts now
              </h2>
              <p className="text-base text-[25px] leading-[2.1rem]">
                Whether you want to manage retirement planning <br /> on your
                own or have us guide you, we’re here to <br /> help along the
                way.
              </p>
            </div>
            <img
              src="retirement.jpeg" // Replace with your image URL
              className="w-full h-full rounded-2xl mr-8" // Adjust the margin value as needed // Adjust the width, rounding, and left margin as needed
              alt="Image Description" // Replace with a suitable alt text
            />
          </article>
        </div>
      </div>

      <div
        id="footer"
        className="bg-black h-[5rem] items-center flex flex-col justify-center mt-[10px]"
      >
        {" "}
        {/* Add mt-8 to create margin at the top */}
      </div>
    </>
  );
};

export default Home;
