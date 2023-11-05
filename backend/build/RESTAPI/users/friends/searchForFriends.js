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
exports.searchForFriends = void 0;
const server_1 = require("../../../server");
const UserManager_1 = require("../../../utils/handlers/UserManager");
exports.searchForFriends = {
    path: "/users/@search",
    method: server_1.RESTMethods.GET,
    sendUser: false,
    run: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { q } = req.query;
        if (!q)
            return res.status(400).json({ error: "Missing query" });
        const users = yield UserManager_1.UserManager.userSearch(q, 11).then((users) => users === null || users === void 0 ? void 0 : users.map((user) => UserManager_1.UserManager.cleanUser(user)));
        res.send(users);
    }),
};
exports.default = exports.searchForFriends;
