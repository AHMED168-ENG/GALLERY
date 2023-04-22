import { NextFunction, Request, Response } from "express";
import { Outhers, ValidationMessage } from "../../helpers/helper";
import tbl_favorits from "../../models/favorits";
import tbl_products from "../../models/products";
import tbl_shopingcart from "../../models/shopingCart";

export class FavoritProductsController {
  constructor() {}

  // add favorit Product
  public async addFavoritProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const favoritProduct = await tbl_favorits.findOne({
        where: {
          userId: body.userId,
          productId: body.productId,
        },
      });
      let isCreat = false;
      if (favoritProduct) {
        await tbl_favorits.destroy({
          where: {
            userId: body.userId,
            productId: body.productId,
          },
        });
      } else {
        isCreat = true;
        await tbl_favorits.create(body);
      }

      if (isCreat) {
        res.send({
          status: true,
          message: "this product added to favorit cart successful",
        });
      } else {
        res.send({
          status: true,
          message: "this product removed from favorit cart successful",
        });
      }
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  }

  // show favorit cart
  public async showFavoritCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      const userData = req.cookies.User;
      let shopingCart = [];
      const myArrCart = await tbl_shopingcart.findAll({
        where: {
          userId: userData.id,
        },
        attributes: ["productId"],
      });

      myArrCart.forEach((ele: any) => {
        shopingCart.push(ele.productId);
      });
      tbl_favorits
        .findAndCountAll({
          distinct: true,
          include: [
            {
              model: tbl_products,
              as: "favoritProduct",
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
                "productImage",
              ],
            },
          ],
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          where: {
            userId: userData.id,
          },
          limit: +PAGE_ITEMS,
        })
        .then((result) => {
          res.render("website/userpages/favoritCart", {
            title: " All Favorit Product",
            notification: req.flash("notification"),
            allFavoritProducts: result.rows,
            hasPrevious: page > 1,
            hasNext: PAGE_ITEMS * page < result.count,
            nextPage: page + 1,
            previousPage: page - 1,
            curantPage: +page,
            allElementCount: result.count,
            elements: +PAGE_ITEMS,
            lastPage: Math.ceil(result.count / PAGE_ITEMS),
            shopingCart,
          });
        });
    } catch (error) {
      next(error);
    }
  }
}
