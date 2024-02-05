import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();
import adminRoute from "./routes/adminRoute.js";
import orderRoute from "./routes/orderRoute.js";
import session from "express-session";
import productRoute from "./routes/productRoute.js"
import userRoute from "./routes/userRoute.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/admin", adminRoute);
app.use("/api/orders", orderRoute);
app.use("/api/products", productRoute);
app.use("/api/user", userRoute);

//connecting to mongo db//
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("connected to db & running on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.error(error);
  });
