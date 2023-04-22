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
exports.UpdateSupCategoryValidation = void 0;
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
const config_1 = require("../../../config/config");
const categorys_1 = __importDefault(require("../../../models/categorys"));
class UpdateSupCategoryValidation {
    validation() {
        return [
            (0, express_validator_1.check)("category_en")
                .notEmpty()
                .withMessage("enter category name in english")
                .isString()
                .withMessage("this field accept string")
                .trim()
                .escape()
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                const category = yield categorys_1.default.scope("supCategorys").findOne({
                    where: {
                        category_en: value,
                        id: { [sequelize_1.Op.ne]: req.params.id },
                    },
                });
                if (category) {
                    throw new Error("");
                }
                return true;
            }))
                .withMessage("this sup category already registed"),
            (0, express_validator_1.check)("category_ar")
                .notEmpty()
                .withMessage("enter category name in arabic")
                .isString()
                .withMessage("this field accept string")
                .trim()
                .escape()
                .custom((value, { req }) => __awaiter(this, void 0, void 0, function* () {
                const category = yield categorys_1.default.scope("supCategorys").findOne({
                    where: {
                        category_ar: value,
                        id: { [sequelize_1.Op.ne]: req.params.id },
                    },
                });
                if (category) {
                    throw new Error("");
                }
                return true;
            }))
                .withMessage("this sup category already registed"),
            (0, express_validator_1.check)("description_en")
                .notEmpty()
                .withMessage("enter category description in english")
                .isString()
                .withMessage("this field accept string")
                .trim()
                .escape(),
            (0, express_validator_1.check)("description_ar")
                .notEmpty()
                .withMessage("enter category description in arabic")
                .isString()
                .withMessage("this field accept string")
                .trim()
                .escape(),
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
exports.UpdateSupCategoryValidation = UpdateSupCategoryValidation;
