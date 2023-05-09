import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import {
  FilesOperations,
  Outhers,
  ValidationMessage,
} from "../../helpers/helper";
import { Op } from "sequelize";
import slugify from "slugify";
import charmap from "../../charmap";
slugify.extend(charmap);
import tbl_products from "../../models/products";
import tbl_categorys from "../../models/categorys";
export class ProductController {
  constructor() {}
  // start show all products
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_products
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
          include: [{ model: tbl_categorys, as: "ProductCategory" }],
        })
        .then((result) => {
          res.render("dashboard/products/all", {
            title: "Dashboard | All Products",
            notification: req.flash("notification"),
            allProducts: result.rows,
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
  // end show all products
  // start findAll product from search
  public async findAllProductFromSearch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = req.query;
      tbl_products
        .findAll({
          order: [["createdAt", "desc"]],
          limit: 8,
          attributes: [
            "productName_ar",
            "productName_en",
            "id",
            "slug_ar",
            "slug_en",
            "productImage",
          ],
          where: {
            [Op.or]: [
              {
                productName_ar: { [Op.like]: `%${query.search}%` },
              },
              {
                productName_en: { [Op.like]: `%${query.search}%` },
              },
              {
                keyWord: { [Op.like]: `%${query.search}%` },
              },
              {
                fullDescription_ar: { [Op.like]: `%${query.search}%` },
              },
              {
                fullDescription_en: { [Op.like]: `%${query.search}%` },
              },
              {
                statmentDescription_ar: { [Op.like]: `%${query.search}%` },
              },
              {
                statmentDescription_en: { [Op.like]: `%${query.search}%` },
              },
            ],
          },
          include: [{ model: tbl_categorys, as: "ProductCategory" }],
        })
        .then((result) => {
          res.send({
            status: true,
            data: result,
          });
        });
    } catch (error) {
      res.send({
        status: false,
        error: error.message,
      });
    }
  }
  // end findAll product from search

  // start create products
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_categorys
        .scope("active")
        .scope("mainCategorys")
        .findAll()
        .then((result) => {
          res.render("dashboard/products/create", {
            title: "Dashboard | Create Product",
            notification: req.flash("notification"),
            validationError: req.flash("validationError")[0] || {},
            bodyData: req.flash("bodyData")[0] || {},
            catigorys: result,
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // end create products

  // start create products post
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
        filesOperations.removeImgFiled([
          req.files["productImage"],
          req.files["descriptionImage"],
        ]);
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/products/create"
        );
        return;
      }
      const files = filesOperations.Rename_uploade_img_multiFild([
        req.files["productImage"],
        req.files["descriptionImage"],
      ]);
      body.slug_ar = slugify(body.productName_ar, {
        remove: /[$*_+~.()'"!\-:@]+/g,
      });
      body.slug_en = slugify(body.productName_en, {
        remove: /[$*_+~.()'"!\-:@]+/g,
      });
      const elementWithArSlug = await tbl_products.findOne({
        where: { slug_ar: body.slug_ar },
      });
      const elementWithEnSlug = await tbl_products.findOne({
        where: { slug_en: body.slug_en },
      });
      if (elementWithArSlug) {
        body.slug_ar = body.slug_ar + "-" + (Date.now() - 10000);
      }
      if (elementWithEnSlug) {
        body.slug_en = body.slug_en + "-" + (Date.now() - 10000);
      }
      body.active = body.active ? true : false;
      body.productImage = files["productImage"];
      body.descriptionImage = files["descriptionImage"];
      body.category = outhers.getCatgoryFromArray(body.category);

      tbl_products
        .create(body)
        .then((result) => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/products/",
            "product added successful",
            "success"
          );
        })

        .catch((error) => next(error));
    } catch (error) {
      next(error);
    }
  }
  // end create products post

  // start update products
  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categorys = await tbl_categorys
        .scope("active")
        .scope("mainCategorys")
        .findAll();
      tbl_products
        .findOne({
          include: [{ model: tbl_categorys, as: "ProductCategory" }],
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          res.render("dashboard/products/update", {
            title: "Dashboard | Update Product",
            notification: req.flash("notification"),
            validationError: req.flash("validationError")[0] || {},
            productData: result,
            bodyData: req.flash("bodyData")[0],
            catigorys: categorys,
          });
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end create products

  // start create products post
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
        filesOperations.removeImgFiled([
          req.files["productImage"],
          req.files["descriptionImage"],
        ]);
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/products/update/" + req.params.id
        );
        return;
      }
      const files = filesOperations.Rename_uploade_img_multiFild([
        req.files["productImage"],
        req.files["descriptionImage"],
      ]);
      if (files["productImage"]) {
        filesOperations.removeImg(req, "Products", body.oldProductImage);
        body.productImage = files["productImage"];
      } else {
        body.productImage = body.oldProductImage;
      }

      if (files["descriptionImage"]) {
        filesOperations.removeImg(req, "Products", body.oldDescriptionImage);
        body.descriptionImage = files["descriptionImage"];
      } else {
        body.descriptionImage = body.oldDescriptionImage;
      }

      body.slug_ar = slugify(body.productName_ar, {
        remove: /[$*_+~.()'"!\-:@]+/g,
      });
      body.slug_en = slugify(body.productName_en, {
        remove: /[$*_+~.()'"!\-:@]+/g,
      });
      const elementWithArSlug = await tbl_products.findOne({
        where: { slug_ar: body.slug_ar, id: { [Op.ne]: req.params.id } },
      });
      const elementWithEnSlug = await tbl_products.findOne({
        where: { slug_en: body.slug_en, id: { [Op.ne]: req.params.id } },
      });
      if (elementWithArSlug) {
        body.slug_ar = body.slug_ar + "-" + (Date.now() - 10000);
      }
      if (elementWithEnSlug) {
        body.slug_en = body.slug_en + "-" + (Date.now() - 10000);
      }
      body.category =
        body.category[0] != ""
          ? outhers.getCatgoryFromArray(body.category)
          : body.oldCategory;
      body.active = body.active ? true : false;
      tbl_products
        .update(body, {
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/products/update/" + req.params.id,
            "product updated successful",
            "success"
          );
        });
    } catch (error) {
      next(error);
    }
  }
  // end create products post

  // start activation product
  public async activation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const validationMessage: ValidationMessage = new ValidationMessage();
      tbl_products
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
              ? "The product has been deactivated successfully"
              : "The product has been activated successfully";
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/products/",
            message,
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end activation product

  // start delete product
  public async deleteproduct(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const filesOperations: FilesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      filesOperations.removeImg(req, "Products", req.body.oldDescriptionImage);
      filesOperations.removeImg(req, "Products", req.body.oldProductImage);
      tbl_products
        .destroy({
          where: {
            id: body.id,
          },
        })
        .then(() => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/products/",
            "The product has been deleted successfully",
            "success"
          );
        })
        .then((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end delete product
}
