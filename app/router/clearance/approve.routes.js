const express = require("express");
const router = express.Router();

// Utils
const catchAsync = require("../../Utils/catchAsync");

// Controllers
const approve = require("../../api/clearance/approve/+controller");

router.route("/").post(catchAsync(approve.selectDate));

router
    .route("/:date")
    .get(catchAsync(approve.renderIndex))
    .patch(catchAsync(approve.updateIndex));

router
    .route("/:date/issueSummary/:issueDate/:location/:type")
    .get(catchAsync(approve.renderIssueSummary))
    .patch(catchAsync(approve.updateIssueSummary));

router
    .route("/:date/returnSummary")
    .get(catchAsync(approve.renderReturnSummary))
    .patch(catchAsync(approve.updateReturnSummary));

module.exports = router;

