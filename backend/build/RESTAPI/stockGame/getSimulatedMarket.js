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
exports.getCurrentGamePortfolio = void 0;
const dates_1 = require("../../dates");
const server_1 = require("../../server");
const StockDatabase_1 = require("../../utils/handlers/StockDatabase");
const StockGame_1 = require("../../utils/handlers/StockGame");
exports.getCurrentGamePortfolio = {
    path: "/stockGame/market",
    method: server_1.RESTMethods.GET,
    sendUser: true,
    run: (req, res, next, user) => __awaiter(void 0, void 0, void 0, function* () {
        let date = dates_1.stockGameDates.find((date) => date === req.query.date);
        if (!date) {
            if (user === null || user === void 0 ? void 0 : user._id) {
                const gameData = yield StockGame_1.StockGame.getUserGameData(user._id);
                date = StockGame_1.StockGame.dateToSimulationTime(gameData.currentDay);
            }
        }
        if (!date) {
            return res.status(400).json({ error: "Invalid time" });
        }
        console.log(date);
        const gameData = yield StockDatabase_1.StockDatabase.getInstance().getStockMarketPricesUpTo(date);
        // console.log(gameData);
        // convert Map<string,Map<string,number>> to Object
        const gameDataObj = {};
        gameData.forEach((value, key) => {
            const valueObj = {};
            value.forEach((value, key) => {
                valueObj[key] = value;
            });
            gameDataObj[key] = valueObj;
        });
        res.send(gameDataObj);
    }),
};
exports.default = exports.getCurrentGamePortfolio;
