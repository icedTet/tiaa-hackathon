import { useForceUpdate } from "framer-motion";
import { SidebarLayout } from "../../components/SidebarLayout";
import { AIQuestionsHelper, useAIHistory } from "../../utils/Advisor";
import TextBox from "../../components/Inputs/TextBox";
import { useCallback, useEffect, useRef, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import MarkdownRenderer from "../../components/markdown-renderer";
import { UserProfile } from "../../components/UserProfile";
import { useSelf } from "../../utils/hooks/useSelf";
import { useAI } from "../../utils/SafeAdvisor";

export const AdvisorPage = () => {
  const [force] = useForceUpdate();
  const [question, setQuestion] = useState("How can I save up for retirement");
  const self = useSelf();
  const [latestQuestion, setLatestQuestion] = useState(0);
  const [mockQuestion, setmockQuestion] = useState("");
  const [history, sessionID, typing, responseString, callMessage] = useAI();
  const messagesDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTimeout(() => {
      globalThis?.document
        ?.getElementById(`message-${latestQuestion}`)
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  }, [responseString]);
  const pingMessage = useCallback(() => {
    if (messagesDiv.current) {
      messagesDiv.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messagesDiv]);
  const onClick = () => {
    console.log("clicked");
    if (!question) return;
    setQuestion("");
    setmockQuestion(question);
    setTimeout(() => {
      globalThis?.document.getElementById(`message-mock`)?.scrollIntoView({
        behavior: "instant",
      });
    }, 100);
    let cancel = false;
    let int = setInterval(() => {
      if (cancel) return clearInterval(int);
      globalThis?.document.getElementById(`response-mock`)?.scrollIntoView({
        behavior: "instant",
        block: "end",
        inline: "end",
      });
    }, 20) as NodeJS.Timeout;
    callMessage(question).then((res) => {
      // setTimeout(() => {
      //   messagesDiv.current?.lastElementChild?.scrollIntoView({
      //     behavior: "smooth",
      //     block: "end",
      //     inline: "nearest",
      //   });
      // }, 200);
      cancel = true;
      globalThis?.document.getElementById(`tagger`)?.scrollIntoView({
        behavior: "instant",
        block: "end",
        inline: "end",
      });
      setLatestQuestion(history.length);
      setmockQuestion("");
    });
  };
  useEffect(() => {
    globalThis?.document.getElementById(`tagger`)?.scrollIntoView({
      behavior: "instant",
      block: "end",
      inline: "end",
    });
  }, [history]);
  return (
    <SidebarLayout title={"r"}>
      <div className={`flex flex-col gap-8 p-8 grow`}>
        <span className={`text-2xl font-bold font-montserrat`}>Advisor</span>
        <div className={`flex flex-col gap-2 grow h-full relative`}>
          <div
            className={`absolute top-0 left-0 w-full h-full overflow-auto flex flex-col gap-12 pb-6`}
            ref={messagesDiv}
          >
            <div
              className={`flex flex-row gap-4 items-start`}
              id={`message-intro`}
            >
              <div
                className={`w-12 h-12 bg-gray-800 flex flex-row items-center justify-center rounded-full font-bold`}
              >
                AI
              </div>
              <div className={`flex flex-col gap-2`}>
                <span className={`text-sm font-bold text-gray-100`}>
                  Clyde{" "}
                </span>
                {/* <span className={`text-gray-100 text-sm`}>
                      {message._getType() === "human"
                        ? "You asked"
                        : "I answered"}
                    </span> */}
                <div className={`bg-gray-900 p-4 rounded-3xl`}>
                  <MarkdownRenderer>
                    Hi there! I&apos;m Clyde, your personal financial advisor. I
                    can help you with any questions you have about your
                    finances. Just ask me a question and I&apos;ll do my best to
                    answer it!
                  </MarkdownRenderer>
                </div>
              </div>
            </div>
            {history.map((message, ind) => {
              return (
                <div
                  className={`flex flex-row gap-4 items-start`}
                  id={`message-${ind}`}
                  key={ind}
                >
                  {message.type === "human" ? (
                    <UserProfile className={"w-12 h-12"} user={self!} />
                  ) : (
                    <div
                      className={`w-12 h-12 bg-gray-800 flex flex-row items-center justify-center rounded-full font-bold`}
                    >
                      AI
                    </div>
                  )}
                  <div className={`flex flex-col gap-2`}>
                    <span className={`text-sm font-bold text-gray-100`}>
                      {message.type === "human" ? self?.firstName : "Clyde"}
                    </span>
                    {/* <span className={`text-gray-100 text-sm`}>
                      {message._getType() === "human"
                        ? "You asked"
                        : "I answered"}
                    </span> */}
                    <div className={`bg-gray-900 p-4 rounded-3xl`}>
                      <MarkdownRenderer>{message.content}</MarkdownRenderer>
                    </div>
                  </div>
                </div>
              );
            })}
            {history[history.length - 1]?.type !== "human" && mockQuestion && (
              <div
                className={`flex flex-row gap-4 items-start`}
                id={`message-mock`}
              >
                <UserProfile className={"w-12 h-12"} user={self!} />
                <div className={`flex flex-col gap-2`}>
                  <span className={`text-sm font-bold text-gray-100`}>
                    {self?.firstName}
                  </span>
                  {/* <span className={`text-gray-100 text-sm`}>
                      {message._getType() === "human"
                        ? "You asked"
                        : "I answered"}
                    </span> */}
                  <div className={`bg-gray-900 p-4 rounded-3xl`}>
                    <MarkdownRenderer>{mockQuestion}</MarkdownRenderer>
                  </div>
                </div>
              </div>
            )}
            {responseString && (
              <div
                className={`flex flex-row gap-4 items-start`}
                id={`response-mock`}
              >
                <div
                  className={`w-12 h-12 bg-gray-800 flex flex-row items-center justify-center rounded-full font-bold`}
                >
                  AI
                </div>
                <div className={`flex flex-col gap-2`}>
                  <span className={`text-sm font-bold text-gray-100`}>
                    Clyde
                  </span>
                  {/* <span className={`text-gray-100 text-sm`}>
                    {message._getType() === "human"
                      ? "You asked"
                      : "I answered"}
                  </span> */}
                  <div className={`bg-gray-900 p-4 rounded-3xl`}>
                    <MarkdownRenderer>{responseString}</MarkdownRenderer>
                  </div>
                </div>
              </div>
            )}
            <span className={`h-1 opacity-0`} id="tagger">Tagger</span>
          </div>
        </div>
        <div className={`flex flex-row gap-4 items-center relative z-30`}>
          <span
            className={`absolute top-0 left-0 ${
              typing ? `translate-y-[-150%]` : `translate-y-full opacity-0`
            } bg-gray-900 opacity-50 rounded-3xl flex flex-row gap-2 items-center justify-center transition-all`}
          >
            <div className={`w-2 h-2 bg-purple-500 rounded-full`}>
              <div
                className={`w-full h-full bg-purple-500 animate-ping ${
                  !typing && `hidden`
                }`}
              ></div>
            </div>
            <span className={`text-xs font-medium text-gray-100`}>
              Clyde is typing...
            </span>
          </span>
          <TextBox
            placeholder={`Ask a question`}
            className={`w-full`}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onClick();
              }
            }}
          ></TextBox>

          <button
            className={`bg-indigo-500 rounded-2xl px-6 p-2 whitespace-nowrap disabled:opacity-50`}
            onClick={() => {
              onClick();
            }}
            disabled={typing}
          >
            <span className={`text-lg font-bold text-gray-100`}>
              <PaperAirplaneIcon className={`w-6 h-6`} />
            </span>
          </button>
        </div>
      </div>
    </SidebarLayout>
  );
};
export default AdvisorPage;
