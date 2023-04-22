import { Request, Response, NextFunction } from "express";
import tbl_users from "../../models/users";
import { validationResult } from "express-validator";
import { FilesOperations, ValidationMessage } from "../../helpers/helper";
import { Roles } from "../../enums/roles";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
export class UserController {
  constructor() {}
  // start show all users
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_users
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
          where: {
            roles: {
              [Op.eq]: Roles.User,
            },
          },
        })
        .then((result) => {
          res.render("dashboard/users/all", {
            title: "Dashboard | All Users",
            notification: req.flash("notification"),
            users: result.rows,
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
  // end show all users
  // start show all admin
  public async findAllAdmins(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_users
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
          where: {
            roles: {
              [Op.eq]: Roles.Admin,
            },
          },
        })
        .then((result) => {
          res.render("dashboard/users/all", {
            title: "Dashboard | All Users",
            notification: req.flash("notification"),
            users: result.rows,
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
  // end show all admin

  // start create user
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.render("dashboard/users/create", {
        title: "Dashboard | Create User",
        notification: req.flash("notification"),
        validationError: req.flash("validationError")[0] || {},
        bodyData: req.flash("bodyData")[0] || {},
      });
    } catch (error) {
      next(error);
    }
  }
  // end create user

  // start create user post
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
      if (!error.isEmpty()) {
        filesOperations.removeImg(req, "Users");
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/users/create"
        );
        return;
      }
      const file = filesOperations.Rename_uploade_img(req);
      bcrypt
        .hash(body.password, +process.env.saltRounds)
        .then((hashPassword) => {
          body.active = body.active ? true : false;
          body.roles = body.isAdmin ? Roles.Admin : Roles.User;
          body.image = file;
          body.password = hashPassword;
          tbl_users
            .create(body)
            .then((result) => {
              validationMessage.returnWithMessage(
                req,
                res,
                "/dashboard/users/",
                "user added successful",
                "success"
              );
            })
            .catch((error) => error);
        })
        .catch((error) => next(error));
    } catch (error) {
      next(error);
    }
  }
  // end create user post

  // start update user
  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_users
        .findOne({
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          res.render("dashboard/users/update", {
            title: "Dashboard | Update User",
            notification: req.flash("notification"),
            validationError: req.flash("validationError")[0] || {},
            userData: result,
            bodyData: req.flash("bodyData")[0],
          });
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end create user

  // start create user post
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
      if (!error.isEmpty()) {
        filesOperations.removeImg(req, "Users");
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/users/update/" + req.params.id
        );
        return;
      }
      const file = filesOperations.Rename_uploade_img(req);
      if (file) {
        filesOperations.removeImg(req, "Users", body.oldImage);
        body.image = file;
      } else {
        body.image = body.oldImage;
      }
      if (body.password) {
        body.password = bcrypt.hashSync(body.password, +process.env.saltRounds);
      } else {
        body.password = body.oldPassword;
      }

      body.active = body.active ? true : false;
      body.roles = body.isAdmin ? Roles.Admin : Roles.User;
      tbl_users
        .update(body, {
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/users/update/" + req.params.id,
            "user updated successful",
            "success"
          );
        });
    } catch (error) {
      next(error);
    }
  }
  // end create user post

  // start update personal data
  public async updatePersonalData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_users
        .findOne({
          where: {
            id: req.cookies.Admin.id,
          },
        })
        .then((result) => {
          res.render("dashboard/users/updatePersonalInformation", {
            title: "Dashboard | Update User",
            notification: req.flash("notification"),
            validationError: req.flash("validationError")[0] || {},
            userData: result,
            bodyData: req.flash("bodyData")[0],
          });
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end update personal data

  // start updatePersonalData post
  public async updatePersonalDataPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.cookies.Admin;
      const error = validationResult(req);
      const body = req.body;
      const filesOperations: FilesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      if (!error.isEmpty()) {
        filesOperations.removeImg(req, "Users");
        validationMessage.handel_validation_errors(
          req,
          res,
          error.errors,
          "/dashboard/users/update-personal-data"
        );
        return;
      }
      const file = filesOperations.Rename_uploade_img(req);
      if (file) {
        filesOperations.removeImg(req, "Users", body.oldImage);
        body.image = file;
      } else {
        body.image = body.oldImage;
      }
      if (body.password) {
        body.password = bcrypt.hashSync(body.password, +process.env.saltRounds);
      } else {
        body.password = body.oldPassword;
      }

      tbl_users
        .update(body, {
          where: {
            id: id,
          },
        })
        .then((result) => {
          res.clearCookie("Admin");
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/login",
            "your data updated successful login again",
            "success"
          );
        });
    } catch (error) {
      next(error);
    }
  }
  // end updatePersonalData post

  // start activation user
  public async activation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const validationMessage: ValidationMessage = new ValidationMessage();
      tbl_users
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
              ? "The user has been deactivated successfully"
              : "The user has been activated successfully";
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/users/",
            message,
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end activation user

  // start delete user
  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const filesOperations: FilesOperations = new FilesOperations();
      const validationMessage: ValidationMessage = new ValidationMessage();
      filesOperations.removeImg(req, "Users", body.image);
      tbl_users
        .destroy({
          where: {
            id: body.id,
          },
        })
        .then(() => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/users/",
            "The user has been deleted successfully",
            "success"
          );
        })
        .then((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end delete user
}

// 5501003003464$$$@
