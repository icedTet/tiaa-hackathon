"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.RESTMethods = void 0;
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
const https_1 = __importDefault(require("https"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("mongodb");
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const storage_1 = require("@google-cloud/storage");
const dotenv_1 = require("dotenv");
const UserManager_1 = require("./utils/handlers/UserManager");
const StockDatabase_1 = require("./utils/handlers/StockDatabase");
(0, dotenv_1.config)();
var RESTMethods;
(function (RESTMethods) {
    RESTMethods["GET"] = "get";
    RESTMethods["POST"] = "post";
    RESTMethods["PUT"] = "put";
    RESTMethods["DELETE"] = "delete";
})(RESTMethods || (exports.RESTMethods = RESTMethods = {}));
globalThis.MongoDB = null;
if (process.env.JWT_SECRET_PATH) {
    process.env.JWT_SECRET = (0, fs_1.readFileSync)(process.env.JWT_SECRET_PATH).toString();
}
if (process.env.NODEMAILER_HOST) {
    globalThis.MailTransporter = nodemailer_1.default.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: ~~process.env.NODEMAILER_PORT,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
        },
    });
}
if (!process.env.GCP_KEY_PATH) {
    throw new Error("No GCP Key Path provided");
}
globalThis.storage = new storage_1.Storage({
    credentials: JSON.parse((0, fs_1.readFileSync)(process.env.GCP_KEY_PATH).toString()),
    keyFilename: process.env.GCP_KEY_PATH,
});
/** @type {import('./Helpers/Databases')} */
if (!process.env.MONGODB_URL) {
    throw new Error("No MongoDB URL provided");
}
const MongoConnection = new mongodb_1.MongoClient(process.env.MONGODB_URL, {});
console.log("Establishing Mongo Connection...");
const importAllHandlers = (path, failedImports) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all((yield (0, promises_1.readdir)(path)).map((file) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Importing ${file}`);
        if ((yield (0, promises_1.lstat)(`${path}/${file}`)).isDirectory()) {
            console.log(`Importing Folder ${path}/${file}`);
            return yield importAllHandlers(`${path}/${file}`, failedImports);
        }
        if (!file.endsWith(".ts") && !file.endsWith(".js")) {
            return;
        }
        Promise.resolve(`${`${path}/${file}`}`).then(s => __importStar(require(s))).then((module) => {
            console.log(`${file} imported`);
            const handler = module.default;
            if (!handler) {
                return failedImports.push(`${file} is not a REST handler`);
            }
            console.log(handler);
            server[handler.method](handler.path, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                let userInfo = handler.sendUser
                    ? yield (0, UserManager_1.getUserFromAuthHeader)(req)
                    : null;
                // if (userInfo?.tokenType === UserTokenTypes.PLUGIN) {
                //   if (!handler.intent)
                //     return res
                //       .sendStatus(403)
                //       .send("Endpoint does not support Plugin Generated Tokens");
                //   if (!userInfo.intents)
                //     return res
                //       .sendStatus(403)
                //       .send("Plugin Token does not have any intents");
                //   if (!userInfo.intents.includes(handler.intent)) {
                //     return res
                //       .sendStatus(403)
                //       .send(
                //         "Plugin Token does not have permission to use this endpoint"
                //       );
                //   }
                // }
                handler.run(req, res, next, userInfo || undefined);
            }));
            console.log(`Loaded ${file}`);
        })
            .catch((err) => {
            console.error(`Failed to import ${file}`);
            console.error(err);
            failedImports.push(`${file} failed to import`);
        });
    })));
});
MongoConnection.connect().then((db) => {
    console.log("Established Mongo Connection...");
    StockDatabase_1.StockDatabase.getInstance().loadStocks();
    globalThis.MongoDB = db;
    db.db("Users").collection("unverifiedUser").deleteMany({});
    server.use((0, cors_1.default)({
        exposedHeaders: ["filename", "updatedat"],
        maxAge: 1209600,
    }));
    server.use(express_1.default.json({ limit: "100mb" }));
    const failedImports = [];
    importAllHandlers(`${__dirname}/RESTAPI`, failedImports).then(() => {
        console.log("Loaded all handlers");
        console.log(`${failedImports.length} handlers failed to load`, failedImports);
    });
    //Import all REST Endpoints
    if (process.env.KEY_PATH && process.env.CERT_PATH) {
        const httpsServer = https_1.default.createServer({
            //@ts-ignore
            key: (0, fs_1.readFileSync)(process.env.KEY_PATH),
            //@ts-ignore
            cert: (0, fs_1.readFileSync)(process.env.CERT_PATH),
        }, server);
        // new SocketServer(
        httpsServer.listen(~~(process.env.SERVER_PORT || 443), () => {
            console.log(`Secure HTTP Server started on port ${process.env.SERVER_PORT}`);
        });
        // );
    }
    else {
        console.log(`HTTP Server running on port ${~~(process.env.SERVER_PORT || 80)}`);
        server.listen(~~(process.env.SERVER_PORT || 80));
        // const SocketAPI = new SocketServer(server.listen(env.port));
    }
});
process.on("unhandledRejection", (reason, p) => {
    console.trace("Unhandled Rejection at: Promise", p, "reason:", reason);
    // application specific logging, throwing an error, or other logic here
});
// (async ()=>{
//   let msg = await MailTransporter.sendMail({
//     from: '\'Tet from Disadus\' no-reply@disadus.app',
//     to: 'ic3dplasma@gmail.com',
//     subject: '[Disadus] (694200) Verify your email!',
//     text: 'Your security code is 694200. It expires in 15 minutes.',
//   });
//   console.log('Msg sent!');
// })();
