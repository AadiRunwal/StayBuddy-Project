if(process.env.NODE__ENV != "production"){       //to Extract Data from .env file.
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

const session = require("express-session");            //to store Session Information.
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
 
//----- Require for User Authentication. -----
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

//----- Require for Database. -----
const mongoose = require("mongoose");

//----- Require for Error Handling. -----
const ExpressError = require('./utilities/ExpressError.js');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//----- Database connection. -----

const atlasURL = process.env.ATLAS_URL;                         //Atlas Database URL.

main().then(()=>{
    console.log("Database Connection Successful.");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    mongoose.connect(atlasURL);
}


//----- establishing Session and Flash Messages. -----
const store = MongoStore.create({
    mongoUrl : atlasURL,
    crypto : {
        secret : process.env.SESSION_SECRET,
    },
    touchAfter : 24*3600                        //Refresh Session after 24 hours.
});
store.on("error", ()=>{
    console.log("Error in Mongo Session Store.",err);
});


const sessionOptions = {
    store,
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7*24*60*60*1000,         // Cookies Expires in 7 Days.
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());           //storing User information in Session.
passport.deserializeUser(User.deserializeUser());       //removing User information from Session.


//Server connection.
const port = 8080;

app.listen(port,()=>{
    console.log("Port Active.");
});


// ---------- Locals-Variable Middleware. (variables can be accessed anywhere) ----------
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.currentPath = req.originalUrl;
    next();
});


app.get("/",(req,res)=>{                                    //____________________ HomePage Route. ____________________
    res.render("./Listings/Homepage.ejs");
});

app.use("/listings",listingRoutes);                     // ____________________  Listing Routes. ____________________
app.use("/listings/:id/review",reviewRoutes);          // ____________________  Review Routes. ____________________
app.use("/",userRoutes);                              // ____________________  User Routes. ____________________



// ____________________  Error Handling  ____________________

//Error if request sent to Wrong Route.
app.get("*a",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

// Error Handling Middleware.
app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{err});
});