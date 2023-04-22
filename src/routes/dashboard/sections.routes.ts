import { Router } from "express";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import { FrontSectionController } from "../../controllers/dashboard/frontSections.controller";
import { StatsSectionsValidation } from "../../validations/dashboard/frontSections/stateSection";

export class SectionsRoutes {
  public Router: Router;
  private frontSectionController: FrontSectionController;
  private statsSectionsValidation: StatsSectionsValidation;
  private isAuthonticate: IsAuthonticate;
  constructor() {
    this.isAuthonticate = new IsAuthonticate();
    this.frontSectionController = new FrontSectionController();
    this.statsSectionsValidation = new StatsSectionsValidation();
    this.Router = Router();
    this.routes();
  }
  // start stae section block
  routes(): void {
    this.Router.get(
      "/stats-section",
      this.isAuthonticate.isAuthonticate,
      this.frontSectionController.stateSection
    );
    this.Router.post(
      "/stats-section",
      this.isAuthonticate.isAuthonticate,
      this.statsSectionsValidation.validation(),
      this.frontSectionController.stateSectionPost
    );
    // end stae section block
  }
}
