import express, { NextFunction, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.join(__dirname, "../env/.env"),
});
import { env } from "./config/config";
import Logging from "./config/logging.config";
import cookies from "cookie-parser";
import session from "express-session";
import connectFlash from "connect-flash";
import cors from "cors";
import csurf from "csurf";
import helmet from "helmet";
import { Sequelize } from "sequelize";
import AllDashboardRoutes from "./routes/dashboard/allDashboard.routes";
import { StartActions } from "./helpers/helper";
import AllSiteRoutes from "./routes/website/allSite.routes";
import InitLanguage from "./routes/language/init.language";

class App {
  private PORT: number = +env.port | +process.env.NODE_SERVER_PORT;
  private logging: Logging = new Logging();
  private myApp: express.Application = express();
  constructor() {
    this.DBAuthorization();
    this.parse();
    this.templateEngine();
    this.routes();
    this.listen();
  }

  // start this part about authonticate database
  private DBAuthorization() {
    const sequelize = new Sequelize(...env.database);

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
  // end this part about authonticate database

  // start this part about thired part package and helper package database
  private parse(): void {
    this.myApp.use(express.urlencoded({ extended: true })); // parse urlencoded request body
    // this.myApp.use(helmet()); // this is thired part package about secure app it is used for securety its add some headers to response to mack it secuered its add multable headers used to mack your app more secured
    // if (process.env.NODE_SERVER_ENV != "production") {
    //   this.myApp.use(
    //     cors({
    //       origin: "http://localhost:5000",
    //     })
    //     // res.setHeader("Access-Control-Allow-Origin" , "*") اسمحلي باي دومين يجيلك
    //     // res.setHeader("Access-Control-Allow-Methods" , "*") اسمحلي باي request method
    //     // res.setHeader("Access-Control-Allow-Headers" , "Authorization") اسمجلي باي headers تجيلك
    //     // ده بالضبط الي بينضاف في middel ware
    //   ); // cors police == crose origin resourse sharing ببساطه خالص قبل لما نستخدم دي المشكله الي كانت بتظهر ان مينفعش دومين يعمل طلب لدومين مختلف لازم من نفس الدومين وله كده علشان الامان علشان السكيورتي لان ببساطه ممكن اي دومين يروح يعمل طلب لدومين تاني و ممكن بكده يخترق الموقع بتاعي  ,,,,, تعريف تاني اني بعمل عبور للمشروع بتاعي من اكثر من دومين يعني المشروع بتاعي تقدر تدخله من اكثر من دومين اخر
    //   // this.myApp.use(morgan("tiny")); // this is third part package logger for node js used to logging the request iformation like request method and url and time state for developing
    // }
    this.myApp.use(cookies());
    this.myApp.use(
      session({
        // store: sessionStore,
        secret: process.env.SECRET_SETION_KEY || "SECRET_SETION_KEY",
        saveUninitialized: false, // معناها انه عند عمل session لاتقوم بحفظها في الداتابيز الا عندما امرك بذالك
        cookie: {
          // السشن ده هو في الاصل عباره عن cookie لذالك انا اقوم بتحديد بعض القيم لتحديد مده الانتهاء الديفولت هو عند اغلاق المتصفح
          maxAge: 60 * 60 * 60 * 100,
        },
        resave: false,
      })
    );
    this.myApp.use(connectFlash());
  }
  // end this part about thired part package and helper package database

  // start this part about templateEngine and set staticfiles
  private templateEngine(): void {
    this.myApp.set("views", path.join(__dirname, "../view"));
    this.myApp.set("view engine", "ejs");
    this.myApp.use(
      "/assets",
      express.static(path.join(__dirname, "../assets"))
    );
    this.myApp.use(
      "/public",
      express.static(path.join(__dirname, "../public"))
    );
  }
  // end this part about templateEngine and set staticfiles

  private routes(): void {
    this.myApp.use(csurf());

    new InitLanguage(this.myApp).router();
    new AllDashboardRoutes(this.myApp).router();
    new AllSiteRoutes(this.myApp).router();
    this.myApp.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        console.log(error);
        this.logging.loggerOperationError().error(error.message);
        res.send(error.message);
      }
    );
    this.myApp.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).render("pageNotFound", { title: "page not found" });
    });
  }

  // start this part about start app and listen
  private listen(): void {
    this.myApp.listen(this.PORT, () => {
      this.logging
        .loggerOperationInfo()
        .info("congratolation app start at port " + this.PORT);
    });
  }
  // end this part about start app and listen

  // start this part about get my application express
  getApp(): express.Application {
    return this.myApp;
  }
  // end this part about get my application express
}
export default App;
