import { RESTHandler, RESTMethods } from "../../../server";
import { FriendsManager } from "../../../utils/handlers/FriendsManager";
import { UserManager } from "../../../utils/handlers/UserManager";

export const getFriendRequest = {
  path: "/friends/requests/:requestID/",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next, user) => {
    const requestID = req.params.requestID;
    if (!requestID)
      return res.status(400).json({ error: "Missing friend request ID" });
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const friendRequest = await FriendsManager.getExistingFriendRequest(
      requestID
    );

    if (!friendRequest)
      return res.status(404).json({ error: "Friend request not found" });
    const users = await UserManager.getUsers([
      friendRequest.senderID,
      friendRequest.receiverID,
    ]).then((users) => (users ? users.map(UserManager.cleanUser) : null));
    if (
      friendRequest.senderID !== user._id &&
      friendRequest.receiverID !== user._id
    )
      return res.status(400).json({
        error: "You are not the receiver or sender of this friend request",
      });
    return res.json({ success: true, friendRequest, users });
  },
} as RESTHandler;
export default getFriendRequest;
