import { check } from "express-validator";
import tbl_users from "../../../models/users";
import { Op } from "sequelize";
import { imageExtention } from "../../../config/config";

export class UpdateUserValidation {
  validation() {
    return [
      check("fName")
        .notEmpty()
        .withMessage("enter first name")
        .isString()
        .withMessage("this field accept string")
        .isLength({ max: 10, min: 2 })
        .withMessage("the first name should be more than 2 and less than 10")
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("lName")
        .notEmpty()
        .withMessage("enter last name")
        .isString()
        .withMessage("this field accept string")
        .isLength({ max: 10, min: 2 })
        .withMessage("the last name should be more than 2 and less than 10")
        .trim()
        .escape(), ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("age").notEmpty().withMessage("enter age").trim().escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("address")
        .notEmpty()
        .withMessage("enter your address")
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("mobile")
        .notEmpty()
        .withMessage("enter your mobile")
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("email")
        .notEmpty()
        .withMessage("enter email")
        .isEmail()
        .withMessage("enter valid email")
        .trim()
        .escape()
        .toLowerCase()
        .custom(async (value, { req }) => {
          var user = await tbl_users.findOne({
            where: {
              email: value,
              id: {
                [Op.ne]: req.params.id,
              },
            },
          });
          if (user) {
            throw new Error();
          }
        })
        .withMessage("this email already registed"),
      check("password")
        .trim()
        .escape()
        .custom(async (value, { req }) => {
          if (!req.body.password) return true;
          var count = 0;
          for (var i = 0; i < value.length; i++) {
            if (isNaN(value[i])) {
              count++;
            }
          }
          if (count < 4) {
            throw new Error();
          }
          return true;
        })
        .withMessage("your password should containe at less 4 charackters"),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("confirmPassword")
        .trim()
        .escape()
        .custom(async (value, { req }) => {
          if (value !== req.body.password && req.body.password) {
            throw new Error();
          }
          return true;
        })
        .withMessage("your password not match"),
      //   check("VendorfName")
      //     .custom(async (value, { req }) => {
      //       if (req.body.isVendor) {
      //         if (!value) {
      //           throw new Error("");
      //         }
      //       }
      //       return true;
      //     })
      //     .withMessage("ادخل الاسم الاول"),
      //   ////////////////////////////////////////////////////////////////////////////////////////////////////////
      //   check("VendorlName")
      //     .custom(async (value, { req }) => {
      //       if (req.body.isVendor) {
      //         if (!value) {
      //           throw new Error("");
      //         }
      //       }
      //       return true;
      //     })
      //     .withMessage("ادخل الاسم الاخير"),
      //   ////////////////////////////////////////////////////////////////////////////////////////////////////////
      //   check("vendorMobile")
      //     .custom(async (value, { req }) => {
      //       if (req.body.isVendor) {
      //         if (!value) {
      //           throw new Error("");
      //         }
      //       }
      //       return true;
      //     })
      //     .withMessage("ادخل الموبيل الخاص بك كتاجر")
      //     .custom(async (value, { req }) => {
      //       if (req.body.isVendor && (value.length > 11 || value.length < 11)) {
      //         throw new Error("");
      //       } else {
      //         return true;
      //       }
      //     })
      //     .withMessage("ادخل رقم الموبايل الخاص بالتاجر مكون من 11 رقم"),
      //   ////////////////////////////////////////////////////////////////////////////////////////////////////////
      //   check("vendorEmail")
      //     .custom(async (value, { req }) => {
      //       if (!req.body.isVendor) {
      //         return true;
      //       } else {
      //         if (!value) {
      //           throw new Error("");
      //         }
      //       }
      //     })
      //     .withMessage("ادخل الايميل الخاص بحساب التاجر ")
      //     .custom(async (value, { req }) => {
      //       var id = req.params.id ? req.params.id : 0;
      //       if (!value) return true;
      //       var vendor = await db.vendorData.findOne({
      //         where: {
      //           vendoerEmail: value,
      //           userId: {
      //             [Op.ne]: id,
      //           },
      //         },
      //       });
      //       if (vendor) {
      //         throw new Error("");
      //       }
      //       return true;
      //     })
      //     .withMessage("هذا الايميل مسجل بالفعل"),
      //   ////////////////////////////////////////////////////////////////////////////////////////////////////////
      //   check("VendorPassword")
      //     .custom(async (value, { req }) => {
      //       if (req.body.isVendor && !value && !req.body.oldCommercialRegister) {
      //         throw new Error("");
      //       }
      //       return true;
      //     })
      //     .withMessage("يجب ادخال الرقم السري")
      //     .custom(async (value, { req }) => {
      //       if (!req.body.VendorPassword) return true;
      //       var count = 0;
      //       for (var i = 0; i < value.length; i++) {
      //         if (isNaN(value[i])) {
      //           count++;
      //         }
      //       }
      //       if (count < 4 && req.url != "/editUser/" + req.params.id) {
      //         throw new Error();
      //       }
      //       return true;
      //     })
      //     .withMessage("الرقم السري يجب ان يحتوي علي الاقل علي خمس حروف"),
      //   ////////////////////////////////////////////////////////////////////////////////////////////////////////
      //   check("vendoerConfirmPassword")
      //     .custom(async (value, { req }) => {
      //       if (value !== req.body.VendorPassword && req.body.VendorPassword) {
      //         throw new Error("");
      //       }
      //       return true;
      //     })
      //     .withMessage("الرقم السري غير متطابق"),

      //   ////////////////////////////////////////////////////////////////////////////////////////////////////////
      //   check("mobile")
      //     .notEmpty()
      //     .withMessage("ادخل رقم الموبايل الخاص بك")
      //     .isLength(11)
      //     .withMessage("الرقم عباره عن 12 رقم")
      //     .isNumeric()
      //     .withMessage("هذا الحقل يستقبل ارقام"),
      //   ////////////////////////////////////////////////////////////////////////////////////////////////////////
      //   ////////////////////////////////////////////////////////////////////////////////////////////////////////
      //   check("licenc")
      //     .custom((value, { req }) => {
      //       if (req.url == "/signUp") {
      //         if (!value) {
      //           throw new Error("");
      //         }
      //       }
      //       return true;
      //     })
      //     .withMessage("يجب قراءه الملاحظات و الموافقه عليها"),
      //   ////////////////////////////////////////////////////////////////////////////////////////////////////////

      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("image")
        .custom(async (value, { req }) => {
          if (!req.files.length) return true;
          req.files.forEach((element) => {
            var arrayExtention = imageExtention;
            var originalname = element.originalname.split(".");
            var imgExtension =
              originalname[originalname.length - 1].toLowerCase();
            if (!arrayExtention.includes(imgExtension)) {
              throw new Error("");
            }
          });
        })
        .withMessage(`image extention should be between  ${imageExtention}`)
        .custom(async (value, { req }) => {
          if (!req.files.length) return true;
          req.files.forEach((element) => {
            if (element.size > 2000000) {
              throw new Error("");
            }
          });
        })
        .withMessage("image should not be more than 2000000 kb"),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      //   check("CommercialRegister")
      //     .custom(async (value, { req }) => {
      //       if (
      //         req.body.isVendor &&
      //         !req.files.CommercialRegister &&
      //         !req.body.oldCommercialRegister
      //       )
      //         throw new Error("");
      //       return true;
      //     })
      //     .withMessage("ادخل السجل التجارس الخاص بك"),
      //   ////////////////////////////////////////////////////////////////////////////////////////////////////////
      //   check("CommercialRegister")
      //     .custom(async (value, { req }) => {
      //       if (!req.files.CommercialRegister) return true;
      //       var arrayExtention = ["pdf"];
      //       var originalname =
      //         req.files.CommercialRegister[0].originalname.split(".");
      //       var imgExtension =
      //         originalname[originalname.length - 1].toLowerCase();
      //       if (!arrayExtention.includes(imgExtension)) {
      //         removeImg(req, req.files.CommercialRegister[0].filename);
      //         throw new Error("");
      //       }
      //     })
      //     .withMessage(`يجب ان يكون امتداد الملف pdf`)
      //     .custom(async (value, { req }) => {
      //       if (!req.files.CommercialRegister) return true;
      //       if (req.files.CommercialRegister[0].size > 13000000) {
      //         throw new Error("");
      //       }
      //     })
      //     .withMessage("الملف يجب الا تزيد عن 13 mb"),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ];
  }
}
