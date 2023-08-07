const express = require("express");
const router = express.Router();

// Utils
const catchAsync = require("../../Utils/catchAsync");

// Controllers
const edit = require("../../api/clearance/edit/+controller");

router.route("/").post(catchAsync(edit.selectDate));

router
    .route("/:date")
    .get(catchAsync(edit.renderIndex))
    .patch(catchAsync(edit.updateIndex));

router
    .route("/:date/detailing")
    .get(catchAsync(edit.renderDetailing))
    .patch(catchAsync(edit.updateDetailing));

router
    .route("/:date/issueSummary/:issueDate/:location/:type")
    .get(catchAsync(edit.renderIssueSummary))
    .patch(catchAsync(edit.updateIssueSummary));

router
    .route("/:date/returnSummary")
    .get(catchAsync(edit.renderReturnSummary))
    .patch(catchAsync(edit.updateReturnSummary));

module.exports = router;
