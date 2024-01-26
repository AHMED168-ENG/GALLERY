import { Request, Response, NextFunction } from "express";
import tbl_gallery from "../../models/gallery";
import { validationResult } from "express-validator";
import { FilesOperations, ValidationMessage } from "../../helpers/helper";
import tbl_products from "../../models/products";
export class GalleryController {
  constructor() {}
  // start show all images
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_gallery
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
          include: [
            {
              model: tbl_products,
              as: "galleryProduct",
              attributes: ["id", "productName_en"],
            },
          ],
        })
        .then((result) => {
          res.render("dashboard/gallery/all", {
            title: "Dashboard | All images",
            notification: req.flash("notification"),
            images: result.rows,
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
  // end show all images

  // start create images gallery
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_products
        .scope("active")
        .findAll()
        .then((result) => {
          res.render("dashboard/gallery/create", {
            title: "Dashboard | Create gallery Image",
            notification: req.flash("notification"),
            validationError: req.flash("validationError")[0] || {},
            bodyData: req.flash("bodyData")[0] || {},
            products: result,
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // end create image gallery

  // start create images gallery post
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
        filesOperations.removeImg(req, "Gallery");
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/gallery/create"
        );
        return;
      }
      const file = filesOperations.Rename_uploade_img(req);
      body.image = file;

      body.active = body.active ? true : false;
      tbl_gallery
        .create(body)
        .then((result) => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/gallery/",
            "gallery added successful",
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end create images gallery post

  // start update images gallery
  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_products
        .scope("active")
        .findAll()
        .then((products) => {
          tbl_gallery
            .findOne({
              where: {
                id: req.params.id,
              },
              include: [
                {
                  model: tbl_products,
                  as: "galleryProduct",
                  attributes: ["id", "productName_en"],
                },
              ],
            })
            .then((gallery) => {
              res.render("dashboard/gallery/update", {
                title: "Dashboard | Update gallery Image",
                notification: req.flash("notification"),
                validationError: req.flash("validationError")[0] || {},
                gallery,
                products,
                bodyData: req.flash("bodyData")[0],
              });
            })
            .catch((error) => error);
        });
    } catch (error) {
      next(error);
    }
  }
  // end update images gallery

  // start update images gallery post
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
        filesOperations.removeImg(req, "Gallery");
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/gallery/update/" + req.params.id
        );
        return;
      }
      const file = filesOperations.Rename_uploade_img(req);
      if (file) {
        console.log(file);
        filesOperations.removeImg(req, "Gallery", body.oldImage);
        body.image = file;
      } else {
        body.image = body.oldImage;
      }
      body.active = body.active ? true : false;
      tbl_gallery
        .update(body, {
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/gallery/update/" + req.params.id,
            "image gallery updated successful",
            "success"
          );
        });
    } catch (error) {
      next(error);
    }
  }
  // end update images gallery post

  // start activation images gallery
  public async activation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const validationMessage: ValidationMessage = new ValidationMessage();
      tbl_gallery
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
              ? "The gallery has been deactivated successfully"
              : "The gallery has been activated successfully";
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/gallery/",
            message,
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end activation images gallery

  // start delete images gallery
  public async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const filesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      filesOperations.removeImg(req, "Gallery", body.oldImage);
      tbl_gallery
        .destroy({
          where: {
            id: body.id,
          },
        })
        .then(() => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/gallery/",
            "The gallery image has been deleted successfully",
            "success"
          );
        })
        .then((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end delete images gallery
}
