import { Router } from "express";
import { dashboardData } from "../controllers/dashboardController";
import verifyToken from "../middlewares/VerifyToken";

const dashboardRouter = Router();

dashboardRouter.get("/", verifyToken, dashboardData);

export default dashboardRouter;
