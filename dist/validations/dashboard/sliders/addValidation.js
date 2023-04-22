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
exports.AddSliderValidation = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../../../config/config");
class AddSliderValidation {
    validation() {
        return [
            (0, express_validator_1.check)("header_ar")
                .notEmpty()
                .withMessage("enter slider header in arabic")
                .trim(),
            (0, express_validator_1.check)("header_en")
                .notEmpty()
                .withMessage("enter slider header in english")
                .trim(),
            (0, express_validator_1.check)("description_ar")
                .notEmpty()
                .withMessage("enter slider description in arabic")
                .trim(),
            (0, express_validator_1.check)("description_en")
                .notEmpty()
                .withMessage("enter slider description in english")
                .trim(),
            (0, express_validator_1.check)("link").notEmpty().withMessage("enter slider link").trim(),
            (0, express_validator_1.check)("position").notEmpty().withMessage("enter slider position").trim(),
            (0, express_validator_1.check)("image")
                .custom((value, { req }) => {
                if (req.files.length == 0) {
                    throw new Error("");
                }
                return true;
            })
                .withMessage("enter slider image")
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
exports.AddSliderValidation = AddSliderValidation;
