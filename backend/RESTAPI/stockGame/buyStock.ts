import stockGameDates  from "../../dates";
import { RESTHandler, RESTMethods } from "../../server";
import { StockDatabase } from "../../utils/handlers/StockDatabase";
import { StockGame } from "../../utils/handlers/StockGame";

export const getCurrentGamePortfolio = {
  path: "/stockGame/user/@me/portfolio/buy",
  method: RESTMethods.POST,
  sendUser: true,
  run: async (req, res, next, user) => {
    const { stockID, amount } = req.body;
    if (!stockID) return res.status(400).json({ error: "Missing stock ID" });
    if (!amount) return res.status(400).json({ error: "Missing amount" });
    if (!user?._id) return res.status(401).json({ error: "Unauthorized" });
    const gameData = await StockGame.getCurrentPortfolio(user._id);
    const timePeriod = gameData?.simulationTime;
    const portfolio = await StockGame.getCurrentPortfolio(user._id);
    const cash = portfolio?.money;
    const stock = await StockDatabase.getInstance().getCurrentStockMarketPrice(
      stockID,
      StockGame.dateToSimulationTime(timePeriod!)
    );
    if (!stock) return res.status(400).json({ error: "Stock not found" });
    if (stock * amount > cash!)
      return res.status(400).json({ error: "Not enough money" });
    const success = await StockGame.buyStock(user._id, stockID, amount);

    res.send(success);
  },
} as RESTHandler;
export default getCurrentGamePortfolio;
