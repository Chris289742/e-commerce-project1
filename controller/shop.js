import Product from '../models/product.js'; // import models to interact with the database
export const getProducts = async (req, res) => {
    const producuts = await Product.find(); // fetch all products from the database
    console.log(producuts);
    
    res.render("products", {
        pageTitle: "Products",
        prods: producuts,
        path: '/products',
    });
};

const shopUtils = { getProducts };

export default shopUtils;

