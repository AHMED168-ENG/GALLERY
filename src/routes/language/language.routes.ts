import { Router } from "express";
import { LanguageController } from "../../controllers/language/language";

export class LanguageRoutes {
  public Router: Router;
  private languageController: LanguageController;
  constructor() {
    this.languageController = new LanguageController();
    this.Router = Router();
    this.routes();
  }
  routes(): void {
    this.Router.post("/set", this.languageController.setLanguage);
  }
}
