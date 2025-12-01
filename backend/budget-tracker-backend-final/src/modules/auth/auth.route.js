const express = require("express");

const router = express.Router();
const AuthController = require("./auth.controller");
const asyncErrorHandle = require("../../errors/asycErrorHandle");
const { registerValidator, loginValidator } = require("./auth.validator");
const validateRequest = require("../../middlewares/validation.middleware");
const authJWT = require("./auth.middleware");

router.post(
  "/register",
  registerValidator,
  validateRequest,
  asyncErrorHandle(AuthController.register.bind(AuthController))
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  asyncErrorHandle(AuthController.login.bind(AuthController))
);

router.get(
  "/profile",
  authJWT,
  asyncErrorHandle(AuthController.profile.bind(AuthController))
);

module.exports = router;
