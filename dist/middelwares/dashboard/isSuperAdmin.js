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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsSuperAdmin = void 0;
const helper_1 = require("../../helpers/helper");
class IsSuperAdmin {
    isSuperAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var Admin = req.cookies.Admin;
            if (Admin.role != "1") {
                new helper_1.ValidationMessage().returnWithMessage(req, res, "/dashboard/", "this part of dashboard belong to super admin", "danger");
            }
            else {
                next();
            }
        });
    }
}
exports.IsSuperAdmin = IsSuperAdmin;
