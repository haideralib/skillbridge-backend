import { MailTransporter } from "../configs/mailer.config";
import  "dotenv/config.js";



export const MailSender = async (to: string, subject: string, html: string) => {
    await MailTransporter.sendMail({
        from: process.env.MAILER_USER,
        to: to,
        subject: subject,
        html: html
    });
}