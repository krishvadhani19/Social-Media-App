// importing files
const catchAsyncError = include("utils/catchAsyncError");
const Activity = include("models/Activity");
const AppError = include("utils/appError");
const responseHandler = include("utils/responseHandler");

exports.createActivity = catchAsyncError(async (req, res, next) => {
  const user = await Activity.create({
    name: req.body.name,
    email: req.body.email,
    user: req.user.id,
  });

  // sending the response
  responseHandler(res, "success", 200, user);
});

exports.followerList = catchAsyncError(async (req, res, next) => {
  const user = await Activity.find({ user: req.user.id });

  responseHandler(res, "success", 201, user);
});
