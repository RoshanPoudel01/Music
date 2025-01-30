import { Router } from "express";
import { MusicController } from "../controllers/musicController";
import verifyToken from "../middlewares/VerifyToken";
const MusicRouter = Router();

MusicRouter.post("/create-music", verifyToken, MusicController.createMusic);
MusicRouter.get("/allMusic", verifyToken, MusicController.getAllMusic);
MusicRouter.get("/:id", verifyToken, MusicController.getMusicById);
// MusicRouter.put("/:id", verifyToken, MusicController.createMusic);
MusicRouter.delete("/delete/:id", verifyToken, MusicController.deleteMusic);

export default MusicRouter;
