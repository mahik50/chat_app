import { Router } from "express";
import { createRoom, joinRoom, userLogin, userLogout, userRegister } from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

export const router = Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJWT, userLogout);
router.route("/createRoom").post(createRoom);
router.route("/joinRoom").post(joinRoom);

