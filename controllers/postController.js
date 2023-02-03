// importing files
const catchAsyncError = include("utils/catchAsyncError");
const Post = include("models/post");
const responseHandler = include("utils/responseHandler");
const AppError = include("utils/appError");

// =================================================================================================

// create new post
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

// =================================================================================================

// delete post
exports.deletePost = catchAsyncError(async (req, res, next) => {
  // check if post exists or not
  const post = await Post.findById(req.params.id);

  // retur error if post does not exist
  if (!post) {
    return next(new AppError("Post does not exist", 404));
  }

  // check if the post belongs to the user himself
  if (req.user.id !== post.user) {
    return next(
      new AppError("You do not have the permission to delete the post!", 400)
    );
  }

  // delete the post
  await Post.findByIdAndDelete(req.params.id);

  // send response
  responseHandler(res, "success", 204, post);
});

// =================================================================================================

// Get all posts of the user
exports.getAllMyPosts = catchAsyncError(async (req, res, next) => {
  // fetching posts from db
  const allPosts = await Post.find({ user: req.user.id });

  // sending response
  responseHandler(res, "success", 200, allPosts);
});

// =================================================================================================

