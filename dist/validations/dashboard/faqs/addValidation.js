"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFaqsValidation = void 0;
const express_validator_1 = require("express-validator");
class AddFaqsValidation {
    validation() {
        return [
            (0, express_validator_1.check)("question_ar")
                .notEmpty()
                .withMessage("you should enter question with arabic")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("question_en")
                .notEmpty()
                .withMessage("you should enter question with english")
                .trim()
                .escape()
                .toLowerCase(),
            (0, express_validator_1.check)("ansower_ar")
                .notEmpty()
                .withMessage("you should enter ansower with arabic")
                .trim()
                .toLowerCase(),
            (0, express_validator_1.check)("ansower_en")
                .notEmpty()
                .withMessage("you should enter ansower with english")
                .trim()
                .toLowerCase(),
        ];
    }
}
exports.AddFaqsValidation = AddFaqsValidation;
