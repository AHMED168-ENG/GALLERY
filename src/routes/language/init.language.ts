import express from "express";
import i18next from "i18next"; //its core of liberary
import i18nextFsBackEnd from "i18next-fs-backend"; //its responsible for geting messages from translation files
import i18nextHttp from "i18next-http-middleware"; // its responsible for inject some functions inside express routes
import { LanguageRoutes } from "./language.routes";

class InitLanguage {
  constructor(private myApp: express.Application) {
    this.router();
  }
  router(): void {
    i18next
      .use(i18nextFsBackEnd)
      .use(i18nextHttp.LanguageDetector)
      .init({
        fallbackLng: "en",
        backend: {
          loadPath: `./locales/{{lng}}/translation.json`,
        },
        detection: {
          order: ["cookie", "querystring", "header"],
          lookupCookie: "lng",
          lookupQuerystring: "lng",
          caches: ["cookie"],
        },
      });
    this.myApp.use(i18nextHttp.handle(i18next));
    this.myApp.use("/language", new LanguageRoutes().Router);
  }
}

export default InitLanguage;
