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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionHasher = exports.Encryptions = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
class Encryptions {
    /**
     * Signs a payload with the JWT secret
     * @param {string|object|Buffer} payload
     * @param {string|number} expiresIn - The time until the token expires (eg. 1h, 1d, 1y) or a timestamp
     * @return {Promise<String>}
     */
    static encrypt(payload, expiresIn) {
        if (!process.env.JWT_SECRET)
            throw new Error("JWT_SECRET not set");
        return new Promise((res, rej) => jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            algorithm: "RS512",
            expiresIn: expiresIn || "14d",
            issuer: "finapp",
        }, (er, encrypted) => (er ? rej(er) : res(encrypted))));
    }
    /**
     * Decrypts a payload with the JWT secret
     * @param {string} encryptedPayload
     * @return {Promise<string|object|Buffer>}
     */
    static decrypt(encryptedPayload) {
        if (!process.env.JWT_SECRET)
            throw new Error("JWT_SECRET not set");
        return new Promise((res, rej) => jsonwebtoken_1.default.verify(encryptedPayload, process.env.JWT_SECRET, { algorithms: ["RS512"] }, (er, decrypted) => (er ? rej(er) : res(decrypted))));
    }
    static issueUserAccessToken(userID) {
        return this.encrypt({ userID });
    }
    static getUserIDFromAccessToken(accessToken) {
        return this.decrypt(accessToken).then((decrypted) => decrypted.userID).catch(() => null);
    }
}
exports.Encryptions = Encryptions;
class EncryptionHasher {
    static hash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield crypto_1.default.randomBytes(128).toString("base64");
            const iterations = 10000;
            const hash = yield this.pbkdf2(password, salt, iterations).catch((er) => null);
            if (!hash)
                throw new Error("Failed to hash password");
            return `${salt}:${iterations}:${hash.toString("base64")}`;
        });
    }
    static pbkdf2(password, salt, iterations) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => crypto_1.default.pbkdf2(password, salt, iterations, 512, "sha512", (er, hash) => er ? rej(er) : res(hash)));
        });
    }
    static verifyPassword(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                const [salt, iterations, hash_] = hash.split(":");
                this.pbkdf2(password, salt, parseInt(iterations))
                    .then((hashedPassword) => {
                    res(hashedPassword.toString("base64") === hash_);
                })
                    .catch((er) => rej(er));
            });
        });
    }
}
exports.EncryptionHasher = EncryptionHasher;
