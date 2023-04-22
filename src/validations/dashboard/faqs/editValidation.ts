import { check } from "express-validator";

export class UpdateFaqsValidation {
  validation() {
    return [
      check("question_ar")
        .notEmpty()
        .withMessage("you should enter question with arabic")
        .trim()
        .escape()
        .toLowerCase(),
      check("question_en")
        .notEmpty()
        .withMessage("you should enter question with english")
        .trim()
        .escape()
        .toLowerCase(),
      check("ansower_ar")
        .notEmpty()
        .withMessage("you should enter ansower with arabic")
        .trim()
        .toLowerCase(),
      check("ansower_en")
        .notEmpty()
        .withMessage("you should enter ansower with english")
        .trim()
        .toLowerCase(),
    ];
  }
}
