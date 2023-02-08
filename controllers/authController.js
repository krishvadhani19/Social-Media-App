// importing files
const catchAsyncError = include("utils/catchAsyncError");
const sendEmail = include("utils/email");
const User = include("models/user");
const AppError = include("utils/appError");

// importing modules
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

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

// =================================================================================================

// SIGNUP
exports.signup = catchAsyncError(async (req, res, next) => {
  // check if the user already exists or not
  if (await User.findOne({ email: req.body.email })) {
    return next(new AppError("User alredy exists", 409));
  }

  // creating new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  // response cookie and token
  createSendToken(newUser, 201, res);
});

// =================================================================================================

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

// =================================================================================================

exports.logout = catchAsyncError((req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 1),

    // cannot be accessed or modified in any way by the browser
    httpOnly: true,
  };

  res.cookie("jwt", "loggedOut", cookieOptions);
  res.status(200).json({
    status: "success",
    token: "loggedOut",
  });
});

// =================================================================================================

// PROTECT
// to verify user before performing any operation
exports.protect = catchAsyncError(async (req, res, next) => {
  let inputToken;

  // checking the authtoken before performing any action
  if (req.headers.authtoken && req.headers.authtoken.startsWith("Bearer")) {
    inputToken = req.headers.authtoken.split(" ")[1];
  } else {
    return next(
      new AppError("You are not logged in! Please try again later.", 401)
    );
  }

  // verify the token using promisify
  const decoded = await promisify(jwt.verify)(
    inputToken,
    process.env.JWT_SECRET
  );

  // decoded has 'id' and 'inter arrival time'
  // find user if it exists or not
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User does not exist!", 404));
  }

  // grant access
  req.user = currentUser;
  next();
});

// =================================================================================================

// Retrict the operations restricted to admin
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have the permission to perform this action",
          403
        )
      );
    }
    console.log("Admin hai bc");
    next();
  };
};

// =================================================================================================

// after login only you can update password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  // find user from database with password
  const user = await User.findById(req.user.id).select("+password");

  // compare entered password and the db password
  if (!(await user.checkPassword(req.body.currentPassword, user.password))) {
    return next(
      new AppError(
        "Your current password did not match. Please try again with correct password inorder to update your password.",
        403
      )
    );
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;

  // updating the user with new password
  await user.save();

  //
  createSendToken(user, 200, res);

  next();
});

// =================================================================================================

// FORGOT PASSWORD
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  // 1. find the user with email
  const user = await User.findOne({ email: req.body.email });

  // 2. does user exists or not
  if (!user) {
    return next(new AppError("User does not exist!", 404));
  }

  // 3. creating resetToken and storing the hashed in the database
  // the resetToken will be sent to User via email
  const resetToken = await user.createPasswordResetToken();

  // 4. since rn its not having confirmPassword
  await user.save({ validateBeforeSave: false });

  // 5. send it user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with new Password and confirmPassword to: ${resetURL}. If you didn't forget your password, please ignore.`;

  // 6.
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10mins)",
      message: message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email try agian later", 500)
    );
  }
});

// =================================================================================================

// RESET PASSWORD
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // 1) get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  // 2) if the token has not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    // passwordResetExpires has to be greater than passwordResetToken
    // passwordResetExpires: { $gt: Date.now() },
  });

  // if no user found return error
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 404));
  }

  // 3) update the chnagePasswordAt property
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // here, we can validate since we have 'confirmPassword'
  await user.save();

  // 4) Log the user in, send JWT
  // update the password
  // 3. if everything is ok. send token to client
  createSendToken(user, 201, res);
  next();
});
