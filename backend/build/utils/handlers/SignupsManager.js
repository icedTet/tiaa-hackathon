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
exports.SignupsManager = void 0;
const EmailManager_1 = require("./Email/EmailManager");
const EncryptionsHandler_1 = require("./EncryptionsHandler");
const UserManager_1 = require("./UserManager");
const crypto_1 = __importDefault(require("crypto"));
//SignupManager class which manages the sign up process of a user.
class SignupsManager {
    // Validates the user's username and email address.
    static validateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the user's username is supplied.
            if (user.username) {
                // Checks if the username is between 3 and 24 characters.
                if (user.username.length < 3 || user.username.length > 16)
                    throw new Error("Username must be between 3 and 24 characters");
                // Checks if it contains only alphanumeric characters and underscores.
                if (!/^[a-zA-Z0-9_]*$/.test(user.username))
                    throw new Error("Username must only contain alphanumeric characters and underscores");
                // Checks if username is already taken by someone else.
                if (yield UserManager_1.UserManager.getUserByUsername(user.username))
                    throw new Error("Username already taken");
            }
            // Check if the user's email address is supplied.
            if (user.email) {
                // Checks if the email address is valid.
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
                    throw new Error("Invalid email address");
                // Checks if the email address is already taken by someone else.
                if (yield UserManager_1.UserManager.getUserByEmailAddress(user.email))
                    throw new Error("Email address already taken");
            }
            return true;
        });
    }
    // Begins the sign up process of a user. This is the first step of the sign up process. This function validates the user's username and email address, and then hashes the user's password. It then creates a new user in the unverifiedUser collection in the Users database, and sends a verification email to the user's email address.
    static signupStep1(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if a signup request is even valid. (eg. all required fields are supplied, username and email address are valid, etc.)
            if (!user.username)
                throw new Error("Username is required");
            if (!user.email)
                throw new Error("Email address is required");
            if (!user.password)
                throw new Error("Password is required");
            if (!user.firstName)
                throw new Error("First name is required");
            if (!user.lastName)
                throw new Error("Last name is required");
            // check if user is valid
            const valid = yield this.validateUser(user).catch((er) => er);
            if (valid instanceof Error)
                return {
                    error: valid.message,
                };
            // hash password
            const hashedPassword = yield EncryptionsHandler_1.EncryptionHasher.hash(user.password);
            // generate verification code
            const code = crypto_1.default.randomInt(0, 999999).toString().padStart(6, "0");
            // insert user into unverifiedUser collection, with hashed password and verification code.
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("unverifiedUser").insertOne(Object.assign(Object.assign({}, user), { password: hashedPassword, _id: undefined, verificationCode: code })));
            // send verification email with verification code
            yield EmailManager_1.EmailManager.getInstance().sendVerificationEmail(user, code);
            // return success
            return {
                success: true,
            };
        });
    }
    // Completes the sign up process of a user. This is the second step of the sign up process. This function checks if the verification code is valid, and then moves the user from the unverifiedUser collection to the user collection.
    static signupStep2(code, email) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if verification code is valid
            const user = yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("unverifiedUser").findOne({ email, verificationCode: code }));
            if (!user)
                throw new Error("Invalid verification code");
            // insert user into user collection
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("user").insertOne(Object.assign(Object.assign({}, user), { verificationCode: undefined })));
            // delete user from unverifiedUser collection
            yield (MongoDB === null || MongoDB === void 0 ? void 0 : MongoDB.db("Users").collection("unverifiedUser").deleteOne({ email, verificationCode: code }));
            // return success
            return {
                success: true,
            };
        });
    }
}
exports.SignupsManager = SignupsManager;
