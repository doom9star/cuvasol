import bcrypt from "bcryptjs";
import { Router } from "express";
import { v4 } from "uuid";
import Employee from "../entities/Employee";
import Group from "../entities/Group";
import Report from "../entities/Report";
import User from "../entities/User";
import {
  ACTIVATE_ACCOUNT_PREFIX,
  APP_PREFIX,
  COOKIE_NAME,
  FORGOT_PASSWORD_PREFIX,
  WEEK,
} from "../lib/constants";
import { TRequest } from "../lib/types";
import { UserType } from "../lib/types/model";
import getResponse from "../lib/utils/getResponse";
import getToken from "../lib/utils/getToken";
import { log } from "../lib/utils/logging";
import { sendMail } from "../lib/utils/sendMail";
import canEmployee from "../middlewares/canEmployee";
import isAuth from "../middlewares/isAuth";
import isMember from "../middlewares/isMember";
import isNotAuth from "../middlewares/isNotAuth";

const router = Router();

router.get(
  "/",
  isAuth,
  isMember([UserType.ADMIN, UserType.MANAGER, UserType.EMPLOYEE], "any"),
  canEmployee(false, true),
  async (req: TRequest, res) => {
    try {
      const user = await User.findOne({
        where: { id: req.user?.id },
        relations: ["groups"],
      });

      if (!user) return res.json(getResponse(404));
      if (user.groups.findIndex((g) => g.name === UserType.EMPLOYEE) !== -1) {
        const employee = await Employee.findOne({
          where: { user: { id: req.user?.id } },
        });
        if (!employee) return res.json(getResponse(404, "Employee not found!"));

        const today = new Date().toISOString().split("T")[0];
        const report = await Report.createQueryBuilder("report")
          .leftJoin("report.user", "user")
          .leftJoinAndSelect("report.tasks", "task")
          .where("user.id = :uid", { uid: req.user?.id })
          .andWhere("report.createdAt like :today", { today: `%${today}%` })
          .getOne();

        if (report) employee.report = report;

        user.employee = employee;
      }

      return res.json(getResponse(200, user));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

router.post("/activate-account/:tid", isNotAuth, async (req: TRequest, res) => {
  try {
    const { tid } = req.params;
    const { password } = req.body;

    const uid = await req.cacher.get(
      `${APP_PREFIX}${ACTIVATE_ACCOUNT_PREFIX}${tid}`
    );

    const user = await User.findOne({ where: { id: uid } });
    if (!user) return res.json(getResponse(404));

    if (user.activated)
      return res.json(getResponse(400, "Account already activated!"));

    const authorized = await user.checkPassword(password);
    if (!authorized) return res.json(getResponse(401, "Wrong credentials!"));

    user.activated = true;
    await user.save();

    await req.cacher.del(`${APP_PREFIX}${ACTIVATE_ACCOUNT_PREFIX}${tid}`);

    return res.json(getResponse(200));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.get("/activate-account/:tid", isNotAuth, async (req: TRequest, res) => {
  try {
    const { tid } = req.params;
    const uid = await req.cacher.get(
      `${APP_PREFIX}${ACTIVATE_ACCOUNT_PREFIX}${tid}`
    );
    if (!uid) return res.json(getResponse(404));

    const user = await User.findOne({ where: { id: uid } });
    if (!user) return res.json(getResponse(404));

    if (user.activated)
      return res.json(getResponse(208, "Account has already been activated!"));

    return res.json(getResponse(200));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post(
  "/register",
  isAuth,
  isMember([UserType.ADMIN, UserType.MANAGER], "any"),
  async (req: TRequest, res) => {
    try {
      const {
        name,
        email,
        type,
        subtype,
        designation,
        location,
        phoneNumber,
        birthDate,
        gender,
        urls,
      } = req.body;

      if (
        [UserType.MANAGER, UserType.CLIENT].includes(type) &&
        !req.groups?.includes(UserType.ADMIN)
      ) {
        return res.json(
          getResponse(400, "ADMIN can only create managers/clients!")
        );
      }

      const password = v4()[10];
      const user = await User.create({
        name,
        password,
        email,
        location,
        designation,
        phoneNumber,
        birthDate,
        gender,
        urls,
      }).save();

      if (type === UserType.EMPLOYEE) {
        const {
          employee: { salary, startTime, endTime, joinedAt },
        } = req.body;
        await Employee.create({
          type: subtype,
          salary,
          startTime,
          endTime,
          joinedAt,
          user,
        }).save();
      }

      const group = await Group.findOne({
        where: { name: type },
      });
      await Group.createQueryBuilder("group")
        .relation("members")
        .of(group)
        .add(user);

      const tid = v4();
      const key = `${APP_PREFIX}${ACTIVATE_ACCOUNT_PREFIX}${tid}`;
      const url = `${process.env.CLIENT}/auth/activate-account/${tid}`;
      await req.cacher.set(key, user.id);

      sendMail({
        from: <any>process.env.MAILER_EMAIL,
        to: user.email,
        subject: "Cuvaosl | Registration Successfull",
        html: `Hi ${user.name}!
      Your account has been successfully registered in cuvasol.

      Your password: ${password}
      Visit this url to activate your account: ${url}

      After activation, you can login during your working hours to submit reports everyday!
      `,
      });

      return res.json(getResponse(200, { url, password }));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

router.post(
  "/login",
  isNotAuth,
  isMember(
    [UserType.ADMIN, UserType.EMPLOYEE, UserType.MANAGER, UserType.CLIENT],
    "any"
  ),
  canEmployee(false, false),
  async (req: TRequest, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email: email },
        relations: ["groups"],
      });

      if (!user) return res.json(getResponse(404));
      if (!user.activated)
        return res.json(getResponse(400, "Account must be activated!"));
      if (!(await user.checkPassword(password)))
        return res.json(getResponse(401, "Wrong credentials!"));

      if (req.groups?.includes(UserType.EMPLOYEE)) {
        const employee = await Employee.findOne({
          where: { user: { id: user.id } },
        });

        if (!employee) return res.json(getResponse(404, "Employee not found!"));

        const today = new Date().toISOString().split("T")[0];
        const reports = await Report.createQueryBuilder("report")
          .leftJoin("report.user", "user")
          .where("user.id = :uid", { uid: user.id })
          .andWhere("report.submittedAt like :today", { today: `%${today}%` })
          .getCount();

        if (reports > 0)
          return res.json(
            getResponse(
              401,
              "You have already submitted your report for today!"
            )
          );

        user.employee = employee;
      }

      res.cookie(`${APP_PREFIX}${COOKIE_NAME}`, getToken({ id: user.id }), {
        maxAge: WEEK * 1000,
      });
      return res.json(getResponse(200, user));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

router.delete("/logout/:rid?", isAuth, async (req, res) => {
  try {
    if (req.params.rid) {
      await Report.delete({ id: req.params.rid });
    }
    res.clearCookie(`${APP_PREFIX}${COOKIE_NAME}`);
    return res.json(getResponse(200));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post("/forgot-password", isAuth, async (req: TRequest, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.json(getResponse(404));
    if (!user.activated)
      return res.json(getResponse(400, "Account must be activated!"));

    const tid = v4();
    const key = `${APP_PREFIX}${FORGOT_PASSWORD_PREFIX}${tid}`;
    const url = `${process.env.CLIENT}/auth/reset-password/${tid}`;
    await req.cacher.set(key, user.id);

    sendMail({
      from: <any>process.env.MAILER_EMAIL,
      to: user.email,
      subject: "Cuvaosl | Reset password",
      html: `Visit this url to reset your password: ${url}`,
    });

    return res.json(getResponse(200, url));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.get("/reset-password/:tid", isNotAuth, async (req: TRequest, res) => {
  try {
    const { tid } = req.params;
    const uid = await req.cacher.get(
      `${APP_PREFIX}${FORGOT_PASSWORD_PREFIX}${tid}`
    );
    if (!uid) return res.json(getResponse(404));

    const user = await User.findOne({ where: { id: uid } });
    if (!user) return res.json(getResponse(404));

    return res.json(getResponse(200));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post("/reset-password/:tid", isNotAuth, async (req: TRequest, res) => {
  try {
    const { tid } = req.params;

    const uid = await req.cacher.get(
      `${APP_PREFIX}${FORGOT_PASSWORD_PREFIX}${tid}`
    );
    if (!uid) return res.json(getResponse(404));

    const { password } = req.body;

    const user = await User.findOne({ where: { id: uid } });
    if (!user) return res.json(getResponse(404));

    user.password = await bcrypt.hash(password, 12);
    user.save();

    await req.cacher.del(`${APP_PREFIX}${FORGOT_PASSWORD_PREFIX}${tid}`);

    return res.json(getResponse(200));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post(
  "/permission",
  isAuth,
  isMember([UserType.ADMIN], "all"),
  async (req: TRequest, res) => {
    try {
      const { operation, group, permissions } = req.body;
      const g = await Group.findOne(group);

      if (operation === "A") {
        await Group.createQueryBuilder("group")
          .relation("permissions")
          .of(g)
          .add(permissions);
      } else if (operation === "R") {
        await Group.createQueryBuilder("group")
          .relation("permissions")
          .of(g)
          .remove(permissions);
      }

      return res.json(getResponse(200));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

export default router;
