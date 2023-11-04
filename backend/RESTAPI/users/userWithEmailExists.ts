import { RESTMethods, RESTHandler } from "../../server";
import { UserManager } from "../../utils/handlers/UserManager";

export const emailExists = {
  path: "/users/@emailexists",
  method: RESTMethods.GET,
  sendUser: false,
  run: async (req, res, next) => {
    const email = req.query.email as string;
    const user = await UserManager.getUserByEmailAddress(email);
    res.send(user != null);
  },
} as RESTHandler;
export default emailExists;
