import { RESTHandler, RESTMethods } from "../../server";
import { AIQuestionsHelper } from "../../utils/handlers/AIQuestionsHelper";
import { AIManager } from "../../utils/handlers/AIQuestionsThing";

export const startSession = {
  path: "/ai/startSession",
  method: RESTMethods.POST,
  sendUser: true,
  run: async (req, res, next, user) => {
    const session = await AIManager.getInstance().startSession();
    res.send(session);
  },
} as RESTHandler;
export default startSession;
