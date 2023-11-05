import { RESTMethods, RESTHandler } from "../../server";
import { AIQuestionsHelper } from "../../utils/handlers/AIQuestionsHelper";
import { UserManager } from "../../utils/handlers/UserManager";

export const homePage_bot = {
  path: "/aiquestion",
  method: RESTMethods.GET,
  sendUser: false,
  run: async (req, res, next, user) => {
    const question = req.query.question;
    const answer = await AIQuestionsHelper.getAnswer(question as string);
    res.send(answer);
  },
} as RESTHandler;
export default homePage_bot;
