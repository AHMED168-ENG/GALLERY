import { Router } from "express";
import { FilesOperations } from "../../helpers/helper";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import { Orders } from "../../controllers/dashboard/orders.controller";

export class OrdersRoutes {
  public Router: Router;
  private orders: Orders;
  private isAuthonticate: IsAuthonticate;
  constructor() {
    this.orders = new Orders();
    this.isAuthonticate = new IsAuthonticate();
    this.Router = Router();
    this.routes();
  }
  routes(): void {
    // show all orders
    this.Router.get(
      "/",
      this.isAuthonticate.isAuthonticate,
      this.orders.allOrders
    );

    // show all orders not seen
    this.Router.get(
      "/not-seen/",
      this.isAuthonticate.isAuthonticate,
      this.orders.allOrdersNotSeen
    );
    // show all orders is not finished
    this.Router.get(
      "/not-finished/",
      this.isAuthonticate.isAuthonticate,
      this.orders.allOrdersNotFinished
    );
    // show all orders is finished
    this.Router.get(
      "/finished/",
      this.isAuthonticate.isAuthonticate,
      this.orders.allOrdersFinished
    );
    // mack order finished
    this.Router.post(
      "/finishOrder",
      this.isAuthonticate.isAuthonticate,
      this.orders.finishOrder
    );
    // delete order
    this.Router.post(
      "/delete",
      this.isAuthonticate.isAuthonticate,
      this.orders.deleteOrder
    );
    // mack order finished
    this.Router.get(
      "/:id",
      this.isAuthonticate.isAuthonticate,
      this.orders.showOrder
    );
  }
}
