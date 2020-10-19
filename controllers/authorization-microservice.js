const jwms = require("./jwt-microservice")
module.exports = {
  authoriseTeacher: async (token) => {
    const teach = total_verification(token)
    if(teach!==false && teach["role"]==="teacher"){
      resolve(teach)
    }
    else {
      resolve(false)
    }
  },
};
