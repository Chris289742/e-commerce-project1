import Product from "../models/product.js";

export const getAddProduct = (req, res) => {
    res.render("add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
    });
};

export const postAddProduct = async (req, res) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({ title, price, description });
    await product.save();
    res.redirect("/admin/products");
};

const adminUtils = { getAddProduct, postAddProduct };

export default adminUtils;
