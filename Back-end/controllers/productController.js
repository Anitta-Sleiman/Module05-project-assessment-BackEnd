import Products from "../models/productModel.js";
import mongoose from "mongoose";

class Product {
  // get all products
  static async getAllProducts(req, res) {
    try {
      const products = await Products.find({});
      res.status(200).json({
        data: products,
        message: "products found successfully!!",
        status: 200,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  //get single product
  static async getSingleProduct(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such product" });
    }
    try {
      const product = await Products.find({ _id: id });
      if (!product) {
        res.status(404).json({ error: "No such product" });
      } else {
        res.status(200).json({
          data: product,
          message: "product found successfully!!",
          status: 200,
        });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  //create a product
  static async createProduct(req, res) {
    const { title, description, price } = req.body;
    const image = req.file ? req.file.path : "";

    try {
      const addProduct = await Products.create({
        title,
        description,
        price,
        image,
      });
      res.status(200).json({
        data: addProduct,
        message: "product added successfully!!",
        status: 200,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // edit a product by id
  static async editProduct(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "this product doesn't exist" });
    }
    const { title, description, price } = req.body;
    const image = req.file ? req.file.path : null;

    try {
      if (image) {
        const product = await Products.findOneAndUpdate(
          { _id: id },
          {
            title,
            description,
            price,
            image: image,
          }
        );
        return res.status(200).json({
          data: product,
          message: `${id} edited successfully!!`,
          status: 200,
        });
      } else {
        const product = await Products.findOneAndUpdate(
          { _id: id },
          {
            title,
            price,
            description,
          },
          {
            new: true,
          }
        );
        return res.status(200).json({
          data: product,
          message: `${id} edited successfully!!`,
          status: 200,
        });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  //delete a product by id
  static async deleteProduct(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "this product doesn't exist" });
    }
    try {
      const product = await Products.findOneAndDelete({ _id: id });
      res.status(200).json({
        data: product,
        message: `${id} deleted successfully!!`,
        status: 200,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default Product;
