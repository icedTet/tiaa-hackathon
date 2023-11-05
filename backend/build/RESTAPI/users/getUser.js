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
exports.getUser = void 0;
const server_1 = require("../../server");
const UserManager_1 = require("../../utils/handlers/UserManager");
exports.getUser = {
    path: "/users/:userID",
    method: server_1.RESTMethods.GET,
    sendUser: false,
    run: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userID = req.params.userID;
        const user = yield UserManager_1.UserManager.getUser(userID);
        if (!user) {
            if (next) {
                return next();
            }
            return res.status(404).send("User not found");
        }
        const cleanedUser = UserManager_1.UserManager.cleanUser(user);
        res.send(cleanedUser);
    }),
};
exports.default = exports.getUser;
