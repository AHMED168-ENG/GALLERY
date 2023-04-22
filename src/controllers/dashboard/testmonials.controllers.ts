import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ValidationMessage } from "../../helpers/helper";
import tbl_testmonials from "../../models/testmonials";
import tbl_users from "../../models/users";
export class TestmonialsController {
  constructor() {}
  // start show all testmonial
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_testmonials
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
          include: [
            {
              model: tbl_users,
              as: "testmonialsUser",
            },
          ],
        })
        .then((result) => {
          res.render("dashboard/testmonials/all", {
            title: "Dashboard | All testmonials",
            notification: req.flash("notification"),
            testmonials: result.rows,
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
  // end show all testmonial
  // start show testmonial
  public async showTestmonial(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_testmonials
        .findOne({
          where: {
            id: req.params.id,
          },
          include: [
            {
              model: tbl_users,
              as: "testmonialsUser",
            },
          ],
        })
        .then((result) => {
          res.render("dashboard/testmonials/showTestmonial", {
            title: "Dashboard | show testmonial",
            notification: req.flash("notification"),
            testmonial: result,
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // end show testmonial
  // start show testmonial
  public async showTestmonialPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validationMessage = new ValidationMessage();
      const body = req.body;
      const lang = req.cookies.lang;
      body.active = body.active ? true : false;
      tbl_testmonials
        .update(body, {
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          const message =
            lang != "en" ? "update successful" : "تم التعديل بنجاح";
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/testmonials/show/" + req.params.id,
            message,
            "success"
          );
        });
    } catch (error) {
      next(error);
    }
  }
  // end show testmonial

  // start create testmonial post
  public async crearePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const lang = req.cookies.lang;

      tbl_testmonials
        .create(body)
        .then((result) => {
          console.log("result");
          console.log(result);
          const message =
            lang != "en"
              ? "your testmonial created successful but not view in sit before admin active"
              : "تم تسجيل رايك عن الموقع بنجاح ولاكن لن يظهر حتي يتم تفعيله من الادمن";
          res.send({
            status: true,
            message: message,
          });
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end create testmonial post

  // start activation testmonial
  public async activation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const validationMessage: ValidationMessage = new ValidationMessage();
      tbl_testmonials
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
              ? "The testmonial has been deactivated successfully"
              : "The testmonial has been activated successfully";
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/testmonials/",
            message,
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end activation testmonial

  // start delete testmonial
  public async deleteTestmonial(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body = req.body;
      const validationMessage: ValidationMessage = new ValidationMessage();
      tbl_testmonials
        .destroy({
          where: {
            id: body.id,
          },
        })
        .then(() => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/testmonials/",
            "The testmonial has been deleted successfully",
            "success"
          );
        })
        .then((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end delete testmonial
}
