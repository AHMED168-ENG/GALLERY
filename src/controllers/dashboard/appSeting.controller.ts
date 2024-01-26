import { Request, Response, NextFunction } from "express";
import tbl_app_settings from "../../models/appSeting";
import { validationResult } from "express-validator";
import { FilesOperations, ValidationMessage } from "../../helpers/helper";
export class AppSettingController {
  constructor() {}
  // start show app Setting
  public async find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_app_settings.findOne().then((result) => {
        res.render("dashboard/setting/appSetting", {
          title: "Dashboard | App Setting",
          notification: req.flash("notification"),
          appSetting: result || {},
          validationError: req.flash("validationError")[0] || {},
          bodyData: req.flash("bodyData")[0],
        });
      });
    } catch (error) {
      next(error);
    }
  }
  // end show app Setting

  // start update AppSetting
  public async updatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const error:any = validationResult(req);
      const body = req.body;
      const filesOperations: FilesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      if (!error.isEmpty()) {
        filesOperations.removeImg(req, "AppSetting");
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/setting/appSetting"
        );
        return;
      }
      const file = filesOperations.Rename_uploade_img(req);
      if (file) {
        if (body.oldImage)
          filesOperations.removeImg(req, "appSetting", body.oldImage);
        body.logo = file;
      } else {
        body.logo = body.oldImage;
      }

      body.active = body.active ? true : false;

      tbl_app_settings.findOne().then(async (result) => {
        if (!result) {
          await tbl_app_settings.create(body).then();
        } else {
          await tbl_app_settings.update(body, {
            where: {
              id: 1,
            },
          });
        }

        validationMessage.returnWithMessage(
          req,
          res,
          "/dashboard/app-setting",
          "edit successful",
          "success"
        );
      });
    } catch (error) {
      next(error);
    }
  }
  // end update AppSetting
}
