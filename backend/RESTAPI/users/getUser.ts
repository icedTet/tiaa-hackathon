import { RESTHandler, RESTMethods } from "../../server";
import { UserManager } from "../../utils/handlers/UserManager";

export const getUser = {
  path: "/users/:userID",
  method: RESTMethods.GET,
  sendUser: false,
  run: async (req, res, next) => {
    const userID = req.params.userID;

    const user = await UserManager.getUser(userID);

    if (!user) {
      if (next) {
        return next();
      }
      return res.status(404).send("User not found");
    }

    const cleanedUser = UserManager.cleanUser(user);

    res.send(cleanedUser);
  },
} as RESTHandler;
export default getUser;
