import { NextFunction, Request, Response } from "express";
import tbl_shopingcart from "../../models/shopingCart";
import { Outhers } from "../../helpers/helper";
import tbl_products from "../../models/products";

export class ShopingCartController {
  constructor() {}

  // add Product to cart
  public async addShopingCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      // start find the cart in your cart table
      const userCart = await tbl_shopingcart.findOne({
        where: {
          userId: body.userId,
          productId: body.productId,
        },
      });
      let isCreat = false;
      // if ther is cart remove it
      if (userCart) {
        await tbl_shopingcart.destroy({
          where: {
            userId: body.userId,
            productId: body.productId,
          },
        });
      } else {
        // if no  cart create it
        isCreat = true;
        const TIME_OF_PRODUCT_IN_CART = +process.env.TIME_OF_PRODUCT_IN_CART;
        body.finishingTime =
          Date.now() + TIME_OF_PRODUCT_IN_CART * 60 * 60 * 1000;
        // body.finishingTime = Date.now() + 120 * 1000;
        await tbl_shopingcart.create(body);
      }

      if (isCreat) {
        res.send({
          status: true,
          message: req.t("productAddToShopingCart"),
        });
      } else {
        res.send({
          status: true,
          message: req.t("productRemoveToShopingCart"),
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        status: false,
        message: error.message,
      });
    }
  }

  // show shoping cart
  public async showShopingCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.cookies.User;
      const others = new Outhers();
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_shopingcart
        .findAndCountAll({
          distinct: true,
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
                "productImage",
                "structure",
              ],
            },
          ],
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
          where: {
            userId: userData.id,
          },
        })
        .then((result: any) => {
          const totalOfAll = others.finalPrice(result.rows);
          res.render("website/userpages/shopingCart", {
            title: "shopingCart",
            notification: req.flash("notification"),
            allShopingProducts: result.rows,
            hasPrevious: page > 1,
            hasNext: PAGE_ITEMS * page < result.count,
            nextPage: page + 1,
            previousPage: page - 1,
            curantPage: +page,
            allElementCount: result.count,
            elements: +PAGE_ITEMS,
            lastPage: Math.ceil(result.count / PAGE_ITEMS),
            totalOfAll,
            TIME_OF_PRODUCT_IN_CART: +process.env.TIME_OF_PRODUCT_IN_CART,
            metaKeywords: null,
            metaDescription: null,
          });
        });
    } catch (error) {
      next(error);
    }
  }

  // change product count in shopcart
  public async changeCountInShopCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const lng = req.cookies.lng;
      const TIME_OF_PRODUCT_IN_CART = +process.env.TIME_OF_PRODUCT_IN_CART;
      body.finishingTime =
        Date.now() + TIME_OF_PRODUCT_IN_CART * 60 * 60 * 1000;
      tbl_shopingcart
        .findOne({
          where: {
            userId: body.userId,
            productId: body.productId,
          },
        })
        .then((result) => {
          if (result) {
            tbl_shopingcart
              .update(
                {
                  count: body.count,
                  finishingTime: body.finishingTime,
                },
                {
                  where: {
                    userId: body.userId,
                    productId: body.productId,
                  },
                }
              )
              .then((result) => {
                let message = req.t("productCount");
                res.send({ status: true, message: message, isCreate: false });
              });
          } else {
            tbl_shopingcart.create(body).then((result) => {
              let message = req.t("addToCart");
              res.send({ status: true, message: message, isCreate: true });
            });
          }
        });
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  }
}
