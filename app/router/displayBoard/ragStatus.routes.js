const express = require("express");
const router = express.Router();

// Utils
const catchAsync = require("../../Utils/catchAsync");

// Controllers
const rag = require("../../api/displayBoard/ragStatus/+controller");

router
    .route("/")
    .get(catchAsync(rag.renderIndex))
    .patch(catchAsync(rag.updatePersonnels));

router.route("/returned").post(catchAsync(rag.returnedDrop));
router.route("/drop").post(catchAsync(rag.clearDrop));
router.route("/safekeep").post(catchAsync(rag.clearSafekeep));

module.exports = router;
