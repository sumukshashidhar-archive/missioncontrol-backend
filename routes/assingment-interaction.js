const auth = require("./../controllers/authorization-microservice");
module.exports = (app) => {

    /*
    Gets all the assignments due for the given student.
    */

    app.get('/api/assignments/student/getAssignemts', async(req, res) => {
        const authenticated = await auth.authoriseStudent(
            req.headers.authorization
          );

          if(authenticated!==false) {

          } 
    })
    /*
    Allows a student to submit a particular assignment
    */
    app.post('/api/assignment/student/submitAssignment', async(req, res) => {
        const authenticated = await auth.authoriseStudent(
            req.headers.authorization
          );

          if(authenticated!==false) {
              
        } 
    })

    app.post('/api/assignments/students/requestExtension', async(req, res) => {
        const authenticated = await auth.authoriseStudent(
            req.headers.authorization
          );

          if(authenticated!==false) {
              
        } 
    })

    app.get('/api/assignments/teacher/getAssignments', async(req, res) => {
        const authenticated = await auth.authoriseTeacher(
            req.headers.authorization
          );

          if(authenticated!==false) {
              
        } 
    })

    app.post('/api/assignments/teacher/makeAssignmnt', async(req, res) => {
        const authenticated = await auth.authoriseTeacher(
            req.headers.authorization
          );

          if(authenticated!==false) {
              
        } 
    })

}