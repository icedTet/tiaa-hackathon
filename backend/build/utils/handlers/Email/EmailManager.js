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
exports.EmailManager = void 0;
const nodemailer_1 = require("nodemailer");
const render_1 = require("@react-email/render");
const EmailTemplate_1 = __importDefault(require("./EmailTemplate"));
class EmailManager {
    static getInstance() {
        if (!EmailManager.instance)
            EmailManager.instance = new EmailManager();
        return EmailManager.instance;
    }
    constructor() {
        this.mailer = (0, nodemailer_1.createTransport)({
            host: process.env.NODEMAILER_HOST,
            port: Number(process.env.NODEMAILER_PORT),
            secure: true,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        });
    }
    sendVerificationEmail(user, code) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mailer.sendMail({
                from: "Finapp <tet@tet.moe>",
                to: user.email,
                subject: `[${code}][Finapp] Verify your email address`,
                html: yield (0, render_1.render)((0, EmailTemplate_1.default)({ validationCode: code })),
            });
        });
    }
}
exports.EmailManager = EmailManager;
