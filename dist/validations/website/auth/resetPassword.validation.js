"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordValidation = void 0;
const express_validator_1 = require("express-validator");
const users_1 = __importDefault(require("../../../models/users"));
class ResetPasswordValidation {
    validation() {
        return [
            (0, express_validator_1.check)("email")
                .notEmpty()
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "يجب ادخال الايميل";
                }
                else {
                    return "you should enter email";
                }
            })
                .isEmail()
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "هذا الحقل يستقبل ايميل";
                }
                else {
                    return "this feild accept email";
                }
            })
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
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "الايميل غير مسجل";
                }
                else {
                    return "your email not registed";
                }
            }),
        ];
    }
}
exports.ResetPasswordValidation = ResetPasswordValidation;
