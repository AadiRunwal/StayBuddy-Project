const Listing = require("../models/listing.js");


// ____________________  Listing Controller.  ____________________


//---------- view all Listings. (Read Route). ----------

module.exports.viewAll = async (req,res)=>{
    let allListings = await Listing.find();
    res.render("./Listings/viewAll.ejs",{allListings});
};


//---------- create new listing. (New & Create Route). -----------

module.exports.listingForm = (req,res)=>{
    res.render("./Listings/newListing.ejs");
};

module.exports.createListing = async (req,res)=>{
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if(req.file){                                   // to save Uploaded Image in Database.
        let filename = req.file.filename;
        let url = req.file.path;
        newListing.image = {filename,url};
    }

    await newListing.save();
    req.flash("success","New Listing Added.");
    res.redirect("/listings");
};


//---------- view particular listing. (Show Route). ----------

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews", populate: {path:"author"} }).populate("owner");
    if(!listing){
        req.flash("error","Listing Not found.");
        return res.redirect("/listings");
    }

    res.render("./Listings/showListing.ejs",{listing});
};


//---------- edit listings. (Update Route). ----------

module.exports.editForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing){                                   //if Edit Request sent to Invalid Listing.
        req.flash("error","Listing Not found.");
        return res.redirect("/listings");
    }


    let imageUrl = listing.image.url;
    imageUrl = imageUrl.replace("upload","upload/w_250/q_auto:best/f_auto");     //to Load Low Quality Image on Edit Page.

    res.render("./Listings/editListing.ejs",{listing, imageUrl});
};

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id,req.body.listing);

    if(req.file){                                     //update Image if User Uploads New Image.
        let filename = req.file.filename;
        let url = req.file.path;
        updatedListing.image = {filename, url};
        await updatedListing.save();
    }

    req.flash("success","Listing Updated.")
    res.redirect(`/listings/${id}`);
};


//---------- destroy listings. (Delete Route). ----------

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted.");
    res.redirect("/listings");
    console.log(deletedListing);
};


//---------- Book Listing ----------

module.exports.bookListing = (req,res)=>{
    let {id} = req.params;
    req.flash("success","Booked Successfuly.");
    res.redirect(`/listings/${id}`);
    
}