import { RESTHandler, RESTMethods } from "../../../server";
import { FriendsManager } from "../../../utils/handlers/FriendsManager";
import { UserManager } from "../../../utils/handlers/UserManager";

export const createFriendRequest = {
  path: "/friends/requests/create",
  method: RESTMethods.POST,
  sendUser: true,
  run: async (req, res, next, user) => {
    const { message, userID } = req.body;
    if (!userID)
      return res.status(400).json({ error: "Missing user to friend request" });
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (user._id === userID)
      return res.status(400).json({ error: "Cannot friend yourself" });
    if (!(await UserManager.getUser(userID)))
      return res.status(404).json({ error: "User not found" });
    // check if there is already a friend request
    const existingFriendRequest = await FriendsManager.findFriendRequest(
      user._id!,
      userID
    );
    if (existingFriendRequest) {
      return res.status(400).json({ error: "Friend request already exists" });
    }
    const friendRequest = await FriendsManager.sendFriendRequest(
      user._id!,
      userID,
      message || "I would like to be your friend!"
    );
    if (!friendRequest)
      return res.status(400).json({ error: "Failed to send friend request" });
    return res.json({ success: true, friendRequest });
  },
} as RESTHandler;
export default createFriendRequest;
