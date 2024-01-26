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
exports.SignUpUserValidation = void 0;
const express_validator_1 = require("express-validator");
const users_1 = __importDefault(require("../../../models/users"));
const config_1 = require("../../../config/config");
class SignUpUserValidation {
    validation() {
        return [
            (0, express_validator_1.check)("fName")
                .notEmpty()
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "ادخل الاسم الاول";
                }
                else {
                    return "enter first name";
                }
            })
                .isString()
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "هذا الحقل يقبل نص";
                }
                else {
                    return "this field accept string";
                }
            })
                .isLength({ max: 10, min: 2 })
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "يجب أن يكون الاسم الأول أكثر من 2 وأقل من 10";
                }
                else {
                    return "the first name should be more than 2 and less than 10";
                }
            })
                .trim()
                .escape(),
            (0, express_validator_1.check)("lName")
                .notEmpty()
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "ادخل الاسم الاخير";
                }
                else {
                    return "ُenter last name";
                }
            })
                .isString()
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "هذا الحقل يقبل نص";
                }
                else {
                    return "this field accept string";
                }
            })
                .isLength({ max: 10, min: 2 })
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "يجب أن يكون الاسم الأول أكثر من 2 وأقل من 10";
                }
                else {
                    return "the first name should be more than 2 and less than 10";
                }
            })
                .trim()
                .escape(),
            (0, express_validator_1.check)("age")
                .notEmpty()
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "ادخل العمر";
                }
                else {
                    return "enter age";
                }
            })
                .trim()
                .escape(),
            (0, express_validator_1.check)("address")
                .notEmpty()
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "ادخل العنوان";
                }
                else {
                    return "enter your addres";
                }
            })
                .trim()
                .escape(),
            (0, express_validator_1.check)("mobile")
                .notEmpty()
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "ادخل الموبايل";
                }
                else {
                    return "enter your mobile";
                }
            })
                .trim()
                .escape(),
            (0, express_validator_1.check)("email")
                .notEmpty()
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "ادخل الايميل";
                }
                else {
                    return "enter email";
                }
            })
                .isEmail()
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "ادخل الايميل بشكل صحيح";
                }
                else {
                    return "enter valid email";
                }
            })
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
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return "هذا الايميل مسجل بالفعل";
                }
                else {
                    return "this email registed";
                }
            }),
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
            (0, express_validator_1.check)("image")
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
                .withMessage((value, { req }) => {
                if (req.cookies.lng == "ar") {
                    return `يجب أن يكون امتداد الصورة بين ${config_1.imageExtention}`;
                }
                else {
                    return `image extention should be between  ${config_1.imageExtention}`;
                }
            })
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.files.length)
                    return true;
                req.files.forEach((element) => {
                    if (element.size > 2000000) {
                        throw new Error("");
                    }
                });
            }))
                .withMessage((value, { req }) => {
                if (req.cookies.lng != "ar") {
                    return "image should not be more than 2000000 kb";
                }
                else {
                    return "يجب ألا يزيد حجم الصورة عن 2000000 كيلو بايت";
                }
            }),
        ];
    }
}
exports.SignUpUserValidation = SignUpUserValidation;
