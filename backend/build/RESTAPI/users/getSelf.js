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
exports.getSelf = void 0;
const server_1 = require("../../server");
exports.getSelf = {
    path: "/users/@me",
    method: server_1.RESTMethods.GET,
    sendUser: true,
    run: (req, res, next, user) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        res.send(Object.assign(Object.assign({}, user), { _id: (_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString(), password: undefined }));
    }),
};
exports.default = exports.getSelf;
