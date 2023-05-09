import { Request, Response, NextFunction } from "express";
import tbl_faqs from "../../models/faqs";
import { validationResult } from "express-validator";
import { ValidationMessage } from "../../helpers/helper";
export class LanguageController {
  constructor() {}

  // start set language post
  public async setLanguage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const lng = req.body.lng;
      res.cookie("lng", lng);
      res.send({
        status: true,
        message: "success",
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: false,
        error: error.message,
      });
    }
  }
  // end set language post
}
