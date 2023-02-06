// importing files
const catchAsyncError = include("utils/catchAsyncError");
const Activity = include("models/Activity");
const AppError = include("utils/appError");
const responseHandler = include("utils/responseHandler");

// ===============================================================================================

exports.createActivity = catchAsyncError(async (req, res, next) => {
  const user = await Activity.create({
    name: req.body.name,
    email: req.body.email,
    user: req.user.id,
  });

  // sending the response
  responseHandler(res, "success", 200, user);
});

// ===============================================================================================

exports.followerList = catchAsyncError(async (req, res, next) => {
  const user = await Activity.findOne({ user: req.user.id });

  responseHandler(res, "success", 201, user);
});

// ===============================================================================================

exports.getLikedPosts = catchAsyncError(async (req, res, next) => {
  // make sure this request is made by the user himself
  const userActivity = await Activity.findOne({ user: req.user.id });

  responseHandler(res, "success", 200, userActivity.getLikedPosts);
});
