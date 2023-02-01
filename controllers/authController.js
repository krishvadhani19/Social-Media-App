// importing files
const catchAsyncError = include("utils/catchAsyncError");
const User = include("models/user");

// importing modules
const jwt = require("jsonwebtoken");

// Function for creating token
const signToken = (userId) => {
  return jwt.sign({ is: userId });
};

exports.signup = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
  });
});
