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
exports.SendMails = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class SendMails {
    send(email, fName, lName, subject, url) {
        return __awaiter(this, void 0, void 0, function* () {
            var transporter = nodemailer_1.default.createTransport({
                host: process.env.SMTP_HOST,
                port: +process.env.SMTP_PORT,
                secure: false,
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                },
            });
            var mailOptions = {
                from: "youremail@gmail.com",
                to: email,
                subject: subject,
                html: `<!DOCTYPE html>
    <html lang="en">
        <head>
            <title></title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="css/style.css" rel="stylesheet">
        </head>
        <body>
            <h3>welcome mr  ${fName} ${lName}  in my application </h3>
            <p>we import on your privacy</p>
            <p>${subject}</p>
            ${url ? `<a href='${url}'>click hir</a>` : ""}
            
            
        </body>
    </html>`,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("Email sent: " + info.response);
                }
            });
        });
    }
}
exports.SendMails = SendMails;
