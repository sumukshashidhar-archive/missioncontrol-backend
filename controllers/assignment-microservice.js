const assignment = require('./../models/assingment')

module.exports = {
    makeAssignment: async (class_assigned, section, teacher_assigned, teacher_name, dueDate, assignmentName, assignmentLink) => {
        return new Promise(async (resolve, reject) => {
            const newAssignment = new assignment({
                class_assigned: class_assigned,
                section: section,
                teacher_assigned_by: teacher_assigned, 
                teacher_name: teacher_name, 
                dueDate: dueDate, 
                assignmentName: assignmentName, 
                assignmentLink: assignmentLink
            })
            newAssignment.save((err, obj) => {
                if(err) {
                    resolve(false)
                }
                else {
                    resolve(true)
                }
            })
        })
    }
}