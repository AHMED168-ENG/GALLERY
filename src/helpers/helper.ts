import { Request, Response } from "express";

import path from "path";
import multer from "multer";
import fs from "fs";
import tbl_users from "../models/users";
import tbl_categorys from "../models/categorys";
import tbl_products from "../models/products";
import tbl_sliders from "../models/sliders";
import tbl_faqs from "../models/faqs";
import moment from "moment";
import tbl_favorits from "../models/favorits";
import tbl_shopingcart from "../models/shopingCart";
import tbl_testmonials from "../models/testmonials";
import tbl_orders from "../models/orders";
export class ValidationMessage {
  constructor() {}
  // about return to eny url with message
  returnWithMessage(
    req: Request,
    res: Response,
    url: string,
    message: string,
    type: string
  ) {
    message = message ? message : "هناك خطا ما ويرجي التحقق من الكود";
    type = type ? type : "danger";
    req.flash("notification", [type, message]);
    res.redirect(url);
  }
  // about return to eny url with message

  // about handel errors that appert whene dataenter
  handel_validation_errors(
    req: Request,
    res: Response,
    errors: any,
    path: string
  ) {
    var param = [];
    var newError: any = {};

    errors.forEach((element: any) => {
      if (!param.includes(element.param)) {
        param.push(element.param);
        newError[element.param] = [element];
      } else {
        newError[element.param].push(element);
      }
    });

    req.flash("validationError", newError);
    req.flash("bodyData", req.body);
    res.redirect(path);
  }
  // about handel errors that appert whene dataenter
}

export class FilesOperations {
  // this function occure about uploading multable file in one field
  public uploade_img(path: string, image: string): any {
    return multer({ dest: path }).array(image);
  }

  // this function occure about uploading multable file in multable field
  public uploade_img_multi_fild(array: any, dest: string): any {
    return multer({ dest: dest }).fields(array);
  }

  // remove single image
  public removeImg(req: any, folder: string, imgname?: string): void {
    if (!imgname) {
      req.files.forEach((element: { path: string }) => {
        fs.unlinkSync(element.path);
      });
    } else {
      let ImgName = imgname.split("--");
      for (var i = 0; i < ImgName.length - 1; i++) {
        fs.unlink(
          path.join("assets/dashboard/" + folder + "/" + ImgName[i]),
          () => {}
        );
      }
    }
  }

  // remove all image in all fields
  public removeImgFiled(fields: { path: string }[][]): void {
    fields.forEach((element) => {
      if (element) {
        element.forEach((element, i) => {
          fs.unlinkSync(element.path);
        });
      }
    });
  }

  // rename images in multable fields
  public Rename_uploade_img_multiFild(
    fields: {
      destination: string;
      path: string;
      originalname: string;
      fieldname: string;
    }[][]
  ): {} {
    var fileds_img = {};
    var image = "";
    fields.forEach((element) => {
      if (element) {
        element.forEach((element, i) => {
          var randomNumber = Date.now();
          var newPath =
            element.destination + "/" + randomNumber + element.originalname;
          fs.renameSync(element.path, newPath);
          image += randomNumber + element.originalname + "--";
        });
        fileds_img[element[0].fieldname] = image;
        image = "";
      }
    });
    return fileds_img;
  }

  public Rename_uploade_img(req: any): string {
    var image = "";
    req.files.forEach(
      (element: {
        destination: string;
        originalname: string;
        path: string;
        fieldname: string;
      }) => {
        var randomNumber = Date.now();
        var newPath =
          element.destination + "/" + randomNumber + element.originalname;
        fs.renameSync(element.path, newPath);
        image += randomNumber + element.originalname + "--";
      }
    );
    return image;
  }
}

