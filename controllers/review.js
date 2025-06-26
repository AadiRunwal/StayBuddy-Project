const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


// ____________________  Review  Controller.  ____________________


//---------- Add Reviews. ----------

module.exports.addReview = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let review = await new Review(req.body.review);
    review.author = req.user._id;
    
    listing.reviews.push(review);
    
    await review.save();
    await listing.save();
    req.flash("success","New Review Added.");
    res.redirect(`/listings/${id}`);
};


//---------- Delete Reviews. ----------

module.exports.destroyReview = async (req,res)=>{
    let {id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted.");
    res.redirect(`/listings/${id}`);
};
