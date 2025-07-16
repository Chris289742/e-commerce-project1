import express from "express";
import adminUtils from "../controller/admin.js";
const router = express.Router();

router.get("/add-product", adminUtils.getAddProduct);
router.post("/add-product", adminUtils.postAddProduct);
router.get("/products", adminUtils.getProducts);
router.get("/edit-product/:productId", adminUtils.getEditProduct);
router.post("/edit-product", adminUtils.postEditProduct);
router.post("/delete-product", adminUtils.postDeleteProduct);

export default router;
