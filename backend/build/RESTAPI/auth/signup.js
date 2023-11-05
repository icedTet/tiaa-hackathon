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
exports.signup = void 0;
const server_1 = require("../../server");
const SignupsManager_1 = require("../../utils/handlers/SignupsManager");
exports.signup = {
    path: "/signup",
    method: server_1.RESTMethods.POST,
    sendUser: false,
    run: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, email, password, firstName, lastName } = req.body;
        const signupResponse = yield SignupsManager_1.SignupsManager.signupStep1({
            username,
            email,
            password,
            firstName,
            lastName,
        }).catch((er) => ({ error: er.message }));
        if (signupResponse.error)
            return res.status(400).json(signupResponse);
        res.send(signupResponse);
    }),
};
exports.default = exports.signup;
