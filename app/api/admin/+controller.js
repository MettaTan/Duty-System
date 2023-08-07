const User = require("../../models/User.model");

async function renderLogin(req, res) {
    return res.render("admin/Login", {
        header: "PLAD Admin Login",
    });
}

async function renderSignup(req, res) {
    return res.render("admin/Signup", {
        header: "PLAD Admin Signup",
    });
}

async function createAccount(req, res) {
    const newUser = new User(req.body);
    await newUser.save();
    req.flash("success", "Account created successfully!");
    return res.redirect("/admin");
}

async function loginAccount(req, res, next) {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        req.flash("error", "Login failed! Username does not exist!");
        return res.redirect("/admin/login");
    }
    if (user.password === password) {
        req.session.user_id = user._id;
        req.session.username = user.username;
        req.session.admin = user.admin;
        req.session.approver = user.approver;
        req.session.rankName = user.rank + " " + user.name;

        req.flash("success", "Login successfully!");
        return res.redirect("/");
    } else {
        req.flash("error", "Login failed! Wrong password!");
        return res.redirect("/admin/login");
    }
}

async function logout(req, res) {
    req.session.user_id = null;
    req.session.username = null;
    req.session.admin = false;
    req.session.approver = false;
    req.session.rankName = null;

    req.flash("success", "Logout successfully!");
    return res.redirect("/");
}

module.exports = {
    renderLogin,
    renderSignup,
    createAccount,
    loginAccount,
    logout,
};
