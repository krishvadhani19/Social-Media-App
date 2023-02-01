// importing files
// const authController = include("controllers/userController");
// const userController = include("controllers/authController");

// importing modules
const express = require("express");

// creating the router
const router = express.Router({ mergeParams: true });

// Authentication
// router.route("/signup").post(authController.signup);
// router.route("/login").post(authController.login);

module.exports = router;
