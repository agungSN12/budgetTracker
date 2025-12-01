const MonthlySummaryService = require("./monthlySummary.service");

class MonthlySummaryController {
  async getAll(req, res, next) {
    try {
      const summary = await MonthlySummaryService.getAll();
      res.json({
        success: true,
        message: "data monthlysummary berhasil di ambil",
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }
  async getById(req, res, next) {
    try {
      const summary = await MonthlySummaryService.getById(req.params.id);
      res.json({
        success: true,
        message: "data monthlysummary berhasil di ambil",
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }
  async create(req, res, next) {
    try {
      const data = {
        ...req.body,
        user_id: req.userId,
      };
      const summary = await MonthlySummaryService.create(data);
      res.json({
        success: true,
        message: "data monthlysummary berhasil ditambahkan",
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      const data = {
        ...req.body,
        user_id: req.userId,
      };
      const summary = await MonthlySummaryService.update(req.params.id, data);
      res.json({
        success: true,
        message: "data monthlysummary berhasil di update",
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const summary = await MonthlySummaryService.delete(req.params.id);
      res.json({
        success: true,
        message: "data monthlysummary berhasil di hapus",
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }

  async generate(req, res, next) {
    try {
      const userId = req.userId;
      const summary = await MonthlySummaryService.generate(userId);
      res.status(200).json({
        success: true,
        message: "summary bulanan berhasil di buat",
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MonthlySummaryController();
