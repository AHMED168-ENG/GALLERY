import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ValidationMessage } from "../../helpers/helper";
import tbl_stats_section from "../../models/statsSection";
export class FrontSectionController {
  constructor() {}
  // start show state Section
  public async stateSection(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_stats_section.findOne().then((result) => {
        res.render("dashboard/sections/stateSection", {
          title: "Dashboard | State Section",
          notification: req.flash("notification"),
          statsSection: result || {},
          validationError: req.flash("validationError")[0] || {},
          bodyData: req.flash("bodyData")[0],
        });
      });
    } catch (error) {
      next(error);
    }
  }
  // end show state Section

  // start update StateSection
  public async stateSectionPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const error = validationResult(req);
      const body = req.body;
      const validationMessage: ValidationMessage = new ValidationMessage();
      if (!error.isEmpty()) {
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/front-sections/stats-section"
        );
        return;
      }

      tbl_stats_section.findOne().then(async (result) => {
        if (!result) {
          await tbl_stats_section.create(body).then();
        } else {
          await tbl_stats_section.update(body, {
            where: {
              id: 1,
            },
          });
        }

        validationMessage.returnWithMessage(
          req,
          res,
          "/dashboard/front-sections/stats-section",
          "edit successful",
          "success"
        );
      });
    } catch (error) {
      next(error);
    }
  }
  // end update StateSection
}
