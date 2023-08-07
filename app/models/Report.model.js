const mongoose = require("mongoose");

const taskingSchema = require("./schemas/issue/tasking.schema");

const reportSchema = new mongoose.Schema({
    date: Date,
    incomingTeam: [],
    issueSummary: {
        taskingOrder: [taskingSchema],
        esh: [taskingSchema],
    },
    others: {
        outstandingTask: {
            type: String,
            default: "Outstanding Task",
        },
        feedback: {
            type: String,
            default: "Feedback",
        },
        others: {
            type: String,
            default: "Others",
        },
    },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
