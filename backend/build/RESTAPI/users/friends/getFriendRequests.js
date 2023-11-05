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
exports.getFriendRequest = void 0;
const server_1 = require("../../../server");
const FriendsManager_1 = require("../../../utils/handlers/FriendsManager");
const UserManager_1 = require("../../../utils/handlers/UserManager");
exports.getFriendRequest = {
    path: "/friends/requests/",
    method: server_1.RESTMethods.GET,
    sendUser: true,
    run: (req, res, next, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user || !user._id)
            return res.status(401).json({ error: "Unauthorized" });
        const friendRequestsSent = yield FriendsManager_1.FriendsManager.getFriendRequestsSent(user._id);
        const friendRequestsReceived = yield FriendsManager_1.FriendsManager.getFriendRequestsReceived(user._id);
        const users = yield UserManager_1.UserManager.getUsers([
            ...friendRequestsSent.map((friendRequest) => friendRequest.receiverID),
            ...friendRequestsReceived.map((friendRequest) => friendRequest.senderID),
        ]).then((users) => (users ? users.map(UserManager_1.UserManager.cleanUser) : null));
        return res.json({
            success: true,
            friendRequestsSent,
            friendRequestsReceived,
            users,
        });
    }),
};
exports.default = exports.getFriendRequest;
