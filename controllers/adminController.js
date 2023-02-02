// importing files
const User = include("models/user");
const catchAsyncError = include("utils/catchAsyncError");
const responseHandler = include("utils/responseHandler");

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  // fetching all data from db
  const allUsers = await User.find();

  responseHandler(res, "success", 200, allUsers);
});
