import express, { NextFunction, Request, Response } from "express";
const server = express();
import https from "https";
import cors from "cors";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { lstat, readdir } from "fs/promises";
import { Storage } from "@google-cloud/storage";
import { User } from "./types";
import { config } from "dotenv";
import { getUserFromAuthHeader } from "./utils/handlers/UserManager";
import { StockDatabase } from "./utils/handlers/StockDatabase";
import { Server, Socket } from "socket.io";
config();
declare global {
  var MongoDB: MongoClient | null;
  var MailTransporter: nodemailer.Transporter | null;
  var storage: Storage;
  var Socketeer: Map<string, Socket>;
}
export interface RESTHandler {
  path: string;
  method: RESTMethods;
  sendUser: boolean;
  run: (
    req: Request,
    res: Response,
    next: NextFunction,
    user?: User
  ) => void | Promise<void> | any | Promise<any>;
}
globalThis.Socketeer = new Map();
export enum RESTMethods {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}
globalThis.MongoDB = null;
if (process.env.JWT_SECRET_PATH) {
  process.env.JWT_SECRET = readFileSync(process.env.JWT_SECRET_PATH).toString();
}
if (process.env.NODEMAILER_HOST) {
  globalThis.MailTransporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST!,
    port: ~~process.env.NODEMAILER_PORT!,
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

globalThis.storage = new Storage({
  credentials: JSON.parse(readFileSync(process.env.GCP_KEY_PATH!).toString()),
  keyFilename: process.env.GCP_KEY_PATH!,
});

/** @type {import('./Helpers/Databases')} */
if (!process.env.MONGODB_URL) {
  throw new Error("No MongoDB URL provided");
}

const MongoConnection = new MongoClient(process.env.MONGODB_URL!, {});
console.log("Establishing Mongo Connection...");
const importAllHandlers = async (path: string, failedImports: string[]) => {
  await Promise.all(
    (
      await readdir(path)
    ).map(async (file) => {
      console.log(`Importing ${file}`);
      if ((await lstat(`${path}/${file}`)).isDirectory()) {
        console.log(`Importing Folder ${path}/${file}`);
        return await importAllHandlers(`${path}/${file}`, failedImports);
      }
      if (!file.endsWith(".ts") && !file.endsWith(".js")) {
        return;
      }
      import(`${path}/${file}`)
        .then((module) => {
          console.log(`${file} imported`);
          const handler = module.default as RESTHandler;
          if (!handler) {
            return failedImports.push(`${file} is not a REST handler`);
          }
          console.log(handler);
          server[handler.method](handler.path, async (req, res, next) => {
            let userInfo = handler.sendUser
              ? await getUserFromAuthHeader(req)
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
            handler.run(
              req as Request,
              res as Response,
              next,
              userInfo || undefined
            );
          });
          console.log(`Loaded ${file}`);
        })
        .catch((err) => {
          console.error(`Failed to import ${file}`);
          console.error(err);
          failedImports.push(`${file} failed to import`);
        });
    })
  );
};

MongoConnection.connect().then((db) => {
  console.log("Established Mongo Connection...");
  StockDatabase.getInstance().loadStocks();
  globalThis.MongoDB = db;
  db.db("Users").collection("unverifiedUser").deleteMany({});
  server.use(
    cors({
      exposedHeaders: ["filename", "updatedat"],
      maxAge: 1209600,
    })
  );

  server.use(express.json({ limit: "100mb" }));
  const failedImports = [] as string[];
  importAllHandlers(`${__dirname}/RESTAPI`, failedImports).then(() => {
    console.log("Loaded all handlers");
    console.log(
      `${failedImports.length} handlers failed to load`,
      failedImports
    );
  });
  let socketServer = null as Server | null;
  //Import all REST Endpoints
  if (process.env.KEY_PATH && process.env.CERT_PATH) {
    const httpsServer = https.createServer(
      {
        //@ts-ignore
        key: readFileSync(process.env.KEY_PATH),
        //@ts-ignore
        cert: readFileSync(process.env.CERT_PATH),
      },
      server
    );
    // new SocketServer(

    socketServer = new Server(
      httpsServer.listen(~~(process.env.SERVER_PORT || 443), () => {
        console.log(
          `Secure HTTP Server started on port ${process.env.SERVER_PORT}`
        );
      }),
      {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      }
    );
    // );
  } else {
    console.log(
      `HTTP Server running on port ${~~(process.env.SERVER_PORT || 80)}`
    );

    socketServer = new Server(
      server.listen(~~(process.env.SERVER_PORT || 80)),
      {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      }
    );
    // const SocketAPI = new SocketServer(server.listen(env.port));
  }
  socketServer.on("connection", (socket) => {
    if (socket.handshake.headers.authorization) {
      globalThis.Socketeer.set(
        socket.handshake.headers.authorization as string,
        socket
      );
      socket.once("disconnect", () => {
        globalThis.Socketeer.delete(socket.handshake.headers.authorization as string);
      });
    }
  });
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
