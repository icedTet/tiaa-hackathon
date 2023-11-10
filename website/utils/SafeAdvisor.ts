import EventEmitter from "events";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory, MemoryVariables } from "langchain/memory";
import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { AIMessage, BaseMessage, HumanMessage } from "langchain/schema";
import { RunnableSequence } from "langchain/schema/runnable";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import { fetcher } from "./Fetcher";
import { apiDomain } from "../constants";
import { io } from "socket.io-client";

export type ChatMessage = {
  type: "human" | "ai";
  content: string;
};
export const useAI = () => {
  const [history, setHistory] = useState([] as ChatMessage[]);
  const [sessionID, setSessionID] = useState(
    undefined as string | undefined | null
  );
  const [typing, setTyping] = useState(false);
  const fetchingHist = useRef(false);
  const [responseString, setResponseString] = useState("");
  const getSession = useCallback(async () => {
    if (globalThis.localStorage) {
      const sessionID = localStorage.getItem("chatSessionID");
      if (sessionID) setSessionID(sessionID);
      else {
        fetcher(`${apiDomain}/ai/startSession`, {
          method: "POST",
        })
          .then((res) => res.text())
          .then((res) => {
            setSessionID(res);
            localStorage.setItem("chatSessionID", res);
          });
      }
    }
  }, []);
  useLayoutEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    if (!sessionID) return;
    if (history.length) return;
    if (fetchingHist.current) return;
    fetchingHist.current = true;
    fetcher(`${apiDomain}/ai/session/${sessionID}/history`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setHistory(res);
      })
      .catch(getSession);
  }, [sessionID, history]);
  const callMessage = useCallback(
    (question: string) => {
      return new Promise((resolve) => {
        if (!sessionID) return;
        if (typing) return;
        setTyping(true);
        setResponseString("");

        fetcher(`${apiDomain}/ai/session/${sessionID}/chat`, {
          method: "POST",
          body: JSON.stringify({
            message: question,
          }),
        })
          .then((res) => res.text())
          .then((eventID) => {
            let queue = [] as string[];
            const socket = io(`${apiDomain}`, {
              extraHeaders: {
                authorization: eventID,
              },
            });
            socket?.on(eventID, (message: string) => {
              queue.push(message);
              setResponseString(queue.join(""));
            });
            socket.on("disconnect", () => {
              socket.disconnect();
              setHistory((h) => [
                ...h,
                {
                  type: "human",
                  content: question,
                },
                {
                  type: "ai",
                  content: responseString,
                },
              ]);
              fetcher(`${apiDomain}/ai/session/${sessionID}/history`, {
                method: "GET",
              })
                .then((res) => res.json())
                .then((res) => {
                  setHistory(res);
                });
              setResponseString("");
              setTyping(false);
              resolve(0);
            });
          })
          .catch(getSession);
      });
    },
    [sessionID, typing]
  );
  return [history, sessionID, typing, responseString, callMessage] as [
    ChatMessage[],
    string | undefined | null,
    boolean,
    string,
    (question: string) => Promise<number>
  ];
};
