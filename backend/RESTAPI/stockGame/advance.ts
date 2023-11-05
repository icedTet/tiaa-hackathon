import stockGameDates  from "../../dates";
import { RESTHandler, RESTMethods } from "../../server";
import { StockDatabase } from "../../utils/handlers/StockDatabase";
import { StockGame } from "../../utils/handlers/StockGame";

export const getCurrentGamePortfolio = {
  path: "/stockGame/user/@me/portfolio/advance",
  method: RESTMethods.POST,
  sendUser: true,
  run: async (req, res, next, user) => {
    if (!user?._id) return res.status(401).json({ error: "Unauthorized" });
    const gameData = await StockGame.advanceDay(user._id).catch((er) => ({
      error: er.message,
    }));
    if (
      (
        gameData as {
          error: string;
        }
      ).error
    )
      return res.status(400).json({
        error: true,
        message: (
          gameData as {
            error: string;
          }
        ).error,
      });
    console.log(gameData);
    res.send(gameData);
  },
} as RESTHandler;
export default getCurrentGamePortfolio;
