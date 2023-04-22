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
exports.AddUserValidation = void 0;
const express_validator_1 = require("express-validator");
const users_1 = __importDefault(require("../../../models/users"));
const config_1 = require("../../../config/config");
class AddUserValidation {
    validation() {
        return [
            (0, express_validator_1.check)("fName")
                .notEmpty()
                .withMessage("enter first name")
                .isString()
                .withMessage("this field accept string")
                .isLength({ max: 10, min: 2 })
                .withMessage("the first name should be more than 2 and less than 10")
                .trim()
                .escape(),
            (0, express_validator_1.check)("lName")
                .notEmpty()
                .withMessage("ُenter last name")
                .isString()
                .withMessage("this field accept string")
                .isLength({ max: 10, min: 2 })
                .withMessage("the last name should be more than 2 and less than 10")
                .trim()
                .escape(),
            (0, express_validator_1.check)("age").notEmpty().withMessage("enter age").trim().escape(),
            (0, express_validator_1.check)("address")
                .notEmpty()
                .withMessage("enter your address")
                .trim()
                .escape(),
            (0, express_validator_1.check)("mobile")
                .notEmpty()
                .withMessage("enter your mobile")
                .trim()
                .escape(),
            (0, express_validator_1.check)("email")
                .notEmpty()
                .withMessage("enter email")
                .isEmail()
                .withMessage("enter valid email")
                .trim()
                .escape()
                .toLowerCase()
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                var user = yield users_1.default.findOne({
                    where: {
                        email: value,
                    },
                });
                if (user) {
                    throw new Error();
                }
            }))
                .withMessage("this email already registed"),
            (0, express_validator_1.check)("password")
                .notEmpty()
                .withMessage("enter password")
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
                .withMessage("your password should containe at less 4 charackters"),
            (0, express_validator_1.check)("confirmPassword")
                .trim()
                .escape()
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (value !== req.body.password && req.body.password) {
                    throw new Error();
                }
            }))
                .withMessage("your password not match"),
            (0, express_validator_1.check)("image")
                .custom((value, { req }) => {
                if (req.files.length == 0) {
                    throw new Error("");
                }
                return true;
            })
                .withMessage("enter user image")
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.files.length)
                    return true;
                req.files.forEach((element) => {
                    var arrayExtention = config_1.imageExtention;
                    var originalname = element.originalname.split(".");
                    var imgExtension = originalname[originalname.length - 1].toLowerCase();
                    if (!arrayExtention.includes(imgExtension)) {
                        throw new Error("");
                    }
                });
            }))
                .withMessage(`image extention should be between  ${config_1.imageExtention}`)
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.files.length)
                    return true;
                req.files.forEach((element) => {
                    if (element.size > 2000000) {
                        throw new Error("");
                    }
                });
            }))
                .withMessage("image should not be more than 2000000 kb"),
        ];
    }
}
exports.AddUserValidation = AddUserValidation;
