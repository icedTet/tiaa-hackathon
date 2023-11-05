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
exports.login = void 0;
const server_1 = require("../../server");
const EncryptionsHandler_1 = require("../../utils/handlers/EncryptionsHandler");
const UserManager_1 = require("../../utils/handlers/UserManager");
exports.login = {
    path: "/login",
    method: server_1.RESTMethods.POST,
    sendUser: false,
    run: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if request has the required parameters
        if (!req.body.email || !req.body.password)
            return res.status(400).json({ error: "Missing parameters" });
        try {
            // Check if there is a user with the given email address
            const user = yield UserManager_1.UserManager.getUserByEmailAddress(req.body.email);
            // If there is no user, return an error
            if (!user)
                return res.status(401).json({ error: "Invalid credentials" });
            // Verify that the password matches the stored hash
            const isVerified = yield EncryptionsHandler_1.EncryptionHasher.verifyPassword(req.body.password, user.password);
            // If the password doesn't match, return an error
            if (!isVerified)
                return res.status(401).json({ error: "Invalid credentials" });
            // Issue a JWT token for the user
            const token = yield EncryptionsHandler_1.Encryptions.issueUserAccessToken(user._id);
            // Return success and the token
            return res.json({ success: true, token });
        }
        catch (er) {
            // Return error
            return res.status(400).json({ error: er.message });
        }
    }),
};
exports.default = exports.login;
