import { NextFunction, Response } from "express";
import User from "../entities/User";
import { TAuthRequest } from "../lib/types";
import { PermissionType } from "../lib/types/model";
import getResponse from "../lib/utils/getResponse";
import { log } from "../lib/utils/logging";

export default (types: PermissionType[]) => {
  return async (req: TAuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.json(getResponse(401));
      const user = await User.createQueryBuilder("user")
        .leftJoinAndSelect("user.groups", "group")
        .leftJoinAndSelect("group.permissions", "permission")
        .where("user.id = :uid", { uid: req.user?.id })
        .andWhere("permission.name IN(:...types)", { types })
        .getOne();

      if (!user) return res.json(getResponse(401));
      req.perms = user.groups.reduce<PermissionType[]>(
        (pg, cg) => [...pg, ...cg.permissions.map((p) => p.name)],
        []
      );

      next();
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(401));
    }
  };
};
