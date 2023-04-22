import { NextFunction, Request, Response } from "express";
import tbl_comments from "../../models/comments";
import tbl_users from "../../models/users";
import { Outhers, ValidationMessage } from "../../helpers/helper";
import tbl_rate from "../../models/userRate";
import tbl_products from "../../models/products";

export class CommentsController {
  constructor() {}
  // all comment to product
  public async findAllForAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_comments
        .scope("active")
        .findAndCountAll({
          include: [{ model: tbl_users, as: "commentUset" }],
          where: {
            productId: req.params.id,
          },
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
        })
        .then((result) => {
          res.render("/allComments", {
            title: "All Comments",
            allComments: result,
            notification: req.flash("notification"),
            hasPrevious: page > 1,
            hasNext: PAGE_ITEMS * page < result.count,
            nextPage: page + 1,
            previousPage: page - 1,
            curantPage: +page,
            allElementCount: result.count,
            elements: +PAGE_ITEMS,
            lastPage: Math.ceil(result.count / PAGE_ITEMS),
          });
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  
  // all comment to product
  public async findAllForUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_comments
        .scope("active")
        .findAndCountAll({
          include: [{ model: tbl_users, as: "commentUset" }],
          where: {
            productId: req.params.id,
          },
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
        })
        .then((result) => {
          res.render("/allComments", {
            title: "All Comments",
            allComments: result,
            notification: req.flash("notification"),
            hasPrevious: page > 1,
            hasNext: PAGE_ITEMS * page < result.count,
            nextPage: page + 1,
            previousPage: page - 1,
            curantPage: +page,
            allElementCount: result.count,
            elements: +PAGE_ITEMS,
            lastPage: Math.ceil(result.count / PAGE_ITEMS),
          });
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }

  // create comment from user
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;

      tbl_comments.create(body).then(() => {
        console.log(req.cookies.User);
        res.send({
          status: true,
          message: "comment added successful",
          userData: req.cookies.User,
        });
      });
    } catch (error) {
      res.send({ status: false, message: error.message });
    }
  }
  // show comment for admin
  public async showComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      tbl_comments
        .findOne({
          where: {
            id: req.params.id,
          },
          include: [{ model: tbl_users, as: "commentUset" }],
        })
        .then((result) => {
          res.send(result);
        });
    } catch (error) {
      next(error);
    }
  }
  // change activation from admin
  public async activation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const commentState = body.state;
      tbl_comments
        .update(
          {
            active: commentState == "true" ? false : true,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        )
        .then(() => {
          res.send({ status: true, message: true });
        });
    } catch (error) {
      res.send({ status: false, message: true });
    }
  }

  // change delete from admin
  public async deleteCommentFromAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const validationMessage = new ValidationMessage();
      tbl_comments
        .destroy({
          where: {
            id: req.params.id,
          },
        })
        .then(() => {
          validationMessage.returnWithMessage(
            req,
            res,
            "",
            "deleted successful",
            "danger"
          );
        });
    } catch (error) {
      next(error);
    }
  }
  // change delete from admin
  public async deleteCommentFromUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_comments
        .destroy({
          where: {
            id: req.params.id,
          },
        })
        .then(() => {
          res.send({
            status: true,
            message: "deleted successful",
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // add rate
  public async addRate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const otherFun = new Outhers();
      const body = req.body;
      const userRate = await tbl_rate.findOne({
        where: {
          userId: body.userId,
          productId: body.productId,
        },
      });
      let isCreat = false;
      if (userRate) {
        await tbl_rate.update(body, {
          where: {
            userId: body.userId,
            productId: body.productId,
          },
        });
      } else {
        isCreat = true;
        await tbl_rate.create(body);
      }
      const allRateForProduct = await tbl_rate.findAll({
        where: {
          productId: body.productId,
        },
        attributes: ["rate"],
      });
      let sumRate = otherFun.getSumeOfArray(allRateForProduct);
      sumRate = (sumRate * 100) / (allRateForProduct.length * 5) / 20;
      tbl_products.update(
        {
          sumRate: sumRate,
        },
        {
          where: {
            id: body.productId,
          },
        }
      );
      if (isCreat) {
        res.send({
          status: true,
          message: "your rate added successful",
        });
      } else {
        res.send({
          status: true,
          message: "your rate update successful",
        });
      }
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  }
}
