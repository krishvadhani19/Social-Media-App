// importing files
const User = include("models/user");
const catchAsyncError = include("utils/catchAsyncError");
const responseHandler = include("utils/responseHandler");
const AppError = include("utils/appError");

// =================================================================================================

// get all users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  // fetching all data from db
  const allUsers = await User.find();

  responseHandler(res, 200, allUsers);
});

// =================================================================================================

// get a User
exports.getOne = catchAsyncError(async (req, res, next) => {
  // fetching user from db
  const user = await User.findById(req.params.id);

  // if user does not exist return error
  if (!user) {
    return next(new AppError("User not found!", 404));
  }

  // return success response
  responseHandler(res, 200, user);
});

// =================================================================================================

// create one
exports.createNewUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = { ...req.body };

  // checking if user already exists
  if (await User.findOne({ email: email })) {
    return next(new AppError("User already exists!", 409));
  }

  // creating new user
  const newUser = await User.create({
    name: name,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    role: role,
  });

  responseHandler(res, 200, newUser);
});

// =================================================================================================

// Delete a User admin or User
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  // checking if user exists
  if (!user) {
    return next(new AppError("User does not exist", 404));
  }

  responseHandler(res, 204, user);
});

// =================================================================================================

// update User
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // checking is user exists
  if (!user) {
    return next(new AppError("User does not exist", 404));
  }

  responseHandler(res, 201, user);
});
