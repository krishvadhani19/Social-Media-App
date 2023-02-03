// importing files
const authController = include("controllers/authController");
const postController = include("controllers/postController");

// importing modules
const express = require("express");

// creating the router
const router = express.Router({ mergeParams: true });

// create new post
router
  .route("/createNewPost")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    postController.createNewPost
  );

module.exports = router;
