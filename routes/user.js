const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userControllers = require("../controllers/user.js");

router.route("/signup")
    .get(userControllers.renderSignupForm)
    .post(wrapAsync(userControllers.signup));

router.route("/login")
    .get(userControllers.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), userControllers.login);

//router.get("/signup", userControllers.renderSignupForm);
//router.post("/signup", wrapAsync(userControllers.signup));
//router.get("/login", userControllers.renderLoginForm);
//router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), userControllers.login);

router.get("/logout", userControllers.logout);

module.exports = router;