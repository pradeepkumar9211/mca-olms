const { Router } = require("express");
const signUp = require("../controllers/authControllers/authSignUpController");
const signIn = require("../controllers/authControllers/authSignInController");
const adminSignIn = require("../controllers/authControllers/adminSignInController");
const userAuth = require("../middleware/authMiddleware");
const getMe = require("../controllers/authControllers/loggedInUserController");
const changePassword = require("../controllers/authControllers/changePasswordController");

const AuthRouter = Router();

// Users Signup route
AuthRouter.post("/signup", signUp);

// Users Signin route
AuthRouter.post("/signin", signIn);

// Admin sign in route
AuthRouter.post('/admin',adminSignIn);

// get logged in user details
AuthRouter.get('/me', userAuth,getMe);

// change password
AuthRouter.put('/change-password',userAuth,changePassword)

module.exports = AuthRouter;
