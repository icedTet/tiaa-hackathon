import { RESTHandler, RESTMethods } from "../../../server";
import { FriendsManager } from "../../../utils/handlers/FriendsManager";

export const getFriends = {
  path: "/users/:userID/friends",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next, user) => {
    let userID = req.params.userID;
    if (!userID) return res.status(400).json({ error: "Missing user ID" });
    if (userID === "@me") {
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      userID = user._id!;
    }
    const friends = await FriendsManager.getFriends(userID);
    if (!friends) return res.status(200).json({ userID: userID, friends: [] });
    res.send(friends);
  },
} as RESTHandler;
export default getFriends;
