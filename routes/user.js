const express = require("express");
const router = express.Router();
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");          //URL to redirect on, after Login.


// ____________________  User Routes.  ____________________

const userController = require("../controllers/user.js");           // Core functionality of Each Route.


// ---------- User SignUp. ----------

router.route("/signup")
    .get(userController.signupForm)

    .post(userController.userSignup);


// ---------- User Login. ----------

router.route("/login")
    .get(userController.loginForm)

    .post(saveRedirectUrl, 
    passport.authenticate("local",{failureRedirect : "/login",failureFlash : true}), 
    userController.userLogin 
    );


// ---------- User Logout. ----------

router.get("/logout",userController.userLogout);


module.exports = router;