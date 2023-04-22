import { Request, Response, NextFunction } from "express";
import tbl_users from "../../models/users";
import { validationResult } from "express-validator";
import {
  FilesOperations,
  Outhers,
  ValidationMessage,
} from "../../helpers/helper";
import { Op } from "sequelize";
const slugify = require("slugify");
import charmap from "../../charmap";
slugify.extend(charmap);
import tbl_categorys from "../../models/categorys";
export class SupCategoryController {
  constructor() {}
  // start show all sup categorys
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
            mainCatigory: { [Op.ne]: 0 },
          },
        })
        .then((result) => {
          res.render("dashboard/supCategorys/all", {
            title: "Dashboard | All Categorys",
            notification: req.flash("notification"),
            supCategorys: result.rows,
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
  // end show all sup categorys

  // start create sup category
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_categorys
        .findAll({
          where: {
            mainCatigory: { [Op.eq]: 0 },
          },
        })
        .then((result) => {
          res.render("dashboard/supCategorys/create", {
            title: "Dashboard | Create Categorys",
            notification: req.flash("notification"),
            validationError: req.flash("validationError")[0] || {},
            bodyData: req.flash("bodyData")[0] || {},
            mainCatigorys: result,
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // end create sup category

  // start create sup category post
  public async crearePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const error = validationResult(req);
      const body = req.body;
      const filesOperations: FilesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      const outhers: Outhers = new Outhers();
      if (!error.isEmpty()) {
        filesOperations.removeImg(req, "Categorys");
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/sup-categorys/create"
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
      body.active = body.active ? true : false;
      body.mainCatigory = outhers.getCatgoryFromArray(body.mainCatigory);

      body.image = file;
      tbl_categorys
        .create(body)
        .then((result) => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/sup-categorys/",
            "category added successful",
            "success"
          );
        })

        .catch((error) => next(error));
    } catch (error) {
      next(error);
    }
  }
  // end create sup category post

  // start update sup category
  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const allMainCategorys = await tbl_categorys
        .scope("active")
        .scope("mainCategorys")
        .findAll();
      tbl_categorys
        .findOne({
          where: {
            id: req.params.id,
          },
          include: [
            {
              model: tbl_categorys,
              as: "mainCatigorys",
              attributes: ["category_en", "id"],
            },
          ],
        })
        .then((result) => {
          res.render("dashboard/supCategorys/update", {
            title: "Dashboard | Update Sup Category",
            notification: req.flash("notification"),
            validationError: req.flash("validationError")[0] || {},
            categoryData: result,
            bodyData: req.flash("bodyData")[0],
            mainCatigorys: allMainCategorys,
          });
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end create sup category

  // start get Main Catigory Ajax
  public async getMainCatigoryAjax(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const mainCategorys = await tbl_categorys.scope("active").findAll({
      where: {
        mainCatigory: req.params.id,
        id: {
          [Op.ne]: req.body.categoryId,
        },
      },
    });
    res.send({ catigorys: mainCategorys });
    try {
    } catch (error) {
      next(error);
    }
  }
  // end get Main Catigory Ajax

  // start create sup category post
  public async updatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const error = validationResult(req);
      const body = req.body;
      const filesOperations: FilesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      const outhers: Outhers = new Outhers();
      if (!error.isEmpty()) {
        filesOperations.removeImg(req, "Categorys");
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/sup-categorys/update/" + req.params.id
        );
        return;
      }
      const file = filesOperations.Rename_uploade_img(req);

      if (file) {
        new FilesOperations().removeImg(req, "Categorys", body.oldImage);
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
      body.mainCatigory =
        body.mainCatigory.length == 1 && !body.mainCatigory[0]
          ? body.oldMainCategory
          : outhers.getCatgoryFromArray(body.mainCatigory);
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
            "/dashboard/sup-categorys/update/" + req.params.id,
            "sup category updated successful",
            "success"
          );
        });
    } catch (error) {
      next(error);
    }
  }
  // end create sup category post
  // start activation  sup category
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
              ? "The sup category has been deactivated successfully"
              : "The sup category has been activated successfully";
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/sup-categorys/",
            message,
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end activation sup category

  // start delete sup category
  public async deleteSupCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
            "/dashboard/sup-categorys/",
            "The sup category has been deleted successfully",
            "success"
          );
        })
        .then((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end delete  sup category
}
