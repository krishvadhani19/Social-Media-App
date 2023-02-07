// importing files
const User = include("models/user");
const catchAsyncError = include("utils/catchAsyncError");
const responseHandler = include("utils/responseHandler");
const AppError = include("utils/AppError");

// =================================================================================================

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

// =================================================================================================

// user deleting its own profile
exports.deleteMe = catchAsyncError(async (req, res, next) => {
  // fetch user from db
  const user = await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });

  // sending response after deleting
  responseHandler(res, "success", 204, user);
});

// =================================================================================================

// follow user
exports.followUser = catchAsyncError(async (req, res, next) => {
  // fetch the user
  const user = await User.findById(req.params.userId);

  // if user does not exist
  if (!user) {
    return next(new AppError("User does not exist!", 404));
  }

  // if already a follower then return error
  if (
    user.followers.filter((ele) => {
      return ele._id.toString() === req.user.id.toString();
    }).length !== 0
  ) {
    return next(new AppError("You are following the person already!", 400));
  }

  // update the 'followers' of the user
  user.followers.push(req.user.id);

  // update the 'following' of the req.user
  req.user.following.push(req.params.userId);

  // saving the req.user
  await req.user.save();

  // saving the user
  await user.save();

  // sending response
  responseHandler(res, "success", 200, req.user);
});

// =================================================================================================

// unfollow the person
exports.unfollowUser = catchAsyncError(async (req, res, next) => {
  // fetch the user
  const user = await User.findById(req.params.userId);

  // if user does not exist
  if (!user) {
    return next(new AppError("User does not exist!", 404));
  }

  // if already a follower then return error
  if (
    !user.followers.filter((ele) => {
      return ele._id.toString() === req.user.id.toString();
    }).length === 0
  ) {
    return next(
      new AppError(
        "You are not following the person. You cannot unfollow it.!",
        400
      )
    );
  }

  // update the 'followers' of the user
  user.followers.remove(req.user.id);

  // update the 'following' of the req.user
  req.user.following.remove(req.params.userId);

  // saving the req.user
  await req.user.save();

  // saving the user
  await user.save();

  // sending response
  responseHandler(res, "success", 204, req.user);
});

// =================================================================================================

exports.getLikedPosts = catchAsyncError(async (req, res, next) => {
  // make sure this request is made by the user himself
  const user = await User.findById(req.user.id);

  responseHandler(res, "success", 200, user.getLikedPosts);
});

// =================================================================================================
exports.getTaggedPosts = catchAsyncError(async (req, res, next) => {
  // make sure this request is made by the user himself
  const user = await User.findById(req.user.id);

  responseHandler(res, "success", 200, user.getTaggedPosts);
});
