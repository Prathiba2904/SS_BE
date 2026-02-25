import { Router } from "express";
import { login } from "../controller/auth.controller";

const router = Router();


import { getUser, updateUser, deleteUser } from "../controller/auth.controller";

router.post("/login", login);
router.get("/user/:email", getUser);
router.put("/user/:email", updateUser);
router.delete("/user/:email", deleteUser);

export default router;