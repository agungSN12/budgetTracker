const express = require("express");
const router = express.Router();
const authRoute = require("./modules/auth/auth.route");
const userRoutes = require("./modules/user/user.route");
const transactionRoute = require("./modules/transaction/transaction.route");
const categoryRoute = require("./modules/category/category.route");
const monthlySummaryRoute = require("./modules/monthlySummary/monthlySummary.route");
const NotFound = require("./errors/NotFoundError");

router.use("/auth", authRoute);
router.use("/users", userRoutes);
router.use("/transaction", transactionRoute);
router.use("/category", categoryRoute);
router.use("/summary", monthlySummaryRoute);

router.use((req, res) => {
  throw new NotFound("data tidak di temukan boy");
});

module.exports = router;
