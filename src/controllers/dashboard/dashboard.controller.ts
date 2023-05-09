import { Request, Response, NextFunction } from "express";
import tbl_orders from "../../models/orders";
import tbl_users from "../../models/users";
import tbl_productsOrder from "../../models/productsOrders";
import tbl_products from "../../models/products";
import { Outhers } from "../../helpers/helper";

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
              model: tbl_productsOrder,
              as: "productOrderTable",
              include: [{ model: tbl_products, as: "productTable" }],
            },
          ],
        })
        .then((orders) => {
          res.render("dashboard/dashboard", {
            title: "Dashboard",
            notification: req.flash("notification"),
            webSeting: {},
            orders: orders,
            finalPriceForAdmin: others.finalPriceForAdmin,
          });
        });
    } catch (error) {
      next(error);
    }
  }
}
// end show dashboard page

export default DashboardController;
