module.exports = {
  setStatus: async (rag_status, rag_member) => {
    if (rag_member.status == "PRESENT") {
      rag_status.present.push(rag_member.name);
      rag_status.leave = rag_status.leave.filter(
        (item) => item !== rag_member.name
      );
      rag_status.MC = rag_status.MC.filter((item) => item !== rag_member.name);
      rag_status.AO = rag_status.AO.filter((item) => item !== rag_member.name);
    } else if (rag_member.status == "LEAVE") {
      rag_status.leave.push(rag_member.name);
      rag_status.present = rag_status.present.filter(
        (item) => item !== rag_member.name
      );
      rag_status.MC = rag_status.MC.filter((item) => item !== rag_member.name);
      rag_status.AO = rag_status.AO.filter((item) => item !== rag_member.name);
    } else if (rag_member.status == "MC") {
      rag_status.MC.push(rag_member.name);
      rag_status.present = rag_status.present.filter(
        (item) => item !== rag_member.name
      );
      rag_status.leave = rag_status.leave.filter(
        (item) => item !== rag_member.name
      );
      rag_status.AO = rag_status.AO.filter((item) => item !== rag_member.name);
    } else if (rag_member.status == "AO") {
      rag_status.AO.push(rag_member.name);
      rag_status.present = rag_status.present.filter(
        (item) => item !== rag_member.name
      );
      rag_status.leave = rag_status.leave.filter(
        (item) => item !== rag_member.name
      );
      rag_status.MC = rag_status.MC.filter((item) => item !== rag_member.name);
    }
    await rag_status.save();
    return;
  },
};
