const { runInNewContext } = require("vm");

const teacher = require('./../models/teacher')

module.exports = {


    getTeacherDashboard: async function(email) {
        return new Promise(async (resolve, reject) => {
            teacher.findOne({emailID: email}, (err, obj) => {
                if(err) {
                    console.error(err)
                    reject(err)
                }
                else {
                    if(obj) {
                        console.debug(obj)
                        resolve(obj);
                    }
                    else {
                        console.debug(obj)
                        resolve(false);
                    }
                }
            })
        })
    }
} 