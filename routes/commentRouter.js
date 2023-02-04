// importing files
const authController = include("controllers/authController");
const commentController = include("controllers/commentController");

// importing modules
const express = require("express");

// creating the router
const router = express.Router();

// =================================================================================================

// Create New Comment
// Any logged in user can comment
router
  .route("/createNewComment/:postId")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    commentController.createNewComment
  );

// =================================================================================================

// anybody can get all comments
router
  .route("/getPostComments/:postId")
  .get(authController.protect, commentController.getPostComments);

// =================================================================================================

// the owner of the post or the individual who owns the comment can delete it
router
  .route("/deletePostComment/:postId/:commentId")
  .delete(authController.protect, commentController.deletePostComment);

// delete a particlular comment

module.exports = router;
