const password_module = require("../controllers/auth-microservice");
const registration = require("./../controllers/registration-service");
const user = require("./../models/user");
const tokenms = require("./../controllers/jwt-microservice");
const accCreate = require('./../controllers/account_creation-microservice')
const ADMIN_CREATION_SECRET = "SECRET";

module.exports = (app) => {
  app.post("/login", async function (req, res) {
    user.findOne({ username: req.body.username }, (err, obj) => {
      if (err) {
        console.error(err);
      } else {
        if (obj !== undefined && obj !== null) {
          const resp = password_module.pass_validate(
            req.body.password,
            obj["password"]
          );
          if (resp) {
            // at this stage, we have successfully authenticated the user
            res.json({
              status: 200,
              token: tokenms.signing(obj["username"], obj["role"]),
            });
          } else {
            res.json({
              status: 403,
              message: "Password Validation Failed",
            });
          }
        } else {
          console.log(obj);
          res.json({
            status: 404,
            message: "This user was not found",
          });
        }
      }
    });
  }),
    app.post("/register", async function (req, res) {
      if (
        req.body.creation_password === process.env.ADMIN_CREATION_SECRET &&
        req.body.role === "admin"
      ) {
        const response = await registration.makeUser(
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
        const response = await registration.makeUser(
          req.body.username,
          req.body.password,
          req.body.role
        );
        if (response) {
          // teacher USER is created, now we create the actual teacher account!
          var responseAccCreate = accCreate.makeTeacherAccount(req.body.username, req.body.name, req.body.class_handled, req.body.section)
          if (responseAccCreate) {
            // this means everything went well
            res.json({
              message: "Successfully Created the User",
            });
          }
          else {
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
        const response = await registration.makeUser(
          req.body.username,
          req.body.password,
          req.body.role
        );
        if (response) {
          var responseAccCreate = accCreate.makeStudentAccount(req.body.username, req.body.name, req.body.classattend, req.body.section)
          if(responseAccCreate) {
            res.json({
              message: "Successfully Created the User",
            });
          }
          else{
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
