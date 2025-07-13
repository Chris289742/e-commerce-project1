import express from "express";
import shopUtils from "../controller/shop.js";

const router = express.Router();

router.get("/products", shopUtils.getProducts);

export default router;