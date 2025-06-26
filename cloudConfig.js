// Cloud Setup (to upload files on Cloud).

const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");

cloudinary.config({                                     //to Access our Cloudinary Account.
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({                //to Access our Storage in Cloudinary Account.
    cloudinary : cloudinary,
    params : {
        folder : "StayBuddy_DEV",
        allowedformats : ["png","jpg","jpeg"]
    }
});

module.exports = {
    cloudinary,
    storage
}