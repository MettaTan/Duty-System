const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, default: "" },
        password: { type: String, default: "" },
        rank: { type: String, default: "" },
        name: { type: String, default: "" },
        admin: { type: Boolean, default: false },
        approver: { type: Boolean, default: false },
    },
    { minimize: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
