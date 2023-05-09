import nodemailer from "nodemailer";

export class SendMails {
  async send(
    email: string,
    fName: string,
    lName: string,
    subject: string,
    url?: string
  ) {
    var transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    var mailOptions = {
      from: "youremail@gmail.com",
      to: email,
      subject: subject,
      html: `<!DOCTYPE html>
    <html lang="en">
        <head>
            <title></title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="css/style.css" rel="stylesheet">
        </head>
        <body>
            <h3>welcome mr  ${fName} ${lName}  in my application </h3>
            <p>we import on your privacy</p>
            <p>${subject}</p>
            ${url ? `<a href='${url}'>click hir</a>` : ""}
            
            
        </body>
    </html>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}
