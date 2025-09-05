const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getCategories,
    searchProducts,
    addReview,
    getProductsByCategory,
    getFeaturedProducts
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

// Public routes (không cần authentication)
routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
})

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// Product routes (public)
routerAPI.get("/products", getProducts);
routerAPI.get("/products/featured", getFeaturedProducts);
routerAPI.get("/products/category/:category", getProductsByCategory);
routerAPI.get("/products/search", searchProducts);
routerAPI.get("/products/categories", getCategories);
routerAPI.get("/products/:id", getProductById);

// Protected routes (cần authentication)
routerAPI.use(auth);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

// Product management routes (cần authentication)
routerAPI.post("/products", createProduct);
routerAPI.put("/products/:id", updateProduct);
routerAPI.delete("/products/:id", deleteProduct);
routerAPI.post("/products/:id/reviews", addReview);

module.exports = routerAPI; //export default

