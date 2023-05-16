import { Request, Response, NextFunction } from "express";
import tbl_orders from "../../models/orders";
import tbl_users from "../../models/users";
import tbl_productsOrder from "../../models/productsOrders";
import tbl_products from "../../models/products";
import { Outhers } from "../../helpers/helper";
import tbl_messages from "../../models/messages";

class DashboardController {
  constructor() {}

  // start show dashboard page
  public async dashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const others: Outhers = new Outhers();

      tbl_orders
        .findAll({
          order: [["createdAt", "desc"]],
          limit: 10,
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
        .then(async (orders) => {
          const lastMessages = await tbl_messages.findAll({
            limit: 10,
            include: [{ model: tbl_users, as: "messageUser" }],
          });
          res.render("dashboard/dashboard", {
            title: "Dashboard",
            notification: req.flash("notification"),
            webSeting: {},
            orders: orders,
            finalPriceForAdmin: others.finalPriceForAdmin,
            formateDate: others.formateDate,
            lastMessages,
          });
        });
    } catch (error) {
      next(error);
    }
  }
}
// end show dashboard page

export default DashboardController;
