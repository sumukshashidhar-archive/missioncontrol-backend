var mongoose = require("mongoose");

var studentSchema = new mongoose.Schema({
  emailID: String,
  student_name: String,
  student_class: Number,
  student_section: String,
  totalInteractionPoints: Number,
});

module.exports = mongoose.model("student", studentSchema);
