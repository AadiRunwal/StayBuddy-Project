const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema} = require("./schema.js");                   //for Server-side Listing Validation.
const {reviewSchema} = require("./schema.js");                 //for Server-side Review Validation.
const ExpressError = require('./utilities/ExpressError.js');


// _______________ Listing Middlewares. _______________

module.exports.validateListing = (req,res,next)=>{          // (Server-Side Validation) if User sends any Empty Field in Listing.
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};

module.exports.isOwner = async (req,res,next)=>{            //to check if Current User is the Owner of Listing.
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","Only the Owner is Authorized.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// ______________ Review Middlewares. _______________

module.exports.validateReview = (req,res,next)=>{          // (Server-Side Validation) if User sends any Empty Field in Review.
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{           //to check if Current user is the Author of the Review.
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "you are not the Author of this Review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// _______________ User Middlewares. _______________

module.exports.isLoggedIn = (req,res,next)=>{               //to check if User is Logged In.
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;          //URL to redirect on, after Login.
        
        req.flash("error","Login is Required!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}