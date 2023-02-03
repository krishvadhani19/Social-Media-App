// importing files
const catchAsyncError = include("utils/catchAsyncError");
const Comment = include("models/comment");
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
  responseHandler(res, "success", 200, newComment);
});

// =================================================================================================

// fetch all comments related to a post
exports.getPostComments = catchAsyncError(async (req, res, next) => {
  // fetch all comments
  const comments = await Comment.find({ post: req.params.postId });

  // send response
  responseHandler(res, "success", 200, comments);
});

// =================================================================================================
