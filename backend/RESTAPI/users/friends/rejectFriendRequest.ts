import { RESTHandler, RESTMethods } from "../../../server";
import { FriendsManager } from "../../../utils/handlers/FriendsManager";
import { UserManager } from "../../../utils/handlers/UserManager";

export const rejectFriendRequest = {
  path: "/friends/requests/:requestID/reject",
  method: RESTMethods.POST,
  sendUser: true,
  run: async (req, res, next, user) => {
    const requestID = req.params.requestID;
    if (!requestID)
      return res.status(400).json({ error: "Missing friend request ID" });
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const friendRequest = await FriendsManager.getExistingFriendRequest(requestID);
    if (!friendRequest)
      return res.status(404).json({ error: "Friend request not found" });
    if (friendRequest.receiverID !== user._id)
      return res.status(400).json({ error: "You are not the receiver of this friend request" });
    const friend = await FriendsManager.rejectFriendRequest(requestID);
    if (!friend)
      return res.status(400).json({ error: "Failed to reject friend request" });
    return res.json({ success: true, friend });
  },
} as RESTHandler;
export default rejectFriendRequest;
