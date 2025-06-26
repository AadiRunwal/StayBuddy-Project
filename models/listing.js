//listing Schema and Model.

const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    image : {
        filename : {
            type : String,
            default :  "listingimage"
        },
        url : {
            type : String,
            default : "https://plus.unsplash.com/premium_photo-1749317659941-b63b68768982?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    },
    price : Number,
    location : String,
    country : String,

    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
});

listingSchema.post("findOneAndDelete", async (listing)=>{       // Mongoose Middleware (to delete All Reviews when the Listing is Deleted).
    await Review.deleteMany({_id : {$in : listing.reviews}});
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;