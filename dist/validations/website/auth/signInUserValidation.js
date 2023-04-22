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
exports.SignInUserValidation = void 0;
const express_validator_1 = require("express-validator");
const users_1 = __importDefault(require("../../../models/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class SignInUserValidation {
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
                .withMessage("your email not registed")
                .custom((value, { req }) => {
                if (!value.active) {
                    throw new Error("");
                }
                return true;
            })
                .withMessage("your account not active call the admin or check the your gmail for resone"),
            (0, express_validator_1.check)("password")
                .notEmpty()
                .withMessage("you shold enter password")
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                const user = yield users_1.default.findOne({
                    where: {
                        email: req.body.email,
                    },
                });
                if (user && user.active) {
                    const compairing = bcrypt_1.default.compareSync(value, user.password);
                    if (!compairing) {
                        throw new Error("");
                    }
                }
                return true;
            }))
                .withMessage("your password not correct")
                .trim()
                .escape(),
        ];
    }
}
exports.SignInUserValidation = SignInUserValidation;
