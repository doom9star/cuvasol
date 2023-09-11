import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../entities/User";
import {
  ACTIVATE_ACCOUNT_PREFIX,
  APP_PREFIX,
  COOKIE_NAME,
  FORGOT_PASSWORD_PREFIX,
} from "../lib/constants";
import { TAuthRequest } from "../lib/types";
import getResponse from "../lib/utils/getResponse";
import getToken from "../lib/utils/getToken";
import isAuth from "../middlewares/isAuth";
import isNotAuth from "../middlewares/isNotAuth";
import { v4 } from "uuid";
import { log } from "../lib/utils/logging";
import Employee from "../entities/Employee";
import { UserRole } from "../lib/types/model";

const router = Router();

router.get("/", isAuth, async (req: TAuthRequest, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user?.id } });
    return res.json(getResponse(200, user));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post(
  "/activate-account/:tid",
  isAuth,
  async (req: TAuthRequest, res) => {
    try {
      const { tid } = req.params;
      const { password } = req.body;

      const uid = await req.redclient.get(
        `${APP_PREFIX}${ACTIVATE_ACCOUNT_PREFIX}${tid}`
      );

      const user = await User.findOne({ where: { id: uid } });
      if (!user) return res.json(getResponse(404));

      if (user.activated)
        return res.json(getResponse(400, "Account already activated!"));

      const authorized = await user.checkPassword(password);
      if (!authorized) return res.json(getResponse(401));

      user.activated = true;
      await user.save();

      await req.redclient.del(`${APP_PREFIX}${ACTIVATE_ACCOUNT_PREFIX}${tid}`);

      return res.json(getResponse(200));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

router.post("/register", isNotAuth, async (req: TAuthRequest, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      location,
      phoneNumber,
      birthDate,
      urls,
    } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      location,
      phoneNumber,
      birthDate,
      urls,
    }).save();

    if (role === UserRole.EMPLOYEE) {
      const {
        employee: { role, salary, startTime, endTime, joinedAt },
      } = req.body;
      await Employee.create({
        role,
        salary,
        startTime,
        endTime,
        joinedAt,
      }).save();
    }

    const tid = v4();
    const key = `${APP_PREFIX}${ACTIVATE_ACCOUNT_PREFIX}${tid}`;
    const url = `${process.env.CLIENT}/auth/activate-account/${key}`;
    await req.redclient.set(key, user.id);

    res.cookie(`${APP_PREFIX}${COOKIE_NAME}`, getToken({ id: user.id }));
    return res.json(getResponse(200, url));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post("/login", isNotAuth, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) return res.json(getResponse(404));
    if (!user.activated)
      return res.json(getResponse(400, "Account must be activated!"));
    if (!(await user.checkPassword(password)))
      return res.json(getResponse(401, "Wrong credentials!"));

    res.cookie(`${APP_PREFIX}${COOKIE_NAME}`, getToken({ id: user.id }));
    return res.json(getResponse(200, user));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.delete("/logout", isAuth, async (_, res) => {
  try {
    res.clearCookie(`${APP_PREFIX}${COOKIE_NAME}`);
    return res.json(getResponse(200));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post("/forgot-password", isAuth, async (req: TAuthRequest, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.json(getResponse(404));
    if (!user.activated)
      return res.json(getResponse(400, "Account must be activated!"));

    const tid = v4();
    const key = `${APP_PREFIX}${FORGOT_PASSWORD_PREFIX}${tid}`;
    const url = `${process.env.CLIENT}/auth/reset-password/${key}`;
    await req.redclient.set(key, user.id);

    return res.json(getResponse(200, url));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post("/reset-password/:tid", isAuth, async (req: TAuthRequest, res) => {
  try {
    const { tid } = req.params;

    const uid = await req.redclient.get(
      `${APP_PREFIX}${FORGOT_PASSWORD_PREFIX}${tid}`
    );
    const { password } = req.body;

    const user = await User.findOne({ where: { id: uid } });
    if (!user) return res.json(getResponse(404));

    user.password = await bcrypt.hash(password, 12);
    user.save();

    await req.redclient.del(`${APP_PREFIX}${FORGOT_PASSWORD_PREFIX}${tid}`);

    return res.json(getResponse(200));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

export default router;
