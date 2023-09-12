import { DataSource } from "typeorm";
import dotenv from "dotenv";
import Employee from "./entities/Employee";
import Group from "./entities/Group";
import Permission from "./entities/Permission";
import Task from "./entities/Task";
import User from "./entities/User";
import Report from "./entities/Report";
import File from "./entities/File";
import path from "path";
import { AddPerm1694507747431 } from "./migrations/1694507747431-AddPerm";
import { AddGrp1694507939389 } from "./migrations/1694507939389-AddGrp";
import { PermAdmin1694512553603 } from "./migrations/1694512553603-PermAdmin";
import { AddAdmin1694514949472 } from "./migrations/1694514949472-AddAdmin";

dotenv.config({ path: path.join(__dirname, "../.env") });

export const DS = new DataSource({
  type: <any>process.env.DB_TYPE,
  host: <any>process.env.DB_HOST,
  port: <any>process.env.DB_PORT,
  username: <any>process.env.DB_USER,
  password: <any>process.env.DB_PASS,
  database: <any>process.env.DB_NAME,
  entities: [User, Group, Permission, Employee, Task, Report, File],
  migrations: [
    AddPerm1694507747431,
    AddGrp1694507939389,
    PermAdmin1694512553603,
    AddAdmin1694514949472,
  ],
  migrationsRun: true,
  synchronize: false,
  logging: true,
});
