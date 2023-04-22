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
exports.UpdateGalleryValidation = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../../../config/config");
class UpdateGalleryValidation {
    validation() {
        return [
            (0, express_validator_1.check)("title_ar")
                .notEmpty()
                .withMessage("you should enter image title with arabic")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("title_en")
                .notEmpty()
                .withMessage("you should enter image title with english")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("productId")
                .notEmpty()
                .withMessage("you should enter product id")
                .trim()
                .toLowerCase(),
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
exports.UpdateGalleryValidation = UpdateGalleryValidation;
