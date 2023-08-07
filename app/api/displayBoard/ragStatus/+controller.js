const Return = require("../../../models/Return.model");

const home = "clearance/edit";
const moment = require("moment");

const allAmmoItems = require("../../../public/items");

module.exports = {
    renderIndex: async (req, res) => {
        const { date } = req.params;
        const drops = await Return.find({
            "status.ragStatus.status": "DROP & GO",
        }).populate("voucher_id");

        const safekeeps = await Return.find({
            "status.safekeepStatus.sk": true,
        }).populate("voucher_id");

        return res.render("displayBoard/RagStatus", {
            header: `RAG Status`,
            date,
            drops,
            safekeeps,
        });
    },
    returnedDrop: async (req, res) => {
        const { date } = req.params;
        const { id } = req.body;
        const return_ = await Return.findById(id);
        return_.status.ragStatus.status = "RETURNS";
        await return_.save();

        return res.redirect(`/displayBoard/ragStatus`);
    },
    clearDrop: async (req, res) => {
        const { date } = req.params;
        const { id } = req.body;
        const return_ = await Return.findById(id);
        return_.status.ragStatus.status = "CLEAR";
        await return_.save();

        return res.redirect(`/displayBoard/ragStatus`);
    },
    updatePersonnels: async (req, res) => {
        const { date } = req.params;
        const { personnels, id } = req.body;

        await Return.findByIdAndUpdate(id, { personnels });
        return res.redirect(`/displayBoard/ragStatus`);
    },
    clearSafekeep: async (req, res) => {
        const { date } = req.params;
        const { id } = req.body;
        const return_ = await Return.findById(id);
        return_.status.safekeepStatus.sk = false;
        await return_.save();

        return res.redirect(`/displayBoard/ragStatus`);
    },
};
