var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  emailID: String,
  teacher_name: String,
  teacher_class: Number,
  teacher_section: String,
});

module.exports = mongoose.model("user", userSchema);
