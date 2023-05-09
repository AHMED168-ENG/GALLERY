import { check } from "express-validator";
import tbl_users from "../../../models/users";
import { Op } from "sequelize";
import { imageExtention } from "../../../config/config";

export class SignUpUserValidation {
  validation() {
    return [
      check("fName")
        .notEmpty()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "ادخل الاسم الاول";
          } else {
            return "enter first name";
          }
        })
        .isString()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "هذا الحقل يقبل نص";
          } else {
            return "this field accept string";
          }
        })
        .isLength({ max: 10, min: 2 })
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "يجب أن يكون الاسم الأول أكثر من 2 وأقل من 10";
          } else {
            return "the first name should be more than 2 and less than 10";
          }
        })
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("lName")
        .notEmpty()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "ادخل الاسم الاخير";
          } else {
            return "ُenter last name";
          }
        })
        .isString()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "هذا الحقل يقبل نص";
          } else {
            return "this field accept string";
          }
        })
        .isLength({ max: 10, min: 2 })
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "يجب أن يكون الاسم الأول أكثر من 2 وأقل من 10";
          } else {
            return "the first name should be more than 2 and less than 10";
          }
        })
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("age")
        .notEmpty()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "ادخل العمر";
          } else {
            return "enter age";
          }
        })
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("address")
        .notEmpty()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "ادخل العنوان";
          } else {
            return "enter your addres";
          }
        })
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("mobile")
        .notEmpty()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "ادخل الموبايل";
          } else {
            return "enter your mobile";
          }
        })
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("email")
        .notEmpty()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "ادخل الايميل";
          } else {
            return "enter email";
          }
        })
        .isEmail()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "ادخل الايميل بشكل صحيح";
          } else {
            return "enter valid email";
          }
        })
        .trim()
        .escape()
        .toLowerCase()
        .custom(async (value, { req }) => {
          var user = await tbl_users.findOne({
            where: {
              email: value,
            },
          });
          if (user) {
            throw new Error();
          }
        })
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "هذا الايميل مسجل بالفعل";
          } else {
            return "this email registed";
          }
        }),
      check("password")
        .notEmpty()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "ادخل الرقم السري";
          } else {
            return "enter password";
          }
        })
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
        })
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "الرقم السري يجب ان يحتوي علي الاقل علي 4 احرف";
          } else {
            return "your password should be contain at lest 4 letters";
          }
        }),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("confirmPassword")
        .trim()
        .escape()
        .custom(async (value, { req }) => {
          if (value !== req.body.password && req.body.password) {
            throw new Error();
          }
        })
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "الرقم السري غير متتطابق";
          } else {
            return "your password not match";
          }
        }),

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
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return `يجب أن يكون امتداد الصورة بين ${imageExtention}`;
          } else {
            return `image extention should be between  ${imageExtention}`;
          }
        })
        .custom(async (value, { req }) => {
          if (!req.files.length) return true;
          req.files.forEach((element) => {
            if (element.size > 2000000) {
              throw new Error("");
            }
          });
        })
        .withMessage((value, { req }) => {
          if (req.cookies.lng != "ar") {
            return "image should not be more than 2000000 kb";
          } else {
            return "يجب ألا يزيد حجم الصورة عن 2000000 كيلو بايت";
          }
        }),

      ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ];
  }
}
