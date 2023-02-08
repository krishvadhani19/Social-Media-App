// importing files
const userController = include("controllers/userController");
const authController = include("controllers/authController");
const adminController = include("controllers/adminController");
const postController = include("controllers/postController");
const commentController = include("controllers/commentController");
const passwordController = include("controllers/passwordController");
const followController = include("controllers/followController");
const userAnalysisController = include("controllers/userAnalysisController");

// importing modules
const express = require("express");

// creating the router
const router = express.Router({ mergeParams: true });

// ==============================================================================================

// Authentication
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.protect, authController.logout);

// ==============================================================================================
// Password
router
  .route("/updatePassword")
  .patch(authController.protect, passwordController.updatePassword);

router.route("/forgotPassword").post(passwordController.forgotPassword);
router
  .route("/resetPassword/:resetToken")
  .patch(passwordController.resetPassword);

// ==============================================================================================
// Self Update and Delete
router
  .route("/updateMe")
  .patch(authController.protect, userController.updateMe);
router
  .route("/deleteMe")
  .delete(
    authController.protect,
    userController.deleteMe,
    postController.deleteAllMyPosts,
    commentController.deleteAllMyComments
  );

// ==============================================================================================
// Admin Operations
router
  .route("/getAllUsers")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    adminController.getAllUsers
  );

router
  .route("/getOne/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    adminController.getOne
  );

router
  .route("/createNewUser")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    adminController.createNewUser
  );

router
  .route("/deleteUser/:id")
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    adminController.deleteUser
  );

router
  .route("/updateUser/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    adminController.updateUser
  );

// ==============================================================================================
// follow and unfollow
router
  .route("/followUser/:userId")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    followController.followUser
  );

router
  .route("/unfollowUser/:userId")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    followController.unfollowUser
  );

// ==============================================================================================
// Get Posts
router
  .route("/getLikedPosts")
  .get(authController.protect, userAnalysisController.getLikedPosts);

router
  .route("/getTaggedPosts")
  .get(authController.protect, userAnalysisController.getTaggedPosts);

// ==============================================================================================
//get active time of the user
router
  .route("/getActiveTime")
  .get(authController.protect, userAnalysisController.getActiveTime);

router
  .route("/getTopActiveUsers")
  .get(authController.protect, userAnalysisController.getTopActiveUsers);

module.exports = router;
