module.exports = {
  setAlloc: async (rag_alloc, alloc) => {
    Object.keys(alloc).forEach((key) => {
      rag_alloc.MMRC = rag_alloc.MMRC.filter((item) => item !== key);
      rag_alloc.DG = rag_alloc.DG.filter((item) => item !== key);
      rag_alloc.CollectReturn = rag_alloc.CollectReturn.filter(
        (item) => item !== key
      );
      rag_alloc.R2 = rag_alloc.R2.filter((item) => item !== key);
      rag_alloc.R3 = rag_alloc.R3.filter((item) => item !== key);
      rag_alloc.DIST = rag_alloc.DIST.filter((item) => item !== key);
      rag_alloc.Salvage = rag_alloc.Salvage.filter((item) => item !== key);
      rag_alloc.Others = rag_alloc.Others.filter((item) => item !== key);

      if (alloc[key] == "MMRC") {
        rag_alloc.MMRC.push(key);
      } else if (alloc[key] == "DG") {
        rag_alloc.DG.push(key);
      } else if (alloc[key] == "CollectReturn") {
        rag_alloc.CollectReturn.push(key);
      } else if (alloc[key] == "R2") {
        rag_alloc.R2.push(key);
      } else if (alloc[key] == "R3") {
        rag_alloc.R3.push(key);
      } else if (alloc[key] == "DIST") {
        rag_alloc.DIST.push(key);
      } else if (alloc[key] == "Salvage") {
        rag_alloc.Salvage.push(key);
      } else if (alloc[key] == "Others") {
        rag_alloc.Others.push(key);
      }
    });

    await rag_alloc.save();
    return;
  },

  removeDeleted: async (rag_alloc, alloc) => {
    Object.values(rag_alloc.MMRC).forEach((member) => {
      if (!Object.keys(alloc).includes(member)) {
        rag_alloc.MMRC = rag_alloc.MMRC.filter((item) => item !== member);
      }
    });

    Object.values(rag_alloc.DG).forEach((member) => {
      if (!Object.keys(alloc).includes(member)) {
        rag_alloc.DG = rag_alloc.DG.filter((item) => item !== member);
      }
    });

    Object.values(rag_alloc.CollectReturn).forEach((member) => {
      if (!Object.keys(alloc).includes(member)) {
        rag_alloc.CollectReturn = rag_alloc.CollectReturn.filter(
          (item) => item !== member
        );
      }
    });

    Object.values(rag_alloc.R2).forEach((member) => {
      if (!Object.keys(alloc).includes(member)) {
        rag_alloc.R2 = rag_alloc.R2.filter((item) => item !== member);
      }
    });

    Object.values(rag_alloc.R3).forEach((member) => {
      if (!Object.keys(alloc).includes(member)) {
        rag_alloc.R3 = rag_alloc.R3.filter((item) => item !== member);
      }
    });

    Object.values(rag_alloc.DIST).forEach((member) => {
      if (!Object.keys(alloc).includes(member)) {
        rag_alloc.DIST = rag_alloc.DIST.filter((item) => item !== member);
      }
    });

    Object.values(rag_alloc.Salvage).forEach((member) => {
      if (!Object.keys(alloc).includes(member)) {
        rag_alloc.Salvage = rag_alloc.Salvage.filter((item) => item !== member);
      }
    });

    Object.values(rag_alloc.Others).forEach((member) => {
      if (!Object.keys(alloc).includes(member)) {
        rag_alloc.Others = rag_alloc.Others.filter((item) => item !== member);
      }
    });

    await rag_alloc.save();
    return;
  },
};
