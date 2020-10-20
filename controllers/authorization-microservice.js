const jwms = require("./jwt-microservice");
module.exports = {
  authoriseTeacher: async (token) => {
    return new Promise(async (resolve, reject) => {
      const teach = await jwms.total_verification(token);
      if (teach !== false && teach["role"] === "teacher") {
        resolve(teach);
      } else {
        resolve(false);
      }
    })
  },

  authoriseStudent: async (token) => {
    return new Promise(async (resolve, reject) => {
      const stud = await jwms.total_verification(token);
      if (stud !== false && stud["role"] === "student") {
        return (stud);
      } else {
        resolve(false);
      }
    })
  },
};
