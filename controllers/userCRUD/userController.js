const { update } = require("../../models/user");

// importing files
const User = include("models/user");
const catchAsyncError = include("utils/catchAsyncError");
const responseHandler = include("utils/responseHandler");
const AppError = include("utils/AppError");

// user updating credentials
exports.updateMe = catchAsyncError(async (req, res, next) => {
  // return error if user tries to update password using this route
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for updating password. Use route '/updatePassword' route"
      )
    );
  }

  //
  const { name, email } = { ...req.body };
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name,
      email: email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // send response
  responseHandler(res, "success", 200, updatedUser);
});

// user deleting its own profile
exports.deleteMe = catchAsyncError(async (req, res, next) => {
  // fetch user from db
  const user = await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });

  // sending response after deleting
  responseHandler(res, "success", 204, user);
});

exports.followUser = catchAsyncError(async (req, res, next) => {
  // fetch the user
  const user = await User.findById(req.params.userId);

  // if already a follower then return error
  if (user.followers.includes(req.user.id)) {
    return next(new AppError("Already a follower!", 400));
  }

  // appending the user to
  user.followers.push(req.user.id);

  // saving the updated user
  await user.save();

  // sending response
  responseHandler(res, "success", 200, user);
});
