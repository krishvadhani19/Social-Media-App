// importing files
const catchAsyncError = include("utils/catchAsyncError");
const User = include("models/user");
const AppError = include("utils/appError");

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

// SIGNUP
exports.signup = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  // response cookie and token
  createSendToken(newUser, 201, res);
});

// LOGIN
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = { ...req.body };

  // 1. checking if email or password is empty
  if (!email || !password) {
    return next(new AppError("Email or Password undefined!", 400));
  }

  // 2. checking if email exits and checking password
  const currentUser = await User.findOne({ email: email }).select("+password");
  if (
    !currentUser ||
    !(await currentUser.checkPassword(password, currentUser.password))
  ) {
    return next(new AppError("Email or Password incorrect!", 404));
  }

  // 3. if everything is find send response token
  createSendToken(currentUser, 201, res);
});
