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
exports.FriendsManager = void 0;
const mongodb_1 = require("mongodb");
class FriendsManager {
    static sendFriendRequest(senderID, receiverID, message = "I want to be your friend!") {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                _id: new mongodb_1.ObjectId(),
                senderID,
                receiverID,
                createdAt: new Date(),
                message,
            };
            if ((_a = (yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friendRequests").insertOne(req)))) === null || _a === void 0 ? void 0 : _a.acknowledged) {
                return req;
            }
            return null;
        });
    }
    static findFriendRequest(senderID, receiverID) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friendRequests").findOne({ senderID, receiverID }));
            return request;
        });
    }
    static getExistingFriendRequest(requestID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(requestID))
                return null;
            const request = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friendRequests").findOne({ _id: new mongodb_1.ObjectId(requestID) }));
            return request;
        });
    }
    static getFriendRequestsSent(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friendRequests").find({ senderID: userID }).toArray());
            return requests;
        });
    }
    static getFriendRequestsReceived(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friendRequests").find({ receiverID: userID }).toArray());
            return requests;
        });
    }
    static getFriends(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const friends = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friends").findOne({ userID }));
            if (!friends)
                return null;
            return friends;
        });
    }
    static addFriend(user, userIDToAdd) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if user is already friends with userIDToAdd
            const friends = yield this.getFriends(user);
            if (friends === null || friends === void 0 ? void 0 : friends.friends.find((f) => f.userID === userIDToAdd))
                return null;
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friends").updateOne({ userID: user }, {
                $push: { friends: { userID: userIDToAdd, friendsSince: Date.now() } },
            }, { upsert: true }));
            return friends;
        });
    }
    static removeFriend(user, userIDToRemove) {
        return __awaiter(this, void 0, void 0, function* () {
            const friends = yield this.getFriends(user);
            if (!(friends === null || friends === void 0 ? void 0 : friends.friends.find((f) => f.userID === userIDToRemove)))
                return null;
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friends").updateOne({ userID: user }, { $pull: { friends: { userID: userIDToRemove } } }));
            return friends;
        });
    }
    static acceptFriendRequest(requestID) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friendRequests").findOne({ _id: new mongodb_1.ObjectId(requestID) }));
            if (!request)
                return null;
            this.addFriend(request.senderID, request.receiverID);
            this.addFriend(request.receiverID, request.senderID);
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friendRequests").deleteOne({ _id: new mongodb_1.ObjectId(requestID) }));
            return request;
        });
    }
    static rejectFriendRequest(requestID) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friendRequests").findOne({ _id: new mongodb_1.ObjectId(requestID) }));
            if (!request)
                return null;
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friendRequests").deleteOne({ _id: new mongodb_1.ObjectId(requestID) }));
            return request;
        });
    }
    static cancelFriendRequest(requestID) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friendRequests").findOne({ _id: new mongodb_1.ObjectId(requestID) }));
            if (!request)
                return null;
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("friendRequests").deleteOne({ _id: new mongodb_1.ObjectId(requestID) }));
            return request;
        });
    }
}
exports.FriendsManager = FriendsManager;
