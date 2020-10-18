var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    emailID: String, 
    student_name: String,
    student_class: Number,
    student_section: String,
    appData: {
        totalInteractionPoints: Number,
        
    }
})

module.exports = mongoose.model("user", userSchema)