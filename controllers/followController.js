// importing files
const User = include("models/user");
const catchAsyncError = include("utils/catchAsyncError");
const responseHandler = include("utils/responseHandler");
const AppError = include("utils/AppError");

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
