import { NextFunction, Request, Response } from "express";
import tbl_user_search from "../../models/userSearch";
import { Op } from "sequelize";

export class UserSearch {
  constructor() {}

  // start add user search
  public addUserSearch(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("ahmed reda alsahed");
      const body = req.body;
      tbl_user_search
        .findOne({
          where: {
            search: { [Op.like]: `%${body.search}%` },
          },
        })
        .then(async (result) => {
          if (!result) {
            await tbl_user_search.create(body);
          }
          res.send({
            status: true,
            message: "",
          });
        });
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  }
  //
}
