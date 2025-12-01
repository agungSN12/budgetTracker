const MonthlySummaryController = require("./monthlySummary.controller");
const express = require("express");
const router = express.Router();
const authJWT = require("../auth/auth.middleware");
const asyncErrorHandle = require("../../errors/asycErrorHandle");
const {
  createMonthlySummaryValidator,
  idParamValidator,
  updateMonthlySummaryValidator,
} = require("./monthlySummary.validator");

const validateRequest = require("../../middlewares/validation.middleware");

router.use(authJWT);

router.get(
  "/",
  asyncErrorHandle(
    MonthlySummaryController.getAll.bind(MonthlySummaryController)
  )
);

router.post(
  "/generate",
  asyncErrorHandle(
    MonthlySummaryController.generate.bind(MonthlySummaryController)
  )
);
router.get(
  "/:id",
  idParamValidator,
  asyncErrorHandle(
    MonthlySummaryController.getById.bind(MonthlySummaryController)
  )
);
router.post(
  "/",
  createMonthlySummaryValidator,
  validateRequest,
  asyncErrorHandle(
    MonthlySummaryController.create.bind(MonthlySummaryController)
  )
);
router.put(
  "/:id",
  idParamValidator,
  updateMonthlySummaryValidator,
  validateRequest,
  asyncErrorHandle(
    MonthlySummaryController.update.bind(MonthlySummaryController)
  )
);
router.delete(
  "/:id",
  validateRequest,
  asyncErrorHandle(
    MonthlySummaryController.delete.bind(MonthlySummaryController)
  )
);

module.exports = router;
