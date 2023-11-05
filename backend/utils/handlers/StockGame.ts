import { ObjectId } from "mongodb";
import { StockDatabase } from "./StockDatabase";
import stockGameDates  from "../../dates";
export class StockGame {
  static dateToSimulationTime(date: Date) {
    return `${date.getUTCFullYear()}-${`${date.getUTCMonth() + 1}`.padStart(
      2,
      "0"
    )}-${`${date.getUTCDate()}`.padStart(2, "0")}`;
  }
  static simulationTimeToDate(simulationTime: string) {
    const [year, month, day] = simulationTime.split("-").map(Number);
    const date = new Date();
    date.setUTCFullYear(year);
    date.setUTCMonth(month - 1);
    date.setUTCDate(day);
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
  }
  static async getCurrentPortfolio(userID: string) {
    const userGameData = await this.getUserGameData(userID);
    const portfolio = await this.getPortfolioAtDate(
      userID,
      userGameData.currentDay
    );
    return portfolio;
  }
  static async getPortfolioTimeSeries(userID: string) {
    const userGameData = await this.getUserGameData(userID);
    const portfolio = await MongoDB?.db("StockGame")
      .collection("portfolio")
      .find({
        userID,
      })
      .toArray();
    return portfolio as StockGameUserTimeStamp[];
  }
  static async getPortfolioAtDate(userID: string, date: Date) {
    // const userGameData = await this.getUserGameData(userID);
    const portfolio = await MongoDB?.db("StockGame")
      .collection("portfolio")
      .findOne({
        userID,
        simulationTime: date,
      });
    return portfolio as StockGameUserTimeStamp | null;
  }
  static async getUserGameData(userID: string) {
    const gameData = await MongoDB?.db("StockGame")
      .collection("gameData")
      .findOne({ userID });
    if (!gameData) {
      return (await this.initializeUser(userID)) as StockGameUserData;
    }
    return gameData as StockGameUserData;
  }
  static async initializeUser(userID: string) {
    const user = await MongoDB?.db("StockGame")
      .collection("gameData")
      .findOne({ userID });
    if (user) return user;
    const gameData = {
      _id: new ObjectId(),
      userID,
      currentDay: new Date(stockGameDates[0]),
      nextAdvanceDay: Date.now() + 1000 * 60 * 60 * 23,
      advancesLeft: 34,
    } as StockGameUserData;
    await MongoDB?.db("StockGame").collection("gameData").updateOne(
      { userID },
      {
        $set: gameData,
      },
      { upsert: true }
    );
    const initialPortfolio = {
      _id: new ObjectId(),
      userID,
      simulationTime: new Date(stockGameDates[0]),
      stocks: [],
      money: 100000,
    } as StockGameUserTimeStamp;
    await MongoDB?.db("StockGame")
      .collection("portfolio")
      .updateOne(
        { userID, simulationTime: new Date(stockGameDates[0]) },
        { $set: initialPortfolio },
        { upsert: true }
      );

    return gameData;
  }

