const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Fix: Invoke cookieParser as a function

// Route Imports
const product = require("../Backend/routes/productRoutes");
const user = require("./routes/userRoutes");
const course=require("./routes/courseRoutes");
const order=require("./routes/orderRoutes");
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1",course);
app.use("/api/v1",order);

module.exports = app;

// Middleware for error
app.use(errorMiddleware);
