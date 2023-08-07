const express = require("express");
const router = express.Router();

// Utils
const catchAsync = require("../../Utils/catchAsync");

// Controllers
const displayBoard = require("../../api/displayBoard/schedule/+controller");

router.route("/:type").post(catchAsync(displayBoard.selectDate));

router
    .route("/:type/:date")
    .get(catchAsync(displayBoard.renderIndex))
    .patch(catchAsync(displayBoard.updateVoucher))
    .delete(catchAsync(displayBoard.deleteVoucher));

// router
//     .route("/:date/detailing")
//     .get(catchAsync(displayBoard.renderDetailing))
//     .patch(catchAsync(displayBoard.updateDetailing));

// router
//     .route("/:date/issueSummaryR2")
//     .get(catchAsync(displayBoard.renderIssueSummaryR2))
//     .patch(catchAsync(displayBoard.updateIssueSummaryR2));

// router
//     .route("/:date/issueSummaryR3")
//     .get(catchAsync(displayBoard.renderIssueSummaryR3))
//     .patch(catchAsync(displayBoard.updateIssueSummaryR3));

// router
//     .route("/:date/returnSummary")
//     .get(catchAsync(displayBoard.renderReturnSummary));

module.exports = router;
