import { NextFunction, Response } from "express";
import { TAuthRequest } from "../lib/types";
import { UserType } from "../lib/types/model";
import { log } from "../lib/utils/logging";
import getResponse from "../lib/utils/getResponse";
import User from "../entities/User";

export default (type: UserType) => {
  return async (req: TAuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.json(getResponse(401));
      const isMember = await User.createQueryBuilder("user")
        .leftJoin("user.groups", "group")
        .where("user.id = :uid", { uid: req.user?.id })
        .andWhere("group.name = :type", { type })
        .getOne();

      if (!isMember) return res.json(getResponse(401));
      next();
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(401));
    }
  };
};
