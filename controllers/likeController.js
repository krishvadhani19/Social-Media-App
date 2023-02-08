// importing files
const catchAsyncError = include("utils/catchAsyncError");
const Post = include("models/post");
const responseHandler = include("utils/responseHandler");
const AppError = include("utils/appError");

// =================================================================================================

// like a post
exports.likeAPost = catchAsyncError(async (req, res, next) => {
  // fetching post from db
  const post = await Post.findById(req.params.postId);

  // post exits or not
  if (!post) {
    return next(new AppError("Post not found!", 404));
  }

  // already liked
  if (
    post.likedBy.filter((ele) => {
      return ele._id.toString() === req.user.id.toString();
    }).length !== 0
  ) {
    return next(new AppError("Post already liked. Cannot like again", 400));
  }

  // liking a post
  post.likesCount += 1;
  post.likedBy.push(req.user.id);

  //
  await post.save();

  responseHandler(res, "success", 200, post);
});

// =================================================================================================

// unlike post
exports.unlikeAPost = catchAsyncError(async (req, res, next) => {
  // fetching post from db
  const post = await Post.findById(req.params.postId);

  // post exits or not
  if (!post) {
    return next(new AppError("Post not found!", 404));
  }

  // not liked
  if (
    post.likedBy.filter((ele) => {
      return ele._id.toString() === req.user.id.toString();
    }).length === 0
  ) {
    return next(
      new AppError(
        "You cannot unlike the post that you have not like in the first place.",
        400
      )
    );
  }

  // liking a post
  post.likesCount -= 1;
  post.likedBy.remove(req.user.id);

  //
  await post.save();

  responseHandler(res, "success", 200, post);
});
