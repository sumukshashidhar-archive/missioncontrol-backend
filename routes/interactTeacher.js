const auth = require('./../controllers/authorization-microservice')
const getStudents = require('./../controllers/student_retrieve-microservice')
module.exports = (app) => {
	app.get('/api/interaction/getStudents', async (req, res) => {
		// this route, if the teacher is authenticated, gets all the students for the particular class
		// first, we check if the teacher is authorized to access this route this way
		const authenticated = auth.authoriseTeacher(token);
		if (authenticated["status"] === true) {
			// now this means that our user is authorized to access this function
			// let us get her the students of her class!
			const studs = await getStudents.getStudents(authenticated['data']['class_handled'], authenticated['data']['section']);
			if (studs !== false) {
				res.status(200).json({
					"object": studs
				})
			}
		}
		else {
			res.status(403).json({
				"message": "This JWT is invalid / user is not authenticated."
			})
		}
	})
}