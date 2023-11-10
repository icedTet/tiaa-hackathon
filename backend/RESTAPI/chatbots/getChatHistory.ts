import { BaseMessage } from "langchain/dist/schema";
import { RESTHandler, RESTMethods } from "../../server";
import { AIQuestionsHelper } from "../../utils/handlers/AIQuestionsHelper";
import { AIManager } from "../../utils/handlers/AIQuestionsThing";

export const getChatHistory = {
  path: "/ai/session/:sessionID/history",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next, user) => {
    const sessionID = req.params.sessionID;
    if (!sessionID) return res.status(400).send("No session ID provided");
    const session = await AIManager.getInstance().getMemory(sessionID);
    if (!session) return res.status(404).send("Session not found");
    const history = session.history as BaseMessage[];
    res.send(
      history.map((m) => ({
        type: m._getType(),
        content: m.content,
      }))
    );
  },
} as RESTHandler;
export default getChatHistory;
