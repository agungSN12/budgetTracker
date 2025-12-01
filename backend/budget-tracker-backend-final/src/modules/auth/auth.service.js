const { User } = require("../../../models");
const BadRequestError = require("../../errors/BadRequestError");
const bcrypt = require("bcrypt");
const JwtService = require("./jwt.service");
const NotFoundError = require("../../errors/NotFoundError");

class AuthService {
  constructor() {
    this.SALT_ROUNDS = 10;
  }

  async register({ name, email, password, number }) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestError("email sudah erdaftar");
    }

    const hash = await bcrypt.hash(password, this.SALT_ROUNDS);
    const Newuser = await User.create({ name, email, password: hash, number });
    const token = JwtService.sign({ id: Newuser.id, email: Newuser.email });

    const userJSON = Newuser.toJSON();

    return { user: userJSON, token };
  }

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new NotFoundError("email tidak terdaftar");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new BadRequestError("password nya salah boy");

    const token = JwtService.sign({ id: user.id, email: user.email });

    const userJSON = user.toJSON();
    delete userJSON.password;
    return { user: userJSON, token };
  }

  async profile(userId) {
    return await User.findByPk(userId);
  }
}

module.exports = new AuthService();
