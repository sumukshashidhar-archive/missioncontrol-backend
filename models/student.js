const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    emailID: String,
    student_name: String,
    student_class: Number,
    student_section: String,
    totalInteractionPoints: {type: Number, default: 0},
});

module.exports = mongoose.model("student", studentSchema);
