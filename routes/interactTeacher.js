const auth = require('./../controllers/authorization-microservice')
module.exports = (app) => {
    app.get('/api/interaction/getStudents', async (req, res) => {
        // this route, if the teacher is authenticated, gets all the students for the particular class
        // first, we check if the teacher is authorized to access this route this way
        const authenticated = auth.authoriseTeacher(token);
        if(authenticated["status"] === true) {
            
        }
        else {
            res.status(403).json({
                "message":"This JWT is invalid / user is not authenticated."
            })
        }
    })
}