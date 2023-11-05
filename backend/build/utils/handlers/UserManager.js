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
exports.getUserFromAuthHeader = exports.UserManager = void 0;
const mongodb_1 = require("mongodb");
const EncryptionsHandler_1 = require("./EncryptionsHandler");
class UserManager {
    static getUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongodb_1.ObjectId.isValid(userID) === false)
                return null;
            const user = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("user").findOne({ _id: new mongodb_1.ObjectId(userID) }));
            if (!user)
                return null;
            return Object.assign(Object.assign({}, user), { _id: user._id.toString() });
        });
    }
    static getUsers(userIDs) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("user").find({ _id: { $in: userIDs.map((id) => new mongodb_1.ObjectId(id)) } }).toArray());
            if (!users)
                return null;
            return users.map((user) => (Object.assign(Object.assign({}, user), { _id: user._id.toString() })));
        });
    }
    static getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("user").findOne({ username }));
            if (!user)
                return null;
            return Object.assign(Object.assign({}, user), { _id: user._id.toString() });
        });
    }
    static cleanUser(user) {
        var _a;
        return {
            _id: (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString(),
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            name: user.name,
            profilePicture: user.profilePicture,
            bio: user.bio,
        };
    }
    static getUserByEmailAddress(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("user").findOne({ email }));
            if (!user)
                return null;
            return Object.assign(Object.assign({}, user), { _id: user._id.toString() });
        });
    }
    static userSearch(query, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("user").find({
                $or: [
                    { username: { $regex: query, $options: "i" } },
                    { name: { $regex: query, $options: "i" } },
                ],
            }).limit(limit || 10).toArray());
            if (!users)
                return null;
            return users.map((user) => (Object.assign(Object.assign({}, user), { _id: user._id.toString() })));
        });
    }
}
exports.UserManager = UserManager;
const getUserFromAuthHeader = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const authStr = req.headers.authorization || "";
    const authSplit = authStr.split(" ");
    if (authSplit.length !== 2)
        return null;
    const [key, accessToken] = authSplit;
    if (key !== "Bearer")
        return null;
    const userID = yield EncryptionsHandler_1.Encryptions.getUserIDFromAccessToken(accessToken);
    if (!userID)
        return null;
    const user = yield UserManager.getUser(userID);
    if (!user)
        return null;
    return user;
});
exports.getUserFromAuthHeader = getUserFromAuthHeader;
