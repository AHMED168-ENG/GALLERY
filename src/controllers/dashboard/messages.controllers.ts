import { Request, Response, NextFunction } from "express";
import tbl_messages from "../../models/messages";
import { ValidationMessage } from "../../helpers/helper";
import tbl_users from "../../models/users";
import axios from "axios";
export class MessageController {
  constructor() {}
  // start show message
  public async findMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      tbl_messages
        .update(
          { isSeen: true },
          {
            where: {
              id: req.params.id,
            },
          }
        )
        .then(() => {
          tbl_messages
            .findOne({
              include: [{ model: tbl_users, as: "messageUser" }],
              where: {
                id: req.params.id,
              },
            })
            .then((result) => {
              res.render("dashboard/messages/showMessage", {
                title: "Dashboard | show messages",
                notification: req.flash("notification"),
                message: result,
              });
            });
        });
    } catch (error) {
      next(error);
    }
  }
  // end show message
  // start show all messages
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_messages
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
        })
        .then((result) => {
          res.render("dashboard/messages/allMessages", {
            title: "Dashboard | All messages",
            notification: req.flash("notification"),
            messages: result.rows,
            hasPrevious: page > 1,
            hasNext: PAGE_ITEMS * page < result.count,
            nextPage: page + 1,
            previousPage: page - 1,
            curantPage: +page,
            allElementCount: result.count,
            elements: +PAGE_ITEMS,
            lastPage: Math.ceil(result.count / PAGE_ITEMS),
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // end show all messages
  // start show all messages not seen
  public async findAllNotSeen(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page: any = req.query.page || 1;
      const PAGE_ITEMS: string | number = +process.env.elementPerPage;
      tbl_messages
        .findAndCountAll({
          order: [["createdAt", "desc"]],
          offset: +((page - 1) * PAGE_ITEMS),
          limit: +PAGE_ITEMS,
          where: {
            isSeen: false,
          },
        })
        .then((result) => {
          res.render("dashboard/messages/allMessagesNotSeen", {
            title: "Dashboard | All messages",
            notification: req.flash("notification"),
            messagesNotSeen: result.rows,
            hasPrevious: page > 1,
            hasNext: PAGE_ITEMS * page < result.count,
            nextPage: page + 1,
            previousPage: page - 1,
            curantPage: +page,
            allElementCount: result.count,
            elements: +PAGE_ITEMS,
            lastPage: Math.ceil(result.count / PAGE_ITEMS),
          });
        });
    } catch (error) {
      next(error);
    }
  }
  // end show all messages not seen

  // start create message post
  public async crearePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const lang = req.cookies.lang;
      const body = req.body;
      if (!body.captcha) {
        res.send({ status: false, message: "please select captcha" });
        return;
      }
      let secretKey = process.env.recaptcherSitKey;
      const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;
      axios
        .get(verifyURL)
        .then((data) => {
          if (data.data.success != true) {
            return res.json({
              status: false,
              message: "Failed captcha verification",
            });
          } else {
            tbl_messages
              .create(body)
              .then((result) => {
                res.send({
                  status: true,
                  message:
                    lang != "en"
                      ? "your message send successful"
                      : "تم ارسال الرساله بنجاح",
                });
              })
              .catch((error) => error);
          }
        })
        .catch((error) => {
          return error;
        });
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  }
  // end create message post

  // start delete messages
  public async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const validationMessage: ValidationMessage = new ValidationMessage();
      tbl_messages
        .destroy({
          where: {
            id: body.id,
          },
        })
        .then(() => {
          validationMessage.returnWithMessage(
            req,
            res,
            "/dashboard/messages/",
            "The message has been deleted successfully",
            "success"
          );
        })
        .then((error) => error);
    } catch (error) {
      next(error);
    }
  }
  // end delete messages
}
