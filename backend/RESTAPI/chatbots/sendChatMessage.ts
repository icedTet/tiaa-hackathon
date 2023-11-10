import { BaseMessage } from "langchain/dist/schema";
import { RESTHandler, RESTMethods } from "../../server";
import { AIQuestionsHelper } from "../../utils/handlers/AIQuestionsHelper";
import { AIManager } from "../../utils/handlers/AIQuestionsThing";

export const sendChatMessage = {
  path: "/ai/session/:sessionID/chat",
  method: RESTMethods.POST,
  sendUser: true,
  run: async (req, res, next, user) => {
    const sessionID = req.params.sessionID;
    const message = req.body.message;
    if (!sessionID) return res.status(400).send("No session ID provided");
    const eventID = await AIManager.getInstance().getAnswer(sessionID, message);
    if (!eventID) return res.status(404).send("Session not found");
    res.send(eventID);
    let queue = [] as string[];
    let end = false;
    AIManager.getInstance().on(
      eventID,
      (answer: { eventID: string; message: string }) => {
        queue.push(answer.message);
        console.log("Got answer", answer);
      }
    );
    AIManager.getInstance().on(`${eventID}-end`, () => {
      end = true;
    });
    while (!Socketeer.get(eventID)) {
      console.log("Waiting for socket");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log("Socket found");
    const socket = Socketeer.get(eventID);
    while (!end || queue.length) {
      if (queue.length > 0) {
        console.log("Sending message", queue[0]);
        socket?.emit(`${eventID}`, queue.shift());
      }
      await new Promise((resolve) => setTimeout(resolve, 4));
    }
    socket?.disconnect();
  },
} as RESTHandler;
export default sendChatMessage;
