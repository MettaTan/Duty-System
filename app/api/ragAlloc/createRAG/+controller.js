const ragMember = require("../../../models/ragMember.model");

async function renderCreateRAG(req, res) {
  return res.render("ragAlloc/createRAG", {
    header: "Register New RAG Personnel",
  });
}

async function createRAG(req, res) {
  const newRAG = new ragMember(req.body);
  await newRAG.save();
  req.flash("success", "RAG Personnel added successfully!");
  return res.redirect("/ragAlloc");
}

module.exports = {
  renderCreateRAG,
  createRAG,
};
