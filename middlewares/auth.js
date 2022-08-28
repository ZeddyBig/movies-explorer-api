const { checkToken } = require('../helpers/jwt');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  if (!req.cookies) {
    throw new UnauthorizedError('Вы не авторизованы');
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = checkToken(token);
  } catch (err) {
    throw new UnauthorizedError('Вы не авторизованы');
  }

  req.user = payload;
  next();
};
