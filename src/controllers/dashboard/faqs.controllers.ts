import { Request, Response, NextFunction } from "express";
import tbl_faqs from "../../models/faqs";
import { validationResult } from "express-validator";
import { ValidationMessage } from "../../helpers/helper";
export class FaqsController {
  constructor() {}
  // start show all questions
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_faqs
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
        })
        .then((result) => {
          res.render("dashboard/faqs/all", {
            title: "Dashboard | All Questions",
            notification: req.flash("notification"),
            questions: result.rows,
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
  // end show all questions

  // start create question
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.render("dashboard/faqs/create", {
        title: "Dashboard | Create Question",
        notification: req.flash("notification"),
        validationError: req.flash("validationError")[0] || {},
        bodyData: req.flash("bodyData")[0] || {},
      });
    } catch (error) {
      next(error);
    }
  }
  // end create question

  // start create questions post
  public async crearePost(
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
          "/dashboard/questions/create"
        );
        return;
      }

      body.active = body.active ? true : false;
      tbl_faqs
        .create(body)
        .then((result) => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/questions/",
            "faqs added successful",
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end create questions post

  // start update questions
  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_faqs
        .findOne({
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          res.render("dashboard/faqs/update", {
            title: "Dashboard | Update faqs",
            notification: req.flash("notification"),
            validationError: req.flash("validationError")[0] || {},
            faqsData: result,
            bodyData: req.flash("bodyData")[0],
          });
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end update questions

  // start update questions post
  public async updatePost(
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
          "/dashboard/questions/update/" + req.params.id
        );
        return;
      }

      body.active = body.active ? true : false;
      tbl_faqs
        .update(body, {
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/questions/update/" + req.params.id,
            "question updated successful",
            "success"
          );
        });
    } catch (error) {
      next(error);
    }
  }
  // end update questions post

  // start activation questions
  public async activation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const validationMessage: ValidationMessage = new ValidationMessage();
      tbl_faqs
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
              ? "The faqs has been deactivated successfully"
              : "The faqs has been activated successfully";
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/questions/",
            message,
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end activation questions

  // start delete questions
  public async deleteFaqs(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const validationMessage: ValidationMessage = new ValidationMessage();
      tbl_faqs
        .destroy({
          where: {
            id: body.id,
          },
        })
        .then(() => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/questions/",
            "The testmonial has been deleted successfully",
            "success"
          );
        })
        .then((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end delete questions
}
