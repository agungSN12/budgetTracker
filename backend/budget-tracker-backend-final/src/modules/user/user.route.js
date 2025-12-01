const express = require("express");
const router = express.Router();

const UserController = require("./user.controllers");
const asyncErrorHandle = require("../../errors/asycErrorHandle");
const {
  idParamValidator,
  createUserValidator,
  updateUserValidator,
} = require("./user.validator");
const validateRequest = require("../../middlewares/validation.middleware");

router.get("/", asyncErrorHandle(UserController.getAll.bind(UserController)));

router.get(
  "/:id",
  idParamValidator,
  validateRequest,
  asyncErrorHandle(UserController.getById.bind(UserController))
);

router.post(
  "/",
  createUserValidator,
  validateRequest,
  asyncErrorHandle(UserController.create.bind(UserController))
);

router.put(
  "/:id",
  idParamValidator,
  updateUserValidator,
  validateRequest,
  asyncErrorHandle(UserController.update.bind(UserController))
);

router.delete(
  "/:id",
  asyncErrorHandle(UserController.delete.bind(UserController))
);

module.exports = router;
