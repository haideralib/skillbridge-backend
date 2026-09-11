import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


export const MailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
});