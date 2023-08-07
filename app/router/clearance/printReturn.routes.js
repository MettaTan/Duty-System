const express = require("express");
const router = express.Router();

// Utils
const catchAsync = require("../../Utils/catchAsync");

// Controllers
const print = require("../../api/clearance/printNYRbyReturn/+controller");

router.route("/").post(catchAsync(print.selectDate))

router
    .route("/:date/:endDate")
    .get(catchAsync(print.renderReturnSummary));




module.exports = router;

