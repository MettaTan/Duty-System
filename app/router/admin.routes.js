const express = require("express");
const router = express.Router();

// Utils
const catchAsync = require("../Utils/catchAsync");

// Controllers
const collection = require("../api/admin/+controller");

router
    .route("/login")
    .get(catchAsync(collection.renderLogin))
    .post(catchAsync(collection.loginAccount));

router
    .route("/signup")
    .get(catchAsync(collection.renderSignup))
    .post(catchAsync(collection.createAccount));

router.route("/logout").post(catchAsync(collection.logout));

module.exports = router;
