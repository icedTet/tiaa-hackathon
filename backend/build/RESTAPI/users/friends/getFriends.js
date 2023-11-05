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
exports.getFriends = void 0;
const server_1 = require("../../../server");
const FriendsManager_1 = require("../../../utils/handlers/FriendsManager");
const UserManager_1 = require("../../../utils/handlers/UserManager");
exports.getFriends = {
    path: "/users/:userID/friends",
    method: server_1.RESTMethods.GET,
    sendUser: true,
    run: (req, res, next, user) => __awaiter(void 0, void 0, void 0, function* () {
        let userID = req.params.userID;
        if (!userID)
            return res.status(400).json({ error: "Missing user ID" });
        if (userID === "@me") {
            if (!user)
                return res.status(401).json({ error: "Unauthorized" });
            userID = user._id;
        }
        const friends = yield FriendsManager_1.FriendsManager.getFriends(userID);
        const users = yield UserManager_1.UserManager.getUsers((friends === null || friends === void 0 ? void 0 : friends.friends.map((friend) => friend.userID)) || []).then((users) => (users ? users.map(UserManager_1.UserManager.cleanUser) : null));
        if (!friends)
            return res.status(200).json({ userID: userID, friends: [], users: [] });
        res.send(Object.assign(Object.assign({}, friends), { users }));
    }),
};
exports.default = exports.getFriends;
