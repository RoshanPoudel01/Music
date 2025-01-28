import { Router } from "express";
import { ArtistController } from "../controllers/artistController";
import verifyToken from "../middlewares/VerifyToken";

const ArtistRouter = Router();

ArtistRouter.post("/create-artist", verifyToken, ArtistController.createArtist);
ArtistRouter.get("/", verifyToken, ArtistController.getAllArtists);
ArtistRouter.get("/:id", verifyToken, ArtistController.getArtistById);
ArtistRouter.put("/:id", verifyToken, ArtistController.createArtist);
ArtistRouter.delete("/delete/:id", verifyToken, ArtistController.deleteArtist);

export default ArtistRouter;
