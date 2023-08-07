// PACKAGES
const express = require("express");
const app = express();
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

const moment = require("moment");

const session = require("express-session");
const sessionConfig = {
    secret: "This shud be a btr secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    },
};
app.use(session(sessionConfig));

const flash = require("connect-flash");
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user_id = req.session.user_id || null;
    res.locals.username = req.session.username || null;
    res.locals.admin = req.session.admin || false;
    res.locals.approver = req.session.approver || false;
    res.locals.rankName = req.session.rankName || null;
    res.locals.moment = moment;
    req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 30);
    next();
});

// Utils
const ExpressError = require("./Utils/ExpressError");

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors());
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.set("layout extractScripts", true);

const config = require("./config");
const allAmmoItems = require("./public/items");
app.locals.allAmmoItems = allAmmoItems;
app.locals.ip = config.express.ip;
app.locals.port = config.express.port;
app.locals.views = process.cwd() + "/views";

app.get("/", (req, res) => {
    res.render("home", {
        header: "PLAD Duty Summary",
    });
});
app.get("/report", (req, res) => {
    res.render("report/Index", {
        header: "PLAD Report Generator",
    });
});
app.get("/clearance", (req, res) => {
    res.render("clearance/Index", {
        header: "PLAD Clearance Generator",
    });
});
app.get("/displayBoard", (req, res) => {
    res.render("displayBoard/Index", {
        header: "PLAD Display Board",
    });
});
app.get("/collection", (req, res) => {
    res.render("collection/Index", {
        header: "PLAD Seed Collection",
        items: allAmmoItems,
    });
});
app.get("/admin", (req, res) => {
    res.render("admin/Index", {
        header: "PLAD Admin Menu",
    });
});

const Voucher = require("./models/Voucher.model");
const Issue = require("./models/Issue.model");
const Return = require("./models/Return.model");
const User = require("./models/User.model");

async function seedCollection(date, collections, returnToday = false) {
    for (const [key, value] of Object.entries(collections)) {
        const { time, location, unit, sto, matDoc, items } = value;

        const newVoucher = new Voucher({
            unit,
            sto,
            matDoc,
        });

        for (const item of items) {
            newVoucher.items.push(item);
        }

        const newIssue = new Issue({
            voucher_id: newVoucher._id,
            date,
            time,
            location,
            status: {},
        });

        const newReturn = new Return({
            voucher_id: newVoucher._id,
            location,
            handover: {},
            status: {},
        });

        if (returnToday) {
            newReturn.date = date;
        }

        newVoucher.issue_id = newIssue;
        newVoucher.return_id = newReturn;
        await newVoucher.save();
        await newReturn.save();
        await newIssue.save();
    }
}

const {
    dayAfter9,
    dayAfter2359,
    nextDayAfter5,
    nextDayAfter9,
    initialUsers,
} = require("./seed.js");

app.get("/seed/issues", async (req, res) => {
    const today = moment().tz("Asia/Singapore").format("YYYY-MM-DD");
    const nextDay = moment()
        .tz("Asia/Singapore")
        .add(1, "days")
        .format("YYYY-MM-DD");

    await seedCollection(today, dayAfter9, true);
    await seedCollection(nextDay, dayAfter2359);
    await seedCollection(nextDay, nextDayAfter5);
    await seedCollection(nextDay, nextDayAfter9);

    return res.redirect("/");
});
app.get("/seed/users", async (req, res) => {
    for (const user of initialUsers) {
        const newUser = new User(user);
        await newUser.save();
    }
    return res.redirect("/");
});

// Routes
const clearanceEdit = "./router/clearance/edit.routes";
app.use("/clearance/edit", require(clearanceEdit));

const clearanceGenerate = "./router/clearance/generate.routes";
app.use("/clearance/generate", require(clearanceGenerate));

const clearanceApprove = "./router/clearance/approve.routes";
app.use("/clearance/approve", require(clearanceApprove));

const printNYRissue = "./router/clearance/printIssue.routes";
app.use("/clearance/printNYRbyIssue", require(printNYRissue));

const printNYRreturn = "./router/clearance/printReturn.routes";
app.use("/clearance/printNYRbyReturn", require(printNYRreturn));

const reportEdit = "./router/report/edit.routes";
app.use("/report/edit", require(reportEdit));

const reportGenerate = "./router/report/generate.routes";
app.use("/report/generate", require(reportGenerate));

const displayBoardSchedule = "./router/displayBoard/schedule.routes";
app.use("/displayBoard/schedule", require(displayBoardSchedule));

const ragStatus = "./router/displayBoard/ragStatus.routes";
app.use("/displayBoard/ragStatus", require(ragStatus));

const collection = "./router/collection.routes";
app.use("/collection", require(collection));

const admin = "./router/admin.routes";
app.use("/admin", require(admin));

//ERROR HANDLING
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message =
            "Something went wrong, inform media team on the bug you experienced";
    }
    res.status(statusCode).render("error", { err, header: statusCode });
});

module.exports = app;
