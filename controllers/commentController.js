// importing files
const catchAsyncError = include("utils/catchAsyncError");
const Comment = include("models/comment");
const Post = include("models/post");
const responseHandler = include("utils/responseHandler");
const AppError = include("utils/appError");

// =================================================================================================

// creating a comment
exports.createNewComment = catchAsyncError(async (req, res, next) => {
  // empty comment not possible
  if (!req.body.comment) {
    return next(new AppError("Comment cannot be empty", 400));
  }

  // creating new comment
  const newComment = await Comment.create({
    comment: req.body.comment,
    user: req.user.id,
    post: req.params.postId,
  });

  // sending response token
  responseHandler(res, 200, newComment);
});

// =================================================================================================

// fetch all comments related to a post
exports.getPostComments = catchAsyncError(async (req, res, next) => {
  // fetch all comments
  const comments = await Comment.find({ post: req.params.postId });

  // send response
  responseHandler(res, 200, comments);
});

// =================================================================================================
// delete a particular comment related to a post
exports.deletePostComment = catchAsyncError(async (req, res, next) => {
  // find the comment
  const comment = await Comment.findById(req.params.commentId);

  // return error of comment does not exist
  if (!comment) {
    return next(new AppError("Comment does not exist!", 404));
  }

  // fetching the post on which the comment is made
  const post = await Post.findById(req.params.postId);

  // only the owner of the comment || owner of that post can delete the comment
  if (
    comment.user.toString() !== req.user.id.toString() &&
    req.user.id.toString() !== post.user.toString()
  ) {
    return next(
      new AppError("You do not have the permission to delete the comment!", 403)
    );
  }

  // deleting the comment
  await Comment.findByIdAndDelete(req.params.commentId);

  // sending the response
  responseHandler(res, 204, comment);
});

// =================================================================================================
// if post is deleted all comments related to the post must be deleted
exports.deleteAllPostComments = catchAsyncError(async (req, res, next) => {
  // find all comments
  const query = { post: req.params.postId };

  await Comment.deleteMany(query);

  next();
});

// =================================================================================================
// if user is deleted then all comments made by the user should be removed
exports.deleteAllMyComments = catchAsyncError(async (req, res, next) => {
  const query = { user: req.user.id };
  await Comment.deleteMany(query);

  next();
});
