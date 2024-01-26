import { Request, Response, NextFunction } from "express";
import tbl_sliders from "../../models/sliders";
import { validationResult } from "express-validator";
import { FilesOperations, ValidationMessage } from "../../helpers/helper";
import { Roles } from "../../enums/roles";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { SildersPosition } from "../../config/config";
export class SlidersController {
  constructor() {}
  // start show all Sliders
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_sliders
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
        })
        .then((result) => {
          res.render("dashboard/sliders/all", {
            title: "Dashboard | All Sliders",
            notification: req.flash("notification"),
            sliders: result.rows,
            hasPrevious: page > 1,
            hasNext: PAGE_ITEMS * page < result.count,
            nextPage: page + 1,
            previousPage: page - 1,
            curantPage: +page,
            allElementCount: result.count,
            elements: +PAGE_ITEMS,
            lastPage: Math.ceil(result.count / PAGE_ITEMS),
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // end show all Sliders

  // start create sliders
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.render("dashboard/sliders/create", {
        title: "Dashboard | Create Slider",
        notification: req.flash("notification"),
        validationError: req.flash("validationError")[0] || {},
        bodyData: req.flash("bodyData")[0] || {},
        sildersPosition: SildersPosition,
      });
    } catch (error) {
      next(error);
    }
  }
  // end create sliders

  // start create slider post
  public async crearePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const error : any = validationResult(req);
      const body = req.body;
      const filesOperations: FilesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      if (!error.isEmpty()) {
        filesOperations.removeImg(req, "Sliders");
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/sliders/create"
        );
        return;
      }
      const file = filesOperations.Rename_uploade_img(req);

      body.active = body.active ? true : false;
      body.image = file;
      tbl_sliders
        .create(body)
        .then((result) => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/sliders/",
            "slider added successful",
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end create slider post

  // start update slider
  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_sliders
        .findOne({
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          res.render("dashboard/sliders/update", {
            title: "Dashboard | Update Slider",
            notification: req.flash("notification"),
            validationError: req.flash("validationError")[0] || {},
            sliderData: result,
            bodyData: req.flash("bodyData")[0],
            sildersPosition: SildersPosition,
          });
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end update slider

  // start update slider post
  public async updatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const error : any = validationResult(req);
      const body = req.body;
      const filesOperations: FilesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      if (!error.isEmpty()) {
        filesOperations.removeImg(req, "Sliders");
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/slider/update/" + req.params.id
        );
        return;
      }
      const file = filesOperations.Rename_uploade_img(req);
      if (file) {
        filesOperations.removeImg(req, "Sliders", body.oldImage);
        body.image = file;
      } else {
        body.image = body.oldImage;
      }

      body.active = body.active ? true : false;
      tbl_sliders
        .update(body, {
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/sliders/update/" + req.params.id,
            "silder updated successful",
            "success"
          );
        });
    } catch (error) {
      next(error);
    }
  }
  // end update slider post

  // start activation slider
  public async activation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const validationMessage: ValidationMessage = new ValidationMessage();
      tbl_sliders
        .update(
          {
            active: body.status == "true" ? false : true,
          },
          {
            where: {
              id: body.id,
            },
          }
        )
        .then(() => {
          let message =
            body.status == "true"
              ? "The slider has been deactivated successfully"
              : "The slider has been activated successfully";
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/sliders/",
            message,
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end activation slider

  // start delete slider
  public async deleteSlider(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const filesOperations: FilesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      filesOperations.removeImg(req, "Sliders", body.image);
      tbl_sliders
        .destroy({
          where: {
            id: body.id,
          },
        })
        .then(() => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/sliders/",
            "The slider has been deleted successfully",
            "success"
          );
        })
        .then((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end delete slider
}
