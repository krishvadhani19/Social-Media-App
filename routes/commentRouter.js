// importing files
const authController = include("controllers/authController");
const commentController = include("controllers/commentController");

// importing modules
const express = require("express");

// creating the router
const router = express.Router();

// =================================================================================================

// Create New Comment
router
  .route("/createNewComment/:postId")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    commentController.createNewComment
  );

// =================================================================================================

router
  .route("/getPostComments/:postId")
  .get(authController.protect, commentController.getPostComments);

// =================================================================================================

module.exports = router;
