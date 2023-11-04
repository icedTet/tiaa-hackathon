import { RESTHandler, RESTMethods } from "../../../server";
import { FriendsManager } from "../../../utils/handlers/FriendsManager";
import { UserManager } from "../../../utils/handlers/UserManager";

export const getFriendRequest = {
  path: "/friends/requests/",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next, user) => {
    if (!user || !user._id)
      return res.status(401).json({ error: "Unauthorized" });
    const friendRequestsSent = await FriendsManager.getFriendRequestsSent(
      user._id
    );
    const friendRequestsReceived =
      await FriendsManager.getFriendRequestsReceived(user._id);
    const users = await UserManager.getUsers([
      ...friendRequestsSent.map((friendRequest) => friendRequest.receiverID),
      ...friendRequestsReceived.map((friendRequest) => friendRequest.senderID),
    ]).then((users) => (users ? users.map(UserManager.cleanUser) : null));
    return res.json({
      success: true,
      friendRequestsSent,
      friendRequestsReceived,
      users,
    });
  },
} as RESTHandler;
export default getFriendRequest;
