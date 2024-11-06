import { Router } from "express";
import { createUser, signInUser } from "./user.controller";

const router = Router();

router.post("/createUser", createUser);
router.post("/signin", signInUser);

export default router;