/*------------------------------------ class start function -------------------------------*/
export class StartActions {
  public async startFunctionForDashboard(
    req: Request,
    res: Response,
    url: string,
    csrfToken: string
  ): Promise<void> {
    const users = await tbl_users.findAndCountAll();
    const usersNotActive = await tbl_users.scope("notActive").findAndCountAll();
    // main categorys
    const mainCategorys = await tbl_categorys
      .scope("mainCategorys")
      .findAndCountAll();
    const mainCategorysNotActive = await tbl_categorys
      .scope("mainCategorys")
      .scope("notActive")
      .findAndCountAll();
    // sup categorys
    const supCategorys = await tbl_categorys
      .scope("supCategorys")
      .findAndCountAll();
    const supCategorysNotActive = await tbl_categorys
      .scope("supCategorys")
      .scope("notActive")
      .findAndCountAll();
    const products = await tbl_products.findAndCountAll();
    const productsNotActive = await tbl_products
      .scope("notActive")
      .findAndCountAll();
    const sliders = await tbl_sliders.findAndCountAll();
    const slidersNotActive = await tbl_sliders
      .scope("notActive")
      .findAndCountAll();
    // faqs statistic
    const faqs = await tbl_faqs.findAndCountAll();
    const faqsNotActive = await tbl_faqs.scope("notActive").findAndCountAll();
    // testmonial statistic
    const testmonial = await tbl_testmonials.findAndCountAll();
    const testmonialNotActive = await tbl_testmonials
      .scope("notActive")
      .findAndCountAll();
    // orders statistic
    const order = await tbl_orders.findAndCountAll();
    const orderNotSeen = await tbl_orders.scope("NotSeen").findAndCountAll();
    const FeaturesNumber = {
      users: users.count,
      usersNotActive: usersNotActive.count,
      mainCategorys: mainCategorys.count,
      mainCategorysNotActive: mainCategorysNotActive.count,
      supCategorys: supCategorys.count,
      supCategorysNotActive: supCategorysNotActive.count,
      products: products.count,
      productsNotActive: productsNotActive.count,
      sliders: sliders.count,
      slidersNotActive: slidersNotActive.count,
      faqsCount: faqs.count,
      faqsNotActive: faqsNotActive.count,
      testmonias: testmonial.count,
      testmonialNotActive: testmonialNotActive.count,
      orderCount: order.count,
      orderNotActive: orderNotSeen.count,
    };
    //   homeLocalization.setLocale(lang);
    //   res.locals.lang = lang == "eng" ? "en" : "gr";

    res.locals.URL = url;
    res.locals.adminData = req.cookies.Admin;
    res.locals.FeaturesNumber = FeaturesNumber;

    //   res.locals.webSeting = webSeting;
    res.locals.csrf = csrfToken;
  }
  public async startFunctionForSite(
    req: Request,
    res: Response,
    url: string,
    csrfToken: string
  ): Promise<void> {
    const userData = req.cookies.User;
    const lang = req.cookies.lang ? req.cookies.lang : "en";
    // res.cookie("lang", lang);
    // asideLocalization.setLocale(lang);
    // navLocalization.setLocale(lang);
    // res.locals.asideLocalization = asideLocalization.translate;
    // res.locals.navLocalization = navLocalization.translate;

    // all categorys for navbare

    let allUserFavorit: any = [];
    let cartAllProduct: any = [];
    if (userData) {
      // start get all favorit product number
      allUserFavorit = await tbl_favorits.findAndCountAll({
        where: {
          userId: userData.id,
        },
      });
      // start get all cart product number
      cartAllProduct = await tbl_shopingcart.findAndCountAll({
        where: {
          userId: userData.id,
        },
      });
      cartAllProduct.rows.forEach((ele) => {
        if (Date.now() >= ele.finishingTime) {
          tbl_shopingcart.destroy({
            where: {
              id: ele.id,
            },
          });
        }
      });
    }

    let allCatigoryForNave = await tbl_categorys
      .scope("mainCategorys")
      .scope("active")
      .findAll({
        order: [["createdAt", "desc"]],
        limit: 10,
        attributes: [
          "category_en",
          "category_ar",
          "id",
          "createdAt",
          "slug_ar",
          "slug_en",
        ],
        include: [
          {
            model: tbl_categorys,
            as: "allSupCategorys",
            attributes: [
              "category_en",
              "category_ar",
              "id",
              "createdAt",
              "slug_ar",
              "slug_en",
            ],
          },
        ],
      });
    //   homeLocalization.setLocale(lang);
    //   res.locals.lang = lang == "eng" ? "en" : "gr";

    res.locals.URL = url;
    res.locals.userData = userData;
    res.locals.allUserFavorit = allUserFavorit.count || 0;
    res.locals.cartAllProduct = cartAllProduct.count || 0;
    res.locals.lang = lang;
    res.locals.allCatigoryForNave = allCatigoryForNave;

    //   res.locals.webSeting = webSeting;
    res.locals.csrf = csrfToken;
  }
}
/*------------------------------------ class start function -------------------------------*/
/*------------------------------------ class others -------------------------------*/
export class Outhers {
  public getCatgoryFromArray(categorys: string[]): string {
    return categorys.length > 1
      ? categorys[categorys.length - 1] != ""
        ? categorys[categorys.length - 1]
        : categorys[categorys.length - 2]
      : categorys[0];
  }
  // git sume of array
  public getSumeOfArray(array: {}[]): number {
    let totalRate = 0;
    array.forEach((ele: any) => {
      totalRate += ele.rate;
    });
    return totalRate;
  }

