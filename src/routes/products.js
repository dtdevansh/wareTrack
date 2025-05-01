const express = require("express");

//local imports
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const {
  newProductDataValidator,
  productDataValidator,
} = require("../utills/dataValidator");
const Products = require("../models/products");

const productRouter = express.Router();
const USER_SAFE = "name category quantity price size description";

productRouter.get("/products", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    //  await User.findById(req.user._id).select("_id");
    if (!userId) {
      throw new Error("User not found");
    }
    const products = await Products.find({ userId: userId });
    if (products.length === 0) {
      throw new Error("You don't have any products yet. Add some products.");
    }
    res.json({ message: "Products fetched successfully", data: products });
  } catch (err) {
    res.json("Error: " + err);
  }
});

productRouter.post("/products", userAuth, async (req, res) => {
  try {
    if (!newProductDataValidator(req)) {
      throw new Error("Invalid request!");
    }
    const userId = req.user._id;
    if (!userId) {
      throw new Error("User not found!");
    }
    const { name, category, quantity, price, size, description } = req.body;
    const productExists = await Products.findOne({
      userId: userId,
      name: name,
      category: category,
      price: price,
      size: size,
      description: description,
    });
    if (productExists) {
      throw new Error("Product already exists!");
    }
    const product = new Products({
      name,
      category,
      quantity,
      price,
      size,
      description,
      userId: userId,
    });
    product.save();
    const safeProduct = {
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      size: product.size,
      description: product.description,
    };

    res.json({ message: "Product Saved succussfully", data: safeProduct });
  } catch (err) {
    res.json("Error: " + err);
  }
});

productRouter.patch("/products/:id", userAuth, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;
    if (!userId) {
      throw new Error("User not found!");
    }
    if (!productId) {
      throw new Error("Product not found!");
    }
    if (!productDataValidator(req)) {
      throw new Error("Invalid Request");
    }
    const productexists = await Products.findOne({
      _id: productId,
      userId: userId,
    });
    if (!productexists) {
      throw new Error("Product not found!");
    }
    Object.keys(req.body).forEach(
      (key) => (productexists[key] = req.body[key])
    );
    await productexists.save();

    const safeProduct = await Products.findById(productexists._id).select(
      USER_SAFE
    );
    res.json({ message: "Product Saved succusfully", data: safeProduct });
  } catch (err) {
    res.json("Error: " + err);
  }
});

module.exports = { productRouter };
