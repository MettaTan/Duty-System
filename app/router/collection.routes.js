const express = require("express");
const router = express.Router();

// Utils
const catchAsync = require("../Utils/catchAsync");

// Controllers
const collection = require("../api/collection/+controller");

router.route("/").post(catchAsync(collection.createCollection));

module.exports = router;
