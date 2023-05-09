import { NextFunction, Request, Response } from "express";

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
import tbl_app_settings from "../models/appSeting";
import pdfkit from "pdfkit-table";
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
    let sitSetting = await tbl_app_settings.findOne({});

    res.locals.URL = url;
    res.locals.sitSetting = sitSetting;
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
    const lang = req.cookies.lng || "en";

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
    let sitSetting = await tbl_app_settings.findOne({});
    res.locals.URL = url;
    res.locals.userData = userData;
    res.locals.allUserFavorit = allUserFavorit.count || 0;
    res.locals.cartAllProduct = cartAllProduct.count || 0;
    res.locals.lang = lang;
    res.locals.trans = req.t;
    res.locals.sitSetting = sitSetting;
    res.locals.allCatigoryForNave = allCatigoryForNave;
    //   res.locals.webSeting = webSeting;
    res.locals.csrf = csrfToken;
    // console.log("lang");
    // console.log(lang);
    // console.log("lang");
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
    } else if ("houre") {
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
      totalPrice: number;
    } = {
      price: 0,
      structure: 0,
      shipping: 0,
      afterDescount: 0,
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
  public finalPriceForAdmin(products: any): {
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
      totalPrice: number;
    } = {
      price: 0,
      structure: 0,
      shipping: 0,
      afterDescount: 0,
      totalPrice: 0,
    };
    let totalPriceWithCount: number = 0;
    let count: number = 0;
    products.forEach((element) => {
      count = element.productCount;
      // get price before descount
      totalOfAll.price += count * element.productTable.price;
      // get price after descount
      totalPriceWithCount = count * element.productTable.price;
      totalOfAll.afterDescount +=
        totalPriceWithCount -
        (element.productTable.descount * totalPriceWithCount) / 100;
      // get price of structure
      totalOfAll.structure += count * element.productTable.structure;
      // get total shipping
      totalOfAll.shipping += element.productTable.shipping;
    });
    totalOfAll.totalPrice +=
      totalOfAll.afterDescount + totalOfAll.structure + totalOfAll.shipping;
    console.log(totalOfAll);
    return totalOfAll;
  }
  /*--------------------- start get final price for admin ---------------------*/

  /*--------------------- start get final price for one product ---------------------*/
  public priceForOneProduct(order: any): {
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
      totalPrice: number;
      count: number;
    } = {
      price: 0,
      structure: 0,
      shipping: 0,
      afterDescount: 0,
      totalPrice: 0,
      count: 0,
    };
    let count = order.productCount;
    let product = order.productTable;
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
}
/*------------------------------------ class start function -------------------------------*/

/*------------------------------------ class download file -------------------------------*/
export class OrdersPdf {
  // ============ start create pdf ================
  public async createPdf(
    res: Response,
    app_setting: any,
    order: any,
    trans: any,
    lng: string,
    userData: any
  ) {
    const pdfName = `${app_setting.sitName_en}_order_${order.id}.pdf`;
    const pdfDirPath = path.join(__dirname, "../ordersPdf/");
    const pdfPath = path.join(__dirname, "../ordersPdf/" + pdfName);
    const pdfDoc = new pdfkit();
    // check if pdf dir not exist create it
    if (!fs.existsSync(pdfDirPath)) {
      fs.mkdirSync(pdfDirPath);
    }
    const writeStream = fs.createWriteStream(pdfPath, {
      encoding: "utf8",
    });
    pdfDoc.pipe(writeStream);
    // start body of pdf
    pdfDoc
      .text(`Hello Mr ( ${userData.fName + " " + userData.lName} )`, {
        align: "center",
      })
      .moveDown();
    let productsData: [string, string, string][] = [];
    order.productOrderTable.forEach((ele: any) => {
      productsData.push([
        ele.productTable["productName_" + lng],
        ele.productCount.toString(),
        ele.productTable.price + trans("Eg"),
      ]);
    });
    const table = {
      title: trans("Bill"),
      subtitle: trans("ProductsData"),
      headers: [trans("products"), trans("count"), trans("RealPrice")],
      rows: productsData,
    };
    pdfDoc.table(table);
    pdfDoc.moveDown();
    // =============================
    const getFinalPrice = new Outhers().finalPriceForAdmin(
      order.productOrderTable
    );
    const finalPriceTable = {
      title: "",
      subtitle: trans("finalPriceData"),

      headers: [
        trans("Structure"),
        trans("Shipping"),
        trans("totalPriceBeforeDescount"),
        trans("TotalAfterDescount"),
        trans("TotalAfterDescountWith"),
      ],
      rows: [
        [
          getFinalPrice.structure + " " + trans("Eg"),
          getFinalPrice.shipping + " " + trans("Eg"),
          getFinalPrice.price + " " + trans("Eg"),
          getFinalPrice.afterDescount + " " + trans("Eg"),
          getFinalPrice.totalPrice + " " + trans("Eg"),
        ],
      ],
    };
    pdfDoc.table(finalPriceTable);
    pdfDoc.end();
    // end body of pdf
  }

  // ============ start download pdf ================
  public async downloadPdf(res: Response, app_setting: any, orderId: string) {
    const pdfName = `${app_setting.sitName_en}_order_${orderId}.pdf`;
    const pdfPath = path.join(__dirname, "../ordersPdf/" + pdfName);
    if (!fs.existsSync(pdfPath)) return res.redirect("/your-orders");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment;filename="${pdfName}"`);
    const readStream = fs.createReadStream(path.join(pdfPath));
    readStream.pipe(res);
  }
}
/*------------------------------------ class download file -------------------------------*/
