"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: path_1.default.join(__dirname, "../env/.env"),
});
const config_1 = require("./config/config");
const logging_config_1 = __importDefault(require("./config/logging.config"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const csurf_1 = __importDefault(require("csurf"));
const sequelize_1 = require("sequelize");
const allDashboard_routes_1 = __importDefault(require("./routes/dashboard/allDashboard.routes"));
const allSite_routes_1 = __importDefault(require("./routes/website/allSite.routes"));
const init_language_1 = __importDefault(require("./routes/language/init.language"));
class App {
    constructor() {
        this.PORT = +config_1.env.port | +process.env.NODE_SERVER_PORT;
        this.logging = new logging_config_1.default();
        this.myApp = (0, express_1.default)();
        this.DBAuthorization();
        this.parse();
        this.templateEngine();
        this.routes();
        this.listen();
    }
    DBAuthorization() {
        const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
        sequelize
            .authenticate()
            .then(() => {
            this.logging
                .loggerOperationInfo()
                .info("database connection successful");
        })
            .catch((error) => {
            this.logging.loggerOperationError().error(error.message);
        });
    }
    parse() {
        this.myApp.use(express_1.default.urlencoded({ extended: true }));
        this.myApp.use((0, cookie_parser_1.default)());
        this.myApp.use((0, express_session_1.default)({
            secret: process.env.SECRET_SETION_KEY || "SECRET_SETION_KEY",
            saveUninitialized: false,
            cookie: {
                maxAge: 60 * 60 * 60 * 100,
            },
            resave: false,
        }));
        this.myApp.use((0, connect_flash_1.default)());
    }
    templateEngine() {
        this.myApp.set("views", path_1.default.join(__dirname, "../view"));
        this.myApp.set("view engine", "ejs");
        this.myApp.use("/assets", express_1.default.static(path_1.default.join(__dirname, "../assets")));
        this.myApp.use("/public", express_1.default.static(path_1.default.join(__dirname, "../public")));
    }
    routes() {
        this.myApp.use((0, csurf_1.default)());
        new init_language_1.default(this.myApp).router();
        new allDashboard_routes_1.default(this.myApp).router();
        new allSite_routes_1.default(this.myApp).router();
        this.myApp.use((error, req, res, next) => {
            console.log(error);
            this.logging.loggerOperationError().error(error.message);
            res.send(error.message);
        });
        this.myApp.use((req, res, next) => {
            res.status(404).render("pageNotFound", { title: "page not found" });
        });
    }
    listen() {
        this.myApp.listen(this.PORT, () => {
            this.logging
                .loggerOperationInfo()
                .info("congratolation app start at port " + this.PORT);
        });
    }
    getApp() {
        return this.myApp;
    }
}
exports.default = App;
