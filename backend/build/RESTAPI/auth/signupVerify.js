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
exports.verifyEmail = void 0;
const server_1 = require("../../server");
const EncryptionsHandler_1 = require("../../utils/handlers/EncryptionsHandler");
const SignupsManager_1 = require("../../utils/handlers/SignupsManager");
const UserManager_1 = require("../../utils/handlers/UserManager");
exports.verifyEmail = {
    path: "/signup/verify",
    method: server_1.RESTMethods.POST,
    sendUser: false,
    run: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if the request has the required parameters
        if (!req.body.code || !req.body.email)
            return res.status(400).json({ error: "Missing parameters" });
        try {
            // Verify the user's email address and complete the sign up process.
            yield SignupsManager_1.SignupsManager.signupStep2(req.body.code, req.body.email);
            // Get the user's ID
            const user = yield UserManager_1.UserManager.getUserByEmailAddress(req.body.email);
            if (!user || !user._id)
                throw new Error("User not found");
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
exports.default = exports.verifyEmail;
