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
exports.getCurrentGameData = void 0;
const server_1 = require("../../server");
const StockGame_1 = require("../../utils/handlers/StockGame");
exports.getCurrentGameData = {
    path: "/stockGame/user/:userID/currentGameData",
    method: server_1.RESTMethods.GET,
    sendUser: true,
    run: (req, res, next, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.params.userID)
            return res.status(400).json({ error: "Missing user ID" });
        let userID = req.params.userID;
        if (userID === "@me") {
            if (!(user === null || user === void 0 ? void 0 : user._id))
                return res.status(401).json({ error: "Unauthorized" });
            userID = user._id;
        }
        const gameData = yield StockGame_1.StockGame.getUserGameData(userID);
        res.send(gameData);
    }),
};
exports.default = exports.getCurrentGameData;
