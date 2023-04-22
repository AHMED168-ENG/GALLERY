import { NextFunction, Request, Response } from "express";
import { ValidationMessage, Outhers } from "../../helpers/helper";
import tbl_products from "../../models/products";
import tbl_shopingcart from "../../models/shopingCart";
import tbl_orders from "../../models/orders";
import tbl_users from "../../models/users";
import { Op } from "sequelize";

export class Orders {
  constructor() {}

  // start websit part

  // show Order Page
  public async showOrderPage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const others = new Outhers();
      const userData = req.cookies.User;
      tbl_shopingcart
        .findAll({
          where: {
            userId: userData.id,
          },
          include: [
            {
              model: tbl_products,
              as: "cartProduct",
              attributes: [
                "id",
                "slug_ar",
                "slug_en",
                "price",
                "productName_ar",
                "productName_en",
                "shipping",
                "descount",
                "structure",
              ],
            },
          ],
        })
        .then((result) => {
          if (result.length == 0) {
            res.redirect("/home");
            return;
          }
          const totalOfAll = others.finalPrice(result);
          res.render("website/userpages/mackOrder", {
            title: " Mack Order",
            notification: req.flash("notification"),
            allFavoritProducts: result,
            totalOfAll,
            allProductCart: result,
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // add order post
  public async addOrderPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validationMessage = new ValidationMessage();
      const userData = req.cookies.User;
      const lang = req.cookies.lang;
      tbl_shopingcart
        .findAll({
          include: [
            {
              model: tbl_products,
              as: "cartProduct",
              attributes: [
                "id",
                "slug_ar",
                "slug_en",
                "price",
                "productName_ar",
                "productName_en",
                "shipping",
                "descount",
                "structure",
              ],
            },
          ],
          where: {
            userId: userData.id,
          },
        })
        .then((result) => {
          let productId: string = "";
          let productCount: string = "";
          result.forEach((ele: any) => {
            productId += ele.cartProduct.id + ",";
            productCount += ele.count + ",";
          });
          tbl_orders
            .create({
              userId: userData.id,
              productsId: productId,
              productsCount: productCount,
            })
            .then(async () => {
              await tbl_shopingcart.destroy({
                where: {
                  userId: userData.id,
                },
              });
              const message =
                lang != "en"
                  ? "your order is creating now and the admin will contact you in 48 houre and we empty your cart"
                  : "الطلب الخاص بك تم انشاءه انتظر حتي يتم الاتصال بك ومتابعه التفاصيل وتم تفريغ الكارت الخاص بيك";
              validationMessage.returnWithMessage(
                req,
                res,
                "/shoping-cart",
                message,
                "success"
              );
            });
        });
    } catch (error) {
      next(error);
    }
  }

  // start dashboard part
  // show all Order Page
  public async allOrders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_orders
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          include: [
            {
              model: tbl_users,
              as: "orderUser",
            },
          ],
        })
        .then((result) => {
          res.render("dashboard/orders/allOrders", {
            title: " all Orders",
            notification: req.flash("notification"),
            allOrders: result.rows,
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

  // show order
  public async showOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const others: Outhers = new Outhers();
      const validationMessage: ValidationMessage = new ValidationMessage();
      // start mack order seen
      tbl_orders.update(
        { isSeen: true },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      // end mack order seen

      let productIdOrder: string[];
      tbl_orders
        .findOne({
          order: [["createdAt", "desc"]],
          where: {
            id: req.params.id,
          },
          include: [
            {
              model: tbl_users,
              as: "orderUser",
            },
          ],
        })
        .then(async (result: any) => {
          if (!result) {
            return validationMessage.returnWithMessage(
              req,
              res,
              "/dashboard/orders/",
              "this order not registed hir",
              "danger"
            );
          }
          productIdOrder = result.productsId.split(",");
          // get all product
          const allProducts = await tbl_products.findAll({
            attributes: [
              "productName_en",
              "id",
              "price",
              "shipping",
              "descount",
              "structure",
              "productImage",
            ],
            where: {
              id: {
                [Op.in]: productIdOrder,
              },
            },
          });
          // git all price for every thing for order
          const totalOfAll = others.finalPriceForAdmin(allProducts, result);

          res.render("dashboard/orders/showOrder", {
            title: " Dashboard | Show Order",
            notification: req.flash("notification"),
            order: result,
            allProducts,
            totalOfAll,
            getTotalPriceForOneProduct: others.priceForOneProduct,
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // show all Order finished Page
  public async allOrdersFinished(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_orders
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          where: {
            isFinished: true,
          },
          include: [
            {
              model: tbl_users,
              as: "orderUser",
            },
          ],
        })
        .then((result) => {
          res.render("dashboard/orders/allOrdersFinished", {
            title: " all Orders",
            notification: req.flash("notification"),
            allOrders: result.rows,
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
  // show all Order not finished Page
  public async allOrdersNotFinished(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_orders
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          where: {
            isFinished: false,
          },
          include: [
            {
              model: tbl_users,
              as: "orderUser",
            },
          ],
        })
        .then((result) => {
          res.render("dashboard/orders/allOrdersNotFinished", {
            title: " all Orders",
            notification: req.flash("notification"),
            allOrders: result.rows,
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
  // show all Order not seen Page
  public async allOrdersNotSeen(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_orders
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          where: {
            isSeen: false,
          },
          include: [
            {
              model: tbl_users,
              as: "orderUser",
            },
          ],
        })
        .then((result) => {
          res.render("dashboard/orders/allOrdersNotSeen", {
            title: " all Orders",
            notification: req.flash("notification"),
            allOrders: result.rows,
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
  // mack order finished
  public async finishOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const isFinished = req.body.isFinished;
      const validationMessage = new ValidationMessage();
      tbl_orders
        .update(
          { isFinished: isFinished == "true" ? false : true },
          {
            where: {
              id: req.body.id,
            },
          }
        )
        .then((result) => {
          const message =
            isFinished == "false"
              ? "the order has finished successful"
              : "the order has become unfit successful";
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/orders/",
            message,
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // delete order
  public async deleteOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validationMessage = new ValidationMessage();
      tbl_orders
        .destroy({
          where: {
            id: req.body.id,
          },
        })
        .then((result) => {
          const message = "the order has deleted successful";
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/orders/",
            message,
            "success"
          );
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
}
