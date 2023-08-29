const express = require("express");
const router = express.Router();

// Utils
const catchAsync = require("../Utils/catchAsync");

// Controllers
const collection = require("../api/ragAlloc/createRAG/+controller");

const manage = require("../api/ragAlloc/manageRAG/+controller");

const alloc = require("../api/ragAlloc/allocRAG/+controller");

router
  .route("/createRAG")
  .get(catchAsync(collection.renderCreateRAG))
  .post(catchAsync(collection.createRAG));

router.route("/manageRAG").post(catchAsync(manage.selectDate));

router
  .route("/manageRAG/:date")
  .get(catchAsync(manage.renderManageRAG))
  .patch(catchAsync(manage.updateRAG))
  .delete(catchAsync(manage.deleteRAG));

router.route("/allocRAG").post(catchAsync(alloc.selectDate));

router
  .route("/allocRAG/:date")
  .get(catchAsync(alloc.renderAllocRAG))
  .patch(catchAsync(alloc.updateAllocRAG));
module.exports = router;
