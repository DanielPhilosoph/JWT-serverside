/* write your server code here */
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const errorHandler = require("./handlers/errorHandler");
const authRouter = require("./routers/auth");
const v1Router = require("./routers/v1");
const endpointsRouter = require("./routers/endpoints");

//Express setup
const app = express();

//Middleware
//app.use(cors());
app.use(express.json());

// Routers
app.use("/users", authRouter);
app.use("/api/v1/", v1Router);

app.use("/", endpointsRouter);

app.use("*", (req, res) => {
  throw { code: 404, message: "unknown endpoint" };
});
app.use(errorHandler);

module.exports = app;
