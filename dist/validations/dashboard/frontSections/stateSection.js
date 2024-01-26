"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsSectionsValidation = void 0;
const express_validator_1 = require("express-validator");
class StatsSectionsValidation {
    validation() {
        return [
            (0, express_validator_1.check)("text_one_ar")
                .notEmpty()
                .withMessage("you should enter text one with arabic")
                .isLength({ max: 16 })
                .withMessage("text should be less than or equall 16 letter")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("text_one_en")
                .notEmpty()
                .withMessage("you should enter text one with english")
                .isLength({ max: 16 })
                .withMessage("text should be less than or equall 16 letter")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("icon_one")
                .notEmpty()
                .withMessage("you should enter icon one")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("text_tow_ar")
                .notEmpty()
                .withMessage("you should enter text tow with arabic")
                .isLength({ max: 16 })
                .withMessage("text should be less than or equall 16 letter")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("text_tow_en")
                .notEmpty()
                .withMessage("you should enter text tow with english")
                .isLength({ max: 16 })
                .withMessage("text should be less than or equall 16 letter")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("icon_tow")
                .notEmpty()
                .withMessage("you should enter icon tow")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("text_three_ar")
                .notEmpty()
                .withMessage("you should enter text three with arabic")
                .isLength({ max: 16 })
                .withMessage("text should be less than or equall 16 letter")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("text_three_en")
                .notEmpty()
                .withMessage("you should enter text three with english")
                .isLength({ max: 16 })
                .withMessage("text should be less than or equall 16 letter")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("icon_three")
                .notEmpty()
                .withMessage("you should enter icon three ")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("text_four_ar")
                .notEmpty()
                .withMessage("you should enter text four with arabic")
                .isLength({ max: 16 })
                .withMessage("text should be less than or equall 16 letter")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("text_four_en")
                .notEmpty()
                .withMessage("you should enter text four with english")
                .isLength({ max: 16 })
                .withMessage("text should be less than or equall 16 letter")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("icon_four")
                .notEmpty()
                .withMessage("you should enter icon four")
                .trim()
                .escape()
                .toLowerCase(),
        ];
    }
}
exports.StatsSectionsValidation = StatsSectionsValidation;
