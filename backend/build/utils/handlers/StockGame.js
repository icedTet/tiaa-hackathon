"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockGame = void 0;
const mongodb_1 = require("mongodb");
const StockDatabase_1 = require("./StockDatabase");
const dates_1 = require("../../dates");
class StockGame {
    static dateToSimulationTime(date) {
        return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getUTCDate()}`.padStart(2, "0")}`;
    }
    static simulationTimeToDate(simulationTime) {
        const [year, month, day] = simulationTime.split("-").map(Number);
        return new Date(year, month, day);
    }
    static getCurrentPortfolio(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const userGameData = yield this.getUserGameData(userID);
            const portfolio = yield this.getPortfolioAtDate(userID, userGameData.currentDay);
            return portfolio;
        });
    }
    static getPortfolioAtDate(userID, date) {
        return __awaiter(this, void 0, void 0, function* () {
            // const userGameData = await this.getUserGameData(userID);
            const portfolio = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("StockGame").collection("portfolio").findOne({
                userID,
                simulationTime: date,
            }));
            return portfolio;
        });
    }
    static getUserGameData(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const gameData = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("StockGame").collection("gameData").findOne({ userID }));
            if (!gameData) {
                return (yield this.initializeUser(userID));
            }
            return gameData;
        });
    }
    static initializeUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("StockGame").collection("gameData").findOne({ userID }));
            if (user)
                return user;
            const gameData = {
                _id: new mongodb_1.ObjectId(),
                userID,
                currentDay: new Date(dates_1.stockGameDates[0]),
                nextAdvanceDay: Date.now() + 1000 * 60 * 60 * 23,
                advancesLeft: 34,
            };
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("StockGame").collection("gameData").insertOne(gameData));
            const initialPortfolio = {
                _id: new mongodb_1.ObjectId(),
                userID,
                simulationTime: new Date(dates_1.stockGameDates[0]),
                stocks: [],
                money: 10000,
            };
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("StockGame").collection("portfolio").updateOne({ userID, simulationTime: new Date(dates_1.stockGameDates[0]) }, { $set: initialPortfolio }, { upsert: true }));
            return gameData;
        });
    }
    static buyStock(userID, stockID, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const userGameData = yield this.getUserGameData(userID);
            const currentPortfolio = yield this.getPortfolioAtDate(userID, userGameData.currentDay);
            if (!currentPortfolio)
                throw new Error("No portfolio");
            const stockPrice = yield StockDatabase_1.StockDatabase.getInstance().getCurrentStockMarketPrice(stockID, StockGame.dateToSimulationTime(userGameData.currentDay));
            if (!stockPrice)
                throw new Error("No stock price");
            const totalCost = stockPrice * amount;
            if (totalCost > currentPortfolio.money)
                throw new Error("Not enough liquid funds! You need $" +
                    (totalCost - currentPortfolio.money) +
                    " more.");
            const newPortfolio = Object.assign(Object.assign({}, currentPortfolio), { money: currentPortfolio.money - totalCost, stocks: [
                    ...currentPortfolio.stocks,
                    {
                        stockID,
                        amount,
                        buyPrice: stockPrice,
                        boughtAt: userGameData.currentDay.valueOf(),
                    },
                ] });
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("StockGame").collection("portfolio").updateOne({ userID, simulationTime: userGameData.currentDay }, { $set: newPortfolio }, { upsert: true }));
            return newPortfolio;
        });
    }
    static sellStock(userID, stockID, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const userGameData = yield this.getUserGameData(userID);
            const currentPortfolio = yield this.getPortfolioAtDate(userID, userGameData.currentDay);
            if (!currentPortfolio)
                throw new Error("No portfolio");
            const stockPrice = yield StockDatabase_1.StockDatabase.getInstance().getCurrentStockMarketPrice(stockID, StockGame.dateToSimulationTime(userGameData.currentDay));
            if (!stockPrice)
                throw new Error("No stock price");
            const totalCost = stockPrice * amount;
            const newPortfolio = Object.assign(Object.assign({}, currentPortfolio), { money: currentPortfolio.money + totalCost, stocks: currentPortfolio.stocks.filter((x) => x.stockID !== stockID) });
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("StockGame").collection("portfolio").updateOne({ userID, simulationTime: userGameData.currentDay }, { $set: newPortfolio }, { upsert: true }));
            return newPortfolio;
        });
    }
    static advanceDay(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const userGameData = yield this.getUserGameData(userID);
            if (userGameData.advancesLeft <= 0 &&
                userGameData.nextAdvanceDay > Date.now())
                throw new Error("You are out of advances for the day! Please wait until tomorrow to advance again.");
            if (userGameData.nextAdvanceDay <= Date.now()) {
                userGameData.advancesLeft = 34;
                userGameData.nextAdvanceDay = Date.now() + 1000 * 60 * 60 * 23;
            }
            userGameData.advancesLeft--;
            const currentDay = StockGame.dateToSimulationTime(userGameData.currentDay);
            const nextDay = dates_1.stockGameDates[dates_1.stockGameDates.indexOf(currentDay) + 1];
            if (!nextDay)
                throw new Error("No next day");
            const newPortfolio = yield this.getPortfolioAtDate(userID, userGameData.currentDay);
            if (!newPortfolio)
                throw new Error("No portfolio");
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("StockGame").collection("portfolio").updateOne({ userID, simulationTime: StockGame.simulationTimeToDate(nextDay) }, { $set: newPortfolio }, { upsert: true }));
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("StockGame").collection("gameData").updateOne({ userID }, {
                $set: {
                    currentDay: StockGame.simulationTimeToDate(nextDay),
                    nextAdvanceDay: userGameData.nextAdvanceDay,
                    advancesLeft: userGameData.advancesLeft,
                },
            }));
            return this.getPortfolioAtDate(userID, StockGame.simulationTimeToDate(nextDay));
        });
    }
}
exports.StockGame = StockGame;
