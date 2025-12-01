const CategoryService = require("./category.sevice");

class CategoryController {
  async getAll(req, res, next) {
    try {
      const categories = await CategoryService.getAll();
      res.json({
        success: true,
        message: "semua data kategori berhasil di ambil",
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  }
  async getById(req, res, next) {
    try {
      const category = await CategoryService.getById();
      res.json({
        success: true,
        message: "data kategori berhasil di ambil",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }
  async create(req, res, next) {
    try {
      const category = await CategoryService.create(req.body);
      res.status(201).json({
        success: true,
        message: "data kategori berhasil di buat",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      const category = await CategoryService.update(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "data kategori berhasil di ubah",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const category = await CategoryService.delete(req.params.id);
      res.status(200).json({
        success: true,
        message: "data berhasil di hapus",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoryController();
