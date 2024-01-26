"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSettingController = void 0;
const appSeting_1 = __importDefault(require("../../models/appSeting"));
const express_validator_1 = require("express-validator");
const helper_1 = require("../../helpers/helper");
class AppSettingController {
    constructor() { }
    find(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                appSeting_1.default.findOne().then((result) => {
                    res.render("dashboard/setting/appSetting", {
                        title: "Dashboard | App Setting",
                        notification: req.flash("notification"),
                        appSetting: result || {},
                        validationError: req.flash("validationError")[0] || {},
                        bodyData: req.flash("bodyData")[0],
                    });
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const error = (0, express_validator_1.validationResult)(req);
                const body = req.body;
                const filesOperations = new helper_1.FilesOperations();
                const validationMessage = new helper_1.ValidationMessage();
                if (!error.isEmpty()) {
                    filesOperations.removeImg(req, "AppSetting");
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/setting/appSetting");
                    return;
                }
                const file = filesOperations.Rename_uploade_img(req);
                if (file) {
                    if (body.oldImage)
                        filesOperations.removeImg(req, "appSetting", body.oldImage);
                    body.logo = file;
                }
                else {
                    body.logo = body.oldImage;
                }
                body.active = body.active ? true : false;
                appSeting_1.default.findOne().then((result) => __awaiter(this, void 0, void 0, function* () {
                    if (!result) {
                        yield appSeting_1.default.create(body).then();
                    }
                    else {
                        yield appSeting_1.default.update(body, {
                            where: {
                                id: 1,
                            },
                        });
                    }
                    validationMessage.returnWithMessage(req, res, "/dashboard/app-setting", "edit successful", "success");
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AppSettingController = AppSettingController;
