// importing files
const catchAsyncError = include("utils/catchAsyncError");
const User = include("models/user");

// importing modules
const jwt = require("jsonwebtoken");

// Function for signing token
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// function for creating the cookie
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // setting up the cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    // cannot be accessed or modified in any way by the browser
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  // avoid password to be shown on the response page
  // after the user is created we are making it undefined wont affect the data
  user.password = undefined;

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token: token,
    data: user,
  });
};

exports.signup = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  createSendToken(newUser, 201, res);
});
