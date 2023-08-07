const express = require("express");
const router = express.Router();

// Utils
const catchAsync = require("../../Utils/catchAsync");

// Controllers
const edit = require("../../api/report/generate/+controller");

router.route("/").post(catchAsync(edit.selectDate));

router.route("/:date").get(catchAsync(edit.renderFinal));

module.exports = router;
