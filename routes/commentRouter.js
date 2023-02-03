// importing files
const authController = include("controllers/authController");
const commentController = include("controllers/commentController");

// importing modules
const express = require("express");

// creating the router
const router = express.Router();

router
  .route("/createNewComment")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    commentController.createNewComment
  );

module.exports = router;
