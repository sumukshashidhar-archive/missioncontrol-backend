const dashboardMicroservice = require("../controllers/dashboard-microservice");

const service = require('./../controllers/dashboard-microservice')
module.exports = (app) => {

	app.get('/api/dashboard/teacher', async function(req, res) {
                // from the token, we need to get the email, do not know how the token will be sent back, so hard to predict
                // will just be assuming var now
		console.debug("Hit the teacher dashboard");
		res.json({
			"status":200,
			"message":"API service is online"
		})
	})
}
