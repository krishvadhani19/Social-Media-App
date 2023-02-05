// importing modules
const express = require("express");

// importing files
const userRouter = include("routes/userRouter");
const commentRouter = include("routes/commentRouter");
const postRouter = include("routes/postRouter");
const activityRouter = include("routes/activityRouter");
const AppError = include("utils/appError");
// const globalErrorHandler = include("utils/errorHandler");

// creating express app
const app = express();

// 1. middleware between req and res
app.use(express.json());

// ---------------------------------------------------------------------------------

// Routes Middleware
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/activity", activityRouter);

// Neither of the routes match
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

//Global Error Handler
// app.use(globalErrorHandler);

module.exports = app;
