const express = require("express");
const router = express.Router();
const {validateListing, isLoggedIn, isOwner} = require("../middleware.js");

//---------- to Upload Images on Cloud Storage. ----------
const  multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const asyncWrap = require("../utilities/asyncWrap.js");             //require for Error Handling.


// ____________________  Listing Routes.  ____________________

const listingController = require("../controllers/listing.js");     // Core functionality of Each Route.


//---------- view all Listings. (Read Route). ----------
router.get("/", asyncWrap(listingController.viewAll));


//---------- create new listing. (New & Create Route). -----------
router.get("/new", isLoggedIn, listingController.listingForm);

router.post("/", upload.single("listing[image]"), asyncWrap(listingController.createListing));


//---------- view particular listing. (Show Route). ----------
router.get("/:id", asyncWrap(listingController.showListing));


//---------- edit listings. (Update Route). ----------
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.editForm));

router.put("/:id", isOwner, validateListing, upload.single("listing[image]"), asyncWrap(listingController.editListing));


//---------- destroy listings. (Delete Route). ----------
router.delete("/:id", isLoggedIn, isOwner, asyncWrap(listingController.destroyListing));


module.exports = router;