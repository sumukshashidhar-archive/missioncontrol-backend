const student = require('./../models/student')
module.exports = {
    
    getStudents: async (classattend, section) => {
        return new Promise(async (resolve, reject) => {
            student.find({classattend:classattend, section:section}, async (err, obj) => {
                if(err) {
                    console.error(err)
                }
                else {
                    console.log
                }
            })
        })
    }   
}