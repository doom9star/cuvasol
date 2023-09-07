import dotenv from "dotenv";
import express from "express";
import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import User from "./entities/User";
import MainRouter from "./routes";

const main = async () => {
  dotenv.config({ path: path.join(__dirname, "../.env") });

  await new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: true,
    logging: true,
  }).initialize();

  const app = express();

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use("/", MainRouter);

  app.listen(process.env.PORT, () => {
    console.log(`\nServer running on http://localhost:${process.env.PORT}`);
  });
};

main();
