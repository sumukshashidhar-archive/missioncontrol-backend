/*
    MODELS
 */
const user = require("./../models/user");
const student = require("./../models/student");
const teacher = require("../models/teacher");

/*
    SERVICES
 */
const token_microservice = require("./../controllers/jwt-microservice");
const password_module = require("../controllers/auth-microservice");
const registration_microservice = require("./../controllers/registration-service");
const account_creation_microservice = require("./../controllers/account_creation-microservice");
const login_microservice = require("./../controllers/login-microservice")

const logger = require("./../config/logger")

module.exports = (app) => {
    app.post("/login", async function (req, res) {
        logger.info(`Reached Login Method. Request is: ${req.body} `)
        logger.debug(`Credentials sent are: Username: ${req.body.username} and Password ${req.body.password}`)
        const response = await login_microservice.authenticate(req.body.username, req.body.password)
        if(response["status"]) {
            res.status(200).json({
                "message":"Successful",
                "token":response["token"]
            })
        }
        else {
            res.status(403).json({
                "message":response["message"]
            })
        }
    }),
        app.post("/register", async function (req, res) {
            if (
                req.body.creation_password === process.env.ADMIN_CREATION_SECRET &&
                req.body.role === "admin"
            ) {
                const response = await registration_microservice.makeUser(
                    req.body.username,
                    req.body.password,
                    req.body.role
                );
                if (response) {
                    //meaning the admin user creation succeeded, now we need to look to creating the actual admin user as well.
                    res.json({
                        message: "Successfully Created the User",
                    });
                    console.info("Created the user");
                } else {
                    res.status(409).json({
                        message: "Did not create the user",
                    });
                }
            } else if (
                (req.body.creation_password === process.env.ADMIN_CREATION_SECRET ||
                    req.body.creation_password === process.env.DEVICE_CREATION_SECRET) &&
                req.body.role === "teacher"
            ) {
                // this is for registration of regular users
                const response = await registration_microservice.makeUser(
                    req.body.username,
                    req.body.password,
                    req.body.role
                );
                if (response) {
                    // teacher USER is created, now we create the actual teacher account!
                    var responseAccCreate = account_creation_microservice.makeTeacherAccount(
                        req.body.username,
                        req.body.name,
                        12,
                        req.body.section
                    );
                    if (responseAccCreate) {
                        // this means everything went well
                        res.json({
                            message: "Successfully Created the User",
                        });
                    } else {
                        res.json({
                            message: "Something went horribly wrong",
                        });
                    }

                    console.info("Created the user");
                } else {
                    res.status(409).json({
                        message: "Did not create the user as the user already exists.",
                    });
                }
            } else if (req.body.role === "student") {
                // this is for registration of regular users
                const response = await registration_microservice.makeUser(
                    req.body.username,
                    req.body.password,
                    req.body.role
                );
                if (response) {
                    var responseAccCreate = account_creation_microservice.makeStudentAccount(
                        req.body.username,
                        req.body.name,
                        12,
                        req.body.section
                    );
                    if (responseAccCreate) {
                        res.json({
                            message: "Successfully Created the User",
                        });
                    } else {
                        res.json({
                            message: "Something went horribly wrong",
                        });
                    }
                    console.info("Created the user");
                } else {
                    res.status(409).json({
                        message: "Did not create the user as the user already exists.",
                    });
                }
            } else {
                res.status(403).json({
                    message:
                        "There was no creation password specified for the current user or the creation password for a different role or the creation password was wrong",
                });
            }

            console.log(req.body);
        });
};
