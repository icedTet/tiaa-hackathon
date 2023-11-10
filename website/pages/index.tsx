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
    setChatResDisp(false);
    setChatRes("");
  };

  //Code for inputting and outputting using ai chatbot from backend
  const [chatRes, setChatRes] = useState("");
  const [chatResFlag, setChatResFlag] = useState(false);
  const [chatResDisp, setChatResDisp] = useState(false);
  const handleKeyDownCapture = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      // Call your function here
      sendQuery();
    }
  };
  const sendQuery = () => {
    setChatResDisp(true);
    setChatResFlag(false);
    setChatRes("");
    let chatInput = chatInputRef.current
    // let chatInputVal = chatInput.value;
    // // console.log("YOOOOOOOO:");
    // // console.log(chatInputVal);
    // getRes(chatInputVal)
    // .then(() => {
    //   chatInput.value = "";
    // });
  }
  const getRes = async (inputQ: any) => {
    //fetch the response from the chatbot
    //Ex question link: https://tiaaapi.tet.moe/aiquestion?question=what%20is%20a%20401k?
    const res = await fetch(`https://tiaaapi.tet.moe/aiquestion?question=${inputQ}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.text())
    .then((data) => {
        // console.log(data);
        setChatRes(data);
        setChatResFlag(true);

      })
      .catch((error) => console.log(error));

  }

  return (
    <>
      <div id="header">
        <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="#" className="flex items-center">
              <img src="logo.png" className="h-[4rem] mr-3" alt="Barrel Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Finapp
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
                    Log In
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

      <div id='main' className="container mx-auto p-6">
        <div id='article_wrapper' className="grid bg-lightgray p-4 rounded-lg mb-1 gap-[20px] ">




          <div className="relative">
            <div id="behind" className="absolute h-full w-full  top-0 filter blur bg-gradient-to-r bg-black">

            </div>

            <article className="gap-[20px] grid grid-cols-2 h-auto p-5 rounded-lg flex items-center leading-[2rem] bg-gray-800 relative place-items-center"> {/* Add mb-6 for margin between articles and flex container */}
              <div className="pr-5 "> {/* Increase the right padding to create more space for text */}
                <h2 className="text-gray-300 text-[25px] font-bold mb-4 mr-[10rem] leading-[2rem] ">Spending & Saving</h2>
                <h2 className="text-[35px] text-white font-bold mb-2">Do More With Your Money</h2>
                <p className="text-gray-500 text-base text-[25px] leading-[2.1rem] text-shadow shadow-red-500">This website will help you learn how to spend money smartly <br /> and save smarter so you can reach your goals.</p>
              </div>
              <img
                src="Savings.jpg" // Replace with your image URL
                className="h-[18rem] rounded-2xl mr-8" // Adjust the margin value as needed // Adjust the width, rounding, and left margin as needed
                alt="Image Description" // Replace with a suitable alt text
              />
            </article>

          </div>

          <div className="relative">
            <div id="behind" className="absolute h-full w-full  top-0 filter blur bg-gradient-to-r bg-black">

            </div>
            <article className="gap-[20px] grid grid-cols-2 h-auto bg-grey p-7 rounded-lg flex items-center bg-gray-800 relative place-items-center">
              <img
                src="investment.png" // Replace with your image URL
                className="h-[20rem] rounded-xl mr-[3rem]" // Adjust the width and rounding as needed, and add right margin
                alt="Image Description" // Replace with a suitable alt text
              />
              <div className=""> {/* No padding needed */}
                <h2 className="text-gray-300 text-.5xl font-bold mb-2 text-[25px] leading-[2rem]">Trading & investing</h2>
                <h2 className="text-[35px] font-bold mb-2 text-[35px] leading-[2rem] text-white">Invest the way you want to</h2>
                <p className="text-base text-[25px] leading-[2.1rem] text-gray-500 ">Whether you are an active trader or investing in the future, we can help you reach your goals.</p>
              </div>
            </article>
          </div>


          <div className="relative">
            <div id="behind" className="absolute h-full w-full  top-0 filter blur bg-gradient-to-r bg-black">

            </div>
            <article className="gap-[20px] grid grid-cols-2 h-auto bg-grey p-5 rounded-lg flex items-center bg-gray-800 relative place-items-center"> {/* Add mb-6 for margin between articles and flex container */}
              <div className="pr-5"> {/* Increase the right padding to create more space for text */}
                <h2 className="text-gray-300 text-.5xl font-bold mb-4 mr-[10rem] text-[25px] leading-[2rem] ">Investment Made Fun</h2>
                <h2 className="text-white text-[35px] font-bold mb-2 text-[35px] leading-[2rem]  ">It All Starts Here</h2>
                <p className="text-gray-500 text-base text-[25px] leading-[2.1rem]">Regardless of what ways you choose to consume content <br /> this website is meant to provide the most engaging <br /> experience for people of the younger generation.</p>
              </div>
              <img
                src="Retirement_mordern.jpg" // Replace with your image URL
                className="h-[20rem] rounded-2xl mr-8" // Adjust the margin value as needed // Adjust the width, rounding, and left margin as needed
                alt="Image Description" // Replace with a suitable alt text
              />
            </article>
          </div>
        </div>
      </div>

      {/* <div id="wrapper" className="w-[150px] h-[150px] ml-[100px] relative ">
        <div id="behind" className="absolute h-full w-full  top-0 filter blur-lg bg-gradient-to-r from-green-400 via-orange-500 to-blue-500">

        </div>
        <div id="front" className="relative bg-blue-500 w-full h-full " >

        </div>
      </div> */}

      <div id="footer" className=" h-[5rem] items-center justify-center mt-[10px]  "> {/* Add mt-8 to create margin at the top */}
        <div id="wrapper" className="w-full h-full relative ">
          <div id="behind" className="absolute h-full w-full  top-0 filter ">

          </div>

          <div id="front" className="relative w-full h-full bg-black" >

          </div>
        </div>

      </div>

      <div
        id="AI_Chat_Wrapper"
        className="fixed bottom-[9px] right-[17px] mt-1  h-fit"
      >
        <img
          id="AI_chat_logo"
          src="chatbot-icon.png"
          className={`${showChat ? "hidden" : "block"} h-[5rem] m3 filter invert`}
          alt="AI chat"
          onClick={toggleChatBot}
        ></img>
        <div
          id="chat_window_wrapper"
          className={`${showChat ? "block" : "hidden"} w-[30rem] h-[35rem]`}
        >
          <div
            id="chat_window"
            className="grid grid-rows-[5%_85%_10%] bg-white bg-gray-600 p-[15px] border-solid border-[4px] border-black rounded-[1.25rem] h-full"
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
              <div id="chat_body" className="overflow-auto h-full">
                <div id="chat_response" className="py-[10px] h-auto">
                  <div className={`${(chatResDisp)? "block" : "hidden"} bg-black text-white w-fit p-1`}>
                    {(chatResFlag)? "Generated Response:" : "Generating Response..."} 
                  </div>
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
                  onKeyDownCapture={handleKeyDownCapture}/>
                <AiOutlineSend onClick={sendQuery}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Home;
