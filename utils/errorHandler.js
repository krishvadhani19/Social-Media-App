// importing files
const AppError = include("utils/appError");

// cast error
const handleCastError = (error) => {
  // console.log(error);
  const message = `Invalid ${error.path}:${error.value}`;
  return new AppError(message, 400);
};

// duplicate error
const handleDuplicateError = (error) => {
  const value = error.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 401);
};

// validation Error
const handleValidationError = (error) => {
  const err = Object.values(error.errors).map((ele) => ele.message);
  const message = `Invalid input data. ${err.join(". ")}`;
  return new AppError(message, 401);
};

// JWT Error
const handleJWTError = () => {
  return new AppError("Invalid Token. Please try again later.", 400);
};

// Token Expired Error
const handleTokenExpiredError = () => {
  return new AppError(
    "Token has Expired. Please try again with a valid token",
    400
  );
};

// development error
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

// Production Error
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // dont leak error details
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  //
  console.log("Error Controller chalu hai");

  // check production or development process
  if (process.env.NODE_ENV === "development") {
    // Development Error
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    //
    let error = { ...err };
    console.log("Production chalu hai");

    // Error Types

    // Cast Error
    if (error.name === "CastError") {
      error = handleCastError(error);
    }

    // Duplicate Error
    else if (error.code === 11000) {
      error = handleDuplicateError(error);
    }

    // Validation Error
    else if (error.name === "ValidationError") {
      console.log("Validor chalu hai");
      error = handleValidationError(error);
    }

    // JWT Incorrect Token Error
    else if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    }

    // Expired Token Error
    else if (error.name === "TokenExpiredError") {
      error = handleTokenExpiredError();
    }

    //

    // Production Error
    sendErrorProd(error, res);
  }
  next();
};
