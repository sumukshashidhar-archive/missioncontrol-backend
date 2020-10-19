var mongoose = require("mongoose");

var assignmentSchema = new mongoose.Schema({
    class_assigned: Number,
    section: String,
    teacher_assigned_by: String,
    dueDate: Number,
    extensionPurchasedBy: Array, 
    newDueDate: Array,
});

module.exports = mongoose.model("assignment", assignmentSchema);
