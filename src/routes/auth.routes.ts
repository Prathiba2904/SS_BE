import { Router } from "express";
import { login, register, logout, getUser, updateUser, deleteUser } from "../controller/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user/:email", getUser);
router.put("/user/:email", updateUser);
router.delete("/user/:email", deleteUser);

export default router;