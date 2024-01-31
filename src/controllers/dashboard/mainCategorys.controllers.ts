import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { FilesOperations, ValidationMessage } from "../../helpers/helper";
import { Op } from "sequelize";
import slugify from "slugify";
import charmap from "../../charmap";
slugify.extend(charmap);
import tbl_categorys from "../../models/categorys";
export class MainCategoryController {
  constructor() {}
  // start show all main categorys
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_categorys
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
          where: {
            mainCatigory: { [Op.eq]: 0 },
          },
        })
        .then((result) => {
          res.render("dashboard/mainCategorys/all", {
            title: "Dashboard | All main Categorys",
            notification: req.flash("notification"),
            mainCategorys: result.rows,
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
  // end show all main categorys

  // start create main category
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.render("dashboard/mainCategorys/create", {
        title: "Dashboard | Create Main Categorys",
        notification: req.flash("notification"),
        validationError: req.flash("validationError")[0] || {},
        bodyData: req.flash("bodyData")[0] || {},
      });
    } catch (error) {
      next(error);
    }
  }
  // end create main category

  // start create main category post
  public async crearePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const error :any = validationResult(req);
      const body = req.body;
      const filesOperations: FilesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      if (!error.isEmpty()) {
        filesOperations.removeImg(req, "Categorys");
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/main-categorys/create"
        );
        return;
      }
      const file = filesOperations.Rename_uploade_img(req);
      body.slug_ar = slugify(body.category_ar, {
        remove: /[$*_+~.()'"!\-:@]+/g,
      });
      body.slug_en = slugify(body.category_en, {
        remove: /[$*_+~.()'"!\-:@]+/g,
      });
      const elementWithArSlug = await tbl_categorys.findOne({
        where: { slug_ar: body.slug_ar },
      });
      const elementWithenSlug = await tbl_categorys.findOne({
        where: { slug_en: body.slug_en },
      });
      if (elementWithArSlug) {
        body.slug_ar = body.slug_ar + "-" + Date.now();
      }
      if (elementWithenSlug) {
        body.slug_en = body.slug_en + "-" + Date.now();
      }
      console.log(body)
      body.active = body.active ? true : false;
      body.mainCatigory = 0;
      body.image = file;
      tbl_categorys
        .create(body)
        .then((result) => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/main-categorys/",
            "category added successful",
            "success"
          );
        })

        .catch((error) => next(error));
    } catch (error) {
      next(error);
    }
  }
  // end create main category post

  // start update main category
  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_categorys
        .findOne({
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          res.render("dashboard/mainCategorys/update", {
            title: "Dashboard | Update Main Category",
            notification: req.flash("notification"),
            validationError: req.flash("validationError")[0] || {},
            mainCategory: result,
            bodyData: req.flash("bodyData")[0],
          });
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end create main category

  // start create main category post
  public async updatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const error :any = validationResult(req);
      const body = req.body;
      const filesOperations: FilesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      if (!error.isEmpty()) {
        filesOperations.removeImg(req, "Categorys");
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/main-categorys/update/" + req.params.id
        );
        return;
      }
      const file = filesOperations.Rename_uploade_img(req);
      if (file) {
        filesOperations.removeImg(req, "Categorys", body.oldImage);
        body.image = file;
      } else {
        body.image = body.oldImage;
      }

      body.slug_ar = slugify(body.category_ar, {
        remove: /[$*_+~.()'"!\-:@]+/g,
      });
      body.slug_en = slugify(body.category_en, {
        remove: /[$*_+~.()'"!\-:@]+/g,
      });
      const elementWithArSlug = await tbl_categorys.findOne({
        where: { slug_ar: body.slug_ar, id: { [Op.ne]: req.params.id } },
      });
      const elementWithenSlug = await tbl_categorys.findOne({
        where: { slug_en: body.slug_en, id: { [Op.ne]: req.params.id } },
      });
      if (elementWithArSlug) {
        body.slug_ar = body.slug_ar + "-" + Date.now();
      }
      if (elementWithenSlug) {
        body.slug_en = body.slug_en + "-" + Date.now();
      }

      body.active = body.active ? true : false;
      tbl_categorys
        .update(body, {
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/main-categorys/update/" + req.params.id,
            "category updated successful",
            "success"
          );
        });
    } catch (error) {
      next(error);
    }
  }
  // end create main category post

  // start activation category
  public async activation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const validationMessage: ValidationMessage = new ValidationMessage();
      tbl_categorys
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
              ? "The category has been deactivated successfully"
              : "The category has been activated successfully";
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/main-categorys/",
            message,
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end activation category

  // start delete category
  public async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const filesOperations: FilesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      filesOperations.removeImg(req, "Categorys", body.image);
      tbl_categorys
        .destroy({
          where: {
            id: body.id,
          },
        })
        .then(() => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/main-categorys/",
            "The category has been deleted successfully",
            "success"
          );
        })
        .then((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end delete category
}
