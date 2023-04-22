"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminValidation = void 0;
const express_validator_1 = require("express-validator");
const users_1 = __importDefault(require("../../../models/users"));
class AuthAdminValidation {
    validation() {
        return [
            (0, express_validator_1.check)("email")
                .notEmpty()
                .withMessage("you should enter email")
                .isEmail()
                .withMessage("this feild accept email")
                .trim()
                .escape()
                .toLowerCase()
                .custom((value, { req }) => {
                return users_1.default
                    .findOne({
                    where: {
                        email: value,
                    },
                })
                    .then((result) => {
                    if (!result) {
                        throw new Error("");
                    }
                    else {
                        return true;
                    }
                });
            })
                .withMessage("your email not registed"),
            (0, express_validator_1.check)("password")
                .notEmpty()
                .withMessage("you shold enter password")
                .trim()
                .escape(),
        ];
    }
}
exports.AuthAdminValidation = AuthAdminValidation;
