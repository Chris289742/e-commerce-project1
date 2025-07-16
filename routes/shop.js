import express from "express";
import shopUtils from "../controller/shop.js";

const router = express.Router();

router.get("/products", shopUtils.getProducts);
router.get("/products/:productId", shopUtils.getProduct);
router.get("/cart", shopUtils.getCart);
router.post("/cart", shopUtils.postCart);
router.post("/cart-delete-item", shopUtils.postCartDeleteProduct);

export default router;