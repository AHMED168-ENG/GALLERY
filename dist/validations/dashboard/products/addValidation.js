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
exports.AddProductValidation = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../../../config/config");
class AddProductValidation {
    validation() {
        return [
            (0, express_validator_1.check)("productName_ar")
                .notEmpty()
                .withMessage("enter product name in arabic")
                .trim()
                .escape(),
            (0, express_validator_1.check)("productName_en")
                .notEmpty()
                .withMessage("enter product name in english")
                .trim()
                .escape(),
            (0, express_validator_1.check)("productOverview_ar")
                .notEmpty()
                .withMessage("you should enter product overview in arabic")
                .trim()
                .escape(),
            (0, express_validator_1.check)("productOverview_en")
                .notEmpty()
                .withMessage("you should enter product overview in english")
                .trim()
                .escape(),
            (0, express_validator_1.check)("fullDescription_ar")
                .notEmpty()
                .withMessage("you should enter full description in arabic")
                .trim(),
            (0, express_validator_1.check)("fullDescription_en")
                .notEmpty()
                .withMessage("you should enter full description in english")
                .trim(),
            (0, express_validator_1.check)("keyWord")
                .notEmpty()
                .withMessage("Enter the keywords through which the product is searched.")
                .trim()
                .escape(),
            (0, express_validator_1.check)("price")
                .isNumeric()
                .withMessage("this field accept number only")
                .isLength({ min: 1 })
                .withMessage("يجب ادخال سعر المنتج")
                .trim()
                .escape(),
            (0, express_validator_1.check)("category")
                .isLength({ min: 1 })
                .withMessage("you should enter category"),
            (0, express_validator_1.check)("metaDescription_en")
                .notEmpty()
                .withMessage("enter meta description in english")
                .isString()
                .withMessage("this field accept string")
                .trim()
                .escape(),
            (0, express_validator_1.check)("metaDescription_ar")
                .notEmpty()
                .withMessage("enter meta description in arabic")
                .isString()
                .withMessage("this field accept string")
                .trim()
                .escape(),
            (0, express_validator_1.check)("metaKeywords_en")
                .notEmpty()
                .withMessage("enter meta meta Keywords in english separeted with ',' ")
                .isString()
                .withMessage("this field accept string")
                .trim()
                .escape(),
            (0, express_validator_1.check)("metaKeywords_ar")
                .notEmpty()
                .withMessage("enter meta meta Keywords in arabic separeted with ',' ")
                .isString()
                .withMessage("this field accept string")
                .trim()
                .escape(),
            (0, express_validator_1.check)("productImage")
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.files.productImage) {
                    throw new Error("");
                }
                return true;
            }))
                .withMessage("you should enter at less on image")
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.files.productImage)
                    return true;
                req.files.productImage.forEach((element) => {
                    var arrayExtention = config_1.imageExtention;
                    var originalname = element.originalname.split(".");
                    var imgExtension = originalname[originalname.length - 1].toLowerCase();
                    if (!arrayExtention.includes(imgExtension)) {
                        throw new Error("");
                    }
                });
            }))
                .withMessage(`The image extension must be ${config_1.imageExtention}`)
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.files.productImage)
                    return true;
                if (req.files.productImage.length > 3) {
                    throw new Error("");
                }
            }))
                .withMessage("The photos should not exceed 3 photos.")
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.files.productImage)
                    return true;
                req.files.productImage.forEach((element) => {
                    if (element.size > 2000000) {
                        throw new Error("");
                    }
                });
            }))
                .withMessage("The image should not be more than 2000000 kb"),
            (0, express_validator_1.check)("descriptionImage")
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.files.descriptionImage)
                    return true;
                req.files.descriptionImage.forEach((element) => {
                    var arrayExtention = config_1.imageExtention;
                    var originalname = element.originalname.split(".");
                    var imgExtension = originalname[originalname.length - 1].toLowerCase();
                    if (!arrayExtention.includes(imgExtension)) {
                        throw new Error("");
                    }
                });
            }))
                .withMessage(`The image extension must be ${config_1.imageExtention}`)
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.files.descriptionImage)
                    return true;
                if (req.files.descriptionImage.length > 3) {
                    throw new Error("");
                }
            }))
                .withMessage("The photos must not be more than 3 photos.")
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.files.descriptionImage) {
                    throw new Error("");
                }
            }))
                .withMessage("At least one photo must be entered.")
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.files.descriptionImage)
                    return true;
                if (req.files.descriptionImage.length > 3) {
                    throw new Error("");
                }
            }))
                .withMessage("The photos should not exceed 3 photos")
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                if (!req.files.descriptionImage)
                    return true;
                req.files.descriptionImage.forEach((element) => {
                    if (element.size > 2000000) {
                        throw new Error("");
                    }
                });
            }))
                .withMessage("The image should not be more than 2000000 kb"),
        ];
    }
}
exports.AddProductValidation = AddProductValidation;
