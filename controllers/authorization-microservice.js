const jwms = require("./jwt-microservice")
module.exports = {
  authoriseTeacher: async (token) => {
    const teach = await jwms.total_verification(token)
    console.log(teach)
    if(teach!==false && teach["role"]==="teacher"){
      return teach
    }
    else {
      return false
    }
  },
};
