import { Transporter, createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { User } from "../../../types";
import { render } from "@react-email/render";
import VerifyIdentityEmail from "./EmailTemplate";

export class EmailManager {
  static instance: EmailManager;
  static getInstance() {
    if (!EmailManager.instance) EmailManager.instance = new EmailManager();
    return EmailManager.instance;
  }
  mailer: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.mailer = createTransport({
      host: process.env.NODEMAILER_HOST,
      port: Number(process.env.NODEMAILER_PORT),
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });
  }
  async sendVerificationEmail(user: Partial<User>, code: string) {
    return this.mailer.sendMail({
      from: "Finapp <tet@tet.moe>",
      to: user.email,
      subject: `[${code}][Finapp] Verify your email address`,
      html: await render(VerifyIdentityEmail({ validationCode: code })),
    });
  }
}
