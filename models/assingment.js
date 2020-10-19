var mongoose = require("mongoose");

var assignmentSchema = new mongoose.Schema({
  class_assigned: Number,
  section: String,
  teacher_assigned_by: String,
  dueDate: Number,
  assignemtName: String,
  assignmentLink: String,
  extensionPurchasedBy: Array,
  newDueDate: Array,
  submittedStudents: Array,
  submittedStudentsLink: Array,
});

module.exports = mongoose.model("assignment", assignmentSchema);
