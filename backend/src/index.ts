import dotenv from "dotenv";
import express from "express";
import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import User from "./entities/User";
import MainRouter from "./routes";
import { createClient } from "redis";
import { TAuthRequest } from "./lib/types";
import { log } from "./lib/utils/logging";
import File from "./entities/File";

const main = async () => {
  dotenv.config({ path: path.join(__dirname, "../.env") });

  await new DataSource({
    type: <any>process.env.DB_TYPE,
    host: <any>process.env.DB_HOST,
    port: <any>process.env.DB_PORT,
    username: <any>process.env.DB_USER,
    password: <any>process.env.DB_PASS,
    database: <any>process.env.DB_NAME,
    entities: [User, File],
    synchronize: true,
    logging: true,
  }).initialize();

  const app = express();

  const redclient = createClient();
  await redclient.connect();

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use((req: TAuthRequest, _, next) => {
    req.redclient = redclient;
    next();
  });
  app.use("/", MainRouter);

  app.listen(process.env.PORT, () => {
    log("INFO", `server running on http://localhost:${process.env.PORT}`);
  });
};

main();
