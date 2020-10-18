module.exports = (app) => {

	app.get('/api/dashboard/teacher', async function(req, res) {
        // need to return data based on teacher email ID here. based on how token is going to be sent back to me
        console.debug("Hit the teacher dashboard page");
        res.status(200).json({

        })
	})
}
