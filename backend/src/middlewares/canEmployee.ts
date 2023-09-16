import { NextFunction, Response } from "express";
import { TRequest } from "../lib/types";
import { log } from "../lib/utils/logging";
import getResponse from "../lib/utils/getResponse";
import Employee from "../entities/Employee";
import timeEmployee from "../lib/utils/timeEmployee";
import {
  APP_PREFIX,
  COOKIE_NAME,
  EMPLOYEE_ADDITIONAL_HOUR,
} from "../lib/constants";

export default (required: boolean, late: boolean = false) => {
  return async (req: TRequest, res: Response, next: NextFunction) => {
    try {
      const employee = await Employee.findOne({
        where: { user: { id: req.user?.id } },
      });

      if (employee) {
        if (employee.leftAt) {
          res.clearCookie(`${APP_PREFIX}${COOKIE_NAME}`);
          return res.json(
            getResponse(400, "You are no longer part of the company!")
          );
        }

        if (
          employee.endedAt &&
          employee.endedAt.getTime() <= new Date().getTime()
        ) {
          res.clearCookie(`${APP_PREFIX}${COOKIE_NAME}`);
          return res.json(
            getResponse(
              400,
              "Your employee contract has expired, please contact the support!"
            )
          );
        }

        const allowed = timeEmployee(
          employee.startTime,
          employee.endTime,
          0,
          late ? EMPLOYEE_ADDITIONAL_HOUR : 0
        );

        if (!allowed) {
          res.clearCookie(`${APP_PREFIX}${COOKIE_NAME}`);
          return res.json(
            getResponse(401, "You can only login within your working period!")
          );
        }

        return next();
      } else if (required)
        return res.json(getResponse(404, "Employee not found!"));

      next();
    } catch (error: any) {
      log("ERROR", error.message);
      return res.json(getResponse(401));
    }
  };
};
