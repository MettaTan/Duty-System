const ragMember = require("../../../models/ragMember.model");
const ragStatus = require("../../../models/ragStatus.model");

const moment = require("moment");

const { setStatus } = require("./+services");

module.exports = {
  selectDate: async (req, res) => {
    const { date } = req.body;
    return res.redirect(`/ragAlloc/manageRAG/${date}`);
  },
  renderManageRAG: async (req, res) => {
    const { date } = req.params;

    const ragMembers = await ragMember.find();
    let rag_status = await ragStatus.findOne({ date: date });
    if (!rag_status) {
      rag_status = new ragStatus({ date: date });
      await rag_status.save();
    }

    let status = "PRESENT";

    if (
      rag_status.present.length == 0 &&
      rag_status.leave.length == 0 &&
      rag_status.MC.length == 0 &&
      rag_status.AO.length == 0
    ) {
      ragMembers.forEach((rag_member) => {
        rag_status.present.push(rag_member.name);
      });
      await rag_status.save();
    }

    /*
    ragMembers.forEach((rag_member, rStatus) => {
      for (i = 0; i < 5; i++) {
        rStatus = statuses[1];
        console.log(rag_status.rStatus);
        if (!rag_status.statuses[i].includes(rag_member.name)) {
          rag_status.present.push(rag_member.name);
        }
      }
    });
    await rag_status.save();
    */
    return res.render("ragAlloc/manageRAG/Index", {
      header: `Set RAG Personnel Status For ${moment(date).format(
        "DD/MM/YYYY"
      )}`,
      ragMembers,
      rag_status,
      status,
      date,
    });
  },

  updateRAG: async (req, res) => {
    const { date } = req.params;
    const { rag_member } = req.body;
    const rag_status = await ragStatus.findOne({ date: date });

    setStatus(rag_status, rag_member);

    return res.redirect(`/ragAlloc/manageRAG/${date}`);
  },

  deleteRAG: async (req, res) => {
    const { rag_id } = req.body;

    await ragMember.findOneAndDelete({ _id: rag_id });

    return res.redirect(`/ragAlloc/manageRAG/${date}`);
  },
};
