const student = require("./../models/student");
module.exports = {
  addPoints: async (studentid) => {
    return new Promise(async (resolve, reject) => {
      student.findOne({ emailID: studentid }, async (err, obj) => {
        if (err) {
          console.error(err);
          resolve(false);
        } else {
          if (obj !== {} && obj !== null) {
            console.log(obj);
            student.updateOne(
              { emailID: studentid },
              { totalInteractionPoints: obj["totalInteractionPoints"] + 2 },
              async (err2, obj2) => {
                if (err2) {
                  console.error(err);
                  resolve(false);
                } else {
                  console.debug(obj);
                  console.debug(obj2);
                  resolve(true);
                }
              }
            );
          } else {
            resolve(false);
          }
        }
      });
    });
  },
};
