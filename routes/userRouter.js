// importing files
const userController = include("controllers/userCRUD/userController");
const authController = include("controllers/authController");
const adminController = include("controllers/userCRUD/adminController");

// importing modules
const express = require("express");

// creating the router
const router = express.Router({ mergeParams: true });

// ==============================================================================================

// Authentication
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

// ==============================================================================================

// Self Update and Delete
router
  .route("/updateMe")
  .patch(authController.protect, userController.updateMe);
router
  .route("/deleteMe")
  .delete(authController.protect, userController.deleteMe);

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
    userController.followUser
  );

router
  .route("/unfollowUser/:userId")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    userController.unfollowUser
  );

// ==============================================================================================

router
  .route("/getLikedPosts")
  .get(authController.protect, userController.getLikedPosts);

router
  .route("/getTaggedPosts")
  .get(authController.protect, userController.getTaggedPosts);

module.exports = router;
