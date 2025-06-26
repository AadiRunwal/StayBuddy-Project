const express = require("express");
const router = express.Router({mergeParams : true});
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const asyncWrap = require("../utilities/asyncWrap.js");             //require for Error Handling.


// ____________________  Review Routes.  ____________________

const reviewController = require("../controllers/review.js");       // Core functionality of Each Route.


//---------- Add Reviews. (on Show Listing Page). ----------
router.post("/", isLoggedIn, validateReview, asyncWrap(reviewController.addReview));


//---------- Delete Reviews. ----------
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncWrap(reviewController.destroyReview));

module.exports = router;