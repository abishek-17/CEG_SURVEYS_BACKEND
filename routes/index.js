let {
  userController,
  surveyController,
  responseController,
} = require("../controller/index");

let isAuth = require("../middleware/auth");

let userRoute = require("express").Router();
let surveyRoute = require("express").Router();
let responseRoute = require("express").Router();

const { check } = require("express-validator");

/**
 * user route will handle route to /api/v1/user/
 */

/** handle login route(/api/v1/usr/login) ;req body is {"username":"","password":""} */
userRoute.post(
  "/login",
  [
    //this array is middleware to validate req body
    check("email").trim().isEmail().withMessage("Enter Valid Email"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password should be minimum 5 characters"),
  ],
  userController.loginUser
);

/** route to create new user POST:/api/v1/user ; req body is  {"username":"",email:"","password":""} */
userRoute.post(
  "/",
  [
    check("email").trim().isEmail().withMessage("Invalid Email"),
    check("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password should be minimum 6 characters"),
  ],
  userController.createUser
);

// route to get all user GET:/api/v1/user/all
userRoute.get("/all", (req, res) => {
  res.json("get all user");
});

// route to get loggedin user
// api/v1/user/ https://thesurvey.herokuapp.com/api/v1/user/login
userRoute.get("/", isAuth, userController.getLoggedinleUser);

/** route to update user PUT:/api/v1/user ;request body {"username":"","email":"","password":""}
 *  all request body fields are optional
 */
userRoute.put(
  "/",
  [
    check("username")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("User Name must be 3 character long"),
    check("email").optional().trim().isEmail().withMessage("Invalid Email"),
    check("password")
      .optional()
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be 6 or more characters"),
  ],
  isAuth,
  userController.updateUser
);

// route to delete user
userRoute.delete("/", isAuth, userController.deleteUser);

// postRoute.delete('/:id',isAuth,postController.deletePost);
// postRoute.put('/:id',isAuth,postController.editPost);
surveyRoute.get("/all", surveyController.getSurveys);
surveyRoute.get("/:id", surveyController.getSurvey);
surveyRoute.post("/", isAuth, surveyController.postSurvey);

responseRoute.get("/:id", responseController.getResponses);
responseRoute.get("/files/:id", responseController.getResponsesFile);

responseRoute.post("/", responseController.postResponse);

module.exports = {
  userRoute,
  responseRoute,
  surveyRoute,
};
