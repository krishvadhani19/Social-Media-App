// importing modules
const express = require("express");

// importing files
const AppError = include("utils/appError");
// const globalErrorHandler = include("utils/errorHandler");

const app = express();

// Routes Middleware

// Neither of the routes match
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

//Global Error Handler
// app.use(globalErrorHandler);

module.exports = app;
