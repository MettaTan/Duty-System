const ragMember = require("../../../models/ragMember.model");
const ragStatus = require("../../../models/ragStatus.model");
const ragAlloc = require("../../../models/ragAlloc.model");

const moment = require("moment");

const { setAlloc, removeDeleted } = require("./+services");

module.exports = {
  selectDate: async (req, res) => {
    const { date } = req.body;
    return res.redirect(`/ragAlloc/allocRAG/${date}`);
  },
  renderAllocRAG: async (req, res) => {
    const { date } = req.params;

    const ragMembers = await ragMember.find();
    const rag_status = await ragStatus.findOne({ date: date });

    const rag_members = [];
    ragMembers.forEach((rag_member) => {
      if (rag_status.present.includes(rag_member.name)) {
        rag_members.push(rag_member);
      }
    });

    let rag_alloc = await ragAlloc.findOne({ date: date });
    if (!rag_alloc) {
      rag_alloc = new ragAlloc({ date: date });
      await rag_alloc.save();
    }

    let rag_assignment;

    return res.render("ragAlloc/allocRAG/Index", {
      header: `Allocate RAG Personnel For ${moment(date).format("DD/MM/YYYY")}`,
      date,
      rag_members,
      rag_alloc,
      rag_assignment,
    });
  },

  updateAllocRAG: async (req, res) => {
    const { date } = req.params;
    let { present_rags, rag_assignment } = req.body;

    const rag_alloc = await ragAlloc.findOne({ date: date });

    if (typeof present_rags === "string") {
      let rag_array = [];

      rag_array.push(present_rags);

      present_rags = rag_array;
    }

    if (typeof rag_assignment === "string") {
      let assign_array = [];

      assign_array.push(rag_assignment);

      rag_assignment = assign_array;
    }

    const createNewAlloc = async (present_rags, rag_assignment) => {
      let newAlloc = {};

      present_rags.forEach((k, i) => {
        newAlloc[k] = rag_assignment[i];
      });

      return newAlloc;
    };

    const alloc = await createNewAlloc(present_rags, rag_assignment);

    await setAlloc(rag_alloc, alloc);

    await removeDeleted(rag_alloc, alloc);

    return res.redirect(`/ragAlloc/allocRAG/${date}`);
  },
};
