const JwtService = require("../auth/jwt.service");
const UnauthorizedError = require("../../errors/UnauthorizedError");

function authJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("token tidak ada");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decode = JwtService.verify(token);
    req.user = decode;
    req.userId = decode.id;
    next();
  } catch (error) {
    throw new UnauthorizedError("token sudah tidak valid atau kadaluarsa");
  }
}

module.exports = authJWT;
