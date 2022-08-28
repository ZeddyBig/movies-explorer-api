require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const router = require('./routes/index');
const { limiter } = require('./helpers/rateLimiter');
const { MONGO_URL } = require('./config');

const options = {
  origin: [
    'http://localhost:3000',
    'http://zeddybig.diploma.nomoredomains.xyz',
    'https://zeddybig.diploma.nomoredomains.xyz',
    'http://api.zeddybig.diploma.nomoredomains.xyz',
    'https://api.zeddybig.diploma.nomoredomains.xyz',
    'https://github.com/ZeddyBig',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

const { PORT = 3001 } = process.env;
const app = express();
app.use(cors(options));
app.use(helmet());

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.use(limiter);
app.use(router);

app.use((req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

app.use(errorLogger);
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {});
