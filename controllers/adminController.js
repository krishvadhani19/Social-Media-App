// importing files
const User = include("models/user");
const catchAsyncError = include("utils/catchAsyncError");
const responseHandler = include("utils/responseHandler");
const AppError = include("utils/appError");

// get all users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  // fetching all data from db
  const allUsers = await User.find();

  responseHandler(res, "success", 200, allUsers);
});

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

  responseHandler(res, "success", 200, newUser);
});
