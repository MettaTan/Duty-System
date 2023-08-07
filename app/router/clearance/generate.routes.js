const express = require("express");
const router = express.Router();

// Utils
const catchAsync = require("../../Utils/catchAsync");

// Controllers
const generate = require("../../api/clearance/generate/+controller");

router.route("/").post(catchAsync(generate.selectDate));

router
    .route("/:date")
    .get(catchAsync(generate.renderIndex))
    .patch(catchAsync(generate.updateIndex));

router
    .route("/:date/issueSummary/:issueDate/:location/:type")
    .get(catchAsync(generate.renderIssueSummary))
    .patch(catchAsync(generate.updateIssueSummary));

router
    .route("/:date/returnSummary")
    .get(catchAsync(generate.renderReturnSummary))
    .patch(catchAsync(generate.updateReturnSummary));

module.exports = router;
