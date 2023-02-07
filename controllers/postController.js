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
    tags: req.body.tags,
  });

  // sending the response
  responseHandler(res, "success", 200, newPost);
});

// =================================================================================================

// delete post
exports.deleteMyPost = catchAsyncError(async (req, res, next) => {
  // check if post exists or not
  const post = await Post.findById(req.params.postId);

  // retur error if post does not exist
  if (!post) {
    return next(new AppError("Post does not exist", 404));
  }

  // check if the post belongs to the user himself
  if (req.user.id.toString() !== post.user.toString()) {
    return next(
      new AppError("You do not have the permission to delete the post!", 400)
    );
  }

  // delete the post
  await Post.findByIdAndDelete(req.params.postId);

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

// get a post
exports.getAPost = catchAsyncError(async (req, res, next) => {
  // fetching post from db
  const post = await Post.findById(req.params.postId);

  // post exits or not
  if (!post) {
    return next(new AppError("Post not found!", 404));
  }

  responseHandler(res, "success", 200, post);
});

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
