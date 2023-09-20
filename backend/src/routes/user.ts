import { Router } from "express";
import User from "../entities/User";
import { UserType } from "../lib/types/model";
import getResponse from "../lib/utils/getResponse";
import { log } from "../lib/utils/logging";
import isAuth from "../middlewares/isAuth";
import isMember from "../middlewares/isMember";

const router = Router();

router.get(
  "/employees",
  isAuth,
  isMember([UserType.ADMIN, UserType.MANAGER], "any"),
  async (_, res) => {
    try {
      const users = await User.createQueryBuilder("user")
        .leftJoin("user.groups", "group")
        .where("group.name = :name", { name: UserType.EMPLOYEE })
        .getMany();
      return res.json(getResponse(200, users));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

export default router;
