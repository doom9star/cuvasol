import "reflect-metadata";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { createClient } from "redis";
import { TAuthRequest } from "./lib/types";
import { log } from "./lib/utils/logging";
import { DS } from "./ormconfig";
import MainRouter from "./routes";

const main = async () => {
  dotenv.config({ path: path.join(__dirname, "../.env") });

  await DS.initialize();
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
    log("INFO", `server running on http://localhost:${process.env.PORT}!`);
  });
};

main();
