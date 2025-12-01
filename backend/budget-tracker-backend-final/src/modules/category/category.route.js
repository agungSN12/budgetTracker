const express = require("express");
const asyncErrorHandle = require("../../errors/asycErrorHandle");
const categoryController = require("./category.controller");
const {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdParamValidator,
} = require("./category.validator");
const validateRequest = require("../../middlewares/validation.middleware");
const router = express.Router();
const authJWT = require("../auth/auth.middleware");

router.use(authJWT);
router.get(
  "/",
  asyncErrorHandle(categoryController.getAll.bind(categoryController))
);

router.get(
  "/:id",
  asyncErrorHandle(categoryController.getById.bind(categoryController))
);

router.post(
  "/",
  createCategoryValidator,
  validateRequest,
  asyncErrorHandle(categoryController.create.bind(categoryController))
);
router.put(
  "/:id",
  updateCategoryValidator,
  categoryIdParamValidator,
  validateRequest,
  asyncErrorHandle(categoryController.update.bind(categoryController))
);
router.delete(
  "/:id",
  validateRequest,
  asyncErrorHandle(categoryController.delete.bind(categoryController))
);

module.exports = router;
