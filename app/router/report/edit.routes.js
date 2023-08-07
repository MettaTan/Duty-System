const express = require("express");
const router = express.Router();

// Utils
const catchAsync = require("../../Utils/catchAsync");

// Controllers
const edit = require("../../api/report/edit/+controller");

router.route("/").post(catchAsync(edit.selectDate));

router
    .route("/:date")
    .get(catchAsync(edit.renderIndex))
    .patch(catchAsync(edit.updatePersonnels));

router
    .route("/:date/issue")
    .get(catchAsync(edit.renderIssue))
    .patch(catchAsync(edit.updateIssue));

router
    .route("/:date/return")
    .get(catchAsync(edit.renderReturn))
    .patch(catchAsync(edit.updateReturns));

router
    .route("/:date/others/1")
    .get(catchAsync(edit.renderOthers1))
    .patch(catchAsync(edit.updateOthers1));

router
    .route("/:date/others/2")
    .get(catchAsync(edit.renderOthers2))
    .patch(catchAsync(edit.updateOthers2));

router
    .route("/:date/final")
    .get(catchAsync(edit.renderFinal))
    .patch(catchAsync(edit.updateOthers2));

module.exports = router;
