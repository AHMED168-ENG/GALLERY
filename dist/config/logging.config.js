"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const winston_1 = require("winston");
const winston_2 = __importDefault(require("winston"));
class Logging {
    loggerOperationError() {
        return winston_2.default
            .createLogger({
            transports: [
                new winston_1.transports.File({
                    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
                    filename: path.join(__dirname, "../logging/error.log"),
                    level: "error",
                }),
            ],
        })
            .add(new winston_1.transports.Console({
            level: "error",
            format: winston_1.format.json(),
        }));
    }
    loggerOperationInfo() {
        return winston_2.default
            .createLogger({
            transports: new winston_1.transports.File({
                format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
                filename: path.join(__dirname, "../logging/combined.log"),
                level: "info",
            }),
        })
            .add(new winston_1.transports.Console({
            level: "info",
            format: winston_1.format.combine(winston_1.format.json()),
        }));
    }
}
exports.default = Logging;
