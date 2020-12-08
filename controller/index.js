const _ = require("lodash");
const User = require("../model/User");
const { validationResult } = require("express-validator");
let userController = {};
let surveyController = {};
let responseController = {};

// Usercreate Controller
userController.createUser = (req, res, next) => {
  // To catch error thrown by express-validator
  const errors = validationResult(req);

  //   console.log("asdf");
  if (!errors.isEmpty()) {
    // If the provided body is not valid
    // console.log("Validation error:",errors.errors)
    next({ code: 409, msg: errors.errors[0].msg });
  } else {
    // after validating request body
    let userData = {};
    userData.userName = req.body.username;
    userData.email = req.body.email;
    userData.password = req.body.password;
    let user = new User(userData); //Creating new User data

    user
      .save()
      .then((userSaved) => {
        // Saving the created data

        let response = {};
        response.status = 200;
        response.msg = "Account created successfully";
        res.status(200).json(response);
      })
      .catch((unsavedUser) => {
        console.log("Error while creating user:", unsavedUser);
        if (unsavedUser.code === 11000) {
          next({ code: 409, msg: "Email already exist!!" });
        } else {
          next({ code: 400, msg: "Unable to create user" });
        }
      });
  }
};

// login controller
userController.loginUser = (req, res, next) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    next({ code: 409, msg: errors.errors[0].msg });
  } else {
    let body = req.body;
    User.findOne({ email: body.email })
      .then((existingUser) => {
        if (!existingUser)
          // when user with username is returned null
          next({ code: 400, msg: "Account doesnt exist" });
        else {
          // when user exist user instance is stored at existingUser object

          //existingUser contain comparePassword,generateAuthToken,and other function defined inside model
          existingUser.comparePassword(body.password, (err, isMatch) => {
            if (!isMatch) {
              // If password doesnt match it isMatch is false
              next({ code: 400, msg: "Invalid password" });
            } else {
              // when password matched

              let response = {};
              response.status = 200;
              response.msg = "Logged in successfully";
              response.token = existingUser.generateAuthToken();
              response.email = existingUser.email;
              response.name = existingUser.userName;
              // response.data.isAdmin = existingUser.isAdmin;
              res.status(200).json(response);
            }
          });
        }
      })
      .catch((err) => {
        console.log("Error while loggingin user:", err);
        next({ code: 500, msg: "Unable to logged in user" });
      });
  }
};

// controller to get logged in user data
userController.getLoggedinleUser = (req, res, next) => {
  if (_.isUndefined(req.user.id))
    next({ code: 401, msg: "Unauthorized Access" });
  else
    User.findOne({ email: req.user.email })
      .then((singleUser) => {
        console.log(singleUser, req.user);
        if (singleUser) {
          let response = {
            username: singleUser.userName,
            email: singleUser.email,
            msg: "User exist",
            status: "success",
          };
          res.status(200).json(response);
        } else {
          next({ code: 400, msg: "Invalid user id" });
        }
      })
      .catch((err) => {
        console.log("Error while getting single user:", err);
        next({ code: 500, msg: "Unable to get single user" });
      });
};

// contoller to update User
userController.updateUser = (req, res, next) => {
  console.log("Update User.....");

  if (_.isUndefined(req.user.id))
    next({ code: 401, msg: "Unauthorized Access" });
  else {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("Validation Error", errors.errors);
      next({ code: 409, msg: errors.errors });
    } else {
      const id = req.user.id;
      const body = req.body;
      return User.findById(id, (err, user) => {
        if (err) {
          console.log("DB error.user.update", err);
          return next({ code: 500, msg: "Unable to update" });
        }
        if (!user) {
          console.log("No User found");
          return next({ code: 400, msg: "Invalid user id" });
        }

        // updating the user data if exist in req.body other old data is used
        user.username = body.username || user.username;
        user.email = body.email || user.email;
        return user.save((err, result) => {
          if (err) {
            if (err.code === 11000) {
              next({
                code: 409,
                msg: "username or email already exist:" + err.errmsg,
              });
            } else {
              console.log("User update error:", err);
              next({ code: 500, msg: "Unable to update user" });
            }
          } else {
            let response = { ...result._doc };
            response.status = 200;
            response.msg = "Successfully updated user";
            return res.status(200).json(response);
          }
        });
      });
    }
  }
};

// controller to delete user data
userController.deleteUser = (req, res, next) => {
  if (_.isUndefined(req.user.id))
    next({ code: 401, msg: "Unauthorized Access" });
  else {
    User.findOneAndDelete({ _id: req.user.id }, (err, deletedUser) => {
      if (err) {
        console.log("Error while deleting user:", err);
        next({ code: 500, msg: "User will not be deleted" });
      } else {
        console.log("User Removed:", deletedUser);
        res.status(200).json({ msg: "User deleted successfully", status: 200 });
      }
    });
  }
};

