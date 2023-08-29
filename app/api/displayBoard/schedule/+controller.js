const Voucher = require("../../../models/Voucher.model");
const Issue = require("../../../models/Issue.model");
const Return = require("../../../models/Return.model");

const { updateVoucher, updateIssue, updateReturn } = require("./+services");

const moment = require("moment");

module.exports = {
  selectDate: async (req, res) => {
    const { date } = req.body;
    const { type } = req.params;
    return res.redirect(`/displayBoard/schedule/${type}/${date}`);
  },
  renderIndex: async (req, res) => {
    const { type, date } = req.params;
    let documents = [];

    if (type == "Issue" || type == "issue") {
      documents = await Issue.find({ date, type: { $nin: "mmrc" } })
        .populate({
          path: "voucher_id",
          populate: {
            path: "return_id",
          },
        })
        .sort({ time: 1 });
    }

    if (type == "Return" || type == "return") {
      documents = await Return.find({ date, type: "unit" }).populate({
        path: "voucher_id",
        populate: {
          path: "issue_id",
          sort: { time: 1 },
        },
      });
    }
    return res.render("displayBoard/schedule/Index", {
      header: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } Summary For ${moment(date).format("DD/MM/YYYY")}`,
      date,
      type,
      documents,
    });
  },
  updateVoucher: async (req, res) => {
    const { type, date } = req.params;
    const { v_id, i_id, r_id, voucher_id, issue_id, return_id } = req.body;

    const voucher = await Voucher.findById(v_id);
    await updateVoucher(voucher, voucher_id);

    const issue = await Issue.findById(i_id);
    await updateIssue(issue, issue_id);

    const return1 = await Return.findById(r_id);
    await updateReturn(return1, return_id);

    return res.redirect(`/displayBoard/schedule/${type}/${date}`);
  },
  deleteVoucher: async (req, res) => {
    const { type, date } = req.params;
    const { v_id } = req.body;
    await Voucher.findOneAndDelete({ _id: v_id });

    return res.redirect(`/displayBoard/schedule/${type}/${date}`);
  },
};
