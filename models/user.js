var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    useruuid: String,
    username: String, 
    password: String,
    role: String,
})

module.exports = mongoose.model("user", userSchema)