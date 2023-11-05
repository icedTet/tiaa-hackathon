import stockGameDates  from "../../dates";
import { RESTHandler, RESTMethods } from "../../server";
import { StockDatabase } from "../../utils/handlers/StockDatabase";
import { StockGame } from "../../utils/handlers/StockGame";

export const getCurrentGamePortfolio = {
  path: "/stockGame/market",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next, user) => {
    let date = stockGameDates.find((date) => date === req.query.date);
    if (!date) {
      if (user?._id) {
        const gameData = await StockGame.getUserGameData(user._id);
        date = StockGame.dateToSimulationTime(gameData.currentDay);
        console.log({current:gameData.currentDay});
      }
    }
    if (!date) {
      return res.status(400).json({ error: "Invalid time" });
    }
    console.log({date});
    const gameData = await StockDatabase.getInstance().getStockMarketPricesUpTo(
      date
    );
    // console.log(gameData);
    // convert Map<string,Map<string,number>> to Object
    const gameDataObj = {} as any;
    gameData.forEach((value, key) => {
      const valueObj = {} as any;
      value.forEach((value, key) => {
        valueObj[key] = value;
      });
      gameDataObj[key] = valueObj;
    });
    res.send(gameDataObj);
  },
} as RESTHandler;
export default getCurrentGamePortfolio;
