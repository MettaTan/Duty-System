const Return = require("../../models/Return.model");
const Discovery = require("../../models/Discovery.model");

module.exports = {
    createDiscovery: async (date, discovery, type) => {
        const newDiscovery = new Discovery({
            date,
            voucher_id: discovery.voucher_id || null,
            return_id: discovery.return_id || null,
            title: discovery.title,
            location: discovery.location,
            tag: discovery.tag,
            discover_id: discovery.discover_id,
            items: discovery.items,
            type,
        });
        const return_ = await Return.findById(discovery.return_id);
        if (return_) {
            return_.status.discovery_id = newDiscovery;
            await return_.save();
        }
        await newDiscovery.save();
    },
    updateDiscovery: async (discovery) => {
        const discover = await Discovery.findById(discovery._id);
        discover.title = discovery.title;
        discover.location = discovery.location;
        discover.tag = discovery.tag;
        discover.discover_id = discovery.discover_id;
        discover.items = discovery.items;

        await discover.save();
    },
    deleteDiscovery: async (discovery) => {
        await Discovery.findByIdAndDelete(discovery._id);
    },
};
