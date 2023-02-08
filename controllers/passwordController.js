// importing files
const catchAsyncError = include("utils/catchAsyncError");
const sendEmail = include("utils/email");
const User = include("models/user");
const AppError = include("utils/appError");
const crypto = require("crypto");

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

  const message = `Forgot your password?\nSubmit a patch request with new Password and confirmPassword to:\n${resetURL}\nIf you didn't forget your password, please ignore.`;

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
