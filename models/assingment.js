var mongoose = require("mongoose");

var assignmentSchema = new mongoose.Schema({
  class_assigned: Number,
  section: String,
  teacher_assigned_by: String,
  teacher_name: String,
  dueDate: Number,
  assignmentName: String,
  assignmentLink: String,
  open: { type: Boolean, default: true },
  extensionPurchasedBy: { type: Array, default: [] },
  extensionPurchasedByNames: { type: Array, default: [] },
  newDueDate: { type: Array, default: [] },
  submittedStudents: { type: Array, default: [] },
  submittedStudentsLink: { type: Array, default: [] },
});

module.exports = mongoose.model("assignment", assignmentSchema);
