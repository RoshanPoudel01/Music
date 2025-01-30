import { Router } from "express";
import { UserController } from "../controllers/userController";
import verifyToken from "../middlewares/VerifyToken";

const router = Router();

router.post("/register", UserController.createUser);
router.get("/", verifyToken, UserController.getAllUsers);
router.get("/:id", verifyToken, UserController.getUserById);
// router.put("/:id", verifyToken, UserController.createUser);
router.delete("/delete/:id", verifyToken, UserController.deleteUser);
router.post("/login", UserController.loginUser);

router.post("/change-password", verifyToken, UserController.changePassword);

export default router;
