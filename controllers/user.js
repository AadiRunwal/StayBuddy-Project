const User = require("../models/user.js");


// ____________________  User  Controller.  ____________________


// ---------- User SignUp. ----------

module.exports.signupForm = (req,res)=>{
    res.render("./Users/signUp.ejs");
};

module.exports.userSignup = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);

        req.login(registeredUser,(err)=>{               //automatically Login when SignedUp.
            if(err){
                return next(err);
            }
            req.flash("success","User registered successfully.");
            res.redirect("/listings");
        });
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};


// ---------- User Login. ----------

module.exports.loginForm = (req,res)=>{
    res.render("./Users/logIn.ejs");
};

module.exports.userLogin = async(req,res)=>{
    let redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success","Logged In successfully.");
    res.redirect(redirectUrl);
};


// ---------- User Logout. ----------

module.exports.userLogout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out Successfully.");
        res.redirect("/listings");
    });
}