// importing files
const userController = include("controllers/userController");
const authController = include("controllers/authController");
const adminController = include("controllers/adminController");

// importing modules
const express = require("express");

// creating the router
const router = express.Router({ mergeParams: true });

// Authentication
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

// Self Update and Delete
router
  .route("/updateMe")
  .patch(authController.protect, userController.updateMe);
router
  .route("/deleteMe")
  .delete(authController.protect, userController.deleteMe);

// Admin Operations
router
  .route("/getAllUsers")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    adminController.getAllUsers
  );

router
  .route("/createNewUser")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    adminController.createNewUser
  );

module.exports = router;