  /*--------------------- start formate date ---------------------*/
  public formateDate(date: string, type: string = "date") {
    if (type == "date") {
      return moment(date).format("YYYY-MM-DD");
    } else {
      return moment(date).format("hh-mm-ss");
    }
  }
  /*--------------------- end formateDate ---------------------*/
  /*--------------------- start get final price ---------------------*/
  public finalPrice(product: any): {
    price: number;
    structure: number;
    shipping: number;
    afterDescount: number;
    totalPrice: number;
  } {
    const totalOfAll: {
      price: number;
      structure: number;
      shipping: number;
      afterDescount: number;
      beforeDescount: number;
      totalPrice: number;
    } = {
      price: 0,
      structure: 0,
      shipping: 0,
      afterDescount: 0,
      beforeDescount: 0,
      totalPrice: 0,
    };
    let totalPriceWithCount: number = 0;
    product.forEach((element) => {
      // get price before descount
      totalOfAll.price += element.count * element.cartProduct.price;
      // get price after descount
      totalPriceWithCount = element.count * element.cartProduct.price;
      totalOfAll.afterDescount +=
        totalPriceWithCount -
        (element.cartProduct.descount * totalPriceWithCount) / 100;
      // get price of structure
      totalOfAll.structure += element.count * element.cartProduct.structure;
      // get total shipping
      totalOfAll.shipping += element.cartProduct.shipping;
    });
    totalOfAll.totalPrice +=
      totalOfAll.afterDescount + totalOfAll.structure + totalOfAll.shipping;
    return totalOfAll;
  }
  /*--------------------- end get final price ---------------------*/
  /*--------------------- start get final price for admin ---------------------*/
  public finalPriceForAdmin(
    product: any,
    order: any
  ): {
    price: number;
    structure: number;
    shipping: number;
    afterDescount: number;
    totalPrice: number;
  } {
    const totalOfAll: {
      price: number;
      structure: number;
      shipping: number;
      afterDescount: number;
      beforeDescount: number;
      totalPrice: number;
    } = {
      price: 0,
      structure: 0,
      shipping: 0,
      afterDescount: 0,
      beforeDescount: 0,
      totalPrice: 0,
    };
    let totalPriceWithCount: number = 0;
    let count: number = 0;
    product.forEach((element) => {
      count = 0;
      count = this.getCountOfEachProduct(
        order.productsId,
        order.productsCount,
        element.id
      );
      // get price before descount
      totalOfAll.price += count * element.price;
      // get price after descount
      totalPriceWithCount = count * element.price;
      totalOfAll.afterDescount +=
        totalPriceWithCount - (element.descount * totalPriceWithCount) / 100;
      // get price of structure
      totalOfAll.structure += count * element.structure;
      // get total shipping
      totalOfAll.shipping += element.shipping;
    });
    totalOfAll.totalPrice +=
      totalOfAll.afterDescount + totalOfAll.structure + totalOfAll.shipping;
    return totalOfAll;
  }
  /*--------------------- start get final price for admin ---------------------*/

  /*--------------------- start get final price for one product ---------------------*/
  public priceForOneProduct(
    product: any,
    order: any
  ): {
    price: number;
    structure: number;
    shipping: number;
    afterDescount: number;
    totalPrice: number;
    count: number;
  } {
    const totalPrice: {
      price: number;
      structure: number;
      shipping: number;
      afterDescount: number;
      beforeDescount: number;
      totalPrice: number;
      count: number;
    } = {
      price: 0,
      structure: 0,
      shipping: 0,
      afterDescount: 0,
      beforeDescount: 0,
      totalPrice: 0,
      count: 0,
    };

    let count = new Outhers().getCountOfEachProduct(
      order.productsId,
      order.productsCount,
      product.id
    );

    // get price before descount
    totalPrice.count = count;
    totalPrice.price += count * product.price;
    // get price after descount
    totalPrice.afterDescount +=
      totalPrice.price - (product.descount * totalPrice.price) / 100;
    // get price of structure
    totalPrice.structure += count * product.structure;
    // get total shipping
    totalPrice.shipping += product.shipping;
    totalPrice.totalPrice +=
      totalPrice.afterDescount + totalPrice.structure + totalPrice.shipping;
    return totalPrice;
  }
  /*--------------------- start get final price for one product ---------------------*/

  /*--------------------- start get Count Of Each Product ---------------------*/
  public getCountOfEachProduct(
    productsId: any,
    productCount: any,
    productId: number
  ) {
    let count = 0;
    productsId = productsId.split(",");
    productCount = productCount.split(",");
    count = productCount[productsId.indexOf(productId + "")];
    return count; // get price before descount
  }
  /*--------------------- end get Count Of Each Product ---------------------*/
}
/*------------------------------------ class start function -------------------------------*/
