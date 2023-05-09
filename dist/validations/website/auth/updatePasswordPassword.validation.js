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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasswordValidation = void 0;
const express_validator_1 = require("express-validator");
class UpdatePasswordValidation {
    validation() {
        return [
            (0, express_validator_1.check)("password")
                .notEmpty()
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "ادخل الرقم السري";
                }
                else {
                    return "enter password";
                }
            })
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.body.password)
                    return true;
                var count = 0;
                for (var i = 0; i < value.length; i++) {
                    if (isNaN(value[i])) {
                        count++;
                    }
                }
                if (count < 4) {
                    throw new Error();
                }
            }))
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "الرقم السري يجب ان يحتوي علي الاقل علي 4 احرف";
                }
                else {
                    return "your password should be contain at lest 4 letters";
                }
            }),
            (0, express_validator_1.check)("confirmPassword")
                .trim()
                .escape()
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (value !== req.body.password && req.body.password) {
                    throw new Error();
                }
            }))
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "الرقم السري غير متتطابق";
                }
                else {
                    return "your password not match";
                }
            }),
        ];
    }
}
exports.UpdatePasswordValidation = UpdatePasswordValidation;
