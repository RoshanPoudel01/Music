import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

router.post("/register", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.createUser);
router.delete("/delete/:id", UserController.deleteUser);
router.post("/login", UserController.loginUser);
export default router;