  static async buyStock(userID: string, stockID: string, amount: number) {
    const userGameData = await this.getUserGameData(userID);
    const currentPortfolio = await this.getPortfolioAtDate(
      userID,
      userGameData.currentDay
    );
    if (!currentPortfolio) throw new Error("No portfolio");
    const stockPrice =
      await StockDatabase.getInstance().getCurrentStockMarketPrice(
        stockID,
        StockGame.dateToSimulationTime(userGameData.currentDay)
      );
    if (!stockPrice) throw new Error("No stock price");

    const totalCost = stockPrice * amount;
    if (totalCost > currentPortfolio.money)
      throw new Error(
        "Not enough liquid funds! You need $" +
          (totalCost - currentPortfolio.money) +
          " more."
      );
    const newPortfolio = {
      ...currentPortfolio,
      money: currentPortfolio.money - totalCost,
      stocks: [
        ...currentPortfolio.stocks,
        {
          stockID,
          amount,
          buyPrice: stockPrice,
          boughtAt: userGameData.currentDay.valueOf(),
        },
      ],
    };
    await MongoDB?.db("StockGame")
      .collection("portfolio")
      .updateOne(
        { userID, simulationTime: userGameData.currentDay },
        { $set: newPortfolio },
        { upsert: true }
      );
    return newPortfolio;
  }
  static async sellStock(userID: string, stockID: string, amount: number) {
    const userGameData = await this.getUserGameData(userID);
    const currentPortfolio = await this.getPortfolioAtDate(
      userID,
      userGameData.currentDay
    );
    if (!currentPortfolio) throw new Error("No portfolio");
    const stockPrice =
      await StockDatabase.getInstance().getCurrentStockMarketPrice(
        stockID,
        StockGame.dateToSimulationTime(userGameData.currentDay)
      );
    if (!stockPrice) throw new Error("No stock price");

    const totalCost = stockPrice * amount;
    const stocks = currentPortfolio?.stocks
      .filter((stock) => stock.stockID === stockID)
      .sort((a, b) => a.boughtAt - b.boughtAt);
    const otherStocks = currentPortfolio?.stocks
      .filter((stock) => stock.stockID !== stockID)
      .sort((a, b) => a.boughtAt - b.boughtAt);
    // remove stocks from the oldest to the newest
    let required = amount;
    console.log("Current stocks", stocks);
    while (required > 0) {
      const stock = stocks?.shift();
      if (!stock) throw new Error("Not enough stocks");
      if (stock.amount > required) {
        stock.amount -= required;
        required = 0;
        console.log("Pushing stock", stock);
        stocks?.unshift(stock);
      } else {
        console.log("Removing stock", stock, stock.amount, required);
        required -= stock.amount;
      }
    }
    console.log("New stocks", stocks);
    const newPortfolio = {
      ...currentPortfolio,
      money: currentPortfolio.money + totalCost,
      stocks: [...otherStocks!, ...stocks!] as StockGameStock[],
    };
    await MongoDB?.db("StockGame")
      .collection("portfolio")
      .updateOne(
        { userID, simulationTime: userGameData.currentDay },
        { $set: newPortfolio },
        { upsert: true }
      );
    return newPortfolio;
  }
  static async advanceDay(userID: string) {
    const userGameData = await this.getUserGameData(userID);
    if (
      userGameData.advancesLeft <= 0 &&
      userGameData.nextAdvanceDay > Date.now()
    )
      throw new Error(
        "You are out of advances for the day! Please wait until tomorrow to advance again."
      );
    if (userGameData.nextAdvanceDay <= Date.now()) {
      userGameData.advancesLeft = 34;
      userGameData.nextAdvanceDay = Date.now() + 1000 * 60 * 60 * 23;
    }
    userGameData.advancesLeft--;
    const currentDay = StockGame.dateToSimulationTime(userGameData.currentDay);
    const nextDay = stockGameDates[stockGameDates.indexOf(currentDay) + 1];
    if (!nextDay) throw new Error("No next day");
    const newPortfolio = await this.getPortfolioAtDate(
      userID,
      userGameData.currentDay
    );
    if (!newPortfolio) throw new Error("No portfolio");
    await MongoDB?.db("StockGame")
      .collection("portfolio")
      .insertOne(
        {
          ...newPortfolio,
          _id: new ObjectId(),
          userID,
          simulationTime: StockGame.simulationTimeToDate(nextDay),
        },
        {}
      );
    await MongoDB?.db("StockGame")
      .collection("gameData")
      .updateOne(
        { userID },
        {
          $set: {
            currentDay: StockGame.simulationTimeToDate(nextDay),
            nextAdvanceDay: userGameData.nextAdvanceDay,
            advancesLeft: userGameData.advancesLeft,
          },
        }
      );
    return this.getPortfolioAtDate(
      userID,
      StockGame.simulationTimeToDate(nextDay)
    );
  }
}

export type StockGameUserTimeStamp = {
  _id?: ObjectId | string;
  userID: string;
  simulationTime: Date;
  stocks: StockGameStock[];
  money: number;
};
export type StockGameStock = {
  stockID: string;
  amount: number;
  buyPrice: number;
  boughtAt: number;
};
export type StockGameUserData = {
  _id?: ObjectId | string;
  userID: string;
  currentDay: Date;
  nextAdvanceDay: number;
  advancesLeft: number;
};
