const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'secret_key';

const generateToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });

const checkToken = (token) => jwt.verify(token, SECRET_KEY);

module.exports = { generateToken, checkToken };
