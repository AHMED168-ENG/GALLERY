import { Request, Response, NextFunction } from "express";
import tbl_categorys from "../../models/categorys";
import tbl_products from "../../models/products";
import tbl_userSearch from "../../models/userSearch";
import { Op } from "sequelize";
import tbl_sliders from "../../models/sliders";
import {
  FilesOperations,
  Outhers,
  ValidationMessage,
} from "../../helpers/helper";
import tbl_comments from "../../models/comments";
import tbl_users from "../../models/users";
import tbl_rate from "../../models/userRate";
import tbl_favorits from "../../models/favorits";
import tbl_shopingcart from "../../models/shopingCart";
import tbl_testmonials from "../../models/testmonials";
import tbl_faqs from "../../models/faqs";
import tbl_stats_section from "../../models/statsSection";

class SitePagesController {
  constructor() {}

  // start show dashboard page
  public async home(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.cookies.User;
      let allCatigory = await tbl_categorys
        .scope("mainCategorys")
        .scope("active")
        .findAll({
          order: [["createdAt", "desc"]],
          limit: 12,
          attributes: [
            "image",
            "id",
            "category_ar",
            "category_en",
            "createdAt",
            "slug_ar",
            "slug_en",
          ],
          include: [
            { model: tbl_products, as: "products", attributes: ["id"] },
          ],
        });

      let productWithHigeRate = await tbl_products.scope("active").findAll({
        order: [["sumRate", "desc"]],
      });

      let latestProduct = await tbl_products.scope("active").findAll({
        limit: 8,
        order: [["createdAt", "desc"]],
        include: [{ model: tbl_rate, as: "allRate" }],
      });

      let categoryWithHighDescount = await tbl_products
        .scope("active")
        .findAll({
          limit: 8,
          order: [["descount", "desc"]],
          attributes: ["descount", "id", "category"],
          include: [{ model: tbl_categorys, as: "ProductCategory" }],
        });

      let productWithHighDescount = await tbl_products.scope("active").findAll({
        limit: 8,
        order: [["descount", "desc"]],
        include: [{ model: tbl_rate, as: "allRate" }],
        attributes: [
          "descount",
          "sumRate",
          "id",
          "category",
          "productImage",
          "price",
          "productName_ar",
          "productName_en",
          "slug_ar",
          "slug_en",
        ],
      });

      let productWithHighRate = await tbl_products.scope("active").findAll({
        limit: 8,
        order: [["sumRate", "desc"]],
        include: [{ model: tbl_rate, as: "allRate" }],
        attributes: [
          "descount",
          "id",
          "category",
          "productImage",
          "price",
          "productName_ar",
          "productName_en",
          "slug_ar",
          "slug_en",
          "sumRate",
        ],
      });

      let favoritProducts = [];
      let shopingCart = [];
      if (userData) {
        // start get all favorit product
        const myArrFavorit = await tbl_favorits.findAll({
          where: {
            userId: userData.id,
          },
          attributes: ["productId"],
        });

        const myArrCart = await tbl_shopingcart.findAll({
          where: {
            userId: userData.id,
          },
          attributes: ["productId"],
        });

        myArrFavorit.forEach((ele: any) => {
          favoritProducts.push(ele.productId);
        });

        myArrCart.forEach((ele: any) => {
          shopingCart.push(ele.productId);
        });

        let userSearch = await tbl_userSearch.findOne({
          where: {
            userId: userData.id,
          },
        });
      }

      let carosalsTop = await tbl_sliders.scope("active").findAll({
        where: {
          position: "HOME_TOP",
        },
      });

      // get some testmonials
      let someTestmonials = await tbl_testmonials.scope("active").findAll({
        limit: 6,
        order: [["rate", "desc"]],
        include: [{ model: tbl_users, as: "testmonialsUser" }],
      });

      // get stats section data
      let statsSection = await tbl_stats_section.findOne({});

      res.render("website/userpages/home", {
        title: "Home",
        notification: req.flash("notification"),
        allCatigory: allCatigory,
        latestProduct: latestProduct,
        productWithHigeRate: productWithHigeRate,
        productWithHighDescount: productWithHighDescount,
        categoryWithHighDescount: categoryWithHighDescount,
        productWithHighRate: productWithHighRate,
        carosalsTop: carosalsTop,
        catigorysRelatedWithSearch: [],
        productRelatedWithSearch: [],
        spechialVendoer: [],
        favoritProducts,
        shopingCart,
        someTestmonials,
        statsSection,
      });
    } catch (error) {
      next(error);
    }
  }

  // /all-categorys page
  public async allCategorys(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPageSite;
      let allCatigory = await tbl_categorys.scope("active").findAll({
        order: [["createdAt", "desc"]],
        offset: +((page - 1) * PAGE_ITEMS),
        limit: PAGE_ITEMS,
        attributes: [
          "image",
          "id",
          "category_ar",
          "category_en",
          "createdAt",
          "slug_ar",
          "slug_en",
        ],
        include: [
          {
            model: tbl_products,
            as: "products",
            attributes: ["id"],
          },
        ],
      });
      const allCatigoryCount = await tbl_categorys
        .scope("active")
        .findAndCountAll({});
      res.render("website/userpages/allCategorys", {
        title: "All Categorys",
        notification: req.flash("notification"),
        allCatigory: allCatigory,
        hasPrevious: page > 1,
        hasNext: PAGE_ITEMS * page < allCatigoryCount.count,
        nextPage: page + 1,
        previousPage: page - 1,
        curantPage: +page,
        allElementCount: allCatigoryCount.count,
        elements: +PAGE_ITEMS,
        lastPage: Math.ceil(allCatigoryCount.count / PAGE_ITEMS),
      });
    } catch (error) {
      next(error);
    }
  }
  // /all-categorys page

  // /all-Products page
  public async allProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.cookies.User;
      const Query = req.query;
      const page: any = Query.page || 1;
      let sorting: any = Query["sort"];
      if (sorting) {
        sorting = sorting.split(",");
      }
      const PAGE_ITEMS: string | number = +process.env.elementPerPageSite;
      const condition = {
        [Op.or]: [
          {
            productName_ar: { [Op.like]: `%${Query.products || ""}%` },
          },
          {
            productName_en: { [Op.like]: `%${Query.products || ""}%` },
          },
          {
            keyWord: { [Op.like]: `%${Query.products || ""}%` },
          },
          {
            fullDescription_ar: { [Op.like]: `%${Query.products || ""}%` },
          },
          {
            fullDescription_en: { [Op.like]: `%${Query.products || ""}%` },
          },
          {
            statmentDescription_ar: { [Op.like]: `%${Query.products || ""}%` },
          },
          {
            statmentDescription_en: { [Op.like]: `%${Query.products || ""}%` },
          },
        ],
        price:
          Query.priceMin && Query.priceMax
            ? {
                [Op.and]: [
                  {
                    [Op.gte]: Query.priceMin,
                  },
                  {
                    [Op.lte]: Query.priceMax,
                  },
                ],
              }
            : Query.priceMin && !Query.priceMax
            ? {
                [Op.gte]: Query.priceMin,
              }
            : !Query.priceMin && Query.priceMax
            ? { [Op.lte]: Query.priceMax }
            : { [Op.gt]: 0 },
        sumRate: Query.rate ? { [Op.lte]: Query.rate } : { [Op.gte]: 0 },
        descount: Query.descount
          ? Query.descount == "false"
            ? { [Op.eq]: 0 }
            : { [Op.gt]: 0 }
          : { [Op.gte]: 0 },
        shipping: Query.shipping
          ? Query.shipping == "false"
            ? { [Op.eq]: 0 }
            : { [Op.gt]: 0 }
          : { [Op.gte]: 0 },
      };
      let allProducts = await tbl_products.scope("active").findAndCountAll({
        where: condition,
        order: sorting ? [sorting] : [],
        offset: +((page - 1) * PAGE_ITEMS),
        limit: PAGE_ITEMS,
        distinct: true,
        include: [
          {
            model: tbl_categorys,
            as: "ProductCategory",
            required: true,
            where: Query.category
              ? {
                  [Op.or]: [
                    {
                      slug_ar: Query.category,
                    },
                    {
                      slug_en: Query.category,
                    },
                  ],
                }
              : {},
          },
          { model: tbl_rate, as: "allRate" },
        ],
      });

      let favoritProducts = [];
      let shopingCart = [];
      if (userData) {
        // start get all favorit product
        const myArrFavorit = await tbl_favorits.findAll({
          where: {
            userId: userData.id,
          },
          attributes: ["productId"],
        });
        const myArrCart = await tbl_shopingcart.findAll({
          where: {
            userId: userData.id,
          },
          attributes: ["productId"],
        });

        myArrFavorit.forEach((ele: any) => {
          favoritProducts.push(ele.productId);
        });
        myArrCart.forEach((ele: any) => {
          shopingCart.push(ele.productId);
        });
      }

      let allCategorys = await tbl_categorys.scope("active").findAll({});
      res.render("website/userpages/allProducts", {
        title: "All Categorys",
        notification: req.flash("notification"),
        allProducts: allProducts.rows,
        hasPrevious: page > 1,
        hasNext: PAGE_ITEMS * page < allProducts.count,
        nextPage: page + 1,
        previousPage: page - 1,
        curantPage: +page,
        allElementCount: allProducts.count,
        elements: +PAGE_ITEMS,
        lastPage: Math.ceil(allProducts.count / PAGE_ITEMS),
        allCategorys: allCategorys,
        favoritProducts: favoritProducts,
        shopingCart: shopingCart,
        Query: Query,
      });
    } catch (error) {
      next(error);
    }
  }
  // /all-Products page
  // /all-comments page
  public async allComments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const Query = req.query;
      const page: any = Query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPageSite;
      const othersFn = new Outhers();
      const product: any = await tbl_products.scope("active").findOne({
        where: {
          [Op.or]: [{ slug_ar: req.params.slug }, { slug_en: req.params.slug }],
        },
      });
      let order: any = Query.filter
        ? [[Query.filter, Query.type]]
        : [["createdAt", "desc"]];
      const allComments = await tbl_comments.scope("active").findAndCountAll({
        where: {
          productId: product.id,
          comment: {
            [Op.like]: Query.search ? "%" + Query.search + "%" : "%",
          },
        },
        offset: +((page - 1) * PAGE_ITEMS),
        limit: PAGE_ITEMS,
        distinct: true,
        order: order,
        include: [
          {
            model: tbl_users,
            as: "commentUser",
          },
        ],
      });
      res.render("website/userpages/allCommentsProduct", {
        title: "All Comments",
        notification: req.flash("notification"),
        allComments: allComments.rows,
        hasPrevious: page > 1,
        hasNext: PAGE_ITEMS * page < allComments.count,
        nextPage: page + 1,
        previousPage: page - 1,
        curantPage: +page,
        allElementCount: allComments.count,
        elements: +PAGE_ITEMS,
        lastPage: Math.ceil(allComments.count / PAGE_ITEMS),
        query: Query,
        formateDate: othersFn.formateDate,
        product,
      });
    } catch (error) {
      next(error);
    }
  }
  // /all-comments page

  // product details page
  public async productDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validationMessage = new ValidationMessage();
      const othersFn = new Outhers();
      const userData = req.cookies.User;
      // ================ find the product
      let product: any = await tbl_products.scope("active").findOne({
        where: {
          [Op.or]: [
            {
              slug_ar: req.params.slug,
            },
            {
              slug_en: req.params.slug,
            },
          ],
        },
        include: [
          {
            model: tbl_comments,
            as: "allComments",
            where: { active: true },
            limit: 2,
            order: [["createdAt", "desc"]],
            include: [
              {
                model: tbl_users,
                as: "commentUser",
                attributes: ["fName", "lName", "image", "id", "createdAt"],
              },
            ],
          },
          {
            model: tbl_rate,
            as: "allRate",
          },
          {
            model: tbl_categorys,
            as: "ProductCategory",
          },
        ],
      });

      // ================ if product not found return to all product page
      if (!product) {
        validationMessage.returnWithMessage(
          req,
          res,
          "/all-products",
          "this product not registed",
          "danger"
        );
        return;
      }
      // ================ find all coments to product
      let allComments = await tbl_comments.scope("active").findAndCountAll({
        where: {
          productId: product.id,
        },
      });
      // ================ find all product rate
      let allProductRate = await tbl_rate.findAll({
        where: {
          productId: product.id,
        },
        include: [{ model: tbl_users, as: "rateUser", attributes: ["id"] }],
      });

      let favoritProducts = [];
      let userRate: any = null;
      let shopingCart = [];
      if (userData) {
        userRate = allProductRate.find(
          (element: any) => element.userId == userData.id
        );

        // favorit cart
        const myArrFavorit = await tbl_favorits.findAll({
          where: {
            userId: userData.id,
          },
          attributes: ["productId"],
        });
        const myArrCart = await tbl_shopingcart.findAll({
          where: {
            userId: userData.id,
          },
          attributes: ["productId"],
        });

        myArrFavorit.forEach((ele: any) => {
          favoritProducts.push(ele.productId);
        });
        myArrCart.forEach((ele: any) => {
          shopingCart.push(ele.productId);
        });
      }

      const productRelated: any = await tbl_products.scope("active").findAll({
        where: {
          id: { [Op.ne]: product.id },
          category: product.category,
        },
        limit: 8,
        order: [["createdAt", "desc"]],
        include: [{ model: tbl_rate, as: "allRate" }],
      });

      res.render("website/userpages/productDetails", {
        title: "Product Details",
        notification: req.flash("notification"),
        product: product,
        allComments: allComments,
        allProductRate: allProductRate,
        userRate: userRate,
        productRelated: productRelated,
        sumOfRate: othersFn.getSumeOfArray,
        favoritProducts,
        shopingCart,
      });
    } catch (error) {
      next(error);
    }
  }
  // product details page

  // contactUs page
  public async contactUs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(process.env.recaptcherSecretKey);
      res.render("website/userpages/contactUs", {
        title: "contactUs",
        notification: req.flash("notification"),
        secretKey: process.env.recaptcherSecretKey,
      });
    } catch (error) {
      next(error);
    }
  }
  // contactUs page

  // testmonials page
  public async showTestmonials(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const Query = req.query;
      const page: any = Query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPageSite;

      tbl_testmonials
        .scope("active")
        .findAndCountAll({
          offset: +((page - 1) * PAGE_ITEMS),
          limit: PAGE_ITEMS,
          distinct: true,
          include: [
            {
              model: tbl_users,
              as: "testmonialsUser",
            },
          ],
        })
        .then((result) => {
          res.render("website/userpages/testmonialsPage", {
            title: "All testmonials",
            notification: req.flash("notification"),
            allTestmonials: result.rows,
            hasPrevious: page > 1,
            hasNext: PAGE_ITEMS * page < result.count,
            nextPage: page + 1,
            previousPage: page - 1,
            curantPage: +page,
            allElementCount: result.count,
            elements: +PAGE_ITEMS,
            lastPage: Math.ceil(result.count / PAGE_ITEMS),
            query: Query,
            numberOfLetters: +process.env.NUMBER_OF_LETTERS_OF_TESTMONIAL,
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // testmonials page

  // faqs page
  public async faqs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const Query = req.query;
      const page: any = Query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPageSite;
      tbl_faqs
        .scope("active")
        .findAndCountAll({
          offset: +((page - 1) * PAGE_ITEMS),
          limit: PAGE_ITEMS,
          order: [["createdAt", "desc"]],
        })
        .then((result) => {
          res.render("website/userpages/faqs", {
            title: "All faqs",
            notification: req.flash("notification"),
            allfaqs: result.rows,
            hasPrevious: page > 1,
            hasNext: PAGE_ITEMS * page < result.count,
            nextPage: page + 1,
            previousPage: page - 1,
            curantPage: +page,
            allElementCount: result.count,
            elements: +PAGE_ITEMS,
            lastPage: Math.ceil(result.count / PAGE_ITEMS),
            query: Query,
            numberOfLetters: +process.env.NUMBER_OF_LETTERS_OF_TESTMONIAL,
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // faqs page
}
// end show dashboard page

export default SitePagesController;
