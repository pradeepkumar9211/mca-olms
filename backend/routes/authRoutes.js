const { Router } = require("express");
const signUp = require("../controllers/authSignUpController");
const signIn = require("../controllers/authSignInController");
const adminSignIn = require("../controllers/adminSignInController");

const AuthRouter = Router();

// Users Signup route
AuthRouter.post("/signup", signUp);

// Users Signin route
AuthRouter.post("/signin", signIn);

// Admin sign in route
AuthRouter.post('/admin',adminSignIn);

module.exports = AuthRouter;
