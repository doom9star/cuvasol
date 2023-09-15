import { Router } from "express";

import AuthRouter from "./auth";
import ReportRouter from "./report";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/report", ReportRouter);

router.get("/", async (req, res) => {
  res.send(`Hi I'm ${req.path}, welcome to ASTROWORLD API.`);
});

export default router;
