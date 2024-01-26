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
exports.FrontSectionController = void 0;
const express_validator_1 = require("express-validator");
const helper_1 = require("../../helpers/helper");
const statsSection_1 = __importDefault(require("../../models/statsSection"));
class FrontSectionController {
    constructor() { }
    stateSection(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                statsSection_1.default.findOne().then((result) => {
                    res.render("dashboard/sections/stateSection", {
                        title: "Dashboard | State Section",
                        notification: req.flash("notification"),
                        statsSection: result || {},
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
    stateSectionPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const error = (0, express_validator_1.validationResult)(req);
                const body = req.body;
                const validationMessage = new helper_1.ValidationMessage();
                if (!error.isEmpty()) {
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/front-sections/stats-section");
                    return;
                }
                statsSection_1.default.findOne().then((result) => __awaiter(this, void 0, void 0, function* () {
                    if (!result) {
                        yield statsSection_1.default.create(body).then();
                    }
                    else {
                        yield statsSection_1.default.update(body, {
                            where: {
                                id: 1,
                            },
                        });
                    }
                    validationMessage.returnWithMessage(req, res, "/dashboard/front-sections/stats-section", "edit successful", "success");
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.FrontSectionController = FrontSectionController;
