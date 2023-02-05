// importing files
const activityController = include("controllers/activityController");
const authController = include("controllers/authController");

// importing modules
const express = require("express");

// creating the router
const router = express.Router({ mergeParams: true });

// =================================================================================================

router
  .route("/followerList")
  .get(authController.protect, activityController.followerList);

// =================================================================================================

router
  .route("/createActivity")
  .post(authController.protect, activityController.createActivity);
module.exports = router;
