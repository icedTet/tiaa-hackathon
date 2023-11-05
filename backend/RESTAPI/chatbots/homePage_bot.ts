import { UserManager } from "../../utils/handlers/UserManager";
import { RESTHandler, RESTMethods } from "../server";

export const homePage_bot = {
  path: "/homePage_bot",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next,user) => {
    res.send(user);
  },
} as RESTHandler;
export default homePage_bot;