import { RESTHandler, RESTMethods } from "../../server";
import { StockGame } from "../../utils/handlers/StockGame";

export const getCurrentGameData = {
  path: "/stockGame/user/:userID/currentGameData",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next, user) => {
    if (!req.params.userID)
      return res.status(400).json({ error: "Missing user ID" });
    let userID = req.params.userID;
    if (userID === "@me") {
      if (!user?._id) return res.status(401).json({ error: "Unauthorized" });
      userID = user._id;
    }
    const gameData = await StockGame.getUserGameData(userID);
    res.send(gameData);
  },
} as RESTHandler;
export default getCurrentGameData;
