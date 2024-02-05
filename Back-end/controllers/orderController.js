import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

//create order
export const createOrder = async (req, res) => {
  try {
    const { products, status, userId, } = req.body;

    console.log(products);
    if (!Array.isArray(products)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing products array" });
    }
    const productDetails = await Promise.all(
      products.map(async (product) => {
        const productDoc = await Product.findById(product.product);
        console.log("this is product doc", product.product);
        return productDoc;
      })
    );
    console.log("Product details:", productDetails);
    // Check if productDetails is an empty array
    if (productDetails.length === 0) {
      return res.status(400).json({ error: "No product details found" });
    }
    console.log("Request body:", req.body);
    const orderProducts = productDetails.map((product, index) => ({
      product: product._id,
      quantity: products[index].quantity,
      price: product.price * products[index].quantity,
    }));

    const totalPrice = productDetails.reduce((total, product, index) => {
      const productPrice = product.price;
      const productQuantity = products[index].quantity;
      return total + productPrice * productQuantity;
    }, 0);

    const order = new Order({
      totalPrice,
      status: status || "Pending",
      products: orderProducts,
      userId,
    });

    const savedOrder = await order.save();

    // Populate the products field in the saved order
    const populatedOrder = await savedOrder.populate("products.product userId");

    return res.status(201).json(populatedOrder);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

//get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: "products.product userId",
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get a single order by id
export const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).populate({
      path: "products.product userId",
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching single order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//update an order
export const updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    // Fetch the existing order with populated products
    const existingOrder = await Order.findById(id).populate({
      path: "products.product userId",
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order data
    existingOrder.status = updatedData.status || existingOrder.status;
    existingOrder.products = updatedData.products || existingOrder.products;

    // Recalculate the total price based on the current products
    const totalPrice = await calculateTotalPrice(existingOrder.products);
    existingOrder.totalPrice = totalPrice;

    // Save the updated order
    const updatedOrder = await existingOrder.save();

    // Populate the products field in the response
    const populatedOrder = await Order.populate(updatedOrder, {
      path: "products.product userId",
    });

    res.status(200).json(populatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const calculateTotalPrice = async (products) => {
  const totalPrice = await Promise.all(
    products.map(async (product) => {
      const productDoc = await Product.findById(product.product);
      return productDoc.price * product.quantity;
    })
  );

  return totalPrice.reduce((total, price) => total + price, 0);
};

//delete order
export const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(204).send({ message: "Order is deleted" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get orders by user
export const getAllOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId }).populate({
      path: "products.product userId",
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get orders by status
export const getPending = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ status: "Pending" });
    const count = orders.length;
    res.status(200).json(count);
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get orders by status
export const getAccepted = async (req, res) => {
  try {
    const orders = await Order.find({ status: "Accepted" });
    const count = orders.length;
    res.status(200).json(count);
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get orders by status
export const getDelivered = async (req, res) => {
  try {
    const orders = await Order.find({ status: "Delivered" });
    const count = orders.length;
    res.status(200).json(count);
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get orders by status
export const getCanceled = async (req, res) => {
  try {
    const orders = await Order.find({ status: "Canceled" });
    const count = orders.length;
    res.status(200).json(count);
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
