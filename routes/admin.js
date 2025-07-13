import express from "express";
import adminUtils from "../controller/admin.js";
const router = express.Router();

router.get("/add-product", adminUtils.getAddProduct);
router.post("/add-product", adminUtils.postAddProduct);

export default router;
