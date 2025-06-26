//for Server Side Validation of Incoming data to Database.


// ----------- Listing Validation. ----------
const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        image : joi.string().allow("",null),        //allowing image to be Empty/Null.
        location : joi.string().required(),
        country : joi.string().required(),
        price : joi.number().required().min(0)      //preventing negative values for price.
    }).required()
});


// ---------- Review Validation. ----------

module.exports.reviewSchema = joi.object({
    review : joi.object({
        comment : joi.string().required(),
        rating : joi.number().required().min(1).max(5)
    }).required()
});
