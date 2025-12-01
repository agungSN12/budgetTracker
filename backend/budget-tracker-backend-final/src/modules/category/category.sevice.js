const { Category } = require("../../../models/index");
const BadRequestError = require("../../errors/BadRequestError");
const NotFoundError = require("../../errors/NotFoundError");

class CategoryService {
  async getAll() {
    const categories = await Category.findAll();
    if (categories.length === 0) {
      throw new NotFoundError("data kategori tidak ditemukan");
    }
    return categories;
  }
  async getById(id) {
    const category = await Category.findByPk(id);
    if (!category) throw new NotFoundError("data kategori tidak di temukan");
    return category;
  }
  async create(data) {
    if (!data.name || !data.description) {
      throw new BadRequestError("data tidak valid");
    }
    return await Category.create(data);
  }
  async update(id, data) {
    const category = await Category.findByPk(id);
    if (!category) throw new NotFoundError("data kategori tidak di temukan");
    if (!data.name || !data.description) {
      throw new BadRequestError("data tiak valid");
    }
    await category.update(data);
    return category;
  }
  async delete(id) {
    const category = await Category.findByPk(id);
    if (!category) throw new NotFoundError("data kategori tidak di temukan");
    await category.destroy();
    return true;
  }
}

module.exports = new CategoryService();
