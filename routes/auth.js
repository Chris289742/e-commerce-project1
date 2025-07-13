import express from "express";
import authUtils from "../controller/auth.js";
const router = express.Router();

router.get("/login", authUtils.getLogin);

export default router;
