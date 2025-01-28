import { Router } from "express";
import ArtistRouter from "./artistRoutes";
import MusicRouter from "./musicRoutes";
import UserRouter from "./userRouters";

const routers = Router();

routers.use("/users", UserRouter);
routers.use("/artist", ArtistRouter);
routers.use("/music", MusicRouter);

export default routers;
