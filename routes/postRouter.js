// importing files
const authController = include("controllers/authController");
const postController = include("controllers/postController");

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
  .delete(authController.protect, postController.deleteMyPost);

// =================================================================================================

// Get a post
router
  .route("/getAPost/:postId")
  .get(authController.protect, postController.getAPost);

module.exports = router;
