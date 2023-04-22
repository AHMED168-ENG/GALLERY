export interface IEnv {
  port: string;
  database: [string, string, string, object]; // DB_Name , User , DB_PW , {host,dialect}
  mail: object;
}
export const env: IEnv = {
  port: process.env.NODE_SERVER_PORT,
  database: [
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      logging: false,
      dialectOptions: {
        supportBigNumbers: true,
        decimalNumbers: true,
        bigNumberStrings: false,
      },
      // TODO: remove sync in product
      sync: true,
    },
  ],
  mail: {
    pool: true,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  },
};

export const imageExtention: string[] = ["jpg", "png", "jpeg", "gif", "svg"];
export const SildersPosition: string[] = ["HOME_TOP"];
