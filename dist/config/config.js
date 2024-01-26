"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SildersPosition = exports.imageExtention = exports.env = void 0;
exports.env = {
    port: process.env.NODE_SERVER_PORT,
    database: [
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: "mysql",
            logging: false,
            dialectOptions: {
                supportBigNumbers: true,
                decimalNumbers: true,
                bigNumberStrings: false,
            },
            sync: true,
        },
    ],
    mail: {
        pool: true,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    },
};
exports.imageExtention = ["jpg", "png", "jpeg", "gif", "svg"];
exports.SildersPosition = ["HOME_TOP"];
