import { RESTHandler, RESTMethods } from "../../server";
import { UserManager } from "../../utils/handlers/UserManager";

export const getUserByUsername = {
  path: "/users/@username/:username",
  method: RESTMethods.GET,
  sendUser: false,
  run: async (req, res, next) => {
    const { username } = req.params;
    const user = await UserManager.getUserByUsername(username);
    if (!user) return res.status(404).send("User not found");
    res.send(UserManager.cleanUser(user));
  },
} as RESTHandler;
export default getUserByUsername;
