import { Router } from "express";
import isAuth from "../middlewares/isAuth";
import isMember from "../middlewares/isMember";
import { UserType } from "../lib/types/model";
import { TRequest } from "../lib/types";
import { log } from "../lib/utils/logging";
import getResponse from "../lib/utils/getResponse";
import Report from "../entities/Report";
import Task from "../entities/Task";
import canEmployee from "../middlewares/canEmployee";
import { APP_PREFIX, COOKIE_NAME } from "../lib/constants";

const router = Router();

router.get(
  "/",
  isAuth,
  isMember([UserType.ADMIN, UserType.MANAGER], "any"),
  async (_, res) => {
    try {
      const reports = await Report.find({
        order: { createdAt: "DESC" },
      });
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
      });
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
  canEmployee(true),
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
  "/:rid/approve",
  isAuth,
  isMember([UserType.ADMIN, UserType.MANAGER], "any"),
  async (req: TRequest, res) => {
    try {
      const report = await Report.findOne({ where: { id: req.params.rid } });
      if (!report) return res.json(getResponse(404));

      report.approved = true;
      await report.save();

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
  canEmployee(true),
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
      report.submitted = true;
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
  canEmployee(true),
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
  canEmployee(true),
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
  canEmployee(true),
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
