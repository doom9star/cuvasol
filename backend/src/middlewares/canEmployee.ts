import { NextFunction, Response } from "express";
import { TRequest } from "../lib/types";
import { log } from "../lib/utils/logging";
import getResponse from "../lib/utils/getResponse";
import Employee from "../entities/Employee";

export default (required: boolean) => {
  return async (req: TRequest, res: Response, next: NextFunction) => {
    try {
      const employee = await Employee.findOne({
        where: { user: { id: req.user?.id } },
      });

      if (employee) {
        if (employee.leftAt)
          return res.json(
            getResponse(400, "You are no longer part of the company!")
          );

        const now = new Date();

        if (employee.endedAt && employee.endedAt.getTime() <= now.getTime())
          return res.json(
            getResponse(
              400,
              "Your employee contract has expired, please contact the support!"
            )
          );

        const startTime = new Date();
        startTime.setHours(
          employee.startTime.getHours(),
          employee.startTime.getMinutes()
        );

        const endTime = new Date();
        endTime.setHours(
          employee.endTime.getHours() - 1,
          employee.endTime.getMinutes()
        );

        if (
          now.getTime() < startTime.getTime() ||
          now.getTime() > endTime.getTime()
        ) {
          return res.json(
            getResponse(401, "You can only login within your working period!")
          );
        }

        next();
      } else if (required)
        return res.json(getResponse(404, "Employee not found!"));

      next();
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(401));
    }
  };
};
