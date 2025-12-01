const { User } = require("../../../models");
const bcrypt = require("bcrypt");
const BadRequestError = require("../../errors/BadRequestError");
const NotFoundError = require("../../errors/NotFoundError");
const ServerError = require("../../errors/ServerError");

class UserService {
  constructor() {
    this.SALT_ROUNDS = 10;
  }

  async getAll() {
    return await User.findAll({ attributes: { exlude: ["password"] } });
  }

  async getById(id) {
    return await User.findByPk(id, { attributes: { exlude: ["password"] } });
  }

  async create(data) {
    const existingUser = await User.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestError("email sudah terdafatar");
    }

    const hash = await bcrypt.hash(data.password, this.SALT_ROUNDS);
    const user = await User.create({ ...data, password: hash });
    const userJSON = user.toJSON();
    delete userJSON.password;

    return userJSON;
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new NotFoundError("id tidak di temukan!");

    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({
        where: { email: data.email },
      });
      if (existingUser) {
        throw new BadRequestError("email sudah di pake brow");
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, this.SALT_ROUNDS);
    } else {
      delete data.password;
    }

    try {
      await user.update(data, { validate: true });
    } catch (err) {
      console.error("error", err);
      const messege = err.error?.map((e) => e.messege) || [err.messege];
      throw new ServerError("gagal update user: " + messege.join(", "));
    }

    const userJSON = user.toJSON();
    delete userJSON.password;

    return userJSON;
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) throw new NotFoundError("id tidak di temukan");
    await user.destroy();
    return true;
  }
}

module.exports = new UserService();
