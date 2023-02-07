// importing files
const authController = include("controllers/authController");
const postController = include("controllers/postController");
const commentController = include("controllers/commentController");

// importing modules
const express = require("express");

// creating the router
const router = express.Router({ mergeParams: true });

// =================================================================================================

// create new post
router
  .route("/createNewPost")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    postController.createNewPost
  );

// =================================================================================================

// get all posts
router
  .route("/getAllMyPosts")
  .get(authController.protect, postController.getAllMyPosts);

// =================================================================================================

// delete My post
router
  .route("/deleteMyPost/:postId")
  .delete(
    authController.protect,
    postController.deleteMyPost,
    commentController.deleteAllPostComments
  );

// =================================================================================================

// Get a post
router
  .route("/getAPost/:postId")
  .get(authController.protect, postController.getAPost);

// =================================================================================================

// Like a post
router
  .route("/likeAPost/:postId")
  .patch(authController.protect, postController.likeAPost);

// =================================================================================================

// unLike a post
router
  .route("/unlikeAPost/:postId")
  .patch(authController.protect, postController.unlikeAPost);

module.exports = router;
