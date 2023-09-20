import { Router } from "express";
import User from "../entities/User";
import { UserType } from "../lib/types/model";
import getResponse from "../lib/utils/getResponse";
import { log } from "../lib/utils/logging";
import isAuth from "../middlewares/isAuth";
import isMember from "../middlewares/isMember";
import { TRequest } from "../lib/types";

const router = Router();

router.get(
  "/staffs",
  isAuth,
  isMember([UserType.ADMIN, UserType.MANAGER], "any"),
  async (req: TRequest, res) => {
    try {
      const groups = [UserType.EMPLOYEE];
      if (req.groups?.includes(UserType.ADMIN)) {
        groups.push(UserType.MANAGER);
        groups.push(UserType.CLIENT);
      }
      const users = await User.createQueryBuilder("user")
        .leftJoin("user.groups", "group")
        .where("group.name in (:...groups)", { groups })
        .getMany();
      return res.json(getResponse(200, users));
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(500, error.message));
    }
  }
);

export default router;
