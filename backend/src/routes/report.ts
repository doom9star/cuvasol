import { Router } from "express";
import Report from "../entities/Report";
import Task from "../entities/Task";
import { APP_PREFIX, COOKIE_NAME } from "../lib/constants";
import { TRequest } from "../lib/types";
import { UserType } from "../lib/types/model";
import getResponse from "../lib/utils/getResponse";
import { log } from "../lib/utils/logging";
import canEmployee from "../middlewares/canEmployee";
import isAuth from "../middlewares/isAuth";
import isMember from "../middlewares/isMember";
import Employee from "../entities/Employee";

const router = Router();

router.get(
  "/all/:date?",
  isAuth,
  isMember([UserType.ADMIN, UserType.MANAGER], "any"),
  async (req, res) => {
    try {
      const date = req.params.date || new Date().toISOString().split("T")[0];
      const reports = await Report.createQueryBuilder("report")
        .leftJoinAndSelect("report.user", "user")
        .where("report.submittedAt like :date", { date: `%${date}%` })
        .orderBy("report.submittedAt", "ASC")
        .getMany();

      return res.json(getResponse(200, reports));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

router.get(
  "/:rid",
  isAuth,
  isMember([UserType.ADMIN, UserType.MANAGER], "any"),
  async (req: TRequest, res) => {
    try {
      const report = await Report.findOne({
        where: { id: req.params.rid },
        relations: ["user", "tasks"],
        order: { tasks: { createdAt: "ASC" } },
      });
      if (!report) return res.json(getResponse(404, "Report not found!"));

      const employee = await Employee.findOne({
        where: { user: { id: report.user.id } },
      });
      if (!employee) return res.json(getResponse(404, "Employee not found!"));

      report.user.employee = employee;

      return res.json(getResponse(200, report));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

router.post(
  "/",
  isAuth,
  isMember([UserType.EMPLOYEE], "all"),
  canEmployee(true, true),
  async (req: TRequest, res) => {
    try {
      const tasks = req.body.tasks as { name: string; description: string }[];

      const report = Report.create({ user: { id: req.user?.id } });
      const _tasks = await Promise.all(
        tasks.map(
          async (t) =>
            await Task.create({
              name: t.name,
              description: t.description,
            }).save()
        )
      );
      report.tasks = _tasks;
      await report.save();

      return res.json(getResponse(200, report));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

router.put(
  "/:rid/status",
  isAuth,
  isMember([UserType.ADMIN, UserType.MANAGER], "any"),
  async (req: TRequest, res) => {
    try {
      await Report.update({ id: req.params.rid }, { status: req.body.status });
      return res.json(getResponse(200));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

router.put(
  "/:rid/submit",
  isAuth,
  isMember([UserType.EMPLOYEE], "all"),
  canEmployee(true, true),
  async (req: TRequest, res) => {
    try {
      const { summary } = req.body;

      const report = await Report.findOne({
        where: { id: req.params.rid },
        relations: ["tasks"],
      });
      if (!report) return res.json(getResponse(404));
      if (report.tasks.length === 0)
        return res.json(
          getResponse(
            400,
            "Report submission denied! Add a task for successfull submission!"
          )
        );
      report.summary = summary;
      report.submittedAt = new Date();
      await report.save();

      res.clearCookie(`${APP_PREFIX}${COOKIE_NAME}`);

      return res.json(getResponse(200));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

router.post(
  "/:rid/task",
  isAuth,
  isMember([UserType.EMPLOYEE], "all"),
  canEmployee(true, true),
  async (req: TRequest, res) => {
    try {
      const { task } = req.body;
      const { rid } = req.params;

      const _task = await Task.create({
        name: task.name,
        description: task.description,
        report: { id: rid },
      }).save();

      return res.json(getResponse(200, _task));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

router.delete(
  "/task/:tid",
  isAuth,
  isMember([UserType.EMPLOYEE], "all"),
  canEmployee(true, true),
  async (req: TRequest, res) => {
    try {
      await Task.delete(req.params.tid);
      return res.json(getResponse(200));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

router.put(
  "/task/:tid",
  isAuth,
  isMember([UserType.EMPLOYEE], "all"),
  canEmployee(true, true),
  async (req: TRequest, res) => {
    try {
      const task = await Task.findOne({ where: { id: req.params.tid } });
      if (task) {
        task.name = req.body.name;
        task.description = req.body.description;
        task.completed = req.body.completed;
        await task.save();
      }
      return res.json(getResponse(200, task));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

export default router;
