import { RESTHandler, RESTMethods } from "../../../server";
import { UserManager } from "../../../utils/handlers/UserManager";

export const searchForFriends = {
  path: "/users/@search",
  method: RESTMethods.GET,
  sendUser: false,
  run: async (req, res, next) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Missing query" });
    const users = await UserManager.userSearch(q as string, 11).then((users) =>
      users?.map((user) => UserManager.cleanUser(user))
    );
    res.send(users);
  },
} as RESTHandler;
export default searchForFriends;
