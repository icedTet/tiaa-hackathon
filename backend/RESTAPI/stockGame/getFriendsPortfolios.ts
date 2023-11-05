import stockGameDates from "../../dates";
import { RESTHandler, RESTMethods } from "../../server";
import { FriendsManager } from "../../utils/handlers/FriendsManager";
import { StockGame } from "../../utils/handlers/StockGame";

export const getCurrentGamePortfolio = {
  path: "/stockGame/user/@friends/portfolio",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next, user) => {
    if (!user?._id) return res.status(400).json({ error: "Missing user ID" });
    let userID = user._id;
    const friends = await FriendsManager.getFriends(userID);
    const friendIDs = friends?.friends.map((friend) => friend.userID);
    const userData = await StockGame.getCurrentPortfolio(userID);
    if (!userData?.simulationTime) {
      return res.status(400).json({ error: "Invalid time" });
    }

    const resultData = {} as any;
    for (const friendID of friendIDs!) {
      const friendData = await StockGame.getPortfolioAtDate(
        friendID,
        userData?.simulationTime
      );
      resultData[friendID] = friendData;
    }
    res.send(resultData);
  },
} as RESTHandler;
export default getCurrentGamePortfolio;
