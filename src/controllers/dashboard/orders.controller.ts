import { NextFunction, Request, Response } from "express";
import { ValidationMessage, Outhers, OrdersPdf } from "../../helpers/helper";
import tbl_products from "../../models/products";
import tbl_shopingcart from "../../models/shopingCart";
import tbl_orders from "../../models/orders";
import tbl_users from "../../models/users";
import { Op } from "sequelize";
import tbl_productsOrder from "../../models/productsOrders";
import tbl_app_settings from "../../models/appSeting";

export class Orders {
  constructor() {}

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
            {
              model: tbl_productsOrder,
              as: "productOrderTable",
              include: [{ model: tbl_products, as: "productTable" }],
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
          // git all price for every thing for order
          const totalOfAll = others.finalPriceForAdmin(
            result.productOrderTable
          );

          res.render("dashboard/orders/showOrder", {
            title: " Dashboard | Show Order",
            notification: req.flash("notification"),
            order: result,
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

  // ============================ this part belong to front end view =========================
  // show Order Page from user from front (view)
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
            title: "mackOrder",
            notification: req.flash("notification"),
            // allFavoritProducts: result,
            totalOfAll,
            allProductCart: result,
            metaKeywords: null,
            metaDescription: null,
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // add order post from user from front (view)
  public async addOrderPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ordersPdf = new OrdersPdf();
      const userData = req.cookies.User;
      const lng = req.cookies.lng;
      tbl_shopingcart
        .findAll({
          where: {
            userId: userData.id,
          },
        })
        .then((result: any) => {
          tbl_orders
            .create({
              userId: userData.id,
            })
            .then(async (order: any) => {
              for (var x = 0; x < result.length; x++) {
                await tbl_productsOrder.create({
                  orderId: order.id,
                  productId: result[x].productId,
                  productCount: result[x].count,
                });
              }
              const orderData: any = await tbl_orders.findOne({
                where: {
                  id: order.id,
                },
                include: [
                  {
                    model: tbl_productsOrder,
                    as: "productOrderTable",
                    include: [{ model: tbl_products, as: "productTable" }],
                  },
                ],
              });
              console.log(orderData.productOrderTable);

              // await tbl_shopingcart.destroy({
              //   where: {
              //     userId: userData.id,
              //   },
              // });
              // ============== get app name for use in pdf name
              const app_setting = await tbl_app_settings.findOne({
                attributes: ["sitName_en"],
              });

              // ============== create pdf =================
              ordersPdf.createPdf(res, app_setting, orderData, req.t, lng , req.cookies.User);
              res.send({
                status: true,
                message: req.t("orderCreate"),
              });
            })
            .catch((error) => error);
        })
        .catch((error) => error);
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  }
  // show all Orders that belong to user
  public async userOrders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const othersFn = new Outhers();
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPageSite;
      tbl_orders
        .findAndCountAll({
          distinct: true,
          order: [["createdAt", "desc"]],
        })
        .then((result) => {
          res.render("website/userpages/userOrders", {
            title: "yourOrders",
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
            metaKeywords: null,
            metaDescription: null,
            formateDate: othersFn.formateDate,
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // show all Orders that belong to user
  // show Orders that belong to user
  public async showOrderDetailsForUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const others: Outhers = new Outhers();
      const userData = req.cookies.User;
      tbl_orders
        .findOne({
          order: [["createdAt", "desc"]],
          where: {
            id: req.params.id,
            userId: userData.id,
          },
          include: [
            {
              model: tbl_productsOrder,
              as: "productOrderTable",
              include: [{ model: tbl_products, as: "productTable" }],
            },
          ],
        })
        .then(async (result: any) => {
          if (!result) {
            return res.redirect("/your-orders");
          }
          // git all price for every thing for order
          const totalOfAll = others.finalPriceForAdmin(
            result.productOrderTable
          );

          res.render("website/userpages/showOrderDetails", {
            title: " Dashboard | Show Order",
            notification: req.flash("notification"),
            order: result,
            totalOfAll,
            getTotalPriceForOneProduct: others.priceForOneProduct,
            metaKeywords: null,
            metaDescription: null,
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // show Orders that belong to user
  // download order pdf
  public async downloadOrderPdf(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ordersPdf = new OrdersPdf();
      const params = req.params;
      const userData = req.cookies.User;

      tbl_orders
        .findOne({
          where: {
            id: params.id,
            userId: userData.id,
          },
        })
        .then(async (result) => {
          // ============== get app name for use in pdf name
          const app_setting = await tbl_app_settings.findOne({
            attributes: ["sitName_en"],
          });
          ordersPdf.downloadPdf(res, app_setting, params.id);
        })
        .catch((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // ============================ this part belong to front end view =========================
}
