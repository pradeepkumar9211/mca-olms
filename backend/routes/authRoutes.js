const { Router } = require("express");
const signUp = require("../controllers/authSignUpController");
const signIn = require("../controllers/authSignInController");

const AuthRouter = Router();

// Users Signup route
AuthRouter.post("/signup", signUp);

// Users Signip route
AuthRouter.post("/signin", signIn);

module.exports = AuthRouter;
