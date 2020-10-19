module.exports = (app) => {

    /*
    Gets all the assignments due for the given student.
    */

    app.get('/api/assignments/student/getAssignemts', async(req, res) => {

    })

    /*
    Allows a student to submit a particular assignment
    */
    app.post('/api/assignment/student/submitAssignment', async(req, res) => {
        
    })

    app.get('/api/assignments/teacher/getAssignments', async(req, res) => {
        
    })

    app.post('/api/assignments/teacher/makeAssignmnt', async(req, res) => {

    })

}