import Product from "../models/product.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render("shop/products", {
            pageTitle: "Products",
            prods: products,
            path: "/products",
            isAuthenticated: req.session.isLoggedIn,
            csrfToken: req.csrfToken(),
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).render("error", {
            pageTitle: "Error",
            message: "Failed to load products",
        });
    }
};

export const getProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).render("error", {
                pageTitle: "404 Not Found",
                message: "Product not found",
            });
        }

        res.render("shop/product-detail", {
            pageTitle: product.title,
            product: product,
            path: "/products",
            isAuthenticated: req.session.isLoggedIn,
            csrfToken: req.csrfToken(),
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).render("error", {
            pageTitle: "Error",
            message: "Failed to load product",
        });
    }
};

export const getCart = async (req, res, next) => {
    try {
        const user = await req.user.populate("cart.items.productId");

        const products = user.cart.items;
        res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
            isAuthenticated: req.session.isLoggedIn,
            csrfToken: req.csrfToken(),
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const postCart = async (req, res) => {
    try {
        const productId = req.body.productId;
        const product = await Product.findById(productId);
        
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/products");
        }

        await req.user.addToCart(product);
        req.flash("success", "Product added to cart!");
        res.redirect("/cart");
    } catch (error) {
        console.error("Error adding to cart:", error);
        req.flash("error", "Failed to add product to cart");
        res.redirect("/products");
    }
};

export const postCartDeleteProduct = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        await req.user.removeFromCart(productId);
        req.flash("success", "Product removed from cart");
        res.redirect("/cart");
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to remove product from cart");
        res.redirect("/cart");
    }
};

const shopUtils = { getProducts, getProduct, getCart, postCart, postCartDeleteProduct };

export default shopUtils;
