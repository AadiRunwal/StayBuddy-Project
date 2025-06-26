//user Schema and Model.

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({        //Username & Password are added automatically by passport-local-mongoose.
    email : {
        type : String,
        required : true
    },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema);
module.exports = User;