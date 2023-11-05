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
exports.acceptFriendRequest = void 0;
const server_1 = require("../../../server");
const FriendsManager_1 = require("../../../utils/handlers/FriendsManager");
exports.acceptFriendRequest = {
    path: "/friends/requests/:requestID/accept",
    method: server_1.RESTMethods.POST,
    sendUser: true,
    run: (req, res, next, user) => __awaiter(void 0, void 0, void 0, function* () {
        const requestID = req.params.requestID;
        if (!requestID)
            return res.status(400).json({ error: "Missing friend request ID" });
        if (!user)
            return res.status(401).json({ error: "Unauthorized" });
        const friendRequest = yield FriendsManager_1.FriendsManager.getExistingFriendRequest(requestID);
        if (!friendRequest)
            return res.status(404).json({ error: "Friend request not found" });
        if (friendRequest.receiverID !== user._id)
            return res.status(400).json({ error: "You are not the receiver of this friend request" });
        const friend = yield FriendsManager_1.FriendsManager.acceptFriendRequest(requestID);
        if (!friend)
            return res.status(400).json({ error: "Failed to accept friend request" });
        return res.json({ success: true, friend });
    }),
};
exports.default = exports.acceptFriendRequest;
