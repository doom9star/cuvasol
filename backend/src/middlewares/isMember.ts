import { NextFunction, Response } from "express";
import { TRequest } from "../lib/types";
import { UserType } from "../lib/types/model";
import { log } from "../lib/utils/logging";
import getResponse from "../lib/utils/getResponse";
import User from "../entities/User";

export default (types: UserType[], type: "any" | "all") => {
  return async (req: TRequest, res: Response, next: NextFunction) => {
    try {
      const query = User.createQueryBuilder("user").leftJoinAndSelect(
        "user.groups",
        "group"
      );

      if (req.user?.id) {
        query.where("user.id = :uid", { uid: req.user?.id });
      } else {
        const { email } = req.body;
        query.where("user.email = :email", { email });
      }

      const user = await query.getOne();
      if (!user) return res.json(getResponse(404));

      const groups = user.groups.map((g) => g.name);
      if (
        type === "any" &&
        types.filter((t) => groups.includes(t)).length < 1
      ) {
        return res.json(getResponse(401));
      }
      if (
        type === "all" &&
        types.filter((t) => groups.includes(t)).length !== types.length
      ) {
        return res.json(getResponse(401));
      }

      req.groups = groups;
      next();
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(401));
    }
  };
};
