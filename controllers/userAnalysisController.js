// importing files
const User = include("models/user");
const catchAsyncError = include("utils/catchAsyncError");
const responseHandler = include("utils/responseHandler");

// =================================================================================================
exports.getLikedPosts = catchAsyncError(async (req, res, next) => {
  // make sure this request is made by the user himself
  const user = await User.findById(req.user.id);

  responseHandler(res, 200, user.getLikedPosts);
});

// =================================================================================================
exports.getTaggedPosts = catchAsyncError(async (req, res, next) => {
  // make sure this request is made by the user himself
  const user = await User.findById(req.user.id);

  responseHandler(res, 200, user.getTaggedPosts);
});

// =================================================================================================
exports.getActiveTime = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const data = {
    days: Number.parseInt(user.activeTime / (1000 * 24 * 60 * 60)),
    hours: Number.parseInt((user.activeTime / (1000 * 60 * 60)) % 24),
    mins: Number.parseInt((user.activeTime / (1000 * 60)) % 60),
    seconds: Number.parseInt((user.activeTime / 1000) % 60),
  };

  responseHandler(res, 200, data);
});

// =================================================================================================
exports.getTopActiveUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({ $sort: { activeTime: -1 } }).select(
    "name email activeTime"
  );

  responseHandler(res, 200, users);
});

// =================================================================================================
