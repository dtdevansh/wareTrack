require("dotenv").config();
const express = require("express");

//local imports
const connectionDB = require("./config/database");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { productRouter } = require("./routes/products");

const port = process.env.PORT || 1111;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", productRouter);

connectionDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log("Server started on port : " + port);
    });
  })
  .catch((err) => {
    console.log("Database connection failer. ERROR: " + err);
  });
