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

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render("admin/products", {
            pageTitle: "Admin Products",
            prods: products,
            path: "/admin/products",
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).render('error', {
            pageTitle: 'Error',
            message: 'Failed to load products'
        });
    }
};

export const getEditProduct = async (req, res) => {
    
}

export const postDeleteProduct = async (req, res) => {
    try {
        const prodId = req.body.productId;
        await Product.findByIdAndDelete(prodId);
        res.redirect("/admin/products");
    } catch (error) {
        console.error('Error deleting product:', error);
        res.redirect("/admin/products");
    }
};


const adminUtils = { getAddProduct, postAddProduct, getProducts, postDeleteProduct };

export default adminUtils;
