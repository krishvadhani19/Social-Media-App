// importing files
const catchAsyncError = include("utils/catchAsyncError");
const Post = include("models/post");
const responseHandler = include("utils/responseHandler");
const AppError = include("utils/appError");

//
exports.createNewPost = catchAsyncError(async (req, res, next) => {
  const { img, caption } = { ...req.body };

  // bad request if either is absent
  if (!img || !caption) {
    return next(new AppError("Image or Caption missing!", 400));
  }

  // Creating new post
  const newPost = await Post.create({
    img: req.body.img,
    caption: req.body.caption,
    user: req.user.id,
  });

  // sending the response
  responseHandler(res, "success", 200, newPost);
});
