const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const usersRoutes = require("./routes/users-routes");
const categoryRoutes = require("./routes/category-routes");
const productRoutes = require("./routes/product-routes");
const braintreeRoutes = require("./routes/braintree-routes");
const OrderRoutes = require("./routes/order-routes");
require('dotenv').config();


var cors = require("cors");

const HttpError = require("./models/http-error");

//middleware
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", cors(), usersRoutes);
app.use("/api", cors(), categoryRoutes);
app.use("/api", cors(), productRoutes);
app.use("/api", cors(), braintreeRoutes);
app.use("/api", cors(), OrderRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

mongoose
  .connect(
    process.env.DATABASE,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
