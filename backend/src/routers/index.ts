import { Router } from "express";
import UserRouter from "./userRouters";

const routers = Router();

routers.use("/users", UserRouter);

export default routers;
