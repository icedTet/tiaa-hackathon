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
exports.createFriendRequest = void 0;
const server_1 = require("../../../server");
const FriendsManager_1 = require("../../../utils/handlers/FriendsManager");
const UserManager_1 = require("../../../utils/handlers/UserManager");
exports.createFriendRequest = {
    path: "/friends/requests/create",
    method: server_1.RESTMethods.POST,
    sendUser: true,
    run: (req, res, next, user) => __awaiter(void 0, void 0, void 0, function* () {
        const { message, userID } = req.body;
        if (!userID)
            return res.status(400).json({ error: "Missing user to friend request" });
        if (!user)
            return res.status(401).json({ error: "Unauthorized" });
        if (user._id === userID)
            return res.status(400).json({ error: "Cannot friend yourself" });
        if (!(yield UserManager_1.UserManager.getUser(userID)))
            return res.status(404).json({ error: "User not found" });
        // check if there is already a friend request
        const existingFriendRequest = yield FriendsManager_1.FriendsManager.findFriendRequest(user._id, userID);
        if (existingFriendRequest) {
            return res.status(400).json({ error: "Friend request already exists" });
        }
        const friendRequest = yield FriendsManager_1.FriendsManager.sendFriendRequest(user._id, userID, message || "I would like to be your friend!");
        if (!friendRequest)
            return res.status(400).json({ error: "Failed to send friend request" });
        return res.json({ success: true, friendRequest });
    }),
};
exports.default = exports.createFriendRequest;
