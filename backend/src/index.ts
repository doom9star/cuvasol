import "reflect-metadata";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { createClient } from "redis";
import { TRequest } from "./lib/types";
import { log } from "./lib/utils/logging";
import { DS } from "./ormconfig";
import MainRouter from "./routes";
import TCP from "tcp-port-used";
import cors from "cors";
import morgan from "morgan";
import KP from "kill-port";

const main = async () => {
  dotenv.config({ path: path.join(__dirname, "../.env") });

  await DS.initialize();
  const app = express();

  const cacher = createClient();
  await cacher.connect();

  app.use(morgan("dev"));
  app.use(cors({ origin: process.env.CLIENT, credentials: true }));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use((req: TRequest, _, next) => {
    req.cacher = cacher;
    next();
  });
  app.use("/", MainRouter);

  try {
    await KP(process.env.PORT as any, "tcp");
  } catch (e) {}
  app.listen(process.env.PORT, () => {
    log("INFO", `server running on http://localhost:${process.env.PORT}!`);
  });
};

main();