const SurveyModel = require("../model/Surveys");
surveyController.getSurveys = (req, res, next) => {
  SurveyModel.find({ creator: req.user.id })
    .select("-_id -__v")
    .then((result) => {
      if (result.length) {
        res.json({ status: "success", data: result });
      } else {
        res.status(404).json({ msg: "No surveys found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ msg: err });
    });
};

surveyController.getSurvey = (req, res, next) => {
  if (!req.params.id.trim())
    return res.status(403).json({ msg: "Invalid parameter" });
  SurveyModel.findById(req.params.id)
    .select("-__v")
    .populate("userName")
    .then((result) => {
      if (result) {
        res.json({ status: "success", data: result });
      } else {
        res.status(404).json({ msg: "No surveys found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ msg: err });
    });
};

surveyController.getSurveys = (req, res, next) => {
  console.log("making get all survey request");
  SurveyModel.find({})
    .select("-__v")
    .then((result) => {
      if (result.length) {
        res.json({ status: "success", data: result });
      } else {
        res.status(404).json({ msg: "No surveys found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ msg: err });
    });
};

surveyController.postSurvey = (req, res, next) => {
  // console.log(body);
  let body = {
    creator: req.user.id,
    ...req.body,
  };
  let surveyModel = new SurveyModel(body);
  surveyModel
    .save()
    .then((result) => {
      res.json({ status: "success", msg: "Survey posted" });
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 11000)
        res.status(403).json({ msg: "Try with different title" });
      else res.status(403).json({ msg: "Server error", errMsg: err });
    });
};

const ResponseModel = require("../model/Response");
const { response } = require("express");

responseController.getResponses = (req, res, next) => {
  if (_.isUndefined(req.params.id))
    res.status(403).json({ status: failed, msg: "Invalid Parameter" });
  const surveyId = req.params.id;
  console.log(surveyId);
  SurveyModel.findById(surveyId)
    .then((survey) => {
      if (survey) {
        ResponseModel.find({ surveyId: surveyId })
          .then((responses) => {
            if (responses.length > 0) {
              console.log("response saved");
              res.json({
                status: "success",
                msg: "response fetched",
                response_length: response.length,
                survey: survey,
                responses: responses,
              });
            } else {
              console.log("repsonse not saved", response);
              res.json({ status: "success", msg: "No response recorded yet" });
            }
          })
          .catch((err) => {
            console.log("Unable to save reponse :", err);
            res.status(403).json({ status: "failed", msg: "Invalid surveyId" });
          });
      } else
        res.status(403).json({ status: "failed", msg: "Invalid surveyId" });
    })
    .catch((err) => {
      res.status(500).json({ status: "failed", msg: err });
    });
};

const generateFile = require("./generateFiles");

responseController.getResponsesFile = (req, res, next) => {
  if (_.isUndefined(req.params.id))
    res.status(403).json({ status: failed, msg: "Invalid Parameter" });
  const surveyId = req.params.id;
  SurveyModel.findById(surveyId)
    .then((survey) => {
      if (survey) {
        ResponseModel.find({ surveyId: surveyId })
          .then((responses) => {
            if (responses.length > 0) {
              // console.log(survey);
              let data = {
                fields: survey.fields,
                responses,
              };
              generateFile(data, (err, file) => {
                if (err)
                  return res
                    .status(500)
                    .json({ status: "failed", msg: "Error geerating files" });
                console.log(file);
                res.set({
                  "Cache-Control": "no-cache",
                  "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "Content-Disposition": "attachment; filename=sample.xlsx",
                });
                res.send(file);
              });
            } else {
              console.log("repsonse not saved", response);
              res.json({ status: "success", msg: "No response recorded yet" });
            }
          })
          .catch((err) => {
            console.log("Unable to save reponse :", err);
            res.status(403).json({ status: "failed", msg: "Invalid surveyId" });
          });
      } else
        res.status(403).json({ status: "failed", msg: "Invalid surveyId" });
    })
    .catch((err) => {
      res.status(500).json({ status: "failed", msg: err });
    });
};

responseController.postResponse = (req, res, next) => {
  console.log(req.body);
  if (_.isUndefined(req.body.surveyId) || req.body.data.length < 1)
    return res.status(403).json({ status: "failed", msg: "Invalid parameter" });

  let body = {
    surveyId: req.body.surveyId,
    response: req.body.data,
  };
  SurveyModel.findById(body.surveyId)
    .then((exist) => {
      if (exist) {
        let responseModel = new ResponseModel(body);
        responseModel
          .save()
          .then((saved) => {
            if (saved) {
              console.log("response saved");
              res.json({ status: "success", msg: "reponse aknowldged!" });
            } else {
              console.log("repsonse not saved", saved);
              res.status(500).json({ status: "failed", msg: "Format Error" });
            }
          })
          .catch((err) => {
            console.log("Unable to save reponse :", err);
            res.status(403).json({ status: "failed", msg: "Invalid surveyId" });
          });
      } else
        res.status(403).json({ status: "failed", msg: "Invalid surveyId" });
    })
    .catch((err) => {
      res.status(500).json({ status: "failed", msg: err });
    });
};

let MailController = () => {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "rashid.pbt@gmail.com",
    from: "no-reply@surveyapp.com",
    subject: "Sending with Twilio SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: `
    <body>
    <div style="text-align-center"><b>Welcome to Survey App</b></div>
    <p>You are successfully created account in survey app.To proceed futher
    <a href="https://www.google.com">Click Here</a>
    </p>
    </body>
    `,
  };
  sgMail
    .send(msg)
    .then((ress) => {
      console.log(ress[0].statusMessage);
    })
    .catch((err) => {
      console.error("at sendgrid", err);
    });
};

module.exports = {
  userController,
  surveyController,
  responseController,
  MailController,
};
