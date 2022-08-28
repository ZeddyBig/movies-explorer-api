const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../helpers/jwt');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const MongoDuplicateErrorCode = require('../errors/MongoDuplicateErrorCode');
const UnauthorizedError = require('../errors/UnauthorizedError');

const SALT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;

module.exports.getUserData = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({ email: user.email, name: user.name, id: user._id });
    })
    .catch(next);
};

module.exports.updateUserData = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updatedUser) => res.status(200).send(updatedUser))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные в методы обновления профиля пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.status(201).send({ email, name }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new MongoDuplicateErrorCode('Емейл занят'));
        return;
      }

      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильный емейл или пароль');
      }

      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new UnauthorizedError('Неправильный емейл или пароль');
      }
      const token = generateToken({ _id: user._id });
      res
        .cookie('jwt', token, {
          httpOnly: true, maxAge: 3600000 * 24 * 7, sameSite: 'none',
        })
        .send({ token });
    })
    .catch(next);
};

module.exports.signout = (req, res) => {
  res
    .clearCookie('jwt', {
      httpOnly: true, maxAge: 3600000 * 24 * 7, sameSite: 'none',
    })
    .send({ message: 'Куки удалены' });
};
