// importing modules
const express = require("express");

// importing files
const userRouter = include("routes/userRouter");
// const commentRouter = include("routes/commentRouter");
// const tagRouter = include("routes/tagRouter");

// importing files
const AppError = include("utils/appError");
// const globalErrorHandler = include("utils/errorHandler");

// creating express app
const app = express();

// ---------------------------------------------------------------------------------
// middlewares
if(process.env.NODE_ENV === 'development'){}

// Routes Middleware
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/posts", postRouter);
// app.use("/api/v1/comments", commentRouter);
// app.use("/api/v1/tags", tagRouter);

// Neither of the routes match
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

//Global Error Handler
// app.use(globalErrorHandler);

module.exports = app;
