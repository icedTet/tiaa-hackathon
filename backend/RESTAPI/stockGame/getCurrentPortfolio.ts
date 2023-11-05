import stockGameDates  from "../../dates";
import { RESTHandler, RESTMethods } from "../../server";
import { StockGame } from "../../utils/handlers/StockGame";

export const getCurrentGamePortfolio = {
  path: "/stockGame/user/:userID/portfolio",
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

    // check if specific time is requested
    if (req.query.date) {
      const time = stockGameDates.find((date) => date === req.query.date);
      if (!time) {
        return res.status(400).json({ error: "Invalid time" });
      }
      const gameData = await StockGame.getPortfolioAtDate(
        userID,
        StockGame.simulationTimeToDate(time)
      );
      return res.send(gameData);
    }
    const gameData = await StockGame.getCurrentPortfolio(userID);
    res.send(gameData);
  },
} as RESTHandler;
export default getCurrentGamePortfolio;
