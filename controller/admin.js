import Product from "../models/product.js";
import mongoose from "mongoose";

export const getAddProduct = (req, res) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: "false"
    });
};

export const postAddProduct = async (req, res) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    // For now, use a dummy userId - in a real app, get from session
    const product = new Product({ 
        title, 
        price, 
        description, 
        userId: req.session.user?._id || new mongoose.Types.ObjectId()
    });
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
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/admin/products');
    }   
    const prodId = req.params.productId;
    try {
        const product = await Product.findById(prodId);
        if (!product) {
            return res.redirect('/admin/products');
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: editMode,
            product: product
        });
    } catch (error) {
        console.error('Error fetching product for edit:', error);
        res.redirect('/admin/products');
    }
};

export const postEditProduct = async (req, res) => {
    try {
        const prodId = req.body.productId;
        const updatedTitle = req.body.title;
        const updatedPrice = req.body.price;
        const updatedDescription = req.body.description;
        
        await Product.findByIdAndUpdate(prodId, {
            title: updatedTitle,
            price: updatedPrice,
            description: updatedDescription
        });
        res.redirect("/admin/products");
    } catch (error) {
        console.error('Error updating product:', error);
        res.redirect("/admin/products");
    }
};

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


const adminUtils = { getAddProduct, postAddProduct, getProducts, getEditProduct, postEditProduct, postDeleteProduct };

export default adminUtils;
